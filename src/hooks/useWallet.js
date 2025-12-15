import { useState, useEffect, useCallback } from 'react';
import { walletService } from '../services/walletService';

/**
 * Custom hook for wallet operations
 * Handles balance, transactions, deposits, and withdrawals
 */

export const useWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionLoading, setTransactionLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await walletService.getBalance();
      if (result.success) {
        // Backend returns full wallet object
        setWallet(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch wallet balance');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (params = {}) => {
    try {
      const result = await walletService.getTransactions(params);
      if (result.success) {
        setTransactions(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch transactions');
    }
  }, []);

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, [fetchBalance, fetchTransactions]);

  const deposit = useCallback(async (amount, paymentMethod) => {
    setTransactionLoading(true);
    try {
      const result = await walletService.deposit(amount, paymentMethod);
      if (result.success) {
        await fetchBalance(); // Refresh balance
        await fetchTransactions(); // Refresh transactions
      }
      return result;
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Deposit failed',
      };
    } finally {
      setTransactionLoading(false);
    }
  }, [fetchBalance, fetchTransactions]);

  const withdraw = useCallback(async (amount, withdrawalMethod, details) => {
    setTransactionLoading(true);
    try {
      const result = await walletService.withdraw(amount, withdrawalMethod, details);
      if (result.success) {
        await fetchBalance(); // Refresh balance
        await fetchTransactions(); // Refresh transactions
      }
      return result;
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Withdrawal failed',
      };
    } finally {
      setTransactionLoading(false);
    }
  }, [fetchBalance, fetchTransactions]);

  const refresh = useCallback(() => {
    fetchBalance();
    fetchTransactions();
  }, [fetchBalance, fetchTransactions]);

  return {
    wallet,
    balance: wallet?.balance || 0,
    currency: wallet?.currency || 'INR',
    transactions,
    loading,
    error,
    transactionLoading,
    deposit,
    withdraw,
    refresh,
  };
};

export default useWallet;
