import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from './useToast';
import { normalizeTradeType } from '../utils/tradeUtils';
import { tradeService } from '../services/tradeService';

/**
 * Custom hook for trade operations
 * Handles CRUD operations, filtering, and real-time updates
 */

export const useTrades = (initialFilters = {}) => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const socketRef = useRef(null);
  const pendingLocalCreatedTradeIds = useRef(new Set());
  const { showToast } = useToast();
  const [filters, setFilters] = useState(initialFilters);

  const fetchTrades = useCallback(async (customFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await tradeService.getTrades({ ...filters, ...customFilters });
      if (result.success) {
        // Normalize trade types for consistent casing
        const normalized = (result.data || []).map(t => ({
          ...t,
          type: normalizeTradeType(t.type || t.tradeType),
        }));
        setTrades(normalized);
        setPagination(result.pagination);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch trades');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  // Real-time updates using Socket.IO
  useEffect(() => {
    // Dynamic import to avoid server-side import errors
    let mounted = true;
    (async () => {
      try {
        const { io } = await import('socket.io-client');
        const token = localStorage.getItem('authToken');
        if (!token || !mounted) return;

        const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
          auth: { token },
          transports: ['websocket', 'polling'],
          reconnection: true,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
          // Subscribe to trades for this user
          try {
            socket.emit('subscribe:trades');
          } catch (err) {
            console.error('Subscribe to trades failed', err);
          }
        });

        const onTradeUpdate = (payload) => {
          console.debug('[useTrades] Socket trade:update received', payload);
          // payload: { action, trade } or { id }
          try {
            const action = payload?.action;
            const trade = payload?.trade || payload;
            console.debug('[useTrades] Processing action', action, 'trade', trade);

            setTrades((prev) => {
              if (!prev) return prev;

              // Handle trade updates and validate against filters
              const matchesFilters = (t) => {
                try {
                  // Basic filter fields supported: status, market, search
                  if (!filters) return true;
                  if (filters.status && String(filters.status).toLowerCase() !== String(t.status).toLowerCase()) return false;
                  if (filters.market && String(filters.market).toLowerCase() !== String(t.market).toLowerCase()) return false;
                  if (filters.search) {
                    const s = String(filters.search).toLowerCase();
                    if (!(String(t.symbol).toLowerCase().includes(s) || String(t.orderId).toLowerCase().includes(s))) return false;
                  }
                  return true;
                } catch (err) {
                  return true;
                }
              };

              // Normalize type for consistent behavior
              if (trade && trade.type) {
                trade.type = normalizeTradeType(trade.type);
              }

              switch (action) {
                case 'create': {
                  // Prepend new trade (most recent first)
                  const exists = prev.some((t) => t.id === trade.id);
                  if (exists) return prev.map((t) => (t.id === trade.id ? trade : t));
                  // If the new trade doesn't match current filters we may need to re-fetch
                  if (!matchesFilters(trade)) {
                    // Only refetch if we don't already expect this trade locally
                    if (!pendingLocalCreatedTradeIds.current.has(trade.id)) {
                      // Fetch server-side to update total counts
                      fetchTrades();
                      showToast?.('New trade created externally', 'info');
                    }
                    return prev;
                  }

                  // Adjust pagination total if available
                  setPagination((p) => (p ? { ...p, total: (p.total || 0) + 1 } : p));
                  // If this was just created locally, don't show external toast
                  if (!pendingLocalCreatedTradeIds.current.has(trade.id)) {
                    const byStrategy = !!(trade.strategy || trade.brokerType === 'Strategy' || (trade.broker || '').toLowerCase().includes('strategy'));
                    if (byStrategy) {
                      showToast?.('Strategy executed a trade', 'info');
                    } else {
                      showToast?.('New trade received', 'success');
                    }
                  }
                  pendingLocalCreatedTradeIds.current.delete(trade.id);

                  return [trade, ...prev];
                }
                case 'update': {
                  return prev.map((t) => (t.id === trade.id ? trade : t));
                }
                case 'delete': {
                  setPagination((p) => (p ? { ...p, total: Math.max((p.total || 1) - 1, 0) } : p));
                  return prev.filter((t) => t.id !== trade.id && t.id !== payload?.id);
                }
                default: {
                  // If payload is not actioned, try merge/update by id
                  if (trade && trade.id) {
                    const found = prev.some((t) => t.id === trade.id);
                    if (found) {
                      // updated trade
                      showToast?.('Trade updated', 'info');
                      return prev.map((t) => (t.id === trade.id ? trade : t));
                    }
                    return [trade, ...prev];
                  }
                  return prev;
                }
              }
            });
          } catch (err) {
            console.error('Error processing trade update', err);
          }
        };

        socket.on('trade:update', onTradeUpdate);

        // Cleanup
        return () => {
          mounted = false;
          if (socket) {
            socket.off('trade:update', onTradeUpdate);
            socket.disconnect();
            socketRef.current = null;
          }
        };
      } catch (err) {
        // Do not block component if socket import fails
        console.warn('Realtime trade updates are unavailable', err.message || err);
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createTrade = useCallback(async (tradeData) => {
    const result = await tradeService.createTrade(tradeData);
    if (result.success) {
      // Optimistic update — add trade to UI immediately if returned
      const created = result.data;
      if (created) {
        // Normalize and add to top of list
        const newTrade = { ...created, type: normalizeTradeType(created.type || created.tradeType) };
        setTrades((prev) => {
          if (!prev) return [newTrade];
          const exists = prev.some((t) => t.id === newTrade.id);
          if (exists) return prev.map((t) => (t.id === newTrade.id ? newTrade : t));
          return [newTrade, ...prev];
        });
      }
      // If the server returned the created entity, track it so we don't show an external toast
      const createdId = result.data?.id;
      if (createdId) pendingLocalCreatedTradeIds.current.add(createdId);
      await fetchTrades(); // Refresh list
    }
    return result;
  }, [fetchTrades]);

  const updateTrade = useCallback(async (id, tradeData) => {
    const result = await tradeService.updateTrade(id, tradeData);
    if (result.success) {
      await fetchTrades(); // Refresh list
    }
    return result;
  }, [fetchTrades]);

  const deleteTrade = useCallback(async (id) => {
    const result = await tradeService.deleteTrade(id);
    if (result.success) {
      await fetchTrades(); // Refresh list
    }
    return result;
  }, [fetchTrades]);

  const refresh = useCallback(() => {
    return fetchTrades();
  }, [fetchTrades]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Helper to navigate pagination
  const goToPage = useCallback((page) => {
    updateFilters({ page });
    fetchTrades({ page });
  }, [updateFilters, fetchTrades]);

  const setLimit = useCallback((limit) => {
    updateFilters({ limit });
    fetchTrades({ limit });
  }, [updateFilters, fetchTrades]);

  return {
    trades,
    loading,
    error,
    pagination,
    filters,
    createTrade,
    updateTrade,
    deleteTrade,
    refresh,
    updateFilters,
    goToPage,
    setLimit,
  };
};

export default useTrades;
