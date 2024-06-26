import React, { useState, useContext, useEffect } from 'react';
import { Course } from './Course';
import { AuthContext } from '../auth/AuthContext';
import './UserHomePage.css';

const COURSES_PER_PAGE = 5;

export const UserHomePage = () => {
  const { role, uid } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleCreateCourse = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch(`/auth/create-repository?repositoryName=${newCourseName}&description=${newCourseDescription}&teacherId=${uid}`, {
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
      console.log('Course created successfully', data);

      // Re-fetch the courses after creating a new one
      fetchCourses();
    } catch (error) {
      console.error('Course creation failed:', error.message);
      setError(`Course creation failed: ${error.message}`);
    }

    setNewCourseName('');
    setNewCourseDescription('');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="home-page">
      <h2>{role === 'teacher' ? 'Courses You Curate' : 'Courses You Are Enrolled In'}</h2>
      <div className="user-courses-list">
        {userCourses.map(course => (
          <Course key={course.id} course={course} />
        ))}
      </div>

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

      {role === 'teacher' && (
        <div className="create-course-form">
          <h3>Create New Course</h3>
          <form onSubmit={handleCreateCourse}>
            <input
              type="text"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              placeholder="Course Name"
              required
            />
            <input
              type="text"
              value={newCourseDescription}
              onChange={(e) => setNewCourseDescription(e.target.value)}
              placeholder="Course Description"
              required
            />
            <button type="submit">Create Course</button>
          </form>
        </div>
      )}
    </div>
  );
};
