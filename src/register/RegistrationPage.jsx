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
