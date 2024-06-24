import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
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
  const { role } = useContext(AuthContext);
  const [assignment, setAssignment] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [assignmentStatus, setAssignmentStatus] = useState('Not Submitted');
  const [submissions, setSubmissions] = useState([]);
  const [isPastDeadline, setIsPastDeadline] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isCurating, setIsCurating] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Flag for editing mode
  const [deletionSuccess, setDeletionSuccess] = useState(false);
  const [editedAssignment, setEditedAssignment] = useState({
    title: '',
    description: '',
    deadline: '',
  });

  useEffect(() => {
    // Placeholder fetch assignment details by id
    setAssignment(placeholderAssignment);

    // Check if the current date is past the deadline
    const currentDate = new Date();
    const assignmentDeadline = new Date(placeholderAssignment.deadline);
    if (currentDate > assignmentDeadline) {
      setIsPastDeadline(true);
    }

    // Check enrollment or curation status
    if (role === 'student') {
      checkEnrollment();
      fetchAssignmentStatusFromBackend(id);
    }

    if (role === 'teacher') {
      checkCuration();
      fetchSubmissionsFromBackend(id);
    }
  }, [id, role]);

  const checkEnrollment = () => {
    // Placeholder function to simulate checking enrollment
    setIsEnrolled(true);
  };

  const checkCuration = () => {
    // Placeholder function to simulate checking curation
    setIsCurating(true);
  };

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

  const handleEdit = () => {
    setIsEditing(true);
    setEditedAssignment({
      title: assignment.title,
      description: assignment.description,
      deadline: assignment.deadline,
    });
  };

  const handleSaveEdit = () => {
    // Simulate sending edit request to server
    setAssignment({
      ...assignment,
      title: editedAssignment.title,
      description: editedAssignment.description,
      deadline: editedAssignment.deadline,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDeleteAssignment = () => {
    setIsEditing(false);
    // Simulate deletion process
    setTimeout(() => {
      // Assuming deletion was successful
      navigate(-1); // Navigate back to previous page in history stack
    }, 1000);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedAssignment({
      ...editedAssignment,
      [name]: value,
    });
  };

  if (deletionSuccess) {
    return <Navigate to="/" replace />;
  }

  if (!assignment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="assignment-details">
      <h2>{assignment.title}</h2>
      <p>{assignment.description}</p>
      <p><strong>Deadline:</strong> {assignment.deadline}</p>

      {role === 'teacher' && isCurating ? (
        <>
          {isEditing ? (
            <div className="edit-form">
              <h3>Edit Assignment</h3>
              <form>
                <div className="form-group">
                  <label htmlFor="title">Title:</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={editedAssignment.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description:</label>
                  <textarea
                    id="description"
                    name="description"
                    value={editedAssignment.description}
                    onChange={handleInputChange}
                    required
                    rows="5"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="deadline">Deadline:</label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={editedAssignment.deadline}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="edit-course-actions">
                <button className="save-button" type="save-button" onClick={handleSaveEdit}>Save</button>
                <button className="cancel-button" type="cancel-button" onClick={handleCancelEdit}>Cancel</button>
                <button className="delete-button" type="delete-button" onClick={handleDeleteAssignment}>Delete Assignment</button>
                </div>
              </form>
            </div>
          ) : (
            <button className="edit-button" onClick={handleEdit}>Edit Assignment</button>
          )}

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
        </>
      ) : (
        role === 'student' && isEnrolled && (
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
