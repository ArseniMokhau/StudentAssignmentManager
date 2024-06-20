import React from 'react';
import { Course } from './Course'; // Example: Course component

export const UserHomePage = ({ userCourses, otherCourses }) => {
  return (
    <div className="home-page">
      <h2>Your Courses</h2>
      <div className="user-courses">
        {userCourses.map(course => (
          <Course key={course.id} course={course} />
        ))}
      </div>
      
      <h2>All Available Courses</h2>
      <div className="other-courses">
        {otherCourses.map(course => (
          <Course key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};