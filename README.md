# About

Solidity を書いて色々試すための環境セット

Debugger をアタッチして状態を色々見たり、実際にあった攻撃を再現したり

# Setup

```
$ sh script/start.sh
```

# Debug

[Truffle tutorial page](http://truffleframework.com/tutorials/debugging-a-smart-contract) に詳細な使い方が乗っている

```
$ sh script/debug/start.sh
```

## Debug log

```
$ sh script/debug/log.sh
```

## Debug command

### migration

```
truffle(develop)> migrate --reset
```

### RPC

```
// calls SimpleStorage contract's get function and return result
SimpleStorage.deployed().then(function(instance){return instance.get.call();}).then(function(value){return value.toNumber()});

// calls SimpleStorage contract's set function with argument of 4
SimpleStorage.deployed().then(function(instance){return instance.set(4);});
```

### debug

```
truffle(develop)> debug <tx>
```

# Test

https://github.com/ConsenSys/smart-contract-best-practices/blob/master/docs/known_attacks.md に記載の攻撃をいくつか再現してみた

```
$ sh script/test/start.sh
```

以下簡単な説明

1: [DoS with revert](https://github.com/ConsenSys/smart-contract-best-practices/blob/master/docs/known_attacks.md#dos-with-unexpected-revert)  /
[テストコード](https://github.com/tsuzukit/solidity-playground/blob/master/project/test/insecure_auction_test.js) /
[テストコントラクト](https://github.com/tsuzukit/solidity-playground/blob/master/project/contracts/InsecureAuction.sol)

オークションコントラクトなどで、新規に入札をできなくする攻撃。`send` などの送金処理で呼び出される関数は書き換えが可能なので、常に失敗の危険がある。

2: [Forcibly Sending Ether to a Contract](https://github.com/ConsenSys/smart-contract-best-practices/blob/master/docs/known_attacks.md#forcibly-sending-ether-to-a-contract) /
[テストコード](https://github.com/tsuzukit/solidity-playground/blob/master/project/test/selfdestruct_test.js) /
[テストコントラクト](https://github.com/tsuzukit/solidity-playground/blob/master/project/contracts/Vulnerable.sol)

`selfdestruct` という関数を呼ぶとコントラクトは自身を破壊して、持っていた ether を強制的に指定したアドレスに送る事が出来る。
つまり保有する ether の量を条件としたロジックなどを組んでいるとハックされる危険がある。

3: [Reentrancy](https://github.com/ConsenSys/smart-contract-best-practices/blob/master/docs/known_attacks.md#reentrancy) /
[テストコード](https://github.com/tsuzukit/solidity-playground/blob/master/project/test/reentrancy_test.js) /
[テストコントラクト](https://github.com/tsuzukit/solidity-playground/blob/master/project/contracts/Reentrancy.sol)

いわゆる The Dao 事件の手口

1 と一緒で、送金処理で呼び出される関数の中で再帰的にもとの関数を呼べてしまう。状態変更を行うタイミングによっては意図しない出金などをされてしまう。

`call.value()()` の代わりに `send()` を使えば gas が足りなくて再帰呼び出しは失敗するはず。ただし、`send()` であっても何が実行されるかはわからないので注意が必要。
