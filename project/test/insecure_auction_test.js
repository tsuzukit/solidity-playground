// https://github.com/ConsenSys/smart-contract-best-practices/blob/master/docs/known_attacks.md#dos-with-unexpected-revert
// InsecureAuction の実装が良くないため、新規での入札をできなくする事が可能

const InsecureAuction = artifacts.require("InsecureAuction");
const MaliciousBidder = artifacts.require("MaliciousBidder");

contract('MaliciousBidder will be leader forever', async (accounts) => {

  it("should have InsecureAuction and MaliciousBidder deployed", async () => {
    let insecureAuction = await InsecureAuction.deployed();
    let maliciousBidder = await MaliciousBidder.deployed();
    assert.ok(insecureAuction.address);
    assert.ok(maliciousBidder.address);
  });

  it("InsecureAuction and MaliciousBidder has 0 ether", async () => {
    let insecureAuction = await InsecureAuction.deployed();
    let maliciousBidder = await MaliciousBidder.deployed();

    let insecureAuctionBalance = await web3.eth.getBalance(insecureAuction.address);
    let maliciousBidderBalance = await web3.eth.getBalance(maliciousBidder.address);
    assert.equal(0, insecureAuctionBalance.toNumber());
    assert.equal(0, maliciousBidderBalance.toNumber());
  });

  it("bid by malicious bidder", async () => {
    let insecureAuction = await InsecureAuction.deployed();
    let maliciousBidder = await MaliciousBidder.deployed();
    await maliciousBidder.bid(insecureAuction.address, {
      from: accounts[1],
      value: 2,
    });

    let currentLeader = await insecureAuction.currentLeader();
    assert.equal(maliciousBidder.address, currentLeader);

    let highestBid = await insecureAuction.highestBid();
    assert.equal(2, highestBid.toNumber());
  });

  it("cannot change highestBid", async () => {
    let insecureAuction = await InsecureAuction.deployed();
    let maliciousBidder = await MaliciousBidder.deployed();

    // maliciousBidder よりも高い金額で入札しているが、maliciousBidder の send function の中で error が起きるため入札できないはず
    try {
      await insecureAuction.bid({
        from: accounts[2],
        value: 10
      });
      // ここが実行されるという事は InsecureAuction の bid が成功しているので意図した動きではない
      assert.isOk(false);
    } catch (err) {
      // InsecureAuction がエラーを返すはずだ
      assert.isOk(true);
    }

    // current leader は maliciousBidder のままのはずだ
    let currentLeader = await insecureAuction.currentLeader();
    assert.equal(maliciousBidder.address, currentLeader);

    // 入札高も変わっていないはずだ
    let highestBid = await insecureAuction.highestBid();
    assert.equal(2, highestBid.toNumber());
  });
});

