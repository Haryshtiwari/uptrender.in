import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import Breadcrumb from '../../../components/layout/full/shared/breadcrumb/Breadcrumb';
import { adminTradeService } from '../../../services/adminTradeService';
import { useToast } from '../../../hooks/useToast';

const AdminTradeManagement = () => {
  const { showToast } = useToast();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [marketFilter, setMarketFilter] = useState('');

  const fetchTrades = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        limit: rowsPerPage,
      };

      if (searchQuery) params.search = searchQuery;
      if (statusFilter) params.status = statusFilter;
      if (marketFilter) params.market = marketFilter;

      const result = await adminTradeService.getAllTrades(params);

      if (result.success) {
        setTrades(result.data.trades || []);
        setTotalCount(result.data.total || 0);
      } else {
        setError(result.message || 'Failed to fetch trades');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery, statusFilter, marketFilter]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trade?')) return;

    try {
      const result = await adminTradeService.deleteTrade(id);
      if (result.success) {
        showToast('Trade deleted successfully', 'success');
        fetchTrades();
      } else {
        showToast(result.message || 'Failed to delete trade', 'error');
      }
    } catch (err) {
      showToast(err.message || 'An error occurred', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatCurrency = (value) => {
    return `₹${parseFloat(value || 0).toFixed(2)}`;
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box>
      <Breadcrumb title="Trade Management" />

      <Box sx={{ mt: 3 }}>
        {/* Filters */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by order ID, symbol..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <Select
              fullWidth
              size="small"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              displayEmpty
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <Select
              fullWidth
              size="small"
              value={marketFilter}
              onChange={(e) => {
                setMarketFilter(e.target.value);
                setPage(1);
              }}
              displayEmpty
            >
              <MenuItem value="">All Markets</MenuItem>
              <MenuItem value="Crypto">Crypto</MenuItem>
              <MenuItem value="Forex">Forex</MenuItem>
              <MenuItem value="Indian">Indian</MenuItem>
            </Select>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Paper>
          <TableContainer>
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : trades.length === 0 ? (
              <Box p={4} textAlign="center">
                <Typography variant="body1" color="text.secondary">
                  No trades found
                </Typography>
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Trade ID</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Market</TableCell>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">P&L</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trades.map((trade) => (
                    <TableRow key={trade.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          #{trade.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {trade.user?.name || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {trade.user?.email || ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={trade.market || 'N/A'} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {trade.symbol}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={trade.type || trade.tradeType}
                          size="small"
                          color={trade.type && trade.type.toLowerCase() === 'buy' ? 'success' : 'error'}
                          variant="filled"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {parseFloat(trade.quantity || trade.amount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(trade.price || trade.entryPrice)}
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color={
                            parseFloat(trade.profitLoss || 0) >= 0
                              ? 'success.main'
                              : 'error.main'
                          }
                        >
                          {parseFloat(trade.profitLoss || 0) >= 0 ? '+' : ''}
                          {formatCurrency(trade.profitLoss || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={trade.status}
                          size="small"
                          color={getStatusColor(trade.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {formatDateTime(trade.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary">
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(trade.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>

          {!loading && trades.length > 0 && (
            <Box display="flex" justifyContent="center" p={2}>
              <Pagination
                count={Math.ceil(totalCount / rowsPerPage)}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminTradeManagement;
