import React, { createContext, useState, useCallback } from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';

/**
 * Toast Notification Context
 * Provides global toast notifications throughout the app
 */

export const ToastContext = createContext({
  showToast: () => {},
  showSuccess: () => {},
  showError: () => {},
  showWarning: () => {},
  showInfo: () => {},
});

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: '',
    title: '',
    severity: 'info', // 'success' | 'error' | 'warning' | 'info'
    duration: 6000,
  });

  const showToast = useCallback((message, options = {}) => {
    setToast({
      open: true,
      message,
      title: options.title || '',
      severity: options.severity || 'info',
      duration: options.duration || 6000,
    });
  }, []);

  const showSuccess = useCallback((message, title = 'Success') => {
    showToast(message, { severity: 'success', title });
  }, [showToast]);

  const showError = useCallback((message, title = 'Error') => {
    showToast(message, { severity: 'error', title, duration: 8000 });
  }, [showToast]);

  const showWarning = useCallback((message, title = 'Warning') => {
    showToast(message, { severity: 'warning', title });
  }, [showToast]);

  const showInfo = useCallback((message, title = 'Info') => {
    showToast(message, { severity: 'info', title });
  }, [showToast]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToast((prev) => ({ ...prev, open: false }));
  };

  const value = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%', minWidth: 300 }}
        >
          {toast.title && <AlertTitle>{toast.title}</AlertTitle>}
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
