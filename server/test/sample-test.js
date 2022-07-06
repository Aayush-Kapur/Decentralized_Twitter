const { expect } = require("chai");
const { ethers } = require("hardhat");
// const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("TwitterClone", function () {

  let user1;
  let user2; 
  let user3; 
  let user4; 

  beforeEach(async function () {
    [user1, user2 , user3 , user4] = await ethers.getSigners();

     TwitterClone = await ethers.getContractFactory("TwitterClone");
     twitterclone = await TwitterClone.deploy();  
  });

  describe("AddTweet",  function () {
    it("Should add tweet and emit tweetadded event" , async function () {

      await expect(twitterclone.connect(user1).addTweet("Sample test Tweet" , false)).to.
      emit(twitterclone , "TweetAdded").withArgs(0,user1.address);
    });
  })
  
  describe("GetAllTweets" , function () {
    beforeEach(async function (){
      await twitterclone.connect(user2).addTweet("Sample test Tweet 1" , false);
      await twitterclone.connect(user3).addTweet("Sample test Tweet 2" , true); 
    })

    it("Should call getAllTweets and emit event with count of all tweets that are not deleted and check respective values of pushed tweets" , async function (){
      await expect(twitterclone.connect(user1).getAllTweets()).to
      .emit(twitterclone , "GotAllTweets").withArgs(
        1)

      const tweet1 = await twitterclone.tweets(0);
      const tweet2 = await twitterclone.tweets(1);
      expect(tweet1.username).to.equal(user2.address);
      expect(tweet2.tweetId).to.equal(1);
      expect(tweet2.postTweet).to.equal("Sample test Tweet 2");
    });
  })

  describe("DeletingTweets" , function (){
    beforeEach(async function (){
      await twitterclone.connect(user2).addTweet("Sample test Tweet 1" , false);
      await twitterclone.connect(user3).addTweet("Sample test Tweet 2" , false); 
    })

    it("should revert if msg.sender isn't the author of tweet" , async function (){
      await expect(twitterclone.connect(user3).deleteTweet(0,true)).to.be.revertedWith("Can't delete someone else's tweet")
    })

    it("should delete the tweet and emit tweetdeleted" , async function () {
       await expect(twitterclone.connect(user2).deleteTweet(0,true)).to.emit(twitterclone, "TweetDeleted").withArgs(0,user2.address)
    }) 
    
    it("should check if the tweet has been deleted or not" , async function () {
      beforeEach(await twitterclone.connect(user2).deleteTweet(0,true))
      const tweet1 = await twitterclone.tweets(0);
      expect(tweet1.isDeleted).to.equal(true);      
    })
  })

});
