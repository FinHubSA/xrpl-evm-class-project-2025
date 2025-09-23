//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title XRPToken
/// @notice ERC20-like wrapper around native token
/// @dev For testing dApps that expect ERC20 interface at the sentinel address
contract XRPToken {
    string public constant name = "XRP";
    string public constant symbol = "XRP";
    uint8 public constant decimals = 18;

    mapping(address => mapping(address => uint256)) private _allowances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // Native supply is not capped — equals whatever the chain has
    function totalSupply() external view returns (uint256) {
        return address(this).balance;
    }

    function balanceOf(address account) public view returns (uint256) {
        return account.balance;
    }

    function allowance(address owner, address spender) external view returns (uint256) {
        return _allowances[owner][spender];
    }

    /// @notice approve is payable in this mock contract to try mimick transferFrom as closely as possible
    ///         approve for native XRP at 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE is not payable - 
    ////        The internal logic is able to take XRP from the sender address to the spender address if an allowance has been set
    function approve(address spender, uint256 amount) external payable returns (bool) {
        require(msg.value == amount, "Must send approve 'amount' ETH");

        // check if sender is dis-approving allowance
        uint256 current_allowance = _allowances[msg.sender][spender];
        if (amount == 0 && current_allowance > 0){
            (bool sent,) = msg.sender.call{value: current_allowance}("");
            require(sent, "Failed to send back XRP allowance");
        }

        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    /// @notice Transfer native XRP (deducts from sender via msg.value)
    ///         Transfer function for native XRP at 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE is not payable.
    ///         The internal logic is able to take XRP from the sender address to the spender address
    function transfer(address to, uint256 amount) external payable returns (bool) {
        require(msg.value == amount, "Must send exactly 'amount' ETH");

        (bool sent,) = payable(to).call{value: amount}("");
        require(sent, "Failed to transfer XRP to spender");

        emit Transfer(msg.sender, to, amount);
        return true;
    }

     /// @notice Transfer native XRP on behalf of `from` (sender must send XRP to the contract using approve)
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 allowed = _allowances[from][msg.sender];
        require(allowed >= amount, "Allowance exceeded");

        _allowances[from][msg.sender] = allowed - amount;

        // XRP comes from the contract
        (bool sent,) = payable(to).call{value: amount}("");
        require(sent, "Failed to transfer XRP from sender to spender");

        emit Transfer(from, to, amount);
        return true;
    }
}
