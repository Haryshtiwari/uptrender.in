import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  IconButton, Typography, Chip, Avatar, CircularProgress, Alert, TextField, InputAdornment,
  FormControl, InputLabel, Select, MenuItem, Switch
} from '@mui/material';
import { Visibility, Edit, Delete, Search, CheckCircle, Cancel } from '@mui/icons-material';
import adminApiKeyService from '../../../services/adminApiKeyService';
import ViewApiKeyDialog from './ViewApiKeyDialog';
import EditApiKeyDialog from './EditApiKeyDialog';
import DeleteApiKeyConfirm from './DeleteApiKeyConfirm';

const AdminApiKeysTable = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewDialog, setViewDialog] = useState({ open: false, apiKey: null });
  const [editDialog, setEditDialog] = useState({ open: false, apiKey: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, apiKey: null });

  const fetchApiKeys = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery || undefined,
        segment: segmentFilter !== 'all' ? segmentFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      };
      const result = await adminApiKeyService.getAllApiKeys(params);
      if (result.success) {
        setApiKeys(result.data?.data?.apiKeys || []);
        setTotalCount(result.data?.data?.pagination?.total || 0);
      } else {
        setError(result.message || 'Failed to fetch API keys');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchQuery, segmentFilter, statusFilter]);

  const handleToggleStatus = async (id) => {
    try {
      const result = await adminApiKeyService.toggleApiKeyStatus(id, 'status');
      if (result.success) {
        fetchApiKeys();
      }
    } catch (error) {
      console.error('Toggle status error:', error);
    }
  };

  const handleToggleVerified = async (id) => {
    try {
      const result = await adminApiKeyService.toggleApiKeyStatus(id, 'isVerified');
      if (result.success) {
        fetchApiKeys();
      }
    } catch (error) {
      console.error('Toggle verified error:', error);
    }
  };

  const handleView = (apiKey) => setViewDialog({ open: true, apiKey });
  const handleEdit = (apiKey) => setEditDialog({ open: true, apiKey });
  const handleDelete = (apiKey) => setDeleteDialog({ open: true, apiKey });

  return (
    <Box>
      <Paper sx={{ mb: 2, p: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            placeholder="Search by broker, segment..."
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
            <InputLabel>Segment</InputLabel>
            <Select value={segmentFilter} onChange={(e) => { setSegmentFilter(e.target.value); setPage(0); }} label="Segment">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Indian">Indian</MenuItem>
              <MenuItem value="Forex">Forex</MenuItem>
              <MenuItem value="Crypto">Crypto</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} label="Status">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Broker</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Segment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Verified</TableCell>
              <TableCell>Default</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : apiKeys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">No API keys found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                        {apiKey.brokerName?.charAt(0) || 'B'}
                      </Avatar>
                      <Typography variant="body2" fontWeight={600}>
                        {apiKey.brokerName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{apiKey.user?.username || 'N/A'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {apiKey.user?.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={apiKey.segment} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Switch
                        size="small"
                        checked={apiKey.status === 'Active'}
                        onChange={() => handleToggleStatus(apiKey.id)}
                        color="success"
                      />
                      <Typography variant="caption">{apiKey.status}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleVerified(apiKey.id)}
                      color={apiKey.isVerified ? 'success' : 'default'}
                    >
                      {apiKey.isVerified ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    {apiKey.isDefault && <Chip label="Default" size="small" color="primary" />}
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" gap={0.5}>
                      <IconButton size="small" color="info" onClick={() => handleView(apiKey)} title="View">
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="primary" onClick={() => handleEdit(apiKey)} title="Edit">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(apiKey)} title="Delete">
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
        <ViewApiKeyDialog
          open={viewDialog.open}
          onClose={() => setViewDialog({ open: false, apiKey: null })}
          apiKey={viewDialog.apiKey}
        />
      )}

      {editDialog.open && (
        <EditApiKeyDialog
          open={editDialog.open}
          onClose={() => setEditDialog({ open: false, apiKey: null })}
          apiKey={editDialog.apiKey}
          onSuccess={() => { fetchApiKeys(); setEditDialog({ open: false, apiKey: null }); }}
        />
      )}

      {deleteDialog.open && (
        <DeleteApiKeyConfirm
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, apiKey: null })}
          apiKey={deleteDialog.apiKey}
          onSuccess={() => { fetchApiKeys(); setDeleteDialog({ open: false, apiKey: null }); }}
        />
      )}
    </Box>
  );
};

export default AdminApiKeysTable;
