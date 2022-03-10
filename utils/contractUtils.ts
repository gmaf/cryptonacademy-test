export async function isContract(ethers: any, address: string): Promise<{
    isError: boolean,
    errMsg: string
}> {
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