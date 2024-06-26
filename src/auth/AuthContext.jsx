import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    if (token) {
      setIsLoggedIn(true);
      setRole(localStorage.getItem('role'));
      setUid(localStorage.getItem('uid'));
    }
  }, [token]);

  const login = (token, userRole, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', userRole);
    localStorage.setItem('uid', userId);
    setToken(token);
    setRole(userRole);
    setUid(userId);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('uid');
    setToken(null);
    setRole(null);
    setUid(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, token, role, uid }}>
      {children}
    </AuthContext.Provider>
  );
};
