// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Donations {
    // Address of the contract owner (who deployed the contract)
    address public contractOwner;

    // Address of the deployed contract
    address public contractAddress;

    // Mapping that stores how much ETH each address donated
    mapping(address => uint256) public addressToAmountDonated;

    // List of all addresses who made a donation
    address[] public addressesWhoDonated;

    // Create a new Donations contract and set the contract owner to address who deployed it
    constructor() {
        contractOwner = msg.sender;
        contractAddress = address(this);
    }

    // Get all donation addresses who donated some money
    function getAllDonatedAddresses() public view returns (address[] memory) {
        return addressesWhoDonated;
    }

    // Get amount donated by specified address
    function getDonatedAmountByAddress(address _address)
        public
        view
        returns (uint256)
    {
        return addressToAmountDonated[_address];
    }

    // Donate
    function donate() public payable {
        require(msg.value > 0, "Donation amount must be bigger than zero!");
        // NOTE: We save donation address only once to exclude duplicates when we want to get all donated addresses
        if (addressToAmountDonated[msg.sender] == 0) {
            addressesWhoDonated.push(msg.sender);
        }
        addressToAmountDonated[msg.sender] += msg.value;
    }

    // Withdraw money to an address. Only a contract owner can perform this operation.
    function withdraw(address payable _withdrawalAddress, uint256 _amount)
        public
        payable
        onlyOwner
    {
        require(_amount > 0, "Withdrawal amount must be bigger than zero!");
        require(
            _amount <= contractAddress.balance,
            "Withdrawal amount must be less than available balance!"
        );
        _withdrawalAddress.transfer(_amount);
    }

    // Modifier that allows actions only for contract owner
    modifier onlyOwner() {
        require(
            msg.sender == contractOwner,
            "This action is allowed only for the contract owner!"
        );
        _;
    }
}
