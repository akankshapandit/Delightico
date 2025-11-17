import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      console.log('🟡 Auth Check - Token exists:', !!token);
      
      // If no token, clear everything
      if (!token) {
        console.log('🟡 No token found');
        localStorage.removeItem('user');
        setUser(null);
        setLoading(false);
        return;
      }

      // Verify token with backend
      console.log('🟡 Verifying token with backend...');
      const response = await fetch('http://localhost:8000/api/auth/me', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🟡 Auth verification response:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('🟢 Token valid - User:', userData.user?.email);
        setUser(userData.user || userData);
      } else {
        // Token is invalid - clear it
        console.log('🔴 Token invalid - clearing storage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } catch (error) {
      console.error('🔴 Auth check error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

const login = async (email, password) => {
  try {
    console.log('🟡 Login attempt for:', email);
    
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('🟡 Login API response:', data);

    // ✅ FIXED: Check for token inside data.data
    if (data.success && data.data && data.data.token) {
      console.log('🟢 Login SUCCESS - storing token and user');
      
      // Store token and user in localStorage
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      // Update state
      setUser(data.data.user);
      
      return { success: true, user: data.data.user };
    } else {
      console.log('🔴 Login FAILED - response structure:', data);
      return { 
        success: false, 
        error: data.message || 'Login failed - invalid response structure' 
      };
    }
  } catch (error) {
    console.error('🔴 Login ERROR:', error);
    return { 
      success: false, 
      error: 'Network error during login' 
    };
  }
};
  const logout = () => {
    console.log('🟡 Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    getToken,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;