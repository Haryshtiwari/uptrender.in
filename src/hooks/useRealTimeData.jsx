import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

/**
 * Custom hook for real-time data fetching with Socket.IO
 * Prevents flickering and unnecessary re-renders
 * @param {string} endpoint - API endpoint
 * @param {string} socketEvent - Socket.IO event name for real-time updates
 * @param {Object} options - Configuration options
 */
export const useRealTimeData = (endpoint, socketEvent, options = {}) => {
  const {
    initialData = null,
    pollInterval = null,
    dependencies = [],
    transform = (data) => data,
    enabled = true,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const mountedRef = useRef(true);
  const dataRef = useRef(initialData);

  // Stable update function to prevent flickering
  const updateData = useCallback((newData) => {
    if (!mountedRef.current) return;
    
    const transformed = transform(newData);
    
    // Only update if data actually changed (deep comparison for primitives)
    if (JSON.stringify(dataRef.current) !== JSON.stringify(transformed)) {
      dataRef.current = transformed;
      setData(transformed);
    }
  }, [transform]);

  // Fetch data from API
  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      updateData(result.data || result);
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      if (mountedRef.current) {
        setError(err.message);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [endpoint, enabled, updateData]);

  // Setup Socket.IO connection for real-time updates
  useEffect(() => {
    if (!socketEvent || !enabled) return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    // Initialize socket connection
    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Listen for real-time updates
    socketRef.current.on(socketEvent, (update) => {
      if (mountedRef.current) {
        updateData(update);
      }
    });

    // Handle connection errors
    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off(socketEvent);
        socketRef.current.disconnect();
      }
    };
  }, [socketEvent, enabled, updateData]);

  // Initial data fetch
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, enabled, ...dependencies]);

  // Optional polling
  useEffect(() => {
    if (!pollInterval || !enabled) return;

    const interval = setInterval(fetchData, pollInterval);
    return () => clearInterval(interval);
  }, [pollInterval, fetchData, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    updateData,
  };
};

/**
 * Custom hook for optimized API calls with caching
 * Prevents unnecessary API calls and flickering
 */
export const useOptimizedFetch = (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    dependencies = [],
    enabled = true,
    cacheKey = endpoint,
    cacheTime = 5 * 60 * 1000, // 5 minutes
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheRef = useRef(new Map());
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Check cache first
    const cached = cacheRef.current.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setData(cached.data);
      setLoading(false);
      return cached.data;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`,
        {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: body ? JSON.stringify(body) : null,
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const responseData = result.data || result;

      // Update cache
      cacheRef.current.set(cacheKey, {
        data: responseData,
        timestamp: Date.now(),
      });

      setData(responseData);
      setError(null);
      return responseData;
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error(`Error fetching ${endpoint}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, method, body, enabled, cacheKey, cacheTime]);

  useEffect(() => {
    fetchData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for debounced values to prevent excessive re-renders
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for memoized data to prevent unnecessary re-renders
 */
export const useStableData = (data) => {
  const dataRef = useRef(data);
  const [stableData, setStableData] = useState(data);

  useEffect(() => {
    if (JSON.stringify(dataRef.current) !== JSON.stringify(data)) {
      dataRef.current = data;
      setStableData(data);
    }
  }, [data]);

  return stableData;
};
