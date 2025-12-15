import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';

/**
 * Custom hook to access toast notifications
 * Must be used within ToastProvider
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default useToast;
