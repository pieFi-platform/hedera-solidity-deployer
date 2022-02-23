# hedera-solidity-deployer

Deploy Solidity Contracts to Hedera Testnet Locally using JavaScript.

## Get Started

### Clone

The first step is to clone this project

```
git clone git@github.com:pieFi-platform/hedera-solidity-deployer.git
```

and then enter the directory

```
cd hedera-solidity-deployer
```

### Install Dependencies

Run this command to install the dependencies

```
npm install
```

## Create Smart Contract

Once the project has been created, the next step is to create the smart contract that we want to deploy. To create the contract file, create a .sol file in the src/contracts folder

```
touch ./src/contracts/SmartContractExample.sol
```

Now right your smart contract in this file using Solidity.

### Compile Smart Contract to Bytecode

Once your contract is written, it'll first need to be compiled to bytecode before being deployed. The following command will compile the smart contract and place it in the src/contracts/bin folder

```
solcjs --bin ./src/contracts/SmartContractExample.sol -o ./src/contracts/bin
```

> **NOTE:** If the solcjs command above fails, try reinstalling solc (npm install solc). 

Once the smart contract is compiled, we'll need to use the path of the newly created .bin file in the .env file as the BIN variable in the next step.

## Create .env File

The .env file will store all of the variables needed to create the file on Hedera and deploy the smart contract.

First, in the root of the project, add a .env file

```
touch .env
```

within the .env file, create the following variables

```
#Client variables
OPERATOR_ID =               #REQUIRED
OPERATOR_PVKEY =            #REQUIRED

#Create & Append File variables (KEYS must contain at least operator key)
KEYS =                      #REQUIRED
BIN =                       #REQUIRED
FILE_MEMO
EXPIRATION_DAYS

#Create Contract variables
CONTRACT_GAS =              #REQUIRED
CONSTRUCTOR_PARAMS
INITIAL_HBAR_BALANCE
ADMIN_KEY
PROXY_ACCOUNT_ID
CONTRACT_MEMO
```

The first block represents the variables used to create the Hedera client on the Hedera test network.

-   OPERATOR_ID - Account ID - **required**
-   OPERATOR_PVKEY - Private Key - **required**

> **NOTE:** If you do not already have a Hedera account, you can create a Hedera testnet account at the [Hedera portal](https://portal.hedera.com/register).

Add the testnet Account ID and Private Key (example below)

```
OPERATOR_ID = "0.0.12345678"
OPERATOR_PVKEY = "302e020100300506032..."
```

The next block represents the variables used to create and append the new file on the Hedera test network. The variables in this block are used in calling the following methods

-   KEYS - setKeys() - **required**
-   BIN - setContents() - **required**
-   FILE_MEMO - setFileMemo()
-   EXPIRATION_DAYS - setExpirationTime()

> **NOTE:** The setExpirationTime method is not fully functioning and will only run for values of about 90 days. Use this variable at your own discretion.

For details regarding file properties, visit the Hedera docs to [create a file](https://docs.hedera.com/guides/docs/sdks/file-storage/create-a-file) and [append to a file](https://docs.hedera.com/guides/docs/sdks/file-storage/append-to-a-file).

Add the file variables to the .env file using the format below **(leave all unused optional variables undeclared)**.

> **NOTE:** The KEYS variable **must** at least contain the Operator Private Key as the first element in the array. Any additional keys are optional.

```
KEYS = "["302e020100300506032...", "302e020100300506032b6..."]"
BIN = "./src/contracts/bin/src_contracts_SmartContractExample_sol_SmartContractExample.bin"
FILE_MEMO = "Enter file memo"
EXPIRATION_DAYS = "90"
```

The last block represents the variables used to create the smart contract on the Hedera test network. The variables in this block are used in calling the following methods

-   CONTRACT_GAS - setGas() - **required**
-   CONSTRUCTOR_PARAMS - setConstructorParameters()
-   INITIAL_HBAR_BALANCE - setInitialBalance()
-   ADMIN_KEY - setAdminKey()
-   PROXY_ACCOUNT_ID - setProxyAccountId()
-   CONTRACT_MEMO - setContractMemo()
    > **NOTE:** The INITIAL_HBAR_BALANCE must be input as Hbar.

For details regarding smart contract properties, visit the Hedera docs to [create a smart contract](https://docs.hedera.com/guides/docs/sdks/smart-contracts/create-a-smart-contract).

Add the file variables to the .env file using the format below **(leave all unused optional variables undeclared)**.

> **NOTE:** The constructor parameters **must** be included in the format shown below, where parameters are listed in order, with the first element of the array representing the **type** of the parameter, and the second element of the array representing the **value** of the parameter.

```
CONTRACT_GAS = "100000"
CONSTRUCTOR_PARAMS = "{"0": ["string", "Alice"], "1": ["uint256", "1234567"]}"
INITIAL_HBAR_BALANCE = "0.000001"
ADMIN_KEY = "302e020100300506032b6..."
PROXY_ACCOUNT_ID = "0.0.12345678"
CONTRACT_MEMO = "Enter contract memo"
```

## Deploy the Smart Contract

We're just about ready to deploy the smart contract, all we need to do now is first, compile to JavaScript by running

```
npm run build
```

and finally, deploy the contract

```
npm run dev
```

Congrats, your smart contract has now been deployed!🎉

Don't forget to keep track of the

-   Bytcode file ID
-   Smart Contract ID
-   Smart Contract Solidity Address

for future use.
