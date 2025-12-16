import React, { useEffect, useState, useCallback } from 'react';
import { AuthContext } from './authContext';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../features/auth/services/authService';

/* ─── keys & helpers ───────────────────────────────────────────────────── */
const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
const getStoredRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/* ─── provider component ───────────────────────────────────────────────── */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken());
  const [refreshToken, setRefreshToken] = useState(getStoredRefreshToken());
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /* handle token refresh */
  const handleTokenRefresh = useCallback(async () => {
    try {
      const result = await authService.refreshToken();
      if (result.success) {
        setToken(result.token);
        saveTokens(result.token, refreshToken);
      } else {
        // Refresh failed, logout
        clearTokens();
        setToken(null);
        setRefreshToken(null);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearTokens();
      setToken(null);
      setRefreshToken(null);
    }
    setIsLoading(false);
  }, [refreshToken]);

  /* decode token whenever it changes */
  useEffect(() => {
  const decodeToken = async () => {
      console.log('[AuthProvider] Decoding token:', { hasToken: !!token });
      
      if (!token) {
        console.log('[AuthProvider] No token, clearing auth state');
        setRole(null);
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const payload = jwtDecode(token);
        console.log('[AuthProvider] Token decoded:', { role: payload.role, id: payload.id });

        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (payload.exp < currentTime) {
          console.log('[AuthProvider] Token expired, clearing auth');
          // Token expired, clear and set loading false
          clearTokens();
          setToken(null);
          setRefreshToken(null);
          setRole(null);
          setUser(null);
          setIsLoading(false);
          return;
        }

        console.log('[AuthProvider] Setting role from token:', payload.role);
        setRole(payload.role);

        // Try to fetch full profile from backend for richer user data
        // Set a timeout to ensure loading state doesn't hang
        const timeoutId = setTimeout(() => {
          console.log('[AuthProvider] Profile fetch timeout, using token payload');
          if (!user) {
            setUser(payload);
            setIsLoading(false);
          }
        }, 5000); // 5 second timeout

        try {
          console.log('[AuthProvider] Fetching user profile...');
          const profileResult = await authService.getProfile();
          clearTimeout(timeoutId);
          
          if (profileResult.success && profileResult.user) {
            console.log('[AuthProvider] Profile fetched successfully:', { role: profileResult.user.role });
            setUser(profileResult.user);
          } else {
            console.log('[AuthProvider] Profile fetch failed, using token payload');
            // Fallback to token payload if backend profile isn't available
            setUser(payload);
          }
        } catch (err) {
          clearTimeout(timeoutId);
          console.log('[AuthProvider] Profile fetch error, using token payload:', err.message);
          // If profile fetch fails, still set basic token payload
          setUser(payload);
        }
      } catch (err) {
        console.error('[AuthProvider] Invalid token:', err);
        clearTokens();
        setToken(null);
        setRefreshToken(null);
        setRole(null);
        setUser(null);
      } finally {
        console.log('[AuthProvider] Auth loading complete');
        setIsLoading(false);
      }
    };

    decodeToken();
  }, [token, handleTokenRefresh]);

  /* login function */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        setToken(result.token);
        setRefreshToken(localStorage.getItem(REFRESH_TOKEN_KEY));
        if (result.user) setUser(result.user);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: result.error };
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'Login failed' };
    }
  };

  /* register function */
  const register = async (userData) => {
    setIsLoading(true);
    try {
      const result = await authService.register(userData);
      if (result.success) {
        setToken(result.token);
        setRefreshToken(localStorage.getItem(REFRESH_TOKEN_KEY));
        if (result.user) setUser(result.user);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: result.error };
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  };

  /* logout function */
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  const value = {
    token,
    refreshToken,
    role,
    user,
    isAuthenticated: Boolean(token),
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* NOTE: `useAuth` hook and `AuthContext` moved to `src/app/authContext.jsx` to
   keep this file component-only for Fast Refresh compatibility. */
