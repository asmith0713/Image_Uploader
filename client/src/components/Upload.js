import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Upload.css';

function Upload() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const validateAndProcessFiles = (selectedFiles) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const processedFiles = [];
    const newPreviews = [];
    let errors = [];

    Array.from(selectedFiles).forEach(file => {
      if (!validTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type`);
        return;
      }
      
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File too large (max 10MB)`);
        return;
      }

      processedFiles.push(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push({
          name: file.name,
          size: (file.size / 1024).toFixed(2) + ' KB',
          url: reader.result,
          id: Math.random().toString(36).substr(2, 9)
        });
        
        if (newPreviews.length === processedFiles.length) {
          setPreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (errors.length > 0) {
      setError(errors.join(', '));
    } else {
      setError('');
    }

    return processedFiles;
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    const validFiles = validateAndProcessFiles(selectedFiles);
    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = validateAndProcessFiles(e.dataTransfer.files);
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    setPreviews([]);
    setCaption('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    if (caption.trim()) {
      formData.append('caption', caption.trim());
    }

    try {
      await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      
      // Save to history
      const historyItem = {
        date: new Date().toISOString(),
        fileCount: files.length,
        caption: caption || 'No caption',
        success: true
      };
      
      const history = JSON.parse(localStorage.getItem('uploadHistory') || '[]');
      history.unshift(historyItem);
      localStorage.setItem('uploadHistory', JSON.stringify(history.slice(0, 20))); // Keep last 20
      
      navigate('/thank-you', { state: { fileCount: files.length } });
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="upload-container">
      <div className="container">
        {/* Logo Header - Centered */}
        <div className="row justify-content-center mb-4">
          <div className="col-12 text-center">
            <div className="logo-container">
              <div className="logo-icon-large">📦</div>
              <h1 className="app-title">TeleBox</h1>
              <p className="app-subtitle">Your Telegram Storage Box</p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-end mb-3">
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => navigate('/history')}
                    type="button"
                  >
                    📋 History
                  </button>
                </div>
            
            <form onSubmit={handleSubmit}>
              {/* Drag and Drop Zone */}
              <div 
                className={`drag-drop-zone ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="drag-drop-content">
                  <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="currentColor" className="bi bi-cloud-arrow-up mb-3" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"/>
                    <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
                  </svg>
                  <p className="upload-title">Drop your images here</p>
                  <p className="upload-subtitle">or click to browse files</p>
                  <div className="upload-formats">
                    <span className="format-badge">JPG</span>
                    <span className="format-badge">PNG</span>
                    <span className="format-badge">GIF</span>
                    <span className="format-badge">WebP</span>
                  </div>
                  <p className="text-muted small mt-3" style={{fontSize: '0.85rem'}}>Maximum file size: 10MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="d-none"
                  id="fileInput"
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  multiple
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </div>

              {/* Image Previews */}
              {previews.length > 0 && (
                <div className="preview-container mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <strong style={{fontSize: '1.1rem', color: '#2d3748'}}>
                        ✨ {files.length} {files.length === 1 ? 'image' : 'images'} ready
                      </strong>
                    </div>
                    <button 
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={clearAll}
                      disabled={uploading}
                    >
                      🗑️ Clear All
                    </button>
                  </div>
                  <div className="preview-grid">
                    {previews.map((preview, index) => (
                      <div key={preview.id} className="preview-item">
                        <img src={preview.url} alt={preview.name} />
                        <div className="preview-overlay">
                          <button
                            type="button"
                            className="btn btn-sm btn-danger remove-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            disabled={uploading}
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                        <div className="preview-info">
                          <small className="preview-name">{preview.name}</small>
                          <small className="preview-size">{preview.size}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Caption Field */}
              {files.length > 0 && (
                <div className="mb-4 mt-4">
                  <label htmlFor="caption" className="form-label">
                    💬 Add a caption
                  </label>
                  <textarea
                    className="form-control"
                    id="caption"
                    rows="3"
                    placeholder="Describe your images... (optional)"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    disabled={uploading}
                    maxLength={500}
                  />
                  <div className="d-flex justify-content-between mt-2">
                    <small className="text-muted">Your caption will be sent with the images</small>
                    <small className="text-muted"><strong>{caption.length}</strong>/500</small>
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {uploading && (
                <div className="mb-4">
                  <div className="progress">
                    <div 
                      className="progress-bar progress-bar-striped progress-bar-animated" 
                      role="progressbar" 
                      style={{width: `${uploadProgress}%`}}
                      aria-valuenow={uploadProgress} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    >
                      {uploadProgress}%
                    </div>
                  </div>
                  <div className="text-center mt-3">
                    <small style={{color: '#667eea', fontWeight: '600'}}>
                      🚀 Uploading to Telegram...
                    </small>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="alert alert-danger mb-4" role="alert">
                  <strong>⚠️ Oops!</strong> {error}
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={uploading || files.length === 0}
              >
                {uploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Uploading {uploadProgress}%
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-send-fill me-2" viewBox="0 0 16 16" style={{verticalAlign: 'middle'}}>
                      <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                    </svg>
                    Send to Telegram
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
