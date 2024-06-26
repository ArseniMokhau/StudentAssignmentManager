import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import './AssignmentDetails.css';
import { AuthContext } from '../auth/AuthContext';

export const AssignmentDetails = () => {
  const { id } = useParams();
  const { role, uid } = useContext(AuthContext);
  const [assignment, setAssignment] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [assignmentStatus, setAssignmentStatus] = useState('Not Submitted');
  const [submissions, setSubmissions] = useState([]);
  const [topSubmission, setTopSubmission] = useState('');
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

    fetchAssignmentDetails();

    // Check if the current date is past the deadline
    /*
    const currentDate = new Date();
    const assignmentDeadline = new Date(placeholderAssignment.deadline);
    if (currentDate > assignmentDeadline) {
      setIsPastDeadline(true);
    }
    */
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

  const fetchAssignmentDetails = async () => {
    try {
      const response = await fetch(`/auth/assignment-info?assignmentId=${id}`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assignment details');
      }

      const data = await response.json();

      const placeholderAssignment = {
        id: id,
        name: data.title,
        description: data.description,
      };

      setAssignment(placeholderAssignment);
    } catch (error) {
      console.error('Error fetching assignment details:', error.message);
    }
  };

  const checkEnrollment = () => {
    // Placeholder function to simulate checking enrollment
    setIsEnrolled(true);
  };

  const checkCuration = () => {
    // Placeholder function to simulate checking curation
    setIsCurating(true);
  };

  const fetchAssignmentStatusFromBackend = async (assignmentId) => {
    try {
      const response = await fetch(`/auth/student-get-sended-assignments?assignmentId=${id}&studentId=${uid}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch assignment status');
      }
  
      const data = await response.json();

      if (data.length > 0) {
        const formattedTopSubmission = {
          studentId: data[0].studentId,
          studentName: data[0].studentName,
          fileName: data[0].fileName,
          path: data[0].path,
          submissionDate: data[0].submissionDate,
        };

        setAssignmentStatus('Submitted');
  
        // Save the top submission to state
        setTopSubmission(formattedTopSubmission);
      } else {
        setAssignmentStatus('Not Submitted');

        // Handle case where no submissions are returned
        console.warn('No submissions found');
      }
  
    } catch (error) {
      console.error('Error fetching assignment status:', error.message);
    }
  };

  const fetchSubmissionsFromBackend = async (assignmentId) => {
    try {
      const response = await fetch(`/auth/teacher-get all sended assignments?assignmentId=${id}&teacherId=${uid}`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }

      const data = await response.json();

      const formattedSubmissions = data.map(submission => ({
        studentId: submission.studentId,
        studentName: submission.studentName,
        fileName: submission.fileName,
        path: submission.path,
        submissionDate: submission.submissionDate,
      }));

      setSubmissions(formattedSubmissions);

    } catch (error) {
      console.error('Error fetching submissions:', error.message);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleSubmit = async () => {

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file, file.name);
    });
  
    try {
      const response = await fetch(`/auth/upload-assignment-file?assignmentId=${id}&studentId=${uid}`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload files');
      }
  
      const data = await response.json();
      console.log('Files uploaded successfully');
      // Handle success, update UI if needed
    } catch (error) {
      console.error('File upload failed:', error.message);
      // Handle error, show error message to user
    }

    fetchAssignmentStatusFromBackend(id);
  };
  

  const handleDownload = async (path, fileName) => {
    const completePath = `${path}\\${fileName}`;
    const encodedPath = encodeURIComponent(completePath);
    
    try {
      const response = await fetch(`/auth/download/${encodedPath}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
  
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error.message);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedAssignment({
      title: assignment.name,
      description: assignment.description,
      // deadline: assignment.deadline,
    });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`/auth/update-assignment?assignmentId=${id}&title=${editedAssignment.title}&description=${editedAssignment.description}&teacherId=${uid}`, {
        method: 'PUT',
        headers: {
          'accept': '/',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update assignment');
      }

      const data = await response.text();

      console.log(data);

      setSubmissions(formattedSubmissions);

    } catch (error) {
      console.error('Error updating assignment:', error.message);
    }

    setIsEditing(false);

    fetchAssignmentDetails();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDeleteAssignment = async () => {
    setIsEditing(false);
    
    try {
      const response = await fetch(`/auth/delete-assignment?assignmentId=${id}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.text();
      console.log('Assignment deleted successfully', data);

      setDeletionSuccess(true);

    } catch (error) {
      console.error('Assignment deletion failed:', error.message);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-UK', options).format(date);
  };
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedAssignment({
      ...editedAssignment,
      [name]: value,
    });
  };

  if (deletionSuccess) {
    return <div>Deletion success</div>;
  }

  if (!assignment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="assignment-details">
      <h2>{assignment.name}</h2>
      <p>{assignment.description}</p>
      {/*
      <p><strong>Deadline:</strong> {assignment.deadline}</p>
      */}

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
                {/*
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
                */}
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
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>File Name</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={`${submission.studentId}-${submission.fileName}-${submission.submissionDate}`}>
                    <td>{submission.studentId}</td>
                    <td>{submission.studentName}</td>
                    <td>{submission.fileName}</td>
                    <td>{formatDate(submission.submissionDate)}</td>
                    <td>
                      <button onClick={() => handleDownload(submission.path, submission.fileName)}>Download</button>
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
                <button onClick={() => handleDownload(topSubmission.path, topSubmission.fileName)}>Download</button>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};
