import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  const login = (token, userRole) => {
    localStorage.setItem('token', token); // Placeholder for token storage
    setRole(userRole); // Set user role in context
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token'); // Placeholder for token removal
    setRole(null); // Clear user role
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, role }}>
      {children}
    </AuthContext.Provider>
  );
};
