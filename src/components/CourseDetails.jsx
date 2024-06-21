import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Assignment } from './Assignment';
import './CourseDetails.css';

const placeholderAssignments = [
  { id: 1, courseId: 1, title: 'Assignment 1', description: 'Description 1' },
  { id: 2, courseId: 1, title: 'Assignment 2', description: 'Description 2' },
  { id: 3, courseId: 2, title: 'Assignment 3', description: 'Description 3' },
];

// Placeholder course details
const placeholderCourse = {
  id: 1,
  name: 'Course Name',
  description: 'Course Description',
};

export const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    // Placeholder fetch course details by id
    setCourse(placeholderCourse);

    // Fetch assignments for the course with id
    const courseAssignments = placeholderAssignments.filter(
      assignment => assignment.courseId === parseInt(id)
    );
    setAssignments(courseAssignments);
  }, [id]);

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
          <Assignment key={assignment.id} assignment={assignment} />
        ))}
      </div>
    </div>
  );
};
