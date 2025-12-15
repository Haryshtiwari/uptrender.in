import React, { useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, TextField, Button,
  InputAdornment, CircularProgress, Alert, Typography, Switch, Tooltip, TablePagination
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { TableSortLabel } from '@mui/material';
import PageContainer from '../../../components/common/PageContainer';
import { Search } from '@mui/icons-material';
import AddApiDialog from './AddApiDialog';
import ViewApiDialog from './ViewApiDialog';
import EditApiDialog from './EditApiDialog';
import DeleteConfirm from './DeleteConfirm';
import apiKeyService from '../../../services/apiKeyService';
import { useToast } from '../../../hooks/useToast';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const ApiTableHead = ({ order, orderBy, onRequestSort }) => {
  const headCells = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'API Name' },
    { id: 'broker', label: 'Broker' },
    { id: 'brokerId', label: 'Broker ID' },
    { id: 'autologin', label: 'Autologin' },
    { id: 'status', label: 'Status' },
    { id: 'segment', label: 'Segment' },
    { id: 'actions', label: 'Actions' },
  ];

  const createSortHandler = (property) => (event) => onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id && (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              )}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
const ApiTable = () => {
  const { showToast } = useToast();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('brokerName');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openApi, setOpenApi] = useState(false);
  const [viewApi, setViewApi] = useState(null);
  const [editApi, setEditApi] = useState(null);
  const [deleteApi, setDeleteApi] = useState(null);

  const fetchApiKeys = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await apiKeyService.getApiKeys();
      if (result.success) {
        setRows(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch API keys');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const handleAddApi = async (data) => {
    try {
      const result = await apiKeyService.createApiKey(data);
      if (result.success) {
        showToast(result.message || 'API key created successfully', 'success');
        setOpenApi(false);
        fetchApiKeys();
      } else {
        showToast(result.error || 'Failed to create API key', 'error');
      }
    } catch (error) {
      showToast(error.message || 'An error occurred', 'error');
    }
  };

  const handleEditApi = async (id, data) => {
    try {
      const result = await apiKeyService.updateApiKey(id, data);
      if (result.success) {
        showToast(result.message || 'API key updated successfully', 'success');
        setEditApi(null);
        fetchApiKeys();
      } else {
        showToast(result.error || 'Failed to update API key', 'error');
      }
    } catch (error) {
      showToast(error.message || 'An error occurred', 'error');
    }
  };

  const handleDeleteApi = async (id) => {
    try {
      const result = await apiKeyService.deleteApiKey(id);
      if (result.success) {
        showToast(result.message || 'API key deleted successfully', 'success');
        setDeleteApi(null);
        fetchApiKeys();
      } else {
        showToast(result.error || 'Failed to delete API key', 'error');
      }
    } catch (error) {
      showToast(error.message || 'An error occurred', 'error');
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleToggle = async (id, field) => {
    try {
      const apiKey = rows.find(r => r.id === id);
      if (!apiKey) return;

      const updateData = {};
      if (field === 'autologin') {
        updateData.autoLogin = !apiKey.autoLogin;
      } else if (field === 'status') {
        updateData.isActive = !apiKey.isActive;
      }

      const result = await apiKeyService.updateApiKey(id, updateData);
      if (result.success) {
        showToast(result.message || `API key ${field} updated successfully`, 'success');
        fetchApiKeys();
      } else {
        showToast(result.error || `Failed to update ${field}`, 'error');
      }
    } catch (error) {
      showToast(error.message || 'An error occurred', 'error');
    }
  };

  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      (row.apiName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (row.brokerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (row.brokerId || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });
  return (
    <PageContainer title="API Table" description="This is the API Table page">
      <Box display="flex" overflow="hidden">

        <Box flex={1} p={1} overflow="auto">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            flexDirection={{ xs: 'column', sm: 'row' }}
            gap={2}
            mb={2}
          >
          <Box
              display="flex"
              flexDirection={{ xs: 'column-reverse', sm: 'row' }}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="flex-end"
              gap={2}
              width="100%"
            >
              <TextField
                size="small"
                placeholder="Search APIs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: { xs: '100%', sm: '250px' },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'transparent',
                    borderRadius: 4,
                  },
                }}
              />

              <Button
                variant="contained"
                onClick={() => setOpenApi(true)}
                sx={{
                  bgcolor: 'primary.main',
                  color: '#fff',
                  textTransform: 'none',
                  px: 3,
                  width: { xs: '100%', sm: 'auto' },
                  borderRadius: 4,
                }}
              >
                + New API
              </Button>
            </Box>
          </Box>
          <AddApiDialog
            open={openApi}
            onClose={() => setOpenApi(false)}
            onSubmit={handleAddApi}
          />
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Paper variant="outlined">
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                  <CircularProgress />
                </Box>
              ) : rows.length === 0 ? (
                <Box p={4} textAlign="center">
                  <Typography variant="body1" color="text.secondary">
                    No API keys found. Click "+ New API" to add one.
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="medium" >
                    <ApiTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                    <TableBody>
                      {stableSort(filteredRows, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                          <TableRow key={row.id} hover>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.apiName}</TableCell>
                            <TableCell>{row.brokerName}</TableCell>
                            <TableCell>{row.brokerId}</TableCell>
                            <TableCell>
                              <Tooltip title={row.autoLogin ? 'Click to disable' : 'Click to enable'}>
                                <Switch
                                  checked={row.autoLogin}
                                  onChange={() => handleToggle(row.id, 'autologin')}
                                  size="small"
                                  color="primary"
                                />
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={row.isActive ? 'Click to deactivate' : 'Click to activate'}>
                                <Switch
                                  checked={row.isActive}
                                  onChange={() => handleToggle(row.id, 'status')}
                                  size="small"
                                  color="success"
                                />
                              </Tooltip>
                            </TableCell>
                            <TableCell>{row.segment}</TableCell>
                            <TableCell>
                              <Tooltip title="View">
                                <IconButton color="primary" onClick={() => setViewApi(row)}>
                                  <IconEye size={18} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton color="primary" onClick={() => setEditApi(row)}>
                                  <IconEdit size={18} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton color="error" onClick={() => setDeleteApi(row)}>
                                  <IconTrash size={18} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
            {!loading && rows.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
              />
            )}
          </Paper>
          
          <ViewApiDialog
            open={Boolean(viewApi)}
            api={viewApi}
            onClose={() => setViewApi(null)}
          />

          <EditApiDialog
            open={Boolean(editApi)}
            api={editApi}
            onClose={() => setEditApi(null)}
            onSave={(id, data) => handleEditApi(id, data)}
          />

          <DeleteConfirm
            open={Boolean(deleteApi)}
            name={deleteApi?.apiName}
            onClose={() => setDeleteApi(null)}
            onConfirm={() => handleDeleteApi(deleteApi.id)}
          />
        </Box>
      </Box>
    </PageContainer>
  );
};

export default ApiTable;



