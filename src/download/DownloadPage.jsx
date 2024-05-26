import React, { useState } from 'react';

export const DownloadPage = () => {
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleDownload = async () => {
    try {
      const response = await fetch(`/auth/download/${fileName}`);

      if (!response.ok) {
        throw new Error('File not found');
      }

      // Create a link element to trigger file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed:', error.message);
      setError(`Download failed: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Download File</h2>
      <input
        type="text"
        placeholder="Enter file name"
        value={fileName}
        onChange={e => setFileName(e.target.value)}
      />
      <button onClick={handleDownload}>Download</button>
      {error && <p>{error}</p>}
    </div>
  );
};