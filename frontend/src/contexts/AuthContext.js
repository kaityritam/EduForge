import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        return { 
          success: false, 
          error: error.response.data?.detail || 'Login failed' 
        };
      } else if (error.request) {
        return { 
          success: false, 
          error: 'Cannot connect to server. Make sure backend is running on port 8000.' 
        };
      } else {
        return { 
          success: false, 
          error: error.message || 'An error occurred' 
        };
      }
    }
  };

  const signup = async (userData) => {
    try {
      console.log('Sending signup request...');
      const response = await api.post('/auth/signup', userData);
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      if (error.response) {
        return { 
          success: false, 
          error: error.response.data?.detail || 'Server error occurred' 
        };
      } else if (error.request) {
        return { 
          success: false, 
          error: 'Cannot connect to server. Make sure backend is running on port 8000.' 
        };
      } else {
        return { 
          success: false, 
          error: error.message || 'An error occurred' 
        };
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);