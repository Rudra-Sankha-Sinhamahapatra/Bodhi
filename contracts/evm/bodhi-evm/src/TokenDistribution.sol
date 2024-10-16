// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
//importing interface of ERC20

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

error insufficientFunds(address);

contract TokenDistribuition is OwnableUpgradeable, UUPSUpgradeable {
    event tokensBought(address indexed, uint256 _amount);

    //constant variables USDC token address on base chain
    address public USDC;
    address public bodhiTokenAddress;

    constructor() {
        _disableInitializers(); // Disable initializers to prevent direct calls
    }

    function initialize(address _usdc) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        USDC = _usdc;
    }

    function setBodhiTokenAddress(address _bodhiToken) public onlyOwner {
        bodhiTokenAddress = _bodhiToken;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function buyTokens(uint256 usdcAmount) public {
        // 1 USDC = 10 BOD
        //  calculate amount of USDC to be transferred
        uint256 bodAmount = usdcAmount * 10;
        //check balance of USDC
        if (IERC20(USDC).balanceOf(msg.sender) < usdcAmount) {
            revert insufficientFunds(msg.sender);
        }
        //buy tokens
        IERC20(USDC).transferFrom(msg.sender, address(this), usdcAmount);
        IERC20(bodhiTokenAddress).transfer(msg.sender, bodAmount);

        emit tokensBought(msg.sender, bodAmount);
    }
}
