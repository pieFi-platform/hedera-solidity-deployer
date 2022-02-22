// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
 

contract LookupContract {

mapping (string => uint) public myDirectory;

constructor (string memory _name, uint _mobileNumber) public {
        myDirectory[_name] = _mobileNumber;
    }

function setMobileNumber(string memory _name, uint _mobileNumber) public {
        myDirectory[_name] = _mobileNumber;
    }

function getMobileNumber(string memory _name) public view returns (uint) {
        return myDirectory[_name];
    }
function setMobileNumber1(string memory _name, uint _mobileNumber) public {
        myDirectory[_name] = _mobileNumber;
    }

function getMobileNumber1(string memory _name) public view returns (uint) {
        return myDirectory[_name];
    }

function setMobileNumber2(string memory _name, uint _mobileNumber) public {
        myDirectory[_name] = _mobileNumber;
    }

function getMobileNumber2(string memory _name) public view returns (uint) {
        return myDirectory[_name];
    }
function setMobileNumber3(string memory _name, uint _mobileNumber) public {
        myDirectory[_name] = _mobileNumber;
    }

function getMobileNumber3(string memory _name) public view returns (uint) {
        return myDirectory[_name];
    }
function setMobileNumber4(string memory _name, uint _mobileNumber) public {
        myDirectory[_name] = _mobileNumber;
    }

function getMobileNumber4(string memory _name) public view returns (uint) {
        return myDirectory[_name];
    }

}