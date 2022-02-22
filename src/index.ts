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
	ContractCallQuery,
} from "@hashgraph/sdk";
import fs from "fs";

// Configure accounts and client using .env
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey); // Currently only for testnet

async function main() {
	const chunkSize = 1024; // Max chunk size (Hedera uploads in chunks of 1kb)
	const successCode = 22; // A transaction receipt returns a status code of 22 if the transaction was a success

	// Get bin path from .env
	const contractBytecode = fs.readFileSync(process.env.BIN);

	// Determine size of bin file and chunks
	const contractBytecodeSizeKB = fs.statSync(process.env.BIN).size;
	const maxChunks = Math.ceil(contractBytecodeSizeKB / chunkSize) + 1;
	console.log("Number of chunks is: ", maxChunks);

	console.log("Contract size is: ", contractBytecodeSizeKB);

	try {
		// Create empty file transaction
		const fileCreateTx = new FileCreateTransaction()
			.setKeys([operatorKey])
			.freezeWith(client);
		const fileCreateSign = await fileCreateTx.sign(operatorKey);
		const fileCreateSubmit = await fileCreateSign.execute(client);
		const fileCreateRx = await fileCreateSubmit.getReceipt(client);
		const fileCreateStatus = fileCreateRx.status._code;
		const bytecodeFileId = fileCreateRx.fileId;

		// Error if transaction failed
		if (fileCreateStatus !== successCode || !bytecodeFileId) {
			throw new Error(`The file creation transaction failed`);
		}

		// Log bytecode file ID
		console.log(`The bytecode file ID is: ${bytecodeFileId}`);

		// Append contents to the file
		const fileAppendTx = new FileAppendTransaction()
			.setFileId(bytecodeFileId)
			.setContents(contractBytecode)
			.setMaxChunks(maxChunks)
			.freezeWith(client);
		const fileAppendSign = await fileAppendTx.sign(operatorKey);
		const fileAppendSubmit = await fileAppendSign.execute(client);
		const fileAppendRx = await fileAppendSubmit.getReceipt(client);
		const fileAppendStatus = fileAppendRx.status._code;

		// Error if transaction failed
		if (fileAppendStatus !== successCode) {
			throw new Error(`The file append transaction failed`);
		}

		// Log file append transaction status
		console.log(`The file append was a : ${fileAppendRx.status}`);

		// Parse constructor parameters and create string
		const parameters = JSON.parse(process.env.CONSTRUCTOR_PARAMS);
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

		// Instantiate smart contract
		const contractInstantiateTx = new ContractCreateTransaction()
			.setBytecodeFileId(bytecodeFileId)
			.setGas(parseInt(process.env.CONTRACT_GAS))
			.setConstructorParameters(constructorParams);
		const contractInstantiateSubmit = await contractInstantiateTx.execute(
			client
		);
		const contractInstantiateRx =
			await contractInstantiateSubmit.getReceipt(client);
		const contractInstantiateStatus = contractInstantiateRx.status._code;
		const contractId = contractInstantiateRx.contractId;

		// Error if transaction failed
		if (contractInstantiateStatus !== successCode || !contractId) {
			throw new Error(`The file append transaction failed`);
		}

		const contractAddress = contractId.toSolidityAddress();

		// Log contract Id and Solidity address for contract
		console.log(`The smart contract ID is: ${contractId}`);
		console.log(
			`The smart contract Solidity address is: ${contractAddress}`
		);

		// Query the contract to check changes in state variable - JUST FOR TESTING
		const contractQueryTx = new ContractCallQuery()
			.setContractId(contractId)
			.setGas(100000)
			.setFunction(
				"getMobileNumber",
				new ContractFunctionParameters().addString("Alice")
			);
		const contractQuerySubmit = await contractQueryTx.execute(client);
		const contractQueryResult = contractQuerySubmit.getUint256(0);
		console.log(
			`- Here's the phone number that you asked for: ${contractQueryResult} \n`
		);
	} catch (err) {
		console.log(err);
	}
}

main();
