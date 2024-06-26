import React, { useState, useEffect } from 'react';
import { Course } from './Course';
import './GuestHomePage.css';

const COURSES_PER_PAGE = 5;


export const GuestHomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const startIndex = (currentPage - 1) * COURSES_PER_PAGE;
  const currentCourses = courses.slice(startIndex, startIndex + COURSES_PER_PAGE);
  const totalPages = Math.ceil(courses.length / COURSES_PER_PAGE);

  useEffect(() => {
    fetchCourses();
  }, []);


  const fetchCourses = async () => {
    try {
      const response = await fetch('/auth/all-repository', {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      const formattedCourses = data.map(course => ({
        id: course.repositoryId,
        name: course.repositoryName,
      }));
      setCourses(formattedCourses);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
