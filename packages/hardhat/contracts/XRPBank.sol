//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./ICreditOracle.sol";

/// @notice XRP Bank Template
/// This contract should handle deposits, withdrawals, and lending functionality
/// TODO: Implement your lending bank logic here
contract XRPBank is Ownable, ReentrancyGuard {
    
    // TODO: Define constants (e.g., time periods, basis points)
    uint256 private constant YEAR = 365 days;

    /// @notice Loan structure to track individual loans
    struct Loan {
        // TODO: Add loan fields (principal, interest rate, timestamps, etc.)
    }

    /// @notice Credit oracle interface
    ICreditOracle public oracle;

    // TODO: Define state variables for deposits
    // Consider: How do you track user deposits? Total deposits?
    
    // TODO: Define state variables for loans
    // Consider: How do you track active loans? Total loaned amount?

    // TODO: Define events
    // Consider: What events should be emitted for deposits, withdrawals, loans, repayments?

    constructor(address oracleAddress) Ownable(msg.sender) {
        // TODO: Initialize oracle and emit events
    }

    // TODO: Implement core banking functions:
    // - receive(): Handle direct XRP transfers
    // - deposit(): Allow users to deposit XRP
    // - withdraw(): Allow users to withdraw their deposits
    // - requestLoan(): Issue loans to borrowers
    // - repay(): Allow borrowers to repay loans
    // - quoteOwed(): Calculate interest and total owed
    
    // TODO: Add any additional functions you think are needed
    // Consider: Admin functions, etc.
}


