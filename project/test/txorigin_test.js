// http://solidity.readthedocs.io/en/develop/security-considerations.html#tx-origin
// tx.origin は絶対につかってはいけない。なぜなら悪意のあるコントラクトになりすましを許すから

const InsecureWallet = artifacts.require("InsecureWallet");
const TxAttackWallet = artifacts.require("TxAttackWallet");

contract('tx.origin を使ったコントラクトはなりすましを行える問題の再現', async (accounts) => {

  it("InsecureWallet から持ち主のふりをして引き出す", async () => {
    let insecureWallet = await InsecureWallet.new({
      from: accounts[0]
    });
    let txAttackWallet = await TxAttackWallet.new({
      from: accounts[1]
    });
    assert.ok(insecureWallet.address);
    assert.ok(txAttackWallet.address);

    let attackerBalance = await web3.eth.getBalance(accounts[1]);

    // insecure wallet に預金
    await insecureWallet.sendTransaction({
      from: accounts[0],
      gas: 210000,
      value: 10000000
    });
    let insecureWalletBalance = await web3.eth.getBalance(insecureWallet.address);
    assert.equal(10000000, insecureWalletBalance);

    // 攻撃者は、財布経由で自分のコントラクトにちょっとだけ送金させる
    await insecureWallet.transfer(txAttackWallet.address, 1);

    // 財布には 0 ether になっている
    insecureWalletBalance = await web3.eth.getBalance(insecureWallet.address);
    assert.equal(0, insecureWalletBalance);

    // attacker に送金されている
    let newAttackerBalance = await web3.eth.getBalance(accounts[1]);
    assert.isAbove(newAttackerBalance - attackerBalance, 10000000);
  });

});
