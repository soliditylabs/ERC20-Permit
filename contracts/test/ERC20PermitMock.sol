//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import {ERC20, ERC20Permit} from "../ERC20Permit.sol";

contract ERC20PermitMock is ERC20Permit {
    constructor (uint256 initialSupply) ERC20("ERC20Permit-Token", "EPT") {
        _mint(msg.sender, initialSupply);
    }
}
