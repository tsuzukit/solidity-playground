# Setup

```
$ sh script/start.sh
```

# Debug

See [Truffle tutorial page](http://truffleframework.com/tutorials/debugging-a-smart-contract) for details

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
