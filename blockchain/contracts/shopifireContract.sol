// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Shopifire {
    address public owner;
    mapping(address => uint) public productBalances;

    constructor() {
        owner = msg.sender;
        productBalances[address(this)] = 100;
    }

    function getProductBalance() public view returns (uint) {
        return productBalances[address(this)];
    }

    // allows the owner to restock the product
    function restock(uint amount) public {
        require(
            msg.sender == owner,
            "Only the owner can restock this product."
        );
        productBalances[address(this)] += amount;
    }

    // payable is used to define any function which is used to receive ether
    function purchase(uint amount) public payable {
        require(
            msg.value >= amount * 0.0005 ether,
            "You must pay at least 0.5 ether per product"
        );
        require(productBalances[address(this)] >= amount, "Out of stock.");
        productBalances[address(this)] -= amount;
        // we refer to purchaser account
        productBalances[msg.sender] += amount;
    }
}
