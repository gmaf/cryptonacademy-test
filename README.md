# Prerequisites:
1. create .env file
1. add ALCHEMY_API_KEY to .env
1. add RINKEBY_PRIVATE_KEY to .env

# Rinkeby proof:

## 1. Accounts:
#### Account1(Owner): [0x8658eba532306C137fAAa31ec0b1d2a16D03B5a8](https://rinkeby.etherscan.io/address/0x8658eba532306c137faaa31ec0b1d2a16d03b5a8)

#### Account2: [0x65a376d42efE83eAE122Da52B652539d078206c8](https://rinkeby.etherscan.io/address/0x65a376d42efE83eAE122Da52B652539d078206c8)

## Deploy a contract to the rinkeby network
### [Contract creation transaction link](https://rinkeby.etherscan.io/tx/0x9d398fee0ffa00641ecae1c06de423f7ae8e044b3fd6d64875d089cf75dd9a8d)
### Command
```shell
hardhat run --network rinkeby scripts/deploy.ts
```

### Output
```
Deploying contracts with the account: 0x8658eba532306C137fAAa31ec0b1d2a16D03B5a8
Account balance: 200000000000000000
Donations deployed to: 0x033aBd77e0CA9484699F43Fc9c14378f46191Bd6
```


## 2. Donate 50 wei
### [Transaction link](https://rinkeby.etherscan.io/address/0x033aBd77e0CA9484699F43Fc9c14378f46191Bd6)

### Command
```shell
npx hardhat donate --network rinkeby --contract 0x033aBd77e0CA9484699F43Fc9c14378f46191Bd6 --amount 50 --unit wei
```

### Output
```
Successfully donated 50 Wei to address 0x033aBd77e0CA9484699F43Fc9c14378f46191Bd6
```


## 3. Check all donater addresses
### Command
```shell
npx hardhat getAllDonaters --network rinkeby --contract 0x033aBd77e0CA9484699F43Fc9c14378f46191Bd6
```
### Output
```
All donated addresses:
[ '0x8658eba532306C137fAAa31ec0b1d2a16D03B5a8' ]
```


## 4. Check getDonatedAmountByAddress
### Command
```shell
npx hardhat getDonatedAmountByAddress --network rinkeby --contract 0x033aBd77e0CA9484699F43Fc9c14378f46191Bd6 --donater 0x8658eba532306C137fAAa31ec0b1d2a16D03B5a8
```
### Output
```
Address: 0x8658eba532306C137fAAa31ec0b1d2a16D03B5a8 donated: 50 Wei to contract: 0x033aBd77e0CA9484699F43Fc9c14378f46191Bd6
```

## 5. Withdraw 30 wei
### [Transaction link](https://rinkeby.etherscan.io/tx/0x4fde09af2cfb007f8e688311ed702175392d8ed989322d19dad01c2d8ffa55ac)

### Command
```shell
npx hardhat withdraw --network rinkeby --contract 0x033aBd77e0CA9484699F43Fc9c14378f46191Bd6 --toaddress 0x65a376d42efE83eAE122Da52B652539d078206c8 --amount 30 --unit wei
```
### Output
```
Successfully withdrew 30 Wei from: 0x033aBd77e0CA9484699F43Fc9c14378f46191Bd6 to address 0x65a376d42efE83eAE122Da52B652539d078206c8
```



## 6. Additional donate of 77 Gwei
### [Transaction link](https://rinkeby.etherscan.io/tx/0x3e87db083034b2001b2525d96fe707dee9e2c2bd436cafefdc35591e9f6e8433)
### Command
```
npx hardhat donate --network rinkeby --contract 0x033aBd77e0CA9484699F43Fc9c14378f46191Bd6 --amount 77 --unit gwei
```
### Output
```
Successfully donated 77000000000 Wei to address 0x033aBd77e0CA9484699F43Fc9c14378f46191Bd6
```


## 7. Additional withdrawal of 33 Gwei
### [Transaction link](https://rinkeby.etherscan.io/tx/0x6767475300699f531d1a9dc7d7ade9a182dee576b5b727c1ea1bbc7ceb3c87a7)
### Command
```
npx hardhat withdraw --network rinkeby --contract 0x033aBd77e0CA9484699F43Fc9c14378f46191Bd6 --toaddress 0x65a376d42efE83eAE122Da52B652539d078206c8 --amount 33 --unit gwei        
```
### Output
```
Successfully withdrew 33000000000 Wei from: 0x033aBd77e0CA9484699F43Fc9c14378f46191Bd6 to address 0x65a376d42efE83eAE122Da52B652539d078206c8
```