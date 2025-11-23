// src/components/ui/AuthProvider.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService } from '../../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('forensic_user');
        const storedToken = localStorage.getItem('forensic_token');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
      }
    };

    // Mostrar splash por al menos 3 segundos
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 4000));
    
    Promise.all([checkAuth(), minLoadTime]).then(() => {
      setLoading(false);
    });
  }, []);

  const register = async (userData) => {
    try {
      const response = await registerService(userData);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al registrar usuario'
      };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await loginService(credentials);
      
      if (response.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        setIsAuthenticated(true);
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al iniciar sesión'
      };
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al cerrar sesión'
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;