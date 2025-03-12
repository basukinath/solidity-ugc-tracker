// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title UserContent
 * @dev Contract for tracking user-generated content on the blockchain
 */
contract UserContent is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _contentIds;

    // Struct to store content information
    struct Content {
        uint256 id;
        address creator;
        string contentURI;
        string contentType;
        uint256 timestamp;
        uint256 likes;
        bool isActive;
    }

    // Mapping from content ID to Content struct
    mapping(uint256 => Content) public contents;
    
    // Mapping from user address to their content IDs
    mapping(address => uint256[]) public userContents;
    
    // Mapping to track user likes
    mapping(uint256 => mapping(address => bool)) public contentLikes;

    // Events
    event ContentCreated(uint256 indexed contentId, address indexed creator, string contentURI, string contentType);
    event ContentUpdated(uint256 indexed contentId, string contentURI);
    event ContentRemoved(uint256 indexed contentId);
    event ContentLiked(uint256 indexed contentId, address indexed liker);
    event ContentUnliked(uint256 indexed contentId, address indexed unliker);

    /**
     * @dev Create new content
     * @param _contentURI IPFS or other decentralized storage URI for the content
     * @param _contentType Type of content (e.g., "image", "video", "text")
     */
    function createContent(string memory _contentURI, string memory _contentType) public {
        _contentIds.increment();
        uint256 newContentId = _contentIds.current();
        
        contents[newContentId] = Content({
            id: newContentId,
            creator: msg.sender,
            contentURI: _contentURI,
            contentType: _contentType,
            timestamp: block.timestamp,
            likes: 0,
            isActive: true
        });
        
        userContents[msg.sender].push(newContentId);
        
        emit ContentCreated(newContentId, msg.sender, _contentURI, _contentType);
    }

    /**
     * @dev Update existing content
     * @param _contentId ID of the content to update
     * @param _newContentURI New URI for the content
     */
    function updateContent(uint256 _contentId, string memory _newContentURI) public {
        require(contents[_contentId].creator == msg.sender, "Only creator can update content");
        require(contents[_contentId].isActive, "Content is not active");
        
        contents[_contentId].contentURI = _newContentURI;
        
        emit ContentUpdated(_contentId, _newContentURI);
    }

    /**
     * @dev Remove content (mark as inactive)
     * @param _contentId ID of the content to remove
     */
    function removeContent(uint256 _contentId) public {
        require(contents[_contentId].creator == msg.sender || owner() == msg.sender, "Only creator or owner can remove content");
        require(contents[_contentId].isActive, "Content is already inactive");
        
        contents[_contentId].isActive = false;
        
        emit ContentRemoved(_contentId);
    }

    /**
     * @dev Like content
     * @param _contentId ID of the content to like
     */
    function likeContent(uint256 _contentId) public {
        require(contents[_contentId].isActive, "Content is not active");
        require(!contentLikes[_contentId][msg.sender], "Content already liked by user");
        require(contents[_contentId].creator != msg.sender, "Creator cannot like their own content");
        
        contentLikes[_contentId][msg.sender] = true;
        contents[_contentId].likes += 1;
        
        emit ContentLiked(_contentId, msg.sender);
    }

    /**
     * @dev Unlike content
     * @param _contentId ID of the content to unlike
     */
    function unlikeContent(uint256 _contentId) public {
        require(contents[_contentId].isActive, "Content is not active");
        require(contentLikes[_contentId][msg.sender], "Content not liked by user");
        
        contentLikes[_contentId][msg.sender] = false;
        contents[_contentId].likes -= 1;
        
        emit ContentUnliked(_contentId, msg.sender);
    }

    /**
     * @dev Get content by ID
     * @param _contentId ID of the content to retrieve
     * @return Content struct
     */
    function getContent(uint256 _contentId) public view returns (Content memory) {
        return contents[_contentId];
    }

    /**
     * @dev Get all content IDs created by a user
     * @param _user Address of the user
     * @return Array of content IDs
     */
    function getUserContentIds(address _user) public view returns (uint256[] memory) {
        return userContents[_user];
    }

    /**
     * @dev Get total number of content items
     * @return Total content count
     */
    function getTotalContentCount() public view returns (uint256) {
        return _contentIds.current();
    }
} 