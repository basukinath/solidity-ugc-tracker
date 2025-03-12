import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const UserReports = ({ contract, account }) => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchUserActions = async () => {
      try {
        if (contract && account) {
          setLoading(true);
          
          // Get user's action IDs
          const actionIds = await contract.getUserActionIds(account);
          
          // Fetch action details for each ID
          const fetchedActions = [];
          for (let i = 0; i < actionIds.length; i++) {
            const id = actionIds[i].toNumber();
            const action = await contract.getUserAction(id);
            
            // Get content details for the action
            const content = await contract.getContent(action.contentId.toNumber());
            
            fetchedActions.push({
              id: action.id.toNumber(),
              user: action.user,
              actionType: action.actionType,
              contentId: action.contentId.toNumber(),
              contentType: content.contentType,
              timestamp: new Date(action.timestamp.toNumber() * 1000).toLocaleString(),
              contentURI: content.contentURI
            });
          }
          
          // Sort by newest first
          fetchedActions.sort((a, b) => b.id - a.id);
          
          setActions(fetchedActions);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user actions:", error);
        setLoading(false);
      }
    };

    fetchUserActions();
  }, [contract, account]);

  const generatePDF = () => {
    setGenerating(true);
    
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('User Activity Report', 14, 22);
      
      // Add user address
      doc.setFontSize(12);
      doc.text(`User: ${account}`, 14, 30);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 38);
      
      // Add action table
      const tableColumn = ["ID", "Action Type", "Content ID", "Content Type", "Timestamp"];
      const tableRows = actions.map(action => [
        action.id,
        action.actionType,
        action.contentId,
        action.contentType,
        action.timestamp
      ]);
      
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [104, 99, 255] }
      });
      
      // Add summary
      const createCount = actions.filter(a => a.actionType === 'create').length;
      const updateCount = actions.filter(a => a.actionType === 'update').length;
      const removeCount = actions.filter(a => a.actionType === 'remove').length;
      const likeCount = actions.filter(a => a.actionType === 'like').length;
      const unlikeCount = actions.filter(a => a.actionType === 'unlike').length;
      
      const finalY = doc.lastAutoTable.finalY || 45;
      
      doc.text('Activity Summary:', 14, finalY + 10);
      doc.text(`Content Created: ${createCount}`, 14, finalY + 20);
      doc.text(`Content Updated: ${updateCount}`, 14, finalY + 28);
      doc.text(`Content Removed: ${removeCount}`, 14, finalY + 36);
      doc.text(`Content Liked: ${likeCount}`, 14, finalY + 44);
      doc.text(`Content Unliked: ${unlikeCount}`, 14, finalY + 52);
      
      // Save the PDF
      doc.save(`user-activity-report-${new Date().getTime()}.pdf`);
      
      setGenerating(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setGenerating(false);
      alert("Error generating PDF report");
    }
  };

  if (loading) {
    return <div className="loading">Loading user actions...</div>;
  }

  return (
    <div className="user-reports">
      <h2>User Activity Reports</h2>
      
      <div className="report-actions">
        <button 
          onClick={generatePDF} 
          className="btn btn-primary"
          disabled={generating || actions.length === 0}
        >
          {generating ? 'Generating PDF...' : 'Generate PDF Report'}
        </button>
      </div>
      
      {actions.length === 0 ? (
        <div className="no-actions">
          <p>No actions recorded for this user yet.</p>
        </div>
      ) : (
        <div className="actions-table">
          <h3>Recent Actions</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Action Type</th>
                <th>Content ID</th>
                <th>Content Type</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {actions.map(action => (
                <tr key={action.id}>
                  <td>{action.id}</td>
                  <td className={`action-type-${action.actionType}`}>
                    {action.actionType.charAt(0).toUpperCase() + action.actionType.slice(1)}
                  </td>
                  <td>{action.contentId}</td>
                  <td>{action.contentType}</td>
                  <td>{action.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserReports; 