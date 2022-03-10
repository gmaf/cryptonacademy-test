import { task, types } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';

import { isContract } from '../utils/contractUtils';

// Task for getting all donater addresses
// Example: npx hardhat getAllDonaters --network localhost --contract 0x5FbDB2315678afecb367f032d93F642f64180aa3
task('getAllDonaters', 'Get all addresses of participated donaters')
    .addParam('contract', 'Contract address', '', types.string)
    .setAction(async ({ contract }, { ethers }) => {
        const contractCheck = await isContract(ethers, contract);
        if (contractCheck.isError) {
            console.error(`--contract parameter is incorrect. Reason: ${contractCheck.errMsg}`);
            return;
        }

        const donationsContract = await ethers.getContractAt('Donations', (contract));
        const addresses = await donationsContract.getAllDonatedAddresses();
        console.log(`All donated addresses:`);
        console.dir(addresses);
    });

module.exports = {};