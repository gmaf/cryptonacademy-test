import { includes } from 'lodash';

export interface CheckResult{
    isError: boolean,
    errMsg: string
}

export async function isContract(ethers: any, address: string): Promise<CheckResult> {
    const isAddress = ethers.utils.isAddress(address);

    if (!isAddress) {
        return {
            isError: true,
            errMsg: 'address is not a valid address!'
        };
    }
    const contractCode = await ethers.provider.getCode(address);
    if (contractCode == '0x') {
        return {
            isError: true,
            errMsg: 'address is not a contract!'
        };
    }

    return {
        isError: false,
        errMsg: ''
    };
}

const validUnits = ['wei', 'gwei', 'ether'];
export function isCorrectUnit(unit: string): CheckResult {
    if (!includes(validUnits, unit)) {
        return {
            isError: false,
            errMsg: 'Unit must be one of: [wei, gwei, eth]'
        };
    }

    return {
        isError: false,
        errMsg: ''
    };
}