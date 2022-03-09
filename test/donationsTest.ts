// Imports
import { ethers } from "hardhat";
import * as chai from "chai";
import { assert, expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { solidity } from "ethereum-waffle";

chai.use(solidity);

// Needed for coverage gas limit
const minGasPrice = 10000000000;
const getGwei = (_amountGwei: number) => ethers.utils.parseUnits(_amountGwei.toString(), 'gwei');

describe("Donations contract", function () {
    let donationsContract: Contract;
    let contractOwner: SignerWithAddress;
    let account1: SignerWithAddress;
    let account2: SignerWithAddress;
    let donationsContractAddress: string;

    beforeEach(async function () {
        [contractOwner, account1, account2] = await ethers.getSigners();

        const DonationsFactory = await ethers.getContractFactory("Donations");
        donationsContract = await DonationsFactory.deploy({ gasPrice: minGasPrice });

        await donationsContract.deployed();
        donationsContractAddress = donationsContract.address;
    });
    describe("Deployment", function () {
        it("Should set the correct contract owner", async function () {
            // Arrange
            const expectedOwnerAddress = contractOwner.address;
            // Act
            const actualOwnerAddress = await donationsContract.contractOwner();
            // Assert
            expect(actualOwnerAddress).to.equal(expectedOwnerAddress);
        });
    });

    describe("Donations", function () {
        it("Should save amount by donater address", async function () {
            // Arrange
            const donationAmount1 = getGwei(1);
            const donationAmount2 = getGwei(2);

            // Act
            const donation1 = await donationsContract.connect(account1).donate({ value: donationAmount1 });
            const donation2 = await donationsContract.connect(account2).donate({ value: donationAmount2 });

            await donation1.wait();
            await donation2.wait();

            // Assert
            const donationsContractBalance = await ethers.provider.getBalance(donationsContractAddress);
            const donater1Balance = await donationsContract.connect(account1).getDonatedAmountByAddress(account1.address);
            const donater2Balance = await donationsContract.connect(account2).getDonatedAmountByAddress(account2.address);

            expect(donationAmount1).to.equal(donater1Balance);
            expect(donationAmount2).to.equal(donater2Balance);
            expect(donationAmount1.add(donationAmount2)).to.equal(donationsContractBalance);
        });

        it("Should raise error when donated amount = 0", async function () {
            // Arrange
            const zeroAmount = getGwei(0);

            // Act
            try {
                const donation = await donationsContract.connect(account1).donate({ value: zeroAmount });
                await donation.wait();
                expect.fail("Exception not thrown");
            }
            catch (err: any) {
                // Assert
                expect(err.message).to.have.string('Donation amount must be bigger than zero!');
            }
        });

        it("Should give all donation addresses without duplicates", async function () {
            // Arrange
            const donationAmount1 = getGwei(1);
            const donationAmount2 = getGwei(2);

            // Act
            const donation1 = await donationsContract.connect(account1).donate({ value: donationAmount1 });
            const donation1_1 = await donationsContract.connect(account2).donate({ value: donationAmount1.add(1) });
            const donation1_2 = await donationsContract.connect(account2).donate({ value: donationAmount1.add(2) });
            const donation2 = await donationsContract.connect(account2).donate({ value: donationAmount2 });
            const donation2_1 = await donationsContract.connect(account2).donate({ value: donationAmount2.add(1) });

            await donation1.wait();
            await donation1_1.wait();
            await donation1_2.wait();
            await donation2.wait();
            await donation2_1.wait();

            // Assert
            const allDonatedAddresses = await donationsContract.connect(account1).getAllDonatedAddresses();
            expect(allDonatedAddresses).to.have.lengthOf(2);
            expect(allDonatedAddresses).to.have.members([account1.address, account2.address]);
        });
    });
    describe("Withdrawals", function () {
        it("Should allow withdrawals for contract owner", async function () {
            // Arrange
            const donationAmount = getGwei(5);
            const withdrawAmount = getGwei(1);
            const donationsContractBalanceBeforeDeposit = await ethers.provider.getBalance(donationsContractAddress);
            const account1BalanceBeforeWithdrawal = await ethers.provider.getBalance(account1.address);

            // Act
            const donation = await donationsContract.connect(contractOwner).donate({ value: donationAmount });
            await donation.wait();
            const donationsContractBalanceAfterDeposit = await ethers.provider.getBalance(donationsContractAddress);

            const withdrawal = await donationsContract.connect(contractOwner).withdraw(account1.address, withdrawAmount);
            await withdrawal.wait();
            const donationsContractBalanceAfterWithdrawal = await ethers.provider.getBalance(donationsContractAddress);
            const account1BalanceAfterWithdrawal = await ethers.provider.getBalance(account1.address);

            // Assert
            expect(donationsContractBalanceBeforeDeposit).equal(0);
            expect(donationsContractBalanceAfterDeposit).equal(donationAmount);
            expect(donationsContractBalanceAfterWithdrawal).equal(donationAmount.sub(withdrawAmount));
            expect(account1BalanceAfterWithdrawal).equals(account1BalanceBeforeWithdrawal.add(withdrawAmount));
        });

        it("Should disallow withdrawals for anyone except contract owner", async function () {
            // Arrange
            const donationAmount = getGwei(5);
            const withdrawAmount = getGwei(1);

            // Act
            const donation = await donationsContract.connect(contractOwner).donate({ value: donationAmount });
            await donation.wait();
            try {
                const withdrawal = await donationsContract.connect(account1).withdraw(account1.address, withdrawAmount);
                await withdrawal.wait();
                expect.fail("Exception not thrown");
            }
            catch (err: any) {
                // Assert
                expect(err.message).to.have.string('This action is allowed only for the contract owner!');
            }
        });

        it("Should disallow withdrawals if withdrawal is zero", async function () {
            // Arrange
            const donationAmount = getGwei(5);
            const zeroWithdrawAmount = BigNumber.from(0);

            // Act
            const donation = await donationsContract.connect(contractOwner).donate({ value: donationAmount });
            await donation.wait();
            try {
                const withdrawal = await donationsContract.connect(contractOwner).withdraw(account1.address, zeroWithdrawAmount);
                await withdrawal.wait();
                expect.fail("Exception not thrown");
            }
            catch (err: any) {
                // Assert
                expect(err.message).to.have.string('Withdrawal amount must be bigger than zero!');
            }
        });

        it("Should disallow withdrawals if the contract has insufficient balance", async function () {
            // Arrange
            const donationAmount = getGwei(5);
            const withdrawAmount = donationAmount.add(1);

            // Act
            const donation = await donationsContract.connect(contractOwner).donate({ value: donationAmount });
            await donation.wait();
            try {
                const withdrawal = await donationsContract.connect(contractOwner).withdraw(account1.address, withdrawAmount);
                await withdrawal.wait();
                expect.fail("Exception not thrown");
            }
            catch (err: any) {
                // Assert
                expect(err.message).to.have.string('Withdrawal amount must be less than available balance!');
            }
        });
    });
});