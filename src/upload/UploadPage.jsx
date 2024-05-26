import React, { useState } from 'react';

export const UploadPage = () => {
    const [selectedFiles, setSelectedFiles] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = e => {
    setSelectedFiles(e.target.files);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!selectedFiles || selectedFiles.length === 0) {
      setMessage('Please select a file to upload');
      return;
    }

    try {
      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('files', selectedFiles[i]);
      }

      const response = await fetch('/auth/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data && data.UploadedFiles) {
        setMessage('Files uploaded successfully: ' + data.UploadedFiles.join(', '));
      } else {
        throw new Error('Invalid server response');
      }
    } catch (error) {
      console.error('Upload failed:', error.message);
      setMessage('Upload failed: ' + error.message);
    }

    // Clear input field after submission
    setSelectedFiles(null);
  };

  return (
    <div>
      <h2>Upload Page</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file">Select File(s):</label>
        <input
          type="file"
          id="file"
          name="file"
          multiple
          onChange={handleFileChange}
        />

        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};