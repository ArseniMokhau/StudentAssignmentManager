import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Assignment } from './Assignment';
import './CourseDetails.css';
import { AuthContext } from '../auth/AuthContext';

// Placeholder assignments data
const placeholderAssignments = [
  { id: 1, courseId: 1, title: 'Assignment 1', description: 'Description 1', deadline: '2024-07-01' },
  { id: 2, courseId: 1, title: 'Assignment 2', description: 'Description 2', deadline: '2024-07-10' },
  { id: 3, courseId: 2, title: 'Assignment 3', description: 'Description 3', deadline: '2024-07-15' },
];

// Placeholder course details
const placeholderCourse = {
  id: 1,
  name: 'Course Name',
  description: 'Course Description',
};

export const CourseDetails = () => {
  const { id } = useParams();
  const { role } = useContext(AuthContext); // Access role from context
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    deadline: '',
  });
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isCurating, setIsCurating] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Flag for editing mode
  const [deletionSuccess, setDeletionSuccess] = useState(false);
  const [editedCourse, setEditedCourse] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    // Simulate fetching course details by id
    setCourse(placeholderCourse);

    // Fetch assignments for the course with id
    const courseAssignments = placeholderAssignments.filter(
      assignment => assignment.courseId === parseInt(id)
    );
    setAssignments(courseAssignments);

    // Placeholder checks for enrollment and curation
    checkEnrollment();
    checkCuration();
  }, [id]);

  const checkEnrollment = () => {
    // Placeholder function to simulate checking enrollment
    setIsEnrolled(false);
  };

  const checkCuration = () => {
    // Placeholder function to simulate checking curation
    setIsCurating(false);
  };

  const handleNewAssignmentChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({ ...newAssignment, [name]: value });
  };

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    const newAssignmentWithId = {
      ...newAssignment,
      id: assignments.length + 1,
      courseId: parseInt(id),
    };
    setAssignments([...assignments, newAssignmentWithId]);
    setNewAssignment({ title: '', description: '', deadline: '' });
  };

  const handleDeleteAssignment = (assignmentId) => {
    setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
  };

  const handleEditCourse = () => {
    setIsEditing(true);
    setEditedCourse({
      name: course.name,
      description: course.description,
    });
  };

  const handleSaveEdit = () => {
    // Simulate sending edit request to server
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

  const handleDeleteCourse = () => {
    setIsEditing(false);
    setDeletionSuccess(true);
  };

  const requestEnrollment = () => {
    setIsEnrolled(true)
  };

  const requestCuration = () => {
    setIsCurating(true)
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

      {role === 'student' && !isEnrolled && (
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
            <button type="submit">Create Assignment</button>
          </form>
        </div>
      )}
    </div>
  );
};