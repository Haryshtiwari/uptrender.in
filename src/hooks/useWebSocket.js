import { useEffect, useRef, useState, useCallback } from 'react';

const useWebSocket = (url, options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  const {
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    autoConnect = true,
  } = options;

  const connect = useCallback(() => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        return;
      }

      // For development, use mock WebSocket if no real URL provided
      if (!url || url.includes('mock')) {
        console.log('Using mock WebSocket connection');
        setIsConnected(true);
        if (onConnect) onConnect();
        
        // Simulate real-time updates
        const interval = setInterval(() => {
          const mockData = {
            type: 'update',
            timestamp: new Date().toISOString(),
            data: {
              price: (Math.random() * 1000 + 15000).toFixed(2),
              volume: Math.floor(Math.random() * 10000),
              change: (Math.random() * 10 - 5).toFixed(2),
            },
          };
          setLastMessage(mockData);
          if (onMessage) onMessage(mockData);
        }, 5000);

        return () => clearInterval(interval);
      }

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        if (onConnect) onConnect();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          if (onMessage) onMessage(data);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        const errorMessage = 'WebSocket connection error';
        setError(errorMessage);
        if (onError) onError(errorMessage);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        if (onDisconnect) onDisconnect();

        // Attempt to reconnect
        if (
          reconnectAttemptsRef.current < reconnectAttempts &&
          autoConnect
        ) {
          reconnectAttemptsRef.current += 1;
          console.log(
            `Reconnecting... Attempt ${reconnectAttemptsRef.current}/${reconnectAttempts}`
          );
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError(err.message);
      if (onError) onError(err.message);
    }
  }, [url, onConnect, onDisconnect, onError, onMessage, reconnectAttempts, reconnectInterval, autoConnect]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    error,
    connect,
    disconnect,
    sendMessage,
  };
};

export default useWebSocket;
