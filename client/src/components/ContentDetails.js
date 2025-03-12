import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ContentDetails = ({ contract, account }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newContentURI, setNewContentURI] = useState('');
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const fetchContentDetails = async () => {
      try {
        if (contract) {
          setLoading(true);
          
          // Fetch content details
          const contentData = await contract.getContent(id);
          
          // Check if user has liked this content
          const liked = await contract.contentLikes(id, account);
          
          // Format content data
          const formattedContent = {
            id: contentData.id.toNumber(),
            creator: contentData.creator,
            contentURI: contentData.contentURI,
            contentType: contentData.contentType,
            timestamp: new Date(contentData.timestamp.toNumber() * 1000).toLocaleString(),
            likes: contentData.likes.toNumber(),
            isActive: contentData.isActive
          };
          
          setContent(formattedContent);
          setNewContentURI(formattedContent.contentURI);
          setHasLiked(liked);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching content details:", error);
        setLoading(false);
      }
    };

    fetchContentDetails();
  }, [contract, id, account]);

  const handleUpdateContent = async () => {
    try {
      const tx = await contract.updateContent(id, newContentURI);
      await tx.wait();
      
      // Update the UI
      setContent(prevContent => ({
        ...prevContent,
        contentURI: newContentURI
      }));
      
      setIsEditing(false);
      alert("Content updated successfully!");
    } catch (error) {
      console.error("Error updating content:", error);
      alert(`Error updating content: ${error.message}`);
    }
  };

  const handleLikeContent = async () => {
    try {
      const tx = await contract.likeContent(id);
      await tx.wait();
      
      // Update the UI
      setContent(prevContent => ({
        ...prevContent,
        likes: prevContent.likes + 1
      }));
      
      setHasLiked(true);
    } catch (error) {
      console.error("Error liking content:", error);
      alert(`Error liking content: ${error.message}`);
    }
  };

  const handleUnlikeContent = async () => {
    try {
      const tx = await contract.unlikeContent(id);
      await tx.wait();
      
      // Update the UI
      setContent(prevContent => ({
        ...prevContent,
        likes: prevContent.likes - 1
      }));
      
      setHasLiked(false);
    } catch (error) {
      console.error("Error unliking content:", error);
      alert(`Error unliking content: ${error.message}`);
    }
  };

  const renderContentDisplay = () => {
    if (!content) return null;

    if (content.contentType === 'image') {
      return (
        <img 
          src={content.contentURI} 
          alt={`Content #${content.id}`} 
          className="content-details-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
          }}
        />
      );
    } else if (content.contentType === 'video') {
      return (
        <video 
          src={content.contentURI} 
          controls 
          className="content-details-video"
        >
          Your browser does not support the video tag.
        </video>
      );
    } else if (content.contentType === 'audio') {
      return (
        <audio 
          src={content.contentURI} 
          controls 
          className="content-details-audio"
        >
          Your browser does not support the audio tag.
        </audio>
      );
    } else {
      // Default for text or other content types
      return (
        <div className="content-details-text">
          <a 
            href={content.contentURI} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            View Content
          </a>
        </div>
      );
    }
  };

  if (loading) {
    return <div className="loading">Loading content details...</div>;
  }

  if (!content) {
    return <div className="not-found">Content not found</div>;
  }

  if (!content.isActive) {
    return (
      <div className="content-inactive">
        <h2>This content is no longer available</h2>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Function to truncate Ethereum address for display
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isCreator = content.creator.toLowerCase() === account.toLowerCase();

  return (
    <div className="content-details">
      <div className="content-details-header">
        <h2 className="content-details-title">Content #{content.id}</h2>
        <p className="content-details-creator">
          Created by: {truncateAddress(content.creator)}
          {isCreator && <span className="creator-badge"> (You)</span>}
        </p>
        <p className="content-details-date">
          Created: {content.timestamp}
        </p>
      </div>
      
      <div className="content-details-body">
        {isEditing ? (
          <div className="edit-content-form">
            <div className="form-group">
              <label htmlFor="newContentURI">Content URI</label>
              <input
                type="text"
                id="newContentURI"
                value={newContentURI}
                onChange={(e) => setNewContentURI(e.target.value)}
                required
              />
            </div>
            
            <div className="edit-actions">
              <button 
                onClick={handleUpdateContent}
                className="btn btn-success"
              >
                Save Changes
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setNewContentURI(content.contentURI);
                }}
                className="btn"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          renderContentDisplay()
        )}
      </div>
      
      <div className="content-details-actions">
        <div className="content-details-likes">
          <i className="fas fa-heart"></i> {content.likes} likes
        </div>
        
        <div className="content-details-buttons">
          {isCreator ? (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-secondary"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Content'}
            </button>
          ) : (
            hasLiked ? (
              <button 
                onClick={handleUnlikeContent}
                className="btn btn-danger"
              >
                Unlike
              </button>
            ) : (
              <button 
                onClick={handleLikeContent}
                className="btn btn-primary"
              >
                Like
              </button>
            )
          )}
          
          <button 
            onClick={() => navigate('/')}
            className="btn"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentDetails; 