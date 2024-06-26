import React, { useState, useEffect, useContext } from 'react';
import './Requests.css';
import { AuthContext } from '../auth/AuthContext';

export const Requests = () => {
  const { role, uid } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (uid) {
      fetchRequests();
    }
  }, [uid]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching requests...');
      const response = await fetch(`/auth/get-active-access-requests?teacherId=${uid}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch requests, status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched data:', data);

      const parsedRequests = data.map(request => ({
        id: request.repositoryAccessRequestId,
        type: request.role,
        course: request.courseId,
        username: request.username,
        requestTime: request.requestTime,
      }));

      setRequests(parsedRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = (requestId) => {
    approveRequest(requestId);
  };

  const handleDeny = (requestId) => {
    console.log(`Request ${requestId} denied.`);
  };

  const approveRequest = async (requestId) => {
    try {
      console.log('Approving request...', requestId);
      const response = await fetch(`/auth/approve-access-student-course?requestId=${requestId}`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
        },
        body: '', // Empty body for POST request
      });

      if (!response.ok) {
        throw new Error(`Failed to approve request, status: ${response.status}`);
      }

      const data = await response.text();
      console.log(data); // Log success message
      fetchRequests(); // Re-fetch requests after approval
    } catch (error) {
      console.error('Error approving request:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="requests-container">
      <h2>Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Course</th>
            <th>Username</th>
            <th>Request Time</th>
            {role === 'teacher' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request.id}>
              <td>{request.type}</td>
              <td>{request.course}</td>
              <td>{request.username}</td>
              <td>{new Date(request.requestTime).toLocaleString()}</td>
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
