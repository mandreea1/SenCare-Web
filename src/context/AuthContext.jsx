import React, { createContext, useState, useContext } from 'react';

// Creăm contextul de autentificare
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Încarcă userul din localStorage la inițializare
const [user, setUser] = useState(() => {
  const stored = sessionStorage.getItem('user');
  return stored ? JSON.parse(stored) : null;
});
const [token, setToken] = useState(() => {
  return sessionStorage.getItem('token') || null;
});

const login = async (userData) => {
  const userObj = { userId: userData.userId, email: userData.email, userType: userData.userType };
  setUser(userObj);
  setToken(userData.token || 'temp-token');
  sessionStorage.setItem('user', JSON.stringify(userObj));
  sessionStorage.setItem('token', userData.token || 'temp-token');
  return userData.userType;
};

const logout = () => {
  setUser(null);
  setToken(null);
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('token');
};

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizat pentru utilizarea contextului de autentificare
export const useAuth = () => {
  return useContext(AuthContext);
};