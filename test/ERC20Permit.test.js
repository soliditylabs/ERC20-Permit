const { expect } = require("chai");
const { utils } = require("ethers");
const { deployContract } = require("ethereum-waffle");
const { signERC2612Permit } = require("eth-permit");
const Common = require("ethereumjs-common");
const { Transaction } = require("ethereumjs-tx");
const Web3 = require("web3");

const ERC20PermitMock = require("../artifacts/ERC20PermitMock.json");

const deployedErc20Permit = "0x7c2C195CD6D34B8F845992d380aADB2730bB9C6F";
const web3 = new Web3("http://localhost:8545");

describe("ERC20Permit", () => {
  let erc20Permit;

  const fixture = async ([senderWallet, spenderWallet]) => ({
    erc20Permit: await deployContract(senderWallet, ERC20PermitMock, [
      utils.parseEther("100"),
    ]),
    sender: senderWallet.address,
    spender: spenderWallet.address,
  });

  beforeEach(async () => {
    erc20Permit = new web3.eth.Contract(
      ERC20PermitMock.abi,
      deployedErc20Permit
    );
  });

  it("should deploy", async () => {
    const value = web3.utils.toWei("1", "ether");
    const sender2 = "0xc783df8a850f42e7f7e57013759c285caa701eb6";
    const spender2 = "0xead9c93b79ae7c1591b1fb5323bd777e86e150d4";

    const result = await signERC2612Permit(
      web3.currentProvider,
      deployedErc20Permit,
      sender2,
      spender2,
      value
    );

    console.log({ result });

    const testAddress = await erc20Permit.methods
      .testSig(
        sender2,
        spender2,
        value,
        result.deadline,
        result.v,
        result.r,
        result.s
      )
      .call();
    console.log({ sender2, testAddress });

    const txParams = {
      nonce: await web3.eth.getTransactionCount(sender2),
      gasPrice: "0x1",
      gasLimit: 9500000,
      to: deployedErc20Permit,
      data: erc20Permit.methods
        .permit(
          sender2,
          spender2,
          value,
          result.deadline,
          result.v,
          result.r,
          result.s
        )
        .encodeABI(),
    };
    const tx = new Transaction(txParams, {
      common: Common.default.forCustomChain(
        "mainnet",
        {
          name: "buidlerevm",
          networkId: 31337,
          chainId: 31337,
        },
        "petersburg"
      ),
    });
    tx.sign(
      Buffer.from(
        "c5e8f61d1ab959b397eecc0a37a6517b8e67a0e7cf1f4bce5591f3ed80199122",
        "hex"
      )
    );
    const serializedTx = tx.serialize();
    const receipt = await web3.eth.sendSignedTransaction(
      "0x" + serializedTx.toString("hex")
    );
    console.log({ receipt });

    expect(receipt.status).to.be.true;
  });
});
