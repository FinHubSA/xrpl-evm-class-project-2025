//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/// @notice Credit oracle interface: implement your own logic off-chain/on-chain
interface ICreditOracle {
    /// @dev Return whether borrower is allowed, the max amount (in wei),
    /// APR in basis points (e.g. 1200 = 12% APR), and min duration (seconds).
    function getTerms(address borrower, uint256 requestedAmount)
        external
        view
        returns (bool allowed, uint256 maxAmount, uint256 aprBps, uint256 minDuration);
}