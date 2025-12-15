import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  IconButton, Typography, Chip, Avatar, CircularProgress, Alert, TextField, InputAdornment,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Visibility, Edit, Delete, Search } from '@mui/icons-material';
import { adminTradeService } from '../../../services/adminTradeService';
import ViewTradeDialog from './ViewTradeDialog';
import EditTradeDialog from './EditTradeDialog';
import DeleteTradeConfirm from './DeleteTradeConfirm';

const AdminTradesTable = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [marketFilter, setMarketFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewDialog, setViewDialog] = useState({ open: false, trade: null });
  const [editDialog, setEditDialog] = useState({ open: false, trade: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, trade: null });

  const fetchTrades = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        market: marketFilter !== 'all' ? marketFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined
      };
      const result = await adminTradeService.getAllTrades(params);
      if (result.success) {
        setTrades(result.data?.trades || []);
        setTotalCount(result.data?.pagination?.total || 0);
      } else {
        setError(result.message || 'Failed to fetch trades');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchQuery, statusFilter, marketFilter, typeFilter]);

  const handleView = (trade) => {
    console.log('Viewing trade:', trade);
    setViewDialog({ open: true, trade });
  };
  
  const handleEdit = (trade) => {
    console.log('Editing trade:', trade);
    setEditDialog({ open: true, trade });
  };
  
  const handleDelete = (trade) => {
    console.log('Deleting trade:', trade);
    setDeleteDialog({ open: true, trade });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Failed': return 'error';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => type === 'Buy' ? 'success' : 'error';

  const getPnlColor = (pnl) => {
    if (pnl > 0) return 'success.main';
    if (pnl < 0) return 'error.main';
    return 'text.secondary';
  };

  return (
    <Box>
      <Paper sx={{ mb: 2, p: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            placeholder="Search by order ID, symbol..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
            size="small"
            sx={{ flexGrow: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} label="Status">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Market</InputLabel>
            <Select value={marketFilter} onChange={(e) => { setMarketFilter(e.target.value); setPage(0); }} label="Market">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Forex">Forex</MenuItem>
              <MenuItem value="Crypto">Crypto</MenuItem>
              <MenuItem value="Indian">Indian</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }} label="Type">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Buy">Buy</MenuItem>
              <MenuItem value="Sell">Sell</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Trade</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Market</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">P&L</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : trades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">No trades found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              trades.map((trade) => (
                <TableRow key={trade.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                        {trade.symbol?.charAt(0) || 'T'}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {trade.orderId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {trade.symbol}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{trade.User?.username || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={trade.market} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip label={trade.type} size="small" color={getTypeColor(trade.type)} />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">${parseFloat(trade.amount || 0).toFixed(2)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">${parseFloat(trade.price || 0).toFixed(2)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      <Typography variant="body2" fontWeight={600} color={getPnlColor(trade.pnl)}>
                        ${parseFloat(trade.pnl || 0).toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color={getPnlColor(trade.pnlPercentage)}>
                        {parseFloat(trade.pnlPercentage || 0).toFixed(2)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={trade.status} size="small" color={getStatusColor(trade.status)} />
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" gap={0.5}>
                      <IconButton size="small" color="info" onClick={() => handleView(trade)} title="View">
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="primary" onClick={() => handleEdit(trade)} title="Edit">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(trade)} title="Delete">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      {viewDialog.open && (
        <ViewTradeDialog
          open={viewDialog.open}
          onClose={() => setViewDialog({ open: false, trade: null })}
          trade={viewDialog.trade}
        />
      )}

      {editDialog.open && (
        <EditTradeDialog
          open={editDialog.open}
          onClose={() => setEditDialog({ open: false, trade: null })}
          trade={editDialog.trade}
          onSuccess={() => { fetchTrades(); setEditDialog({ open: false, trade: null }); }}
        />
      )}

      {deleteDialog.open && (
        <DeleteTradeConfirm
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, trade: null })}
          trade={deleteDialog.trade}
          onSuccess={() => { fetchTrades(); setDeleteDialog({ open: false, trade: null }); }}
        />
      )}
    </Box>
  );
};

export default AdminTradesTable;
