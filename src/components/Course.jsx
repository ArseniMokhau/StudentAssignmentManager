import React from 'react';
import { Link } from 'react-router-dom';
import './Course.css';

export const Course = ({ course }) => {
  return (
    <div className="course">
      <h3>
        <Link to={`/course/${course.id}`}>{course.name}</Link>
      </h3>
      {/* You can add more course details here */}
    </div>
  );
};
