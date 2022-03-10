import { task, types } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';

import { isContract } from '../utils/contractUtils';

// Task for getting all donater addresses
// Example: npx hardhat getAllDonaters --network localhost --address 0x5FbDB2315678afecb367f032d93F642f64180aa3
task('getAllDonaters', 'Get all addresses of participated donaters')
    .addParam('address', 'Contract address', '', types.string)
    .setAction(async (taskArgs, { ethers }) => {
        const contractCheck = await isContract(ethers, taskArgs.address);
        if (contractCheck.isError) {
            console.error(`--address parameter is incorrect. Reason: ${contractCheck.errMsg}`);
            return;
        }

        const donationsContract = await ethers.getContractAt('Donations', (taskArgs.address));
        const addresses = await donationsContract.getAllDonatedAddresses();
        console.log(`All donated addresses:`);
        console.dir(addresses);
    });

module.exports = {};