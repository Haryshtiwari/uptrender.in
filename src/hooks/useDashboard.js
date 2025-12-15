import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';

/**
 * Custom hook for dashboard data
 * Handles loading, error states, and data fetching for all dashboard types
 */

export const useDashboard = (type = 'user') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const fetchDashboard = useCallback(async (forceRefresh = false) => {
    // If data exists and not forcing refresh, skip if fetched within last minute
    if (data && !forceRefresh && lastFetch) {
      const timeSinceLastFetch = Date.now() - lastFetch;
      if (timeSinceLastFetch < 60000) { // 1 minute cache
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      let result;
      switch (type) {
        case 'admin':
          result = await dashboardService.getAdminDashboard();
          break;
        case 'platform':
          result = await dashboardService.getPlatformStats();
          break;
        case 'user':
        default:
          result = await dashboardService.getUserDashboard();
          break;
      }

      if (result.success) {
        setData(result.data);
        setLastFetch(Date.now());
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [type, data, lastFetch]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]); // Fetch when type or dependencies change

  const refresh = useCallback(() => {
    return fetchDashboard(true);
  }, [fetchDashboard]);

  return {
    data,
    loading,
    error,
    refresh,
    lastFetch,
  };
};

export default useDashboard;
