import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Download as DownloadIcon, Receipt, TrendingUp, TrendingDown } from '@mui/icons-material';
import walletService from '../../../services/walletService';

const BillingHistoryTable = ({ onDownloadInvoice }) => {
  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchBillingHistory();
  }, []);

  const fetchBillingHistory = async () => {
    try {
      setLoading(true);
      // Fetch actual wallet transactions
      const response = await walletService.getTransactions({ limit: 100, page: 1 });
      
      if (response.success && response.data) {
        const transactions = Array.isArray(response.data) ? response.data : [];
        setBillingHistory(transactions);
      } else {
        setBillingHistory([]);
      }
    } catch (error) {
      console.error('Error fetching billing history:', error);
      setBillingHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (type) => {
    const typeConfig = {
      Credit: { color: 'success', label: 'Credit', icon: <TrendingUp fontSize="small" /> },
      Debit: { color: 'error', label: 'Debit', icon: <TrendingDown fontSize="small" /> },
      credit: { color: 'success', label: 'Credit', icon: <TrendingUp fontSize="small" /> },
      debit: { color: 'error', label: 'Debit', icon: <TrendingDown fontSize="small" /> },
    };

    const config = typeConfig[type] || { color: 'default', label: type || 'N/A', icon: null };
    return (
      <Chip 
        label={config.label} 
        color={config.color} 
        size="small" 
        icon={config.icon}
      />
    );
  };

  const handleDownload = (invoiceId) => {
    if (onDownloadInvoice) {
      onDownloadInvoice(invoiceId);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (billingHistory.length === 0) {
    return (
      <Alert severity="info">
        No billing history found.
      </Alert>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billingHistory
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    {new Date(row.createdAt || row.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {row.description || row.type || 'Transaction'}
                    </Typography>
                    {row.reference && (
                      <Typography variant="caption" color="textSecondary">
                        Ref: {row.reference}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{getStatusChip(row.type)}</TableCell>
                  <TableCell align="right">
                    <Typography 
                      variant="body2" 
                      fontWeight={600}
                      color={row.type === 'Credit' || row.type === 'credit' ? 'success.main' : 'error.main'}
                    >
                      {row.type === 'Credit' || row.type === 'credit' ? '+' : '-'}₹{Math.abs(Number(row.amount) || 0).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={500}>
                      ₹{Number(row.balanceAfter || 0).toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={billingHistory.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default BillingHistoryTable;
