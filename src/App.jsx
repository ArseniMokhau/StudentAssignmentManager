import React, { useContext } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { Registration } from './components/Registration';
import { Login } from './components/Login';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { CourseList } from './components/CourseList';
import { CourseDetails } from './components/CourseDetails';
import { TaskDetails } from './components/TaskDetails';
import { Profile } from './components/Profile';
import { AuthContext } from './auth/AuthContext';
import { GuestHomePage } from './components/GuestHomePage';
import { UserHomePage } from './components/UserHomePage';

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  // Example courses data
  const courses = [
    { id: 1, title: 'Course 1' },
    { id: 2, title: 'Course 2' },
  ];

  // Example user's courses (after login)
  const userCourses = [
    { id: 1, title: 'User Course 1' },
    { id: 2, title: 'User Course 2' },
  ];

  const otherCourses = courses.filter(course => !userCourses.some(userCourse => userCourse.id === course.id));

  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {isLoggedIn && (
              <>
                <li>
                  <Link to="/student-dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
              </>
            )}
            {!isLoggedIn && (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={isLoggedIn ? <UserHomePage userCourses={userCourses} otherCourses={otherCourses} /> : <GuestHomePage courses={courses} />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/task/:id" element={<TaskDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
