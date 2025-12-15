import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  Pagination,
  Select,
  MenuItem,
  Button,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  InputAdornment,
  Switch,
  Grid,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  PlayArrow,
  Pause,
  Public,
  Lock,
} from '@mui/icons-material';
import { adminStrategyService } from '../../../services/adminStrategyService';
import ViewStrategyDialog from './ViewStrategyDialog';
import EditStrategyDialog from './EditStrategyDialog';
import DeleteStrategyConfirm from './DeleteStrategyConfirm';

const AdminStrategiesTable = () => {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Dialog states
  const [viewStrategy, setViewStrategy] = useState(null);
  const [editStrategy, setEditStrategy] = useState(null);
  const [deleteStrategy, setDeleteStrategy] = useState(null);

  // Fetch strategies
  const fetchStrategies = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
      };

      if (searchQuery) params.search = searchQuery;
      if (segmentFilter) params.segment = segmentFilter;
      if (statusFilter) params.isActive = statusFilter;

      const result = await adminStrategyService.getAllStrategies(params);

      if (result.success) {
        setStrategies(result.data.strategies || []);
        setTotalCount(result.data.total || 0);
      } else {
        setError(result.message || 'Failed to fetch strategies');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching strategies');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery, segmentFilter, statusFilter]);

  useEffect(() => {
    fetchStrategies();
  }, [fetchStrategies]);

  const handleToggleStatus = async (strategy, field) => {
    try {
      const result = await adminStrategyService.toggleStrategyStatus(strategy.id, field);
      if (result.success) {
        fetchStrategies();
      }
    } catch (err) {
      console.error('Error toggling strategy status:', err);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Strategy Management
        </Typography>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search strategies..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
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
            value={segmentFilter}
            onChange={(e) => {
              setSegmentFilter(e.target.value);
              setPage(0);
            }}
            displayEmpty
          >
            <MenuItem value="">All Segments</MenuItem>
            <MenuItem value="Crypto">Crypto</MenuItem>
            <MenuItem value="Forex">Forex</MenuItem>
            <MenuItem value="Indian">Indian (Equity/F&O)</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={3} md={2}>
          <Select
            fullWidth
            size="small"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            displayEmpty
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </Select>
        </Grid>
      </Grid>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <Paper variant="outlined">
        <TableContainer>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <CircularProgress />
            </Box>
          ) : strategies.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <Typography variant="body1" color="text.secondary">
                No strategies found
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Strategy</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Segment</TableCell>
                  <TableCell>Capital</TableCell>
                  <TableCell>Performance</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {strategies.map((strategy) => (
                  <TableRow hover key={strategy.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          {strategy.name?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{strategy.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {strategy.symbol || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {strategy.User ? `${strategy.User.firstName} ${strategy.User.lastName}` : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={strategy.segment} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        ₹{Number(strategy.capital || 0).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={strategy.performance >= 0 ? 'success.main' : 'error.main'}
                        fontWeight={600}
                      >
                        {strategy.performance || 0}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="column" gap={0.5}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Tooltip title="Toggle Active">
                            <Switch
                              size="small"
                              checked={strategy.isActive}
                              onChange={() => handleToggleStatus(strategy, 'isActive')}
                              color="success"
                            />
                          </Tooltip>
                          <Typography variant="caption">Active</Typography>
                        </Box>
                        <Box display="flex" gap={0.5}>
                          {strategy.isPublic ? (
                            <Chip icon={<Public />} label="Public" size="small" color="info" />
                          ) : (
                            <Chip icon={<Lock />} label="Private" size="small" />
                          )}
                          {strategy.isRunning && (
                            <Chip icon={<PlayArrow />} label="Running" size="small" color="success" />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={0.5}>
                        <Tooltip title="View Details">
                          <IconButton size="small" color="info" onClick={() => setViewStrategy(strategy)}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" color="primary" onClick={() => setEditStrategy(strategy)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Toggle Running">
                          <IconButton
                            size="small"
                            color={strategy.isRunning ? 'warning' : 'success'}
                            onClick={() => handleToggleStatus(strategy, 'isRunning')}
                          >
                            {strategy.isRunning ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => setDeleteStrategy(strategy)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* Pagination */}
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2">Rows:</Typography>
            <Select
              size="small"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            >
              {[5, 10, 25, 50].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Showing {page * rowsPerPage + 1} - {Math.min((page + 1) * rowsPerPage, totalCount)} of {totalCount}
          </Typography>

          <Pagination
            count={Math.ceil(totalCount / rowsPerPage)}
            page={page + 1}
            onChange={(e, value) => setPage(value - 1)}
            shape="rounded"
            variant="outlined"
            color="primary"
          />
        </Box>
      </Paper>

      {/* Dialogs */}
      <ViewStrategyDialog
        open={Boolean(viewStrategy)}
        strategy={viewStrategy}
        onClose={() => setViewStrategy(null)}
      />

      <EditStrategyDialog
        open={Boolean(editStrategy)}
        strategy={editStrategy}
        onClose={() => setEditStrategy(null)}
        onSuccess={fetchStrategies}
      />

      <DeleteStrategyConfirm
        open={Boolean(deleteStrategy)}
        strategy={deleteStrategy}
        onClose={() => setDeleteStrategy(null)}
        onSuccess={fetchStrategies}
      />
    </Box>
  );
};

export default AdminStrategiesTable;
