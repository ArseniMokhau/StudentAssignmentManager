import React from 'react';

export const Course = ({ course }) => {
  return (
    <div className="course">
      <h3>{course.title}</h3>
      {/* Add more details here if needed */}
    </div>
  );
};