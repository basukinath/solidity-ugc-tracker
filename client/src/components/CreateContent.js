import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Web3Storage } from 'web3.storage';

const CreateContent = ({ contract, account }) => {
  const [file, setFile] = useState(null);
  const [contentType, setContentType] = useState('image');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  // Initialize Web3Storage client
  // Note: In a production app, you would want to store this API key securely
  const getWeb3StorageClient = () => {
    return new Web3Storage({ token: 'YOUR_WEB3_STORAGE_API_KEY' });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleContentTypeChange = (e) => {
    setContentType(e.target.value);
  };

  const uploadToIPFS = async () => {
    if (!file) return null;

    try {
      setIsUploading(true);
      setUploadProgress(10);

      const client = getWeb3StorageClient();
      
      // Create a File object with proper name
      const fileToUpload = new File([file], file.name, { type: file.type });
      
      // Upload file to IPFS via Web3.Storage
      setUploadProgress(30);
      const cid = await client.put([fileToUpload], {
        onRootCidReady: () => {
          setUploadProgress(50);
        },
        onStoredChunk: () => {
          setUploadProgress(70);
        }
      });
      
      setUploadProgress(90);
      
      // Construct the IPFS URL
      const ipfsUrl = `https://${cid}.ipfs.dweb.link/${encodeURIComponent(file.name)}`;
      
      setUploadProgress(100);
      return ipfsUrl;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert("Please select a file to upload");
      return;
    }
    
    try {
      // Upload file to IPFS
      const contentURI = await uploadToIPFS();
      
      if (!contentURI) {
        alert("Failed to upload content to IPFS");
        setIsUploading(false);
        return;
      }
      
      // Create content on the blockchain
      const tx = await contract.createContent(contentURI, contentType);
      
      // Wait for transaction to be mined
      await tx.wait();
      
      setIsUploading(false);
      alert("Content created successfully!");
      
      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error("Error creating content:", error);
      alert(`Error creating content: ${error.message}`);
      setIsUploading(false);
    }
  };

  return (
    <div className="create-content">
      <h2>Create New Content</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="contentType">Content Type</label>
          <select
            id="contentType"
            value={contentType}
            onChange={handleContentTypeChange}
            required
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="text">Text</option>
            <option value="audio">Audio</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="file">Upload File</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            required
          />
          <small className="form-text">
            The file will be uploaded to IPFS, a decentralized storage network.
          </small>
        </div>
        
        {isUploading ? (
          <div className="upload-progress">
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p>Uploading... {uploadProgress}%</p>
          </div>
        ) : (
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isUploading || !file}
          >
            Create Content
          </button>
        )}
      </form>
    </div>
  );
};

export default CreateContent; 