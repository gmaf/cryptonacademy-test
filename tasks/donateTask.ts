import { task, types } from 'hardhat/config';
import { includes } from 'lodash';
import '@nomiclabs/hardhat-ethers';

import { isContract } from '../utils/contractUtils';

const validUnits = ['wei', 'gwei', 'eth'];
// Task for making donations
// Example: npx hardhat donate --network localhost --contract 0x5FbDB2315678afecb367f032d93F642f64180aa3 --amount 1 --unit gwei
task('donate', 'Donate some money')
    .addParam('contract', 'Contract address', '', types.string)
    .addParam('amount', 'Amount donated in units parameter. Default is 0.', '0', types.string)
    .addParam('unit', 'Specify units (wei, gwei, eth) for provided amount. Default is wei.', 'wei', types.string)
    .setAction(async ({ contract, amount, unit }, { ethers }) => {
        if (!includes(validUnits, unit)) {
            console.error('--unit parameter is incorrect. It must be one of: [wei, gwei, eth]');
            return;
        }

        const contractCheck = await isContract(ethers, contract);
        if (contractCheck.isError) {
            console.error(`--contract parameter is incorrect. Reason: ${contractCheck.errMsg}`);
            return;
        }

        const donationsContract = await ethers.getContractAt('Donations', (contract));
        amount = ethers.utils.parseUnits(amount, unit);
        const donateTransaction = await donationsContract.donate({ value: amount });
        await donateTransaction.wait();
        console.log(`Successfully donated ${amount.toString()} Wei to address ${donationsContract.address}`);
    });

export { };