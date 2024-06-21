import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './AssignmentDetails.css';

// Placeholder assignment details
const placeholderAssignment = {
  id: 1,
  title: 'Assignment Title',
  description: 'Assignment Description',
};

export const AssignmentDetails = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [assignmentStatus, setAssignmentStatus] = useState('Not Submitted');

  useEffect(() => {
    // Placeholder fetch assignment details by id
    setAssignment(placeholderAssignment);

    // Placeholder fetch assignment status by id (from backend)
    fetchAssignmentStatusFromBackend(id); // Replace with actual API call
  }, [id]);

  const fetchAssignmentStatusFromBackend = (assignmentId) => {
    // Placeholder function to fetch assignment status from backend
    setTimeout(() => {
      const fetchedAssignmentStatus = 'Not Submitted';
      setAssignmentStatus(fetchedAssignmentStatus);
    }, 1000);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Placeholder for submission logic
    setAssignmentStatus('Submitted');
    setSubmissionStatus('Success');
  };

  const handleDownload = () => {
    // Placeholder function for downloading submitted files
    console.log('Downloading submitted files...');
  };

  if (!assignment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="assignment-details">
      <h2>{assignment.title}</h2>
      <p>{assignment.description}</p>

      {/* Assignment Status */}
      <div className="assignment-status">
        <h3>Assignment Status</h3>
        <p>{assignmentStatus}</p>
      </div>

      {/* Submission Form */}
      <div className="submission-form">
        <h3>Submit Your Files</h3>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} multiple />
          <button type="submit">Submit</button>
        </form>
        {submissionStatus && <p>Submission Status: {submissionStatus}</p>}
      </div>

      {/* Download Button */}
      {assignmentStatus === 'Submitted' && (
        <div className="download-section">
          <h3>Download Submitted Files</h3>
          <button onClick={handleDownload}>Download</button>
        </div>
      )}
    </div>
  );
};