import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './AssignmentDetails.css';
import { AuthContext } from '../auth/AuthContext';

// Placeholder assignment details
const placeholderAssignment = {
  id: 1,
  title: 'Assignment Title',
  description: 'Assignment Description',
  deadline: '2024-07-01',
};

// Placeholder student submissions
const placeholderSubmissions = [
  { id: 1, assignmentId: 1, studentId: 101, fileName: 'file1.pdf', date: '2024-06-20' },
  { id: 2, assignmentId: 1, studentId: 102, fileName: 'file2.pdf', date: '2024-06-21' },
];

export const AssignmentDetails = () => {
  const { id } = useParams();
  const { isLoggedIn, role } = useContext(AuthContext);
  const [assignment, setAssignment] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [assignmentStatus, setAssignmentStatus] = useState('Not Submitted');
  const [submissions, setSubmissions] = useState([]);
  const [isPastDeadline, setIsPastDeadline] = useState(false);

  useEffect(() => {
    // Placeholder fetch assignment details by id
    setAssignment(placeholderAssignment);

    // Check if the current date is past the deadline
    const currentDate = new Date();
    const assignmentDeadline = new Date(placeholderAssignment.deadline);
    if (currentDate > assignmentDeadline) {
      setIsPastDeadline(true);
    }

    // Placeholder fetch assignment status by id (from backend)
    if (role === 'student') {
      fetchAssignmentStatusFromBackend(id);
    }

    if (role === 'teacher') {
      // Placeholder fetch student submissions (from backend)
      fetchSubmissionsFromBackend(id);
    }
  }, [id, role]);

  const fetchAssignmentStatusFromBackend = (assignmentId) => {
    setTimeout(() => {
      const fetchedAssignmentStatus = 'Not Submitted';
      setAssignmentStatus(fetchedAssignmentStatus);
    }, 1000);
  };

  const fetchSubmissionsFromBackend = (assignmentId) => {
    setTimeout(() => {
      setSubmissions(placeholderSubmissions);
    }, 1000);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setAssignmentStatus('Submitted');
    setSubmissionStatus('Success');
  };

  const handleDownload = (fileName) => {
    console.log(`Downloading file: ${fileName}`);
  };

  if (!assignment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="assignment-details">
      <h2>{assignment.title}</h2>
      <p>{assignment.description}</p>
      <p><strong>Deadline:</strong> {assignment.deadline}</p>

      {role === 'teacher' ? (
        <div className="submissions-table">
          <h3>Student Submissions</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student ID</th>
                <th>File Name</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id}>
                  <td>{submission.id}</td>
                  <td>{submission.studentId}</td>
                  <td>{submission.fileName}</td>
                  <td>{submission.date}</td>
                  <td>
                    <button onClick={() => handleDownload(submission.fileName)}>Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        role === 'student' && (
          <>
            <div className="assignment-status">
              <h3>Assignment Status</h3>
              <p>{assignmentStatus}</p>
            </div>

            {isPastDeadline ? (
              <p>The deadline has passed. You can no longer submit files for this assignment.</p>
            ) : (
              <div className="submission-form">
                <h3>Submit Your Files</h3>
                <form onSubmit={handleSubmit}>
                  <input type="file" onChange={handleFileChange} multiple />
                  <button type="submit">Submit</button>
                </form>
                {submissionStatus && <p>Submission Status: {submissionStatus}</p>}
              </div>
            )}

            {assignmentStatus === 'Submitted' && (
              <div className="download-section">
                <h3>Download Submitted Files</h3>
                <button onClick={handleDownload}>Download</button>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};
