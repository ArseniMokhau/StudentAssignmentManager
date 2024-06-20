import React from 'react';
import { Course } from './Course'; // Example: Course component

export const GuestHomePage = ({ courses }) => {
  return (
    <div className="home-page">
      <h2>All Available Courses</h2>
      <div className="courses-list">
        {courses.map(course => (
          <Course key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};