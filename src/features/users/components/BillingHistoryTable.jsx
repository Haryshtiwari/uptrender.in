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
import { Download as DownloadIcon, Receipt } from '@mui/icons-material';

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
      // TODO: Replace with actual API call
      // const response = await planService.getBillingHistory();
      
      // Mock data
      const mockData = [
        {
          id: 1,
          date: '2024-01-15',
          description: 'Pro Plan - Monthly',
          amount: 49.99,
          status: 'paid',
          invoiceId: 'INV-2024-001',
        },
        {
          id: 2,
          date: '2023-12-15',
          description: 'Pro Plan - Monthly',
          amount: 49.99,
          status: 'paid',
          invoiceId: 'INV-2023-312',
        },
        {
          id: 3,
          date: '2023-11-15',
          description: 'Basic Plan - Monthly',
          amount: 19.99,
          status: 'paid',
          invoiceId: 'INV-2023-287',
        },
      ];
      
      setBillingHistory(mockData);
    } catch (error) {
      console.error('Error fetching billing history:', error);
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

  const getStatusChip = (status) => {
    const statusConfig = {
      paid: { color: 'success', label: 'Paid' },
      pending: { color: 'warning', label: 'Pending' },
      failed: { color: 'error', label: 'Failed' },
      refunded: { color: 'info', label: 'Refunded' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Chip label={config.label} color={config.color} size="small" />;
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
              <TableCell align="right">Amount</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Invoice</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billingHistory
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    {new Date(row.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600}>
                      ${row.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{getStatusChip(row.status)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleDownload(row.invoiceId)}
                      title="Download Invoice"
                    >
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
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
