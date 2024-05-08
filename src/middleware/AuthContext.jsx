import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAuthState = localStorage.getItem('isAuthenticated');

    if (storedUser && storedAuthState) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(JSON.parse(storedAuthState));
    }
  }, []);

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  };

  const login = (user) => {
    setIsAuthenticated(true);
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', JSON.stringify(true));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
