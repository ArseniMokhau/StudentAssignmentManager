import React, { useContext, useState } from 'react';
import './Login.css';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    // Simulate login with token and role (replace with actual backend integration)
    const token = 'placeholder_token'; // Placeholder for token
    const role = 'teacher'; // Placeholder for role (could be 'teacher' based on your logic)

    // Call login function from context to update state
    login(token, role);

    // Set login success flag to trigger redirect
    setLoginSuccess(true);
  };

  if (loginSuccess) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};


// NEW LOGIN

/*

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Login = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    try {
      // Send login request to backend and receive token
      const response = await fetch('your-backend-login-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const { token } = await response.json();
        // Store token securely (e.g., in localStorage)
        localStorage.setItem('token', token);
        // Update logged in state
        setLoggedIn(true);
        // Redirect to dashboard or home page
        history.push('/dashboard'); // Example redirect
      } else {
        // Handle login error
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

*/


// OLD LOGIN

/*
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
*/