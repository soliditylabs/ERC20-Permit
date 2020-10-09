const { utils } = require("ethers");

module.exports = async ({
  getNamedAccounts,
  deployments,
  getChainId,
  getUnamedAccounts,
}) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const result = await deploy("ERC20PermitMock", {
    from: deployer,
    gas: 4000000,
    args: [utils.parseEther("100")],
  });
  console.log({ result: result.address });
};
