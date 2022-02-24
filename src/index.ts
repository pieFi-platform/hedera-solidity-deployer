console.clear();
import dotenv from "dotenv";
dotenv.config();
import {
	AccountId,
	PrivateKey,
	Client,
	FileCreateTransaction,
	FileAppendTransaction,
	ContractCreateTransaction,
	ContractFunctionParameters,
	Hbar,
} from "@hashgraph/sdk";
import fs from "fs";

async function main() {
	// Hedera specific variables
	const chunkSize = 1024; // Max chunk size (Hedera uploads in chunks of 1kb)
	const successCode = 22; // A transaction receipt returns a status code of 22 if the transaction was a success

	try {
		// Retrieve account info from .env
		const operatorId = AccountId.fromString(
			process.env.OPERATOR_ID.replace('"', "")
		);
		const operatorKey = PrivateKey.fromString(
			process.env.OPERATOR_PVKEY.replace('"', "")
		);

		// Configure Hedera network and build client
		const network = process.env.NETWORK.toLowerCase();

		let client: Client;

		if (network === "testnet") {
			client = Client.forTestnet().setOperator(operatorId, operatorKey);
		} else if (network === "mainnet") {
			client = Client.forMainnet().setOperator(operatorId, operatorKey);
		} else {
			throw new Error(
				`❌The Hedera network you entered is not valid. (Please enter either "Testnet" or "Mainnet")❌`
			);
		}

		// Prepare signing keys
		const keys: string[] = JSON.parse(process.env.KEYS);
		const signKeys = keys.map((key: string) => PrivateKey.fromString(key));

		// Get bin path from .env
		const contractBytecode = fs.readFileSync(process.env.BIN);

		// Determine size of bin file and chunks
		const contractBytecodeSizeB = fs.statSync(process.env.BIN).size;
		const maxChunks = Math.ceil(contractBytecodeSizeB / chunkSize) + 1;
		console.log("Contract size is: ", contractBytecodeSizeB);
		console.log("Number of chunks is: ", maxChunks, `\n`);

		//////////////////Create empty file transaction//////////////////
		console.log(`⏱ Creating file...`);
		const fileCreateTx = new FileCreateTransaction().setKeys(signKeys);

		// Add any additional methods
		if (process.env.FILE_MEMO) {
			fileCreateTx.setFileMemo(process.env.FILE_MEMO);
			console.log(`-Added file memo-`);
		}
		if (process.env.EXPIRATION_DAYS) {
			const expirationDays =
				parseInt(process.env.EXPIRATION_DAYS) * 24 * 60 * 60 * 1000; // Caclulating expiration days in milliseconds
			fileCreateTx.setExpirationTime(
				new Date(Date.now() + expirationDays)
			); //ERROR - working with ~90 days, but returning AUTORENEW_DURATION_NOT_IN_RANGE otherwise (functionality not fully built out)
			console.log(`-Added expiration date- \n`);
		}
		// Freeze and sign
		fileCreateTx.freezeWith(client);
		for (const key of signKeys) {
			fileCreateTx.sign(key);
		}

		const fileCreateSubmit = await fileCreateTx.execute(client);
		const fileCreateRx = await fileCreateSubmit.getReceipt(client);
		const fileCreateStatus = fileCreateRx.status._code;
		const bytecodeFileId = fileCreateRx.fileId;

		// Error if transaction failed
		if (fileCreateStatus !== successCode || !bytecodeFileId) {
			throw new Error(`❌The file creation transaction failed❌`);
		}

		// Log bytecode file ID
		console.log(`✅The bytecode file ID is: ${bytecodeFileId} \n`);

		//////////////////Append contents to the file//////////////////
		console.log(`⏱ Appending to file...`);
		const fileAppendTx = new FileAppendTransaction()
			.setFileId(bytecodeFileId)
			.setContents(contractBytecode)
			.setMaxChunks(maxChunks)
			.freezeWith(client);

		// Sign transaction
		for (const key of signKeys) {
			fileAppendTx.sign(key);
		}
		const fileAppendSubmit = await fileAppendTx.execute(client);
		const fileAppendRx = await fileAppendSubmit.getReceipt(client);
		const fileAppendStatus = fileAppendRx.status._code;

		// Error if transaction failed
		if (fileAppendStatus !== successCode) {
			throw new Error(`❌The file append transaction failed❌`);
		}

		// Log file append transaction status
		console.log(`✅The file append was a : ${fileAppendRx.status} 👍 \n`);

		//------Parse constructor parameters and create string-----
		const parameters = process.env.CONSTRUCTOR_PARAMS
			? JSON.parse(process.env.CONSTRUCTOR_PARAMS)
			: {};
		let constructorParams = new ContractFunctionParameters();

		for (const key in parameters) {
			const type = parameters[key][0].toLowerCase();
			const value = parameters[key][1];

			switch (
				type //Accounting for everything except functions. TODO: add in functions
			) {
				case "string":
					constructorParams.addString(value);
					break;
				case "address":
					constructorParams.addAddress(value);
					break;
				case "addressarray":
					constructorParams.addAddressArray(value);
					break;
				case "bool":
					constructorParams.addBool(value);
					break;
				case "bytes":
					constructorParams.addBytes(value);
					break;
				case "bytes32":
					constructorParams.addBytes32(value);
					break;
				case "bytes32array":
					constructorParams.addBytes32Array(value);
					break;
				case "bytesArray":
					constructorParams.addBytesArray(value);
					break;
				case "int256":
					constructorParams.addInt256(value);
					break;
				case "int256array":
					constructorParams.addInt256Array(value);
					break;
				case "int32":
					constructorParams.addInt32(value);
					break;
				case "int32array":
					constructorParams.addInt32Array(value);
					break;
				case "int64":
					constructorParams.addInt64(value);
					break;
				case "int64array":
					constructorParams.addInt64Array(value);
					break;
				case "int8":
					constructorParams.addInt8(value);
					break;
				case "int8array":
					constructorParams.addInt8Array(value);
					break;
				case "stringarray":
					constructorParams.addStringArray(value);
					break;
				case "uint256":
					constructorParams.addUint256(value);
					break;
				case "uint256array":
					constructorParams.addUint256Array(value);
					break;
				case "uint32":
					constructorParams.addUint32(value);
					break;
				case "uint32array":
					constructorParams.addUint32Array(value);
					break;
				case "uint64":
					constructorParams.addUint64(value);
					break;
				case "uint64array":
					constructorParams.addUint64Array(value);
					break;
				case "uint8":
					constructorParams.addUint8(value);
					break;
				case "uint8array":
					constructorParams.addUint8Array(value);
					break;
			}
		}

		//////////////////Instantiate smart contract//////////////////
		console.log(`⏱ Creating smart contract...`);
		const contractInstantiateTx = new ContractCreateTransaction()
			.setBytecodeFileId(bytecodeFileId)
			.setGas(parseInt(process.env.CONTRACT_GAS));

		// Add any additional methods
		if (process.env.CONSTRUCTOR_PARAMS) {
			contractInstantiateTx.setConstructorParameters(constructorParams);
			console.log(`-Set constructor parameters-`);
		}
		if (process.env.INITIAL_HBAR_BALANCE) {
			const hbarBalance = parseInt(process.env.INITIAL_HBAR_BALANCE);
			contractInstantiateTx.setInitialBalance(new Hbar(hbarBalance));
			console.log(`-Set initial Hbar balance-`);
		}
		if (process.env.PROXY_ACCOUNT_ID) {
			contractInstantiateTx.setProxyAccountId(
				process.env.PROXY_ACCOUNT_ID
			);
			console.log(`-Set proxy account id-`);
		}
		if (process.env.CONTRACT_MEMO) {
			contractInstantiateTx.setContractMemo(process.env.CONTRACT_MEMO);
			console.log(`-Set contract memo-`);
		}
		if (process.env.ADMIN_KEY) {
			const adminKey = PrivateKey.fromString(process.env.ADMIN_KEY);
			contractInstantiateTx.setAdminKey(adminKey);
			contractInstantiateTx.freezeWith(client);
			contractInstantiateTx.sign(adminKey);
			console.log(`-Set admin key- \n`);
		}

		const contractInstantiateSubmit = await contractInstantiateTx.execute(
			client
		);
		const contractInstantiateRx =
			await contractInstantiateSubmit.getReceipt(client);
		const contractInstantiateStatus = contractInstantiateRx.status._code;
		const contractId = contractInstantiateRx.contractId;

		// Error if transaction failed
		if (contractInstantiateStatus !== successCode || !contractId) {
			throw new Error(`❌The file append transaction failed❌`);
		}
		const contractAddress = contractId.toSolidityAddress();

		// Log contract Id and Solidity address for contract
		console.log(`✅The smart contract ID is: ${contractId}`);
		console.log(
			`✅The smart contract Solidity address is: ${contractAddress} \n`
		);
	} catch (err) {
		console.log(err);
	}
}

main();
