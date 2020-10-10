const { expect, assert } = require("chai");
const { signERC2612Permit } = require("eth-permit");
const Common = require("ethereumjs-common");
const { Transaction } = require("ethereumjs-tx");
const Web3 = require("web3");

const ERC20PermitMock = require("../artifacts/ERC20PermitMock.json");

const deployedErc20Permit = "0x7c2C195CD6D34B8F845992d380aADB2730bB9C6F";
const web3 = new Web3("http://localhost:8545");

// first Buidler default account
const defaultSender = "0xc783df8a850f42e7f7e57013759c285caa701eb6";
const defaultKey =
  "c5e8f61d1ab959b397eecc0a37a6517b8e67a0e7cf1f4bce5591f3ed80199122";

// second Buidler default account
const defaultSpender = "0xead9c93b79ae7c1591b1fb5323bd777e86e150d4";

const customCommon = Common.default.forCustomChain(
  "mainnet",
  {
    name: "buidlerevm",
    networkId: 31337,
    chainId: 31337,
  },
  "petersburg"
);

describe("ERC20Permit", () => {
  let erc20Permit;

  beforeEach(async () => {
    erc20Permit = new web3.eth.Contract(
      ERC20PermitMock.abi,
      deployedErc20Permit
    );
  });

  it("should set allowance after a permit transaction", async () => {
    const value = web3.utils.toWei("1", "ether");

    const result = await signERC2612Permit(
      web3.currentProvider,
      deployedErc20Permit,
      defaultSender,
      defaultSpender,
      value
    );

    const txParams = {
      nonce: await web3.eth.getTransactionCount(defaultSender),
      gasLimit: 80000,
      to: deployedErc20Permit,
      data: erc20Permit.methods
        .permit(
          defaultSender,
          defaultSpender,
          value,
          result.deadline,
          result.v,
          result.r,
          result.s
        )
        .encodeABI(),
    };
    const tx = new Transaction(txParams, {
      common: customCommon,
    });
    tx.sign(Buffer.from(defaultKey, "hex"));
    const receipt = await web3.eth.sendSignedTransaction(
      "0x" + tx.serialize().toString("hex")
    );

    const allowance = await erc20Permit.methods
      .allowance(defaultSender, defaultSpender)
      .call();

    expect(receipt.status).to.be.true;
    expect(allowance.toString()).to.equal(value.toString());

    txParams.nonce = txParams.nonce + 1;
    const replayTx = new Transaction(txParams, {
      common: customCommon,
    });
    replayTx.sign(Buffer.from(defaultKey, "hex"));

    try {
      await web3.eth.sendSignedTransaction(
        "0x" + replayTx.serialize().toString("hex")
      );
      assert.fail("Replay tx should fail");
    } catch (error) {
      expect(error.message).to.contain("ERC20Permit: invalid signature");
    }
  });
});
