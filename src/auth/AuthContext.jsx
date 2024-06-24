import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // On component mount, check if there's a token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // If token exists, set isLoggedIn to true and retrieve role
      setIsLoggedIn(true);
      // Fetch role from backend or set it based on your implementation
      setRole('teacher'); // Placeholder, replace with actual logic to fetch role
    }
  }, []);

  const login = (token, userRole) => {
    localStorage.setItem('token', token);
    setRole(userRole);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setRole(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, role }}>
      {children}
    </AuthContext.Provider>
  );
};
