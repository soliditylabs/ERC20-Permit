# ERC20-permit

Package for implementing the ERC20 permit (EIP-2612). Unaudited, use at own risk.

## Installation

1. Install the package via NPM:

```bash
$ npm install @soliditylabs/erc20-permit --save-dev
```

Or Yarn:

```bash
$ yarn add @soliditylabs/erc20-permit --dev
```

2. Import it into your ERC-20 contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import {ERC20, ERC20Permit} from "@soliditylabs/erc20-permit/contracts/ERC20Permit.sol";

contract ERC20PermitToken is ERC20Permit {
    constructor (uint256 initialSupply) ERC20("ERC20Permit-Token", "EPT") {
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public {
        _burn(from, amount);
    }
}
```

## Running tests

1. Clone the repository

```bash
$ git clone https://github.com/soliditylabs/ERC20-Permit
```

2. Install the dependencies

```bash
$ cd ERC20-Permit
$ npm install
```

3. Run Buidler Node

```bash
$ npx buidler node
```

4. Run tests

```bash
$ npm test
```
