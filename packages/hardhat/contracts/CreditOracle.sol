//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ICreditOracle.sol";

/// @notice Credit Oracle Template
/// This contract should determine lending terms for borrowers
/// TODO: Implement your credit scoring logic here
contract CreditOracle is ICreditOracle, Ownable {
    
    // TODO: Define data structures to store borrower information
    // Consider: credit scores, max loan amounts, interest rates, etc.
    
    constructor() Ownable(msg.sender) {
        // TODO: Initialize any required state variables
    }

    // TODO: Implement required functions from ICreditOracle interface:
    // - setTerms(): Set lending terms for a borrower
    // - getTerms(): Get lending terms for a borrower
    
    // TODO: Add any additional functions you think are needed
    // Consider: credit scoring algorithms, risk assessment, etc.
}