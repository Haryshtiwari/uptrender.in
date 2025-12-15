import { useState, useEffect, useCallback } from 'react';
import { strategyService } from '../services/strategyService';

/**
 * Custom hook for strategy operations
 * Handles CRUD, activation, execution control, and stats
 */

export const useStrategies = (initialFilters = {}) => {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchStrategies = useCallback(async (customFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await strategyService.getStrategies({ ...filters, ...customFilters });
      if (result.success) {
        setStrategies(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch strategies');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStrategies();
  }, [fetchStrategies]);

  const createStrategy = useCallback(async (strategyData) => {
    const result = await strategyService.createStrategy(strategyData);
    if (result.success) {
      await fetchStrategies(); // Refresh list
    }
    return result;
  }, [fetchStrategies]);

  const updateStrategy = useCallback(async (id, strategyData) => {
    const result = await strategyService.updateStrategy(id, strategyData);
    if (result.success) {
      await fetchStrategies(); // Refresh list
    }
    return result;
  }, [fetchStrategies]);

  const deleteStrategy = useCallback(async (id) => {
    const result = await strategyService.deleteStrategy(id);
    if (result.success) {
      await fetchStrategies(); // Refresh list
    }
    return result;
  }, [fetchStrategies]);

  const activateStrategy = useCallback(async (id) => {
    const result = await strategyService.activateStrategy(id);
    if (result.success) {
      await fetchStrategies(); // Refresh to show updated status
    }
    return result;
  }, [fetchStrategies]);

  const deactivateStrategy = useCallback(async (id) => {
    const result = await strategyService.deactivateStrategy(id);
    if (result.success) {
      await fetchStrategies(); // Refresh to show updated status
    }
    return result;
  }, [fetchStrategies]);

  const startStrategy = useCallback(async (id) => {
    const result = await strategyService.startStrategy(id);
    if (result.success) {
      await fetchStrategies(); // Refresh to show running status
    }
    return result;
  }, [fetchStrategies]);

  const stopStrategy = useCallback(async (id) => {
    const result = await strategyService.stopStrategy(id);
    if (result.success) {
      await fetchStrategies(); // Refresh to show stopped status
    }
    return result;
  }, [fetchStrategies]);

  const cloneStrategy = useCallback(async (id, newName) => {
    const result = await strategyService.cloneStrategy(id, newName);
    if (result.success) {
      await fetchStrategies(); // Refresh to show cloned strategy
    }
    return result;
  }, [fetchStrategies]);

  const refresh = useCallback(() => {
    return fetchStrategies();
  }, [fetchStrategies]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  return {
    strategies,
    loading,
    error,
    pagination,
    filters,
    createStrategy,
    updateStrategy,
    deleteStrategy,
    activateStrategy,
    deactivateStrategy,
    startStrategy,
    stopStrategy,
    cloneStrategy,
    refresh,
    updateFilters,
  };
};

export default useStrategies;
