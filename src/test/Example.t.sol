// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import "./test.sol";
import "../example_contracts/Example.sol";

contract LookupContractTest is DSTest {
    LookupContract lookupContract;

    string name1 = "alice";
    uint256 mobileNumber1 = 12345;
    string name2 = "bob";
    uint256 mobileNumber2 = 55555;

    function setUp() public {
        lookupContract = new LookupContract(name1, mobileNumber1);
    }

    function testGetMobileNumber() public {
        assertEq(lookupContract.getMobileNumber(name1), mobileNumber1);
    }

    function testSetMobileNumber() public {
        lookupContract.setMobileNumber(name2, mobileNumber2);
        assertEq(lookupContract.getMobileNumber(name2), mobileNumber2);
        assertEq(lookupContract.getMobileNumber(name1), mobileNumber1);
    }
}
