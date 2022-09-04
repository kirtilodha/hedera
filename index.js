console.clear();
require("dotenv").config();
const {
	AccountId,
	PrivateKey,
	Client,
	FileCreateTransaction,
	ContractCreateTransaction,
	ContractFunctionParameters,
	ContractExecuteTransaction,
	ContractCallQuery,
    ContractCreateFlow,
	Hbar,
} = require("@hashgraph/sdk");
const fs = require("fs");

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
	// Import the compiled contract bytecode
	const contractBytecode = fs.readFileSync("names_sol_AddColab.bin");

	const contractCreate = new ContractCreateFlow()
    .setGas(100000)
    .setBytecode(contractBytecode);

//Sign the transaction with the client operator key and submit to a Hedera network
const txResponse = contractCreate.execute(client);

//Get the receipt of the transaction
const receipt = (await txResponse).getReceipt(client);

//Get the new contract ID
const newContractId = (await receipt).contractId;
        
console.log("The new contract ID is " +newContractId);

	// Query the contract to check changes in state variable
	const contractExecuteTx = new ContractExecuteTransaction() 
		.setContractId(newContractId)
		.setGas(300000)
		.setFunction("setColab", new ContractFunctionParameters().addString("Alice").addString("name").addUint256(0).addUint256(1));
        const contractExecuteSubmit = await contractExecuteTx.execute(client);
        const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
        console.log(`- Contract function call status: ${contractExecuteRx.status} \n`);
	//console.log(`- Here's the phone number that you asked for: ${contractQueryResult} \n`);

	// // Call contract function to update the state variable
	// const contractExecuteTx = new ContractExecuteTransaction()
	// 	.setContractId(contractId)
	// 	.setGas(100000)
	// 	.setFunction(
	// 		"setMobileNumber",
	// 		new ContractFunctionParameters().addString("Bob").addUint256(222222)
	// 	);
	// const contractExecuteSubmit = await contractExecuteTx.execute(client);
	// const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
	// console.log(`- Contract function call status: ${contractExecuteRx.status} \n`);

	// // Query the contract to check changes in state variable
	const contractQueryTx1 = new ContractCallQuery()
		.setContractId(newContractId)
		.setGas(300000)
		.setFunction("getCollabnames");
        console.log("a");
	const contractQuerySubmit1 = await contractQueryTx1.execute(client);
    console.log("a");
	const contractQueryResult1 = contractQuerySubmit1.getStringArray();
    console.log("a");
	console.log(`- Here's the phone number that you asked for: ${contractQueryResult1} \n`);
}
main();