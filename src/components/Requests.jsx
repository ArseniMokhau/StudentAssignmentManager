import React, { useState, useEffect, useContext } from 'react';
import './Requests.css';
import { AuthContext } from '../auth/AuthContext';

// Placeholder data for student requests
const studentRequests = [
  { id: 1, type: 'Enrollment', course: 'Course A', status: 'Pending' },
  { id: 2, type: 'Curation', course: 'Course B', status: 'Pending' },
];

// Placeholder data for teacher requests (self and others)
const teacherRequests = [
  { id: 1, type: 'Enrollment', course: 'Course C', status: 'Pending', userId: 101 },
  { id: 2, type: 'Curation', course: 'Course D', status: 'Pending', userId: 102 },
  { id: 3, type: 'Enrollment', course: 'Course E', status: 'Pending', userId: 103 },
];

export const Requests = () => {
  const { role } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    if (role === 'student') {
      // Simulate fetching student requests
      setRequests(studentRequests);
    } else if (role === 'teacher') {
      // Simulate fetching teacher requests (self and others)
      setRequests(teacherRequests);
    }
  };

  const handleConfirm = (requestId) => {
    // Placeholder function to handle confirmation
    console.log(`Request ${requestId} confirmed.`);
  };

  const handleDeny = (requestId) => {
    // Placeholder function to handle denial
    console.log(`Request ${requestId} denied.`);
  };

  return (
    <div className="requests-container">
      <h2>Requests</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Course</th>
            {role === 'teacher' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.type}</td>
              <td>{request.course}</td>
              {/*Check if the id of request user matches the id of logged in user*/}
              {role === 'teacher' && (
                <td>
                  <button onClick={() => handleConfirm(request.id)}>Confirm</button>
                  <button onClick={() => handleDeny(request.id)}>Deny</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};