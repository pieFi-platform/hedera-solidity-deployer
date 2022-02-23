# hedera-solidity-deployer

> Deploy Solidity Contracts to Hedera Locally using JavaScript.

## Get Started

### Clone

First, clone this project

```
git clone git@github.com:pieFi-platform/hedera-solidity-deployer.git
```

then enter the directory

```
cd hedera-solidity-deployer
```

### Install dependencies

```
npm install
```

### Create .env file

The .env file will store all of the variables needed to create the
file on Hedera and deploy the smart contract.

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

-   OPERATOR_ID - Account ID **required**
-   OPERATOR_PVKEY - Private Key **required**

> **NOTE:** If you do not already have a Hedera account, you can create a Hedera testnet account at the [Hedera portal](https://portal.hedera.com/register).

Add the testnet Account ID and Private Key (example below)

```
OPERATOR_ID = "0.0.12345678"
OPERATOR_PVKEY = "302e020100300506032..."
```

The next block represents the variables used to create and append the new file on the Hedera test network. The variables in this are used in calling the following methods

-   KEYS - setKeys() - **required**
-   BIN - setContents() - **required**
-   FILE_MEMO - setFileMemo()
-   EXPIRATION_DAYS - setExpirationTime()
    **NOTE:** The setExpirationTime method is not fully functioning and will only run for values of about 90 days. Use this variable at your own discretion.

For details regarding file properties, visit the [Hedera docs - Create a file](https://docs.hedera.com/guides/docs/sdks/file-storage/create-a-file).

Add the file variables to the .env file using the format below **(leave all optional variables undeclared).**

> **NOTE:** The KEYS variable **must** at least contain the Operator Private Key as the first element in the array. Any additional keys are optional.

```
KEYS = "["302e020100300506032...", "302e020100300506032b6..."]"
BIN = "./src/contracts/bin/src_contracts_SmartContract_sol_SmartContract.bin"
FILE_MEMO = "Enter file memo"
EXPIRATION_DAYS = "90"
```

[create a file](https://docs.hedera.com/guides/docs/sdks/file-storage/create-a-file)
[append to a file](https://docs.hedera.com/guides/docs/sdks/file-storage/append-to-a-file)
[create a smart contract](https://docs.hedera.com/guides/docs/sdks/smart-contracts/create-a-smart-contract)
