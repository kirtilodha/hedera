// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract AddColab {
    struct Collabs{
        string name;
        string eventName;
        uint start;
        uint end;
    }

    error notOwner();

    Collabs[] public collabList;
    uint i;
    address public owner;

    modifier onlyOwner(){
        if(msg.sender != owner){
            revert notOwner();
        }
        _;
    }
    constructor(){
        owner = msg.sender;
        i=0;
    }
    function setColab(string memory name, string memory eventName, uint start, uint end) public onlyOwner{
        collabList.push(Collabs(name,eventName,start,end));
        // collabList[i].name=name;
        // collabList[i].eventName=eventName;
        // collabList[i].start=start;
        // collabList[i].end=end;
        i++;
        // collabList.push(details);
    }
    function getCollabs() public view returns(Collabs[] memory){
        return collabList;
    }
}