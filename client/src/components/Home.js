import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ContentCard from './ContentCard';

const Home = ({ contract, account }) => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        if (contract) {
          setLoading(true);
          
          // Get total content count
          const totalCount = await contract.getTotalContentCount();
          const contentCount = totalCount.toNumber();
          
          // Fetch all active contents
          const fetchedContents = [];
          for (let i = 1; i <= contentCount; i++) {
            const content = await contract.getContent(i);
            if (content.isActive) {
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
          }
          
          // Sort by newest first
          fetchedContents.sort((a, b) => b.id - a.id);
          
          setContents(fetchedContents);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching contents:", error);
        setLoading(false);
      }
    };

    fetchContents();
  }, [contract]);

  if (loading) {
    return <div className="loading">Loading contents...</div>;
  }

  return (
    <div>
      <h2>Latest User Generated Content</h2>
      
      {contents.length === 0 ? (
        <div className="no-content">
          <p>No content has been created yet.</p>
          <Link to="/create" className="btn btn-primary">Create First Content</Link>
        </div>
      ) : (
        <div className="content-grid">
          {contents.map(content => (
            <ContentCard 
              key={content.id} 
              content={content} 
              account={account}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home; 