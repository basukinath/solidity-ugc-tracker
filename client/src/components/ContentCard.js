import React from 'react';
import { Link } from 'react-router-dom';

const ContentCard = ({ content }) => {
  // Function to truncate Ethereum address for display
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function to determine content preview based on type
  const renderContentPreview = () => {
    if (content.contentType === 'image') {
      return (
        <img 
          src={content.contentURI} 
          alt={`Content #${content.id}`} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
          }}
        />
      );
    } else if (content.contentType === 'video') {
      return (
        <div className="video-placeholder">
          <img 
            src="https://via.placeholder.com/300x200?text=Video+Content" 
            alt={`Video Content #${content.id}`} 
          />
          <div className="play-icon">▶</div>
        </div>
      );
    } else {
      // Default for text or other content types
      return (
        <div className="text-preview">
          <img 
            src="https://via.placeholder.com/300x200?text=Text+Content" 
            alt={`Text Content #${content.id}`} 
          />
        </div>
      );
    }
  };

  return (
    <div className="content-card">
      {renderContentPreview()}
      
      <div className="content-card-body">
        <h3 className="content-card-title">
          Content #{content.id}
        </h3>
        <p className="content-card-text">
          Created by: {truncateAddress(content.creator)}
        </p>
        <p className="content-card-text">
          Created: {content.timestamp}
        </p>
        <Link to={`/content/${content.id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
      
      <div className="content-card-footer">
        <div className="content-card-likes">
          <i className="fas fa-heart"></i> {content.likes} likes
        </div>
        <div className="content-card-type">
          {content.contentType}
        </div>
      </div>
    </div>
  );
};

export default ContentCard; 