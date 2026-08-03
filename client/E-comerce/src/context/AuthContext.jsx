import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext(null);

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and validate the authentication state from local storage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          localStorage.setItem('userId', parsedUser._id || parsedUser.id);

          // Verify if token is still valid by hitting the backend verify endpoint
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.user) {
              setUser(data.user);
              localStorage.setItem('user', JSON.stringify(data.user));
              localStorage.setItem('userId', data.user._id || data.user.id);
            }
          } else {
            // Token is invalid/expired
            handleLogout();
          }
        } catch (error) {
          console.error('Failed to validate authentication session:', error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Handle successful login
  const handleLogin = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('userId', newUser._id || newUser.id);
    setToken(newToken);
    setUser(newUser);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Verify email address with 6-digit code
  const verifyEmail = async (email, code) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        handleLogin(data.token, data.user);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Verification failed.' };
      }
    } catch (error) {
      return { success: false, message: 'Verification error: ' + error.message };
    }
  };

  // Resend verification code
  const resendCode = async (email) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/resend-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.verificationCode) {
        localStorage.setItem('temp_verification_code', data.verificationCode);
      }
      return {
        success: response.ok && data.success,
        message: data.message,
        verificationCode: data.verificationCode
      };
    } catch (error) {
      return { success: false, message: 'Server error: ' + error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login: handleLogin, logout: handleLogout, verifyEmail, resendCode }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the AuthContext easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
