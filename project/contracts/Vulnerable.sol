pragma solidity 0.4.19;

contract Vulnerable {

    string public message;

    function Vulnerable() public {
        message = "something bad not happen";
    }

    function () payable public {
        revert();
    }

    function somethingBad() public {
        require(this.balance > 0);
        message = "something bad happen";
    }
}

contract Destructable {

    function kill(address addr) payable public {
        selfdestruct(addr);
    }
}
