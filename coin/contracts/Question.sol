pragma solidity ^0.4.2;

contract Question{
    bytes32 ipfsURL;
    uint round = 88;
    uint maxround;
    bytes32 bestSolURL;
    address[] solverList;
    Solution[] solutionList;
    uint startTime;
    uint duration;
    uint bond;
    uint reward;
    mapping(address => bool) solverSubmitted;
    
    //mapping
    mapping(bytes32 => Solution) getSstruct;//use URL to get solution struct
    mapping(bytes32 => Question) getQstruct;//use URL to get question struct
    
    //solution struct
    struct Solution{
      bytes32 ipfsURL;
      uint voteNum;
      address[] contributors; //teamates
      bytes32[] referencesURL; //previous URL
      address solverAddress;
    }
    
    
    //constructor
    function Question(bytes32 _ipfsURL, uint _maxround, uint _duration, uint _bond, uint _reward){
        ipfsURL = _ipfsURL;
        round = 1;
        maxround = _maxround;
        startTime = now;
        duration = _duration;
        bond = _bond;
        reward = _reward;
    }
    
    //getter functions
    function getURL() constant returns(bytes32){
        return ipfsURL;
    }
    
    function getRound() constant returns(uint){
        return round;
    }
    
    function getMaxRound() constant returns(uint){
        return maxround;
    }
    
    function getStartTime() constant returns(uint){
        return startTime;
    }
    
    function getDuration() constant returns(uint){
        return duration;
    }
    
    function getBond() constant returns(uint){
        return bond;
    }
    
    function getReward() constant returns(uint){
        return reward;
    }
    
    function getBestSolURL() constant returns(bytes32){
        return bestSolURL;
    }
    //setter function
     function pushreferencesURL(bytes32 queryURL,bytes32 reference) returns (bytes32){
        //push reference into URL
        getSstruct[queryURL].referencesURL.push(reference);
        return getSstruct[queryURL].referencesURL[0];
    }
    
    function pushContributor(bytes32 ipfsURL, address newContributor) returns (address){
        getSstruct[ipfsURL].contributors.push(newContributor);
        return getSstruct[ipfsURL].contributors[0];
    }
    
    //update solverList
   function pushSolverList(address _solver){
       solverList.push(_solver);
   }
   
   //set bestSolURL
   function chooseBestSolURL(bytes32 queryURL){
       bestSolURL = queryURL;
   }
   
   function addRound(){
       round = round + 1;
   }
    
    //submission function
    function submission(bytes32 _ipfsURL, bytes32 _referenceURL) returns (bool){
        bool status = false;
        //some time checking
        if(duration + startTime < now)
            return status;
        status = true;
        //add solution to solutionList
       if(status){
        Solution me;
        me.ipfsURL = _ipfsURL;
        me.voteNum = 0;
        pushreferencesURL(_ipfsURL,_referenceURL);
        pushContributor(_ipfsURL,msg.sender);
        solutionList.push(me);
        pushSolverList(msg.sender);
       }
        return status;
    }
    
   
    
    //voting functions
    function upvote(bytes32 queryURL) returns (uint){
        bool status = false;
        
        //check for submission
        for(uint i = 0; i < solverList.length;i++){
            if(keccak256(solverList[i]) == keccak256(queryURL)){
                status = true;
            }
        }
        
        if(status){
            //decrement voteNum
            getSstruct[queryURL].voteNum++;
            return getSstruct[queryURL].voteNum;
        }
        else{
            return getSstruct[queryURL].voteNum;
        }
    }

    function downvote(bytes32 queryURL) returns (uint){
        bool status = false;
        
        //check for submission
        for(uint i = 0; i < solverList.length;i++){
            if(keccak256(solverList[i]) == keccak256(queryURL)){
                status = true;
            }
        }
        
        if(status){
            //decrement voteNum
            getSstruct[queryURL].voteNum--;
            return getSstruct[queryURL].voteNum;
        }
        else{
            return getSstruct[queryURL].voteNum;
        }
    }
    
   
    
    
    
    
    
    
    
}