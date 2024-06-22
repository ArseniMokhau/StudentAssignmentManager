import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Assignment } from './Assignment';
import './CourseDetails.css';
import { AuthContext } from '../auth/AuthContext';

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

  useEffect(() => {
    // Placeholder fetch course details by id
    setCourse(placeholderCourse);

    // Fetch assignments for the course with id
    const courseAssignments = placeholderAssignments.filter(
      assignment => assignment.courseId === parseInt(id)
    );
    setAssignments(courseAssignments);
  }, [id]);

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

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="course-details">
      <h2>{course.name}</h2>
      <p>{course.description}</p>
      <h3>Assignments</h3>
      <div className="assignments-list">
        {assignments.map(assignment => (
          <div key={assignment.id} className="assignment-item">
            <div className="assignment-details">
              <Assignment assignment={assignment} />
            </div>
            {role === 'teacher' && (
              <div className="assignment-actions">
                <button onClick={() => handleDeleteAssignment(assignment.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {role === 'teacher' && (
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
