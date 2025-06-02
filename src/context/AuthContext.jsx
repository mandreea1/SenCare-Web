import React, { createContext, useState, useEffect, useContext } from 'react';

// Creăm contextul de autentificare
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Durata de valabilitate a sesiunii (în milisecunde)
  const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 zile
  
  useEffect(() => {
    // Verificăm dacă există date de autentificare în localStorage
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      const userId = localStorage.getItem('userId');
      const email = localStorage.getItem('email');
      const userType = localStorage.getItem('userType');
      
      if (token && tokenExpiry && userId && email && userType) {
        // Verifică dacă token-ul nu a expirat
        if (new Date().getTime() < parseInt(tokenExpiry)) {
          // Setăm datele utilizatorului din localStorage
          setUser({
            userId,
            email,
            userType
          });
        } else {
          // Token-ul a expirat, ștergem datele
          logout();
        }
      }
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);
  
  // Funcția de login
  const login = async (userData) => {
    // Salvăm datele utilizatorului în localStorage
    localStorage.setItem('authToken', userData.token || 'temp-token');
    localStorage.setItem('tokenExpiry', (new Date().getTime() + SESSION_DURATION).toString());
    localStorage.setItem('userId', userData.userId);
    localStorage.setItem('email', userData.email);
    localStorage.setItem('userType', userData.userType);
    
    // Actualizăm starea user
    setUser({
      userId: userData.userId,
      email: userData.email,
      userType: userData.userType
    });
    
    return userData.userType;
  };
  
  // Funcția de logout
  const logout = () => {
    // Ștergem toate datele din localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('userType');
    
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizat pentru utilizarea contextului de autentificare
export const useAuth = () => {
  return useContext(AuthContext);
};