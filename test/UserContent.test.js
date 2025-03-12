const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UserContent", function () {
  let UserContent;
  let userContent;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy the contract
    UserContent = await ethers.getContractFactory("UserContent");
    userContent = await UserContent.deploy();
    await userContent.deployed();
  });

  describe("Content Creation", function () {
    it("Should create new content correctly", async function () {
      const contentURI = "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
      const contentType = "image";

      await userContent.connect(user1).createContent(contentURI, contentType);

      // Check content was created
      const content = await userContent.getContent(1);
      expect(content.id).to.equal(1);
      expect(content.creator).to.equal(user1.address);
      expect(content.contentURI).to.equal(contentURI);
      expect(content.contentType).to.equal(contentType);
      expect(content.likes).to.equal(0);
      expect(content.isActive).to.equal(true);

      // Check user's content list
      const userContents = await userContent.getUserContentIds(user1.address);
      expect(userContents.length).to.equal(1);
      expect(userContents[0]).to.equal(1);

      // Check total content count
      const totalCount = await userContent.getTotalContentCount();
      expect(totalCount).to.equal(1);
    });
  });

  describe("Content Updates", function () {
    beforeEach(async function () {
      // Create content for testing
      await userContent.connect(user1).createContent("ipfs://original", "image");
    });

    it("Should allow creator to update content", async function () {
      const newURI = "ipfs://updated";
      await userContent.connect(user1).updateContent(1, newURI);
      
      const content = await userContent.getContent(1);
      expect(content.contentURI).to.equal(newURI);
    });

    it("Should not allow non-creator to update content", async function () {
      await expect(
        userContent.connect(user2).updateContent(1, "ipfs://hacked")
      ).to.be.revertedWith("Only creator can update content");
    });
  });

  describe("Content Removal", function () {
    beforeEach(async function () {
      // Create content for testing
      await userContent.connect(user1).createContent("ipfs://original", "image");
    });

    it("Should allow creator to remove content", async function () {
      await userContent.connect(user1).removeContent(1);
      
      const content = await userContent.getContent(1);
      expect(content.isActive).to.equal(false);
    });

    it("Should allow owner to remove content", async function () {
      await userContent.connect(owner).removeContent(1);
      
      const content = await userContent.getContent(1);
      expect(content.isActive).to.equal(false);
    });

    it("Should not allow non-creator/non-owner to remove content", async function () {
      await expect(
        userContent.connect(user2).removeContent(1)
      ).to.be.revertedWith("Only creator or owner can remove content");
    });
  });

  describe("Content Likes", function () {
    beforeEach(async function () {
      // Create content for testing
      await userContent.connect(user1).createContent("ipfs://original", "image");
    });

    it("Should allow users to like content", async function () {
      await userContent.connect(user2).likeContent(1);
      
      const content = await userContent.getContent(1);
      expect(content.likes).to.equal(1);
      
      const hasLiked = await userContent.contentLikes(1, user2.address);
      expect(hasLiked).to.equal(true);
    });

    it("Should not allow creator to like their own content", async function () {
      await expect(
        userContent.connect(user1).likeContent(1)
      ).to.be.revertedWith("Creator cannot like their own content");
    });

    it("Should allow users to unlike content", async function () {
      // First like
      await userContent.connect(user2).likeContent(1);
      
      // Then unlike
      await userContent.connect(user2).unlikeContent(1);
      
      const content = await userContent.getContent(1);
      expect(content.likes).to.equal(0);
      
      const hasLiked = await userContent.contentLikes(1, user2.address);
      expect(hasLiked).to.equal(false);
    });
  });
}); 