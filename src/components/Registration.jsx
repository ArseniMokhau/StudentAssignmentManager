import React, { useState } from 'react';
import './Login.css'; // Reuse the same CSS as Login
import { Link, Navigate } from 'react-router-dom';

export const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegistration = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      });

      const textResponse = await response.text();

      if (!response.ok) {
        throw new Error(textResponse);
      }

      setMessage(textResponse || "User registered successfully");
      setRegistrationSuccess(true);
    } catch (error) {
      console.error('Registration failed:', error.message);
      setMessage(`Registration failed: ${error.message}`);
    }
  };

  if (registrationSuccess) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="login-container">
      <h2>Register</h2>
      <form onSubmit={handleRegistration}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        <button type="submit">Register</button>
        {message && <p>{message}</p>}
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};


// OLD REGISTRATION

/*
import React, { useState } from 'react';
import './RegistrationPage.css'; // Import CSS file

export const RegistrationPage = ({ handleRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student'); // Default role is Student
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    console.log('Registering...');

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }), // Include role in the request body
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.text();
      setMessage(data);
    } catch (error) {
      console.error('Registration failed:', error.message);
      setMessage(`Registration failed: ${error.message}`);
    }

    // Clear input fields after submission
    setUsername('');
    setPassword('');
    setRole('Student'); // Reset role to default after submission
  };

  return (
    <div>
      <h2>Registration Page</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <label htmlFor="role">Role:</label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
        </select>

        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};
*/