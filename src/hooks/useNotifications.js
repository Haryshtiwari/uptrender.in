import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';

/**
 * Custom hook for notifications
 * Handles real-time notifications, read states, and preferences
 */

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await notificationService.getNotifications(params);
      if (result.success) {
        setNotifications(result.data);
        // Count unread
        const unread = result.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const result = await notificationService.getUnreadNotifications();
      if (result.success) {
        setUnreadCount(result.data?.length || 0);
      }
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id) => {
    const result = await notificationService.markAsRead(id);
    if (result.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    return result;
  }, []);

  const markAllAsRead = useCallback(async () => {
    const result = await notificationService.markAllAsRead();
    if (result.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
    return result;
  }, []);

  const deleteNotification = useCallback(async (id) => {
    const result = await notificationService.deleteNotification(id);
    if (result.success) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      // Update unread count if deleted notification was unread
      const deletedNotification = notifications.find((n) => n.id === id);
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    }
    return result;
  }, [notifications]);

  const refresh = useCallback(() => {
    return fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
    fetchUnreadCount,
  };
};

export default useNotifications;
