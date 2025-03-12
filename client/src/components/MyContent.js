import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ContentCard from './ContentCard';

const MyContent = ({ contract, account }) => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyContents = async () => {
      try {
        if (contract && account) {
          setLoading(true);
          
          // Get user's content IDs
          const contentIds = await contract.getUserContentIds(account);
          
          // Fetch content details for each ID
          const fetchedContents = [];
          for (let i = 0; i < contentIds.length; i++) {
            const id = contentIds[i].toNumber();
            const content = await contract.getContent(id);
            
            fetchedContents.push({
              id: content.id.toNumber(),
              creator: content.creator,
              contentURI: content.contentURI,
              contentType: content.contentType,
              timestamp: new Date(content.timestamp.toNumber() * 1000).toLocaleString(),
              likes: content.likes.toNumber(),
              isActive: content.isActive
            });
          }
          
          // Sort by newest first
          fetchedContents.sort((a, b) => b.id - a.id);
          
          setContents(fetchedContents);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user contents:", error);
        setLoading(false);
      }
    };

    fetchMyContents();
  }, [contract, account]);

  if (loading) {
    return <div className="loading">Loading your contents...</div>;
  }

  return (
    <div>
      <div className="my-content-header">
        <h2>My Content</h2>
        <Link to="/create" className="btn btn-primary">Create New Content</Link>
      </div>
      
      {contents.length === 0 ? (
        <div className="no-content">
          <p>You haven't created any content yet.</p>
          <Link to="/create" className="btn btn-primary">Create First Content</Link>
        </div>
      ) : (
        <div className="content-grid">
          {contents.map(content => (
            <div key={content.id} className="my-content-card-wrapper">
              <ContentCard 
                content={content} 
                account={account}
              />
              
              {content.isActive && (
                <div className="my-content-actions">
                  <Link to={`/content/${content.id}`} className="btn btn-secondary">
                    Edit
                  </Link>
                  <button 
                    className="btn btn-danger"
                    onClick={async () => {
                      try {
                        const tx = await contract.removeContent(content.id);
                        await tx.wait();
                        
                        // Update the UI
                        setContents(prevContents => 
                          prevContents.map(c => 
                            c.id === content.id ? { ...c, isActive: false } : c
                          )
                        );
                        
                        alert("Content removed successfully!");
                      } catch (error) {
                        console.error("Error removing content:", error);
                        alert(`Error removing content: ${error.message}`);
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
              
              {!content.isActive && (
                <div className="content-inactive-badge">
                  Inactive
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyContent; 