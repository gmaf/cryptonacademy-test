import { task, types } from 'hardhat/config';
import { includes } from 'lodash';
import '@nomiclabs/hardhat-ethers';

import { isContract } from '../utils/contractUtils';

const validUnits = ['wei', 'gwei', 'eth'];
// Task for making donations
// Example: npx hardhat donate --address 0xdD2FD4581271e230360230F9337D5c0430Bf44C0 --amount 1 --unit gwei
task('donate', 'Donate some money')
    .addParam('address', 'Contract address', '', types.string)
    .addParam('amount', 'Amount donated in units parameter. Default is 0.', '0', types.string)
    .addParam('unit', 'Specify units (wei, gwei, eth) for provided amount. Default is wei.', 'wei', types.string)
    .setAction(async (taskArgs, { ethers }) => {
        if (!includes(validUnits, taskArgs.unit)) {
            console.error('--unit parameter is incorrect. It must be one of: [wei, gwei, eth]');
            return;
        }

        const contractCheck = await isContract(ethers, taskArgs.address);
        if (contractCheck.isError) {
            console.error(`--address parameter is incorrect. Reason: ${contractCheck.errMsg}`);
            return;
        }

        const donationsContract = await ethers.getContractAt('Donations', (taskArgs.address));
        const amount = ethers.utils.parseUnits(taskArgs.amount, taskArgs.unit);
        const donateTransaction = await donationsContract.donate({ value: amount });
        await donateTransaction.wait();
        console.log(`Successfully donated ${amount.toString()} Wei to address ${donationsContract.address}`);
    });

export { };