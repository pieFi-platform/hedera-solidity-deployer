# hedera-solidity-deployer

Deploy Solidity Contracts to Hedera Testnet Locally using JavaScript.

## by [pieFi](https://piefi.io/)

<p align="center">
     <img src="./logo.jpeg" width="200" />
</p>

Check us out [here](https://piefi.io/)!

### Authors

-   Kendra Morrey
-   Taylor Buerger

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

Once the project has been created, the next step is to create the smart contract that we want to deploy. We've included a sample smart contract in the src/example_contracts folder for you to check out.

> **NOTE:** To learn how to write this example smart contract, check out [How to Deploy Smart Contracts on Hedera](https://hedera.com/blog/how-to-deploy-smart-contracts-on-hedera-part-1-a-simple-getter-and-setter-contract)

Now to create your own contract file, create a .sol file in the src/contracts folder

```
touch ./src/contracts/SmartContractExample.sol
```

and then write your smart contract in this file using Solidity.

### Compile Smart Contract to Bytecode

Once your contract is written, it'll first need to be compiled to bytecode before being deployed. The following command will compile the smart contract and place it in the src/contracts/bin folder

```
npm run solcjs -- --bin ./src/contracts/SmartContractExample.sol -o ./src/contracts/bin
```

Once the smart contract is compiled, we'll need to use the path of the newly created .bin file as the BIN variable when we create our .env file in the next step.

## Create .env File

The .env file will store all of the variables needed to create the file on Hedera and deploy the smart contract.

We've included an example .env file in the root of the project for you to edit with your respective data.

> **NOTE:** We've included the .env file in the .gitignore. Remember to never push your .env file to a public repository, as it will contain sensitive information.

Within the .env file, you'll see the following variables, with required variables marked as such

```
#Client variables
OPERATOR_ID =               #REQUIRED
OPERATOR_PVKEY =            #REQUIRED
NETWORK =                   #REQUIRED

#Create & Append File variables (KEYS must at least contain operator key)
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

The first block represents the variables used to create the Hedera client on the Hedera network.

-   OPERATOR_ID - Account ID - **required**
-   OPERATOR_PVKEY - Private Key - **required**
-   NETWORK - Hedera Network - **required**

> **NOTE:** If you do not already have a Hedera account, you can create a Hedera testnet account at the [Hedera portal](https://portal.hedera.com/register).

Add the Account ID and Private Key, and chose which Hedera network you would like to deploy to (must be either "Testnet" or "Mainnet"). See example below

> **CAUTION:** Deploying to Mainnet will cost real Hbar.

```
OPERATOR_ID = "0.0.12345678"
OPERATOR_PVKEY = "302e020100300506032..."
NETWORK = "Testnet"
```

The next block represents the variables used to create and append the new file on the Hedera network. The variables in this block are used in calling the following methods

-   KEYS - setKeys() - **required**
-   BIN - setContents() - **required**
-   FILE_MEMO - setFileMemo()
-   EXPIRATION_DAYS - setExpirationTime()

> **NOTE:** The setExpirationTime method is not fully functioning and will only run for values of about 90 days. Use this variable at your own discretion.

For details regarding file properties, visit the Hedera docs to [create a file](https://docs.hedera.com/guides/docs/sdks/file-storage/create-a-file) and [append to a file](https://docs.hedera.com/guides/docs/sdks/file-storage/append-to-a-file).

Add the file variables to the .env file using the format below **(leave all unused optional variables undeclared - as shown in the example .env file)**.

> **NOTE:** The KEYS variable **must** at least contain the Operator Private Key as the first element in the array. Any additional keys are optional.

```
KEYS = "["302e020100300506032...", "302e020100300506032b6..."]"
BIN = "./src/contracts/bin/src_contracts_SmartContractExample_sol_SmartContractExample.bin"
FILE_MEMO = "Enter file memo"
EXPIRATION_DAYS = "90"
```

> **NOTE:** Depending on what you named your contract in SmartContractExample.sol, your filename of the .bin file may be different than the one listed here. Make sure you are including the correct filename/path for your project.

The last block represents the variables used to create the smart contract on the Hedera network. The variables in this block are used in calling the following methods

-   CONTRACT_GAS - setGas() - **required**
-   CONSTRUCTOR_PARAMS - setConstructorParameters()
-   INITIAL_HBAR_BALANCE - setInitialBalance()
-   ADMIN_KEY - setAdminKey()
-   PROXY_ACCOUNT_ID - setProxyAccountId()
-   CONTRACT_MEMO - setContractMemo()
    > **NOTE:** The INITIAL_HBAR_BALANCE must be input as Hbar.

For details regarding smart contract properties, visit the Hedera docs to [create a smart contract](https://docs.hedera.com/guides/docs/sdks/smart-contracts/create-a-smart-contract).

Add the file variables to the .env file using the format below **(leave all unused optional variables undeclared - as shown in the example .env file)**.

> **NOTE:** The constructor parameters **must** be included in the format shown below, where parameters are listed in order, with the first element of the array representing the **type** of the parameter, and the second element of the array representing the **value** of the parameter.
> \*Additionally, this version of the deployer does not support functions as constructor parameters.

```
CONTRACT_GAS = "100000"
CONSTRUCTOR_PARAMS = "{"0": ["string", "Alice"], "1": ["uint256", "1234567"]}"
INITIAL_HBAR_BALANCE = "0.000001"
ADMIN_KEY = "302e020100300506032b6..."
PROXY_ACCOUNT_ID = "0.0.12345678"
CONTRACT_MEMO = "Enter contract memo"
```

## Deploy the Smart Contract

Now it's time to deploy the smart contract! All we need to do is run the following command

```
npm run deploy
```

Congrats, your smart contract has now been deployed!🎉

Don't forget to keep track of the

-   Bytcode file ID
-   Smart Contract ID
-   Smart Contract Solidity Address

for future use.
