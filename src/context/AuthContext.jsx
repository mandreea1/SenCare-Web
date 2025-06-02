import React, { createContext, useState, useContext } from 'react';

// Creăm contextul de autentificare
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Funcția de login
  const login = async (userData) => {
    setUser({
      userId: userData.userId,
      email: userData.email,
      userType: userData.userType
    });
    setToken(userData.token || 'temp-token');
    return userData.userType;
  };

  // Funcția de logout
  const logout = () => {
    setUser(null);
    setToken(null);
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