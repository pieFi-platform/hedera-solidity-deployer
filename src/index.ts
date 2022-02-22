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
} from "@hashgraph/sdk";
import fs from "fs";

// Configure accounts and client using .env
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey); // Currently only for testnet

async function main() {
	const maxFileSize = 1024; // Max file size for Hedera is 1,024 kB
	const successCode = 22; // A transaction receipt returns a status code of 22 if the transaction was a success

	// Get bin path from .env
	const contractBytecode = fs.readFileSync(process.env.BIN);

	// Determine size of bin file and chunks
	const contractBytecodeSizeKB = fs.statSync(process.env.BIN).size;
	const chunkNum = Math.ceil(contractBytecodeSizeKB / maxFileSize); //TODO - fix math here (right now we're comaring kB to bytes)
	console.log("Number of chunks is: ", chunkNum);

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
			.setMaxChunks(chunkNum)
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

		// Instantiate smart contract (get contructor parameters and gas?)
		const contractInstantiateTx = new ContractCreateTransaction()
			.setBytecodeFileId(bytecodeFileId)
			.setGas(parseInt(process.env.CONTRACT_GAS))
			.setConstructorParameters(
				new ContractFunctionParameters()
					.addString("Alice")
					.addUint256(111111)
			); // TODO: EDIT THIS
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
	} catch (err) {
		console.log(err);
	}
}

main();
