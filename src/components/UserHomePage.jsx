import React, { useState } from 'react';
import { Course } from './Course';
import './UserHomePage.css';

const placeholderCourses = [
  { id: 1, name: 'Course 1' },
  { id: 2, name: 'Course 2' },
  { id: 3, name: 'Course 3' },
  { id: 4, name: 'Course 4' },
  { id: 5, name: 'Course 5' },
  { id: 6, name: 'Course 6' },
  { id: 7, name: 'Course 7' },
  { id: 8, name: 'Course 8' },
  { id: 9, name: 'Course 9' },
  { id: 10, name: 'Course 10' },
  { id: 11, name: 'Course 11' },
  { id: 12, name: 'Course 12' },
];

const COURSES_PER_PAGE = 5;

export const UserHomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * COURSES_PER_PAGE;
  const currentCourses = placeholderCourses.slice(startIndex, startIndex + COURSES_PER_PAGE);

  const totalPages = Math.ceil(placeholderCourses.length / COURSES_PER_PAGE);

  return (
    <div className="home-page">
      <h2>All Available Courses</h2>
      <div className="courses-list">
        {currentCourses.map(course => (
          <Course key={course.id} course={course} />
        ))}
      </div>
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};
