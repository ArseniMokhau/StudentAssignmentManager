import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Assignment } from './Assignment';
import './CourseDetails.css';
import { AuthContext } from '../auth/AuthContext';

export const CourseDetails = () => {
  const { id } = useParams();
  const { token, role, uid } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    deadline: '',
  });
  const [isEnrolled, setIsEnrolled] = useState('');
  const [isCurating, setIsCurating] = useState('');
  const [hasApplied, setHasApplied] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [deletionSuccess, setDeletionSuccess] = useState(false);
  const [editedCourse, setEditedCourse] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchCourse();
    fetchAssignments();
    checkEnrollment();
    checkCuration();
  }, [id, isCurating, isEditing]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/auth/repository-info?repositoryId=${id}`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch course details');
      }

      const data = await response.json();
      const fetchedCourse = {
        id: id,
        name: data.repositoryName,
        description: data.description,
      };

      setCourse(fetchedCourse);
    } catch (error) {
      console.error('Error fetching course details:', error.message);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`/auth/all-assignments-by-repository?repositoryId=${id}`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }

      const data = await response.json();
      const formattedAssignments = data.map(assignment => ({
        id: assignment.assignmentId,
        title: assignment.title,
        description: assignment.description,
        deadline: assignment.deadline,
      }));
      setAssignments(formattedAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error.message);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await fetch(`/auth/is-student-enrolled?courseId=${id}&studentId=${uid}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check enrollment status');
      }

      const isAssociated = await response.json();
      setIsEnrolled(isAssociated);
    } catch (error) {
      console.error('Error checking enrollment status:', error.message);
    }
  };

  const checkCuration = async () => {
    try {
      const response = await fetch(`/auth/is-teacher-associated?courseId=${id}&teacherId=${uid}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check curation status');
      }

      const isAssociated = await response.json();
      setIsCurating(isAssociated);
    } catch (error) {
      console.error('Error checking curation status:', error.message);
    }
  };

  const handleNewAssignmentChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({ ...newAssignment, [name]: value });
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/auth/create-assignment?teacherId=${uid}&repositoryId=${id}&title=${newAssignment.title}&description=${newAssignment.description}&deadline=${newAssignment.deadline}`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
        },
        body: JSON.stringify(newAssignment)
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.text();
      console.log('Assignment created successfully', data);

      // Re-fetch assignments after creating a new one
      fetchAssignments();

      setNewAssignment({ title: '', description: '', deadline: '' });
    } catch (error) {
      console.error('Assignment creation failed:', error.message);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      const response = await fetch(`/auth/delete-assignment?assignmentId=${assignmentId}`, {
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

    } catch (error) {
      console.error('Assignment deletion failed:', error.message);
    }

    fetchAssignments();
  };

  const handleEditCourse = () => {
    setIsEditing(true);
    setEditedCourse({
      name: course.name,
      description: course.description,
    });
  };

  const handleSaveEdit = () => {
    setCourse({
      ...course,
      name: editedCourse.name,
      description: editedCourse.description,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDeleteCourse = async () => {
    try {
      const response = await fetch(`/auth/delete-repository?repositoryId=${id}`, {
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
      console.log('Course deleted successfully', data);
      
      setDeletionSuccess(true);

    } catch (error) {
      console.error('Course deletion failed:', error.message);
    }
    
    setIsEditing(false);
  };

  const requestEnrollment = async () => {
    try {
      const response = await fetch(`/auth/request-access?courseId=${id}&studentId=${uid}`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.text();
      console.log('Applied successfuly: ', data);

    } catch (error) {
      console.error('Could not apply to the course:', error.message);
    }

    setHasApplied(true);
    checkEnrollment();

    // setIsEnrolled(true);
  };

  const requestCuration = () => {
    setIsCurating(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedCourse({
      ...editedCourse,
      [name]: value,
    });
  };

  if (deletionSuccess) {
    return <Navigate to="/" replace />;
  }

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="course-details">
      <h2>{isEditing ? (
        <input
          type="text"
          name="name"
          value={editedCourse.name}
          onChange={handleInputChange}
          className="edit-input"
        />
      ) : (
        course.name
      )}</h2>

      <p>{isEditing ? (
        <textarea
          name="description"
          value={editedCourse.description}
          onChange={handleInputChange}
          className="edit-textarea"
        />
      ) : (
        course.description
      )}</p>

      {role === 'teacher' && isCurating && !isEditing && (
        <button className="edit-button" onClick={handleEditCourse}>
          Edit Course
        </button>
      )}

      {role === 'teacher' && isCurating && isEditing && (
        <div className="edit-course-actions">
          <button className="save-button" onClick={handleSaveEdit}>
            Save
          </button>
          <button className="cancel-button" onClick={handleCancelEdit}>
            Cancel
          </button>
          <button className="delete-button" onClick={handleDeleteCourse}>
            Delete Course
          </button>
        </div>
      )}

      {role === 'student' && !isEnrolled && !hasApplied &&(
        <button className="enroll-button" onClick={requestEnrollment}>
          Enroll
        </button>
      )}
      {role === 'student' && isEnrolled && (
        <p className="enrolled-message">You are enrolled in this course.</p>
      )}
      {role === 'teacher' && !isCurating && (
        <button className="enroll-button" onClick={requestCuration}>
          Request Curation
        </button>
      )}
      {role === 'teacher' && isCurating && (
        <p className="enrolled-message">You are curating this course.</p>
      )}

      <h3>Assignments</h3>
      <div className="assignments-list">
        {assignments.map(assignment => (
          <div key={assignment.id} className="assignment-item">
            <div className="assignment-details">
              <Assignment assignment={assignment} />
            </div>
            {role === 'teacher' && isCurating && (
              <div className="assignment-actions">
                <button onClick={() => handleDeleteAssignment(assignment.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {role === 'teacher' && isCurating && (
        <div className="new-assignment-form">
          <h3>Create New Assignment</h3>
          <form onSubmit={handleCreateAssignment}>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newAssignment.title}
                onChange={handleNewAssignmentChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={newAssignment.description}
                onChange={handleNewAssignmentChange}
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
                value={newAssignment.deadline}
                onChange={handleNewAssignmentChange}
                required
              />
            </div>
            */}
            <button type="submit">Create Assignment</button>
          </form>
        </div>
      )}
    </div>
  );
};
