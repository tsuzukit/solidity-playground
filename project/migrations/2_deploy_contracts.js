let SimpleStorage = artifacts.require("SimpleStorage");

let InsecureAuction = artifacts.require("InsecureAuction");
let MaliciousBidder = artifacts.require("MaliciousBidder");

let Vulnerable = artifacts.require("Vulnerable");
let Destructable = artifacts.require("Destructable");

let Reentrancy = artifacts.require("Reentrancy");
let MaliciousWithdrawer = artifacts.require("MaliciousWithdrawer");

let InsecureWallet = artifacts.require("InsecureWallet");
let TxAttackWallet = artifacts.require("TxAttackWallet");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);

  deployer.deploy(InsecureAuction);
  deployer.deploy(MaliciousBidder);

  deployer.deploy(Vulnerable);
  deployer.deploy(Destructable);

  deployer.deploy(Reentrancy);
  deployer.deploy(MaliciousWithdrawer);

  deployer.deploy(InsecureWallet);
  deployer.deploy(TxAttackWallet);
};

