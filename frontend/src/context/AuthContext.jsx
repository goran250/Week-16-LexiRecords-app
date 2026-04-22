import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Inlogging misslyckades';
    }
  }, []);

  const register = useCallback(async (fullname, email, password, street, zipCode, city, country) => {
    try {
      const response = await axios.post('/api/auth/register', { fullname, email, password, street, zipCode, city, country });
      setUser(response.data);
      
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Registrering misslyckades';
    }
  }, []);

  const registerAdmin = useCallback(async (fullname, email, password ) => {
    try {
      const response = await axios.post('/api/auth/registerAdmin', { fullname, email, password, role: 'admin' });  
    
      setUser(response.data);
      
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Registrering misslyckades';
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, register, registerAdmin, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
