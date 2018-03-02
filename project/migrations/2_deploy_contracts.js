let SimpleStorage = artifacts.require("SimpleStorage");
let InsecureAuction = artifacts.require("InsecureAuction");
let MaliciousBidder = artifacts.require("MaliciousBidder");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(InsecureAuction);
  deployer.deploy(MaliciousBidder);
};

