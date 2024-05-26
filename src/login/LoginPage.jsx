import React, { useState } from 'react';
import './LoginPage.css'; // Import CSS file

export const LoginPage = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [passwordHash, setPassword] = useState('');
  const [message, setMessage] = useState('');


  const handleSubmit = async e => {
    e.preventDefault();
    console.log('Logging in...');

    try {
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, passwordHash}),
        });
  
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }
  
        const data = await response.json();
        localStorage.setItem('token', data.token);
        console.log(localStorage.getItem('token'));
        setMessage("Login successful");
      } catch (error) {
        console.error('Login failed:', error.message);
        setMessage(`Login failed: ${error.message}`);
      }
    
    // Clear input fields after submission
    setUsername('');
    setPassword('');
  };

  return (
    <div>
      <h2>Login Page</h2>
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
          value={passwordHash}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};
