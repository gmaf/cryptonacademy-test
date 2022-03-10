import { task, types } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';

import { isContract } from '../utils/contractUtils';

// Task for getting donated amount by donater's address
// Example: npx hardhat getDonatedAmountByAddress --network localhost --contract 0x5FbDB2315678afecb367f032d93F642f64180aa3 --donater 0x70997970c51812dc3a010c7d01b50e0d17dc79c8
task('getDonatedAmountByAddress', 'Get donated amount by donater\'s address')
    .addParam('contract', 'Contract address', '', types.string)
    .addParam('donater', 'Donater address', '', types.string)
    .setAction(async ({ contract, donater }, { ethers }) => {
        const contractCheck = await isContract(ethers, contract);
        if (contractCheck.isError) {
            console.error(`--contract parameter is incorrect. Reason: ${contractCheck.errMsg}`);
            return;
        }

        if (!ethers.utils.isAddress(donater)) {
            console.error(`--donater parameter is incorrect. Reason: not a valid address.`);
            return;
        }

        const donationsContract = await ethers.getContractAt('Donations', (contract));
        const donatedAmount = await donationsContract.getDonatedAmountByAddress(donater);

        if (donatedAmount > 0) {
            console.log(`Address: ${donater} donated: ${donatedAmount} Wei to contract: ${contract}`);
        } else {
            console.log(`Address: ${donater} has not donated any Wei to contract: ${contract}`);
        }
    });

module.exports = {};