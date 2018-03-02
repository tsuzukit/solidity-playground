// https://github.com/ConsenSys/smart-contract-best-practices/blob/master/docs/known_attacks.md#reentrancy
// いわゆる The Dao として広く世に知られている攻撃
// fallback 関数の中で再帰呼び出しをかける事で攻撃する

const Reentrancy = artifacts.require("Reentrancy");
const MaliciousWithdrawer = artifacts.require("MaliciousWithdrawer");

contract('いわゆる the dao の再現', async (accounts) => {

  it("コントラクトはディプロイされているはず", async () => {
    let reentrancy = await Reentrancy.deployed();
    let maliciousWithdrawer = await MaliciousWithdrawer.deployed();
    assert.ok(reentrancy.address);
    assert.ok(maliciousWithdrawer.address);
  });

  it("攻撃が上手くいくと、預けたお金以上を引き出す事が出来るはず", async () => {
    let reentrancy = await Reentrancy.deployed();
    let maliciousWithdrawer = await MaliciousWithdrawer.deployed();

    // reentrancy に普通のユーザーが deposit する
    await reentrancy.deposit({
      from: accounts[0],
      value: 20,
    });
    var reentrancyBalance = await web3.eth.getBalance(reentrancy.address);
    assert.equal(20, reentrancyBalance.toNumber());

    // attacker が 1 ether を deposit する
    await maliciousWithdrawer.deposit(reentrancy.address, {
      from: accounts[1],
      value: 1
    });
    let b = await reentrancy.userBalances(maliciousWithdrawer.address);
    assert.equal(1, b);

    // reentrancy はこの時点で 21 もっているはず
    reentrancyBalance = await web3.eth.getBalance(reentrancy.address);
    assert.equal(21, reentrancyBalance.toNumber());

    // MaliciousWithdrawer はこの時点では ether を持っていないはず
    maliciousWithdrawerBalance = await web3.eth.getBalance(maliciousWithdrawer.address);
    assert.equal(0, maliciousWithdrawerBalance.toNumber());

    // 攻撃開始
    await maliciousWithdrawer.withdraw(reentrancy.address, {
      from: accounts[1],
    });
    // 攻撃が成功すれば 1 を預けただけなのに 10 を引き出せている
    maliciousWithdrawerBalance = await web3.eth.getBalance(maliciousWithdrawer.address);
    assert.equal(10, maliciousWithdrawerBalance.toNumber());

  });

});

