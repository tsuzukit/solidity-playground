let SimpleStorage = artifacts.require("SimpleStorage");
let InsecureAuction = artifacts.require("InsecureAuction");
let MaliciousBidder = artifacts.require("MaliciousBidder");
let Vulnerable = artifacts.require("Vulnerable");
let Destructable = artifacts.require("Destructable");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(InsecureAuction);
  deployer.deploy(MaliciousBidder);
  deployer.deploy(Vulnerable);
  deployer.deploy(Destructable);
};

