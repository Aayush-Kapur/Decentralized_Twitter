//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;


contract TwitterClone {
    struct Tweet {
        address username;
        uint256 tweetId;
        string postTweet;
        bool isDeleted;
    }
    Tweet[] public tweets;

    event TweetAdded(uint256 tweetId, address User);
    event TweetDeleted(uint256 tweetId, address User);
   
    // Mapping tweet id to User(address)
    mapping(uint256 => address) tweetIdToUser;

    //Method to AddTweet

    function addTweet(string memory tweetText, bool isDeleted) external {
        // tweets.length is initially zero so id to first is 0 then after your push first id to next is 1
        uint256 tweetId = tweets.length;
        tweets.push(Tweet(msg.sender, tweetId, tweetText, isDeleted));
        tweetIdToUser[tweetId] = msg.sender;
        emit TweetAdded(tweetId, msg.sender);
    }

    function getAllTweets() external view returns (Tweet[] memory) {
        Tweet[] memory temp = new Tweet[](tweets.length);

        uint256 counter = 0;
        for (uint256 i = 0; i < tweets.length; i++) {
            if (tweets[i].isDeleted == false) {
                temp[counter] = tweets[i];
                counter++;
            }
        }
       
        return temp;
    }

    function getMyTweets() external view returns (Tweet[] memory) {
        Tweet[] memory mytemp = new Tweet[](tweets.length);

        uint256 counter = 0;
        for (uint256 i = 0; i < tweets.length; i++) {
            if (
                tweetIdToUser[tweets[i].tweetId] == msg.sender &&
                tweets[i].isDeleted == false
            ) {
                mytemp[counter] = tweets[i];
                counter++;
            }
        }
        return mytemp;
    }

    function deleteTweet(uint256 tweetId, bool isDeleted) external {
        require(tweetIdToUser[tweetId] == msg.sender , "Can't delete someone else's tweet");
        tweets[tweetId].isDeleted = isDeleted;
        emit TweetDeleted(tweetId, msg.sender);
    }
}
