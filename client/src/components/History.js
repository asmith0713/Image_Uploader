import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './History.css';

function History() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('uploadHistory') || '[]');
    setHistory(savedHistory);
  }, []);

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('uploadHistory');
      setHistory([]);
    }
  };

  const deleteItem = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    localStorage.setItem('uploadHistory', JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  return (
    <div className="history-container">
      <div className="container mt-4">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="card-title mb-0">📚 Upload History</h5>
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => navigate('/')}
              >
                ← Upload
              </button>
            </div>

            {history.length === 0 ? (
              <div className="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-inbox mb-3" viewBox="0 0 16 16">
                  <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4H4.98zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438L14.933 9zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374l3.7-4.625z"/>
                </svg>
                <p className="text-muted">No upload history yet</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/')}
                >
                  Upload Images
                </button>
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <small className="text-muted">
                    {history.length} upload{history.length !== 1 ? 's' : ''} total
                  </small>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={clearHistory}
                  >
                    Clear All
                  </button>
                </div>

                <div className="history-list">
                  {history.map((item, index) => (
                    <div 
                      key={index} 
                      className="history-item"
                      style={{'--item-index': index}}
                    >
                      <div className="history-icon">
                        {item.success ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-check-circle-fill text-success" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x-circle-fill text-danger" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                          </svg>
                        )}
                      </div>
                      <div className="history-content">
                        <div className="history-header">
                          <strong>📸 {item.fileCount} image{item.fileCount !== 1 ? 's' : ''}</strong>
                          <span className="text-muted small">{formatDate(item.date)}</span>
                        </div>
                        <p className="history-caption mb-0">💬 {item.caption}</p>
                      </div>
                      <button 
                        className="btn btn-sm btn-outline-danger delete-btn"
                        onClick={() => deleteItem(index)}
                        title="Delete this upload"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
