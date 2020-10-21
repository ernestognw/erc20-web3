const Migrations = artifacts.require('Migrations');
const BlockdemyCoin = artifacts.require('BlockdemyCoin');

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(BlockdemyCoin, 'BlockdemyCoin', 'BDM', 3, 10000000000);
};
