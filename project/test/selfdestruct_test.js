// https://github.com/ConsenSys/smart-contract-best-practices/blob/master/docs/known_attacks.md#forcibly-sending-ether-to-a-contract
// selfdestruct で強制的に ether を送りつける事が出来るので、ether の保有量を条件にした何かを書くのは危険な場合がある

const Destructable = artifacts.require("Destructable");
const Vulnerable = artifacts.require("Vulnerable");

contract('selfdestruct によって強制的にイーサを送る事が出来る問題の再現', async (accounts) => {

  it("should have contracts deployed", async () => {
    let destructable = await Destructable.deployed();
    let vulnerable = await Vulnerable.deployed();
    assert.ok(destructable.address);
    assert.ok(vulnerable.address);
  });

  it("Vulnerable has 0 ether", async () => {
    let vulnerable = await Vulnerable.deployed();

    let vulnerableBalance = await web3.eth.getBalance(vulnerable.address);
    assert.equal(0, vulnerableBalance.toNumber());

    // somethingBad を呼んでも、this.balance が 0 なので something bad は実行されない
    try {
      await vulnerable.somethingBad();
      assert.isOk(false);
    } catch (err) {
      assert.isOk(true);
    }
    let message = await vulnerable.message();
    assert.equal('something bad not happen', message);
  });

  it("Something bad happens to Vulnerable", async () => {
    let vulnerable = await Vulnerable.deployed();
    let destructable = await Destructable.deployed();

    // selfdestruct が呼ばれ、10 eth は全て vulnerable に行く
    await destructable.kill(vulnerable.address, {
      from: accounts[0],
      value: 10
    });
    let vulnerableBalance = await web3.eth.getBalance(vulnerable.address);
    assert.equal(10, vulnerableBalance.toNumber());

    // somethingBad を呼ぶと something bad が実行されてしまう
    await vulnerable.somethingBad();
    let message = await vulnerable.message();
    assert.equal('something bad happen', message);
  });

});

