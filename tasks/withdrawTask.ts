import { task, types } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';

import { isContract, isCorrectUnit } from '../utils/contractUtils';

// Task for making donations
// Example: npx hardhat withdraw --network localhost --contract 0x5FbDB2315678afecb367f032d93F642f64180aa3 --toaddress 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc --amount 50 --unit wei
task('withdraw', 'Withdraw money from contract')
    .addParam('contract', 'Contract address', '', types.string)
    .addParam('toaddress', 'Address to withdraw money to', '', types.string)
    .addParam('amount', 'Amount to withdraw defined in unit parameter', '0', types.string)
    .addParam('unit', 'Specify units (wei, gwei, eth) for provided amount. Default is wei.', 'wei', types.string)
    .setAction(async ({ contract, toaddress, amount, unit }, { ethers }) => {
        const unitCheck = isCorrectUnit(unit);
        if (unitCheck.isError) {
            console.error(`--unit parameter is incorrect. Reason: ${unitCheck.errMsg}`);
            return;
        }

        const contractCheck = await isContract(ethers, contract);
        if (contractCheck.isError) {
            console.error(`--contract parameter is incorrect. Reason: ${contractCheck.errMsg}`);
            return;
        }

        if (!ethers.utils.isAddress(toaddress)) {
            console.error(`--toaddress parameter is incorrect. Reason: not a valid address.`);
            return;
        }

        const donationsContract = await ethers.getContractAt('Donations', (contract));
        amount = ethers.utils.parseUnits(amount, unit);

        const withdrawTransaction = await donationsContract.withdraw(toaddress, amount);
        await withdrawTransaction.wait();

        console.log(`Successfully withdrew ${amount.toString()} Wei from: ${donationsContract.address} to address ${toaddress}`);
    });

export { };