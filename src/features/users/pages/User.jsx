import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Switch,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  Close,
  People,
  PersonAdd,
  Verified,
  Block,
} from '@mui/icons-material';
import Breadcrumb from '../../../components/layout/full/shared/breadcrumb/Breadcrumb';
import adminUserService from '../../../services/adminUserService';
import walletService from '../../../services/walletService';
import { formatDistanceToNow, format } from 'date-fns';

const BCrumb = [
  { to: '/admin', title: 'Admin' },
  { title: 'User Management' },
];

const User = () => {
  // User data state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    verified: 0,
  });

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form data
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'Active',
    walletAmount: '',
  });

  const [addFormData, setAddFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
  });

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await adminUserService.getAllUsers({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm || undefined,
      });

      if (result.success) {
        const usersData = result.data.users || [];
        setUsers(usersData);
        setTotalCount(result.data.pagination?.total || result.data.total || usersData.length);
        
        // Calculate stats from pagination data if available
        if (result.data.stats) {
          setStats({
            total: result.data.stats.total || 0,
            active: result.data.stats.active || 0,
            inactive: result.data.stats.inactive || 0,
            verified: result.data.stats.verified || 0,
          });
        } else {
          // Fallback to calculating from current page data
          setStats({
            total: result.data.pagination?.total || usersData.length,
            active: usersData.filter(u => u.status === 'Active').length,
            inactive: usersData.filter(u => u.status !== 'Active').length,
            verified: usersData.filter(u => u.emailVerified).length,
          });
        }
      } else {
        setError(result.error || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Toggle user status
  const handleToggleStatus = async (userId) => {
    try {
      const result = await adminUserService.toggleUserStatus(userId);
      if (result.success) {
        showSnackbar('User status updated successfully');
        fetchUsers();
      } else {
        showSnackbar(result.error || 'Failed to update status', 'error');
      }
    } catch (err) {
      showSnackbar('Error toggling user status', 'error');
    }
  };

  // View user
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  // Edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'user',
      status: user.status || 'Active',
      walletAmount: '',
    });
    setEditModalOpen(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    
    setActionLoading(true);
    try {
      // Prepare user data without wallet amount
      const { walletAmount, ...userData } = editFormData;
      
      // Update user details
      const result = await adminUserService.updateUser(selectedUser.id, userData);
      if (!result.success) {
        showSnackbar(result.error || 'Failed to update user', 'error');
        return;
      }

      // Handle wallet transfer if amount is provided
      if (walletAmount && parseFloat(walletAmount) > 0) {
        const transferResult = await walletService.adminTransferFunds(
          selectedUser.id,
          walletAmount,
          `Admin wallet transfer to ${selectedUser.name || selectedUser.email}`
        );
        
        if (transferResult.success) {
          showSnackbar(`User updated and ₹${walletAmount} transferred to wallet successfully`);
        } else {
          showSnackbar(`User updated but wallet transfer failed: ${transferResult.error}`, 'warning');
        }
      } else {
        showSnackbar('User updated successfully');
      }
      
      setEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error('Edit user error:', err);
      showSnackbar('Error updating user', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    setActionLoading(true);
    try {
      const result = await adminUserService.deleteUser(selectedUser.id);
      if (result.success) {
        showSnackbar('User deleted successfully');
        setDeleteModalOpen(false);
        fetchUsers();
      } else {
        showSnackbar(result.error || 'Failed to delete user', 'error');
      }
    } catch (err) {
      showSnackbar('Error deleting user', 'error');
    } finally {
      setActionLoading(false);
    }
  };



  // Add user
  const handleAddFormChange = (field, value) => {
    setAddFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddUser = async () => {
    // Validate required fields
    if (!addFormData.name || !addFormData.email || !addFormData.password) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const result = await adminUserService.createUser(addFormData);
      if (result.success) {
        showSnackbar('User created successfully');
        setAddModalOpen(false);
        setAddFormData({
          name: '',
          username: '',
          email: '',
          password: '',
          phone: '',
          role: 'user',
        });
        fetchUsers();
      } else {
        showSnackbar(result.error || 'Failed to create user', 'error');
      }
    } catch (err) {
      showSnackbar('Error creating user', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'default';
      case 'Suspended': return 'error';
      default: return 'default';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'franchise': return 'warning';
      default: return 'primary';
    }
  };

  return (
    <Box>
      <Breadcrumb title="User Management" items={BCrumb} />
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">{stats.total}</Typography>
                  <Typography color="textSecondary" variant="body2">Total Users</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
                  <PersonAdd />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="success.main">{stats.active}</Typography>
                  <Typography color="textSecondary" variant="body2">Active Users</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48 }}>
                  <Block />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="warning.main">{stats.inactive}</Typography>
                  <Typography color="textSecondary" variant="body2">Inactive Users</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'info.main', width: 48, height: 48 }}>
                  <Verified />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="info.main">{stats.verified}</Typography>
                  <Typography color="textSecondary" variant="body2">Verified Users</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper sx={{ p: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        {/* Header with Search and Add Button */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Typography variant="h5" component="h1">
            Registered Users ({totalCount})
          </Typography>
          <Box display="flex" gap={2}>
            <TextField
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200 }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddModalOpen(true)}
            >
              Add User
            </Button>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {/* Users Table */}
        {!loading && (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Verified</TableCell>
                    <TableCell>Wallet Balance</TableCell>
                    <TableCell>Registered</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body2" color="textSecondary" py={4}>
                          {searchTerm ? 'No users found matching your search.' : 'No users registered yet.'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                              {user.name?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase() || 'U'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {user.name || user.username || 'N/A'}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                ID: {user.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{user.email || 'N/A'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.role || 'user'}
                            color={getRoleColor(user.role)}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                              label={user.status || 'Unknown'}
                              color={getStatusColor(user.status)}
                              size="small"
                            />
                            <Switch
                              checked={user.status === 'Active'}
                              onChange={() => handleToggleStatus(user.id)}
                              size="small"
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.emailVerified ? 'Verified' : 'Pending'}
                            color={user.emailVerified ? 'success' : 'warning'}
                            size="small"
                            variant={user.emailVerified ? 'filled' : 'outlined'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            ₹{user.wallet?.balance ? Number(user.wallet.balance).toLocaleString() : '0'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            {user.createdAt
                              ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })
                              : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={0.5}>
                            <Tooltip title="View Details">
                              <IconButton size="small" color="primary" onClick={() => handleViewUser(user)}>
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit User">
                              <IconButton size="small" color="default" onClick={() => handleEditUser(user)}>
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete User">
                              <IconButton size="small" color="error" onClick={() => handleDeleteUser(user)}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>

      {/* View User Modal */}
      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">User Details</Typography>
          <IconButton onClick={() => setViewModalOpen(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Box>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 24 }}>
                  {selectedUser.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedUser.name || 'N/A'}</Typography>
                  <Typography color="textSecondary">@{selectedUser.username || 'N/A'}</Typography>
                </Box>
              </Box>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">Email</Typography>
                  <Typography variant="body2">{selectedUser.email || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">Phone</Typography>
                  <Typography variant="body2">{selectedUser.phone || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">Role</Typography>
                  <Box mt={0.5}>
                    <Chip label={selectedUser.role || 'user'} color={getRoleColor(selectedUser.role)} size="small" />
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">Status</Typography>
                  <Box mt={0.5}>
                    <Chip label={selectedUser.status || 'Unknown'} color={getStatusColor(selectedUser.status)} size="small" />
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">Email Verified</Typography>
                  <Typography variant="body2">{selectedUser.emailVerified ? 'Yes' : 'No'}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">Wallet Balance</Typography>
                  <Typography variant="body2">₹{Number(selectedUser.wallet?.balance || 0).toLocaleString()}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">Joined Date</Typography>
                  <Typography variant="body2">
                    {selectedUser.createdAt ? format(new Date(selectedUser.createdAt), 'PPP') : 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">Plan</Typography>
                  <Typography variant="body2">{selectedUser.plan?.name || 'Free'}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Edit User</Typography>
          <IconButton onClick={() => setEditModalOpen(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              fullWidth
              value={editFormData.name}
              onChange={(e) => handleEditFormChange('name', e.target.value)}
            />
            <TextField
              label="Email"
              fullWidth
              value={editFormData.email}
              onChange={(e) => handleEditFormChange('email', e.target.value)}
            />
            <TextField
              label="Phone"
              fullWidth
              value={editFormData.phone}
              onChange={(e) => handleEditFormChange('phone', e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={editFormData.role}
                label="Role"
                onChange={(e) => handleEditFormChange('role', e.target.value)}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="franchise">Franchise</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={editFormData.status}
                label="Status"
                onChange={(e) => handleEditFormChange('status', e.target.value)}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Add Wallet Balance (₹)"
              fullWidth
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              value={editFormData.walletAmount}
              onChange={(e) => handleEditFormChange('walletAmount', e.target.value)}
              helperText="Enter amount to transfer from admin wallet to user wallet (leave blank to skip)"
              placeholder="0.00"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveEdit}
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={16} /> : null}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user <strong>{selectedUser?.name || selectedUser?.email}</strong>? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleConfirmDelete}
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={16} /> : <Delete />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add User Modal */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Add New User</Typography>
          <IconButton onClick={() => setAddModalOpen(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              fullWidth
              required
              value={addFormData.name}
              onChange={(e) => handleAddFormChange('name', e.target.value)}
            />
            <TextField
              label="Username"
              fullWidth
              value={addFormData.username}
              onChange={(e) => handleAddFormChange('username', e.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={addFormData.email}
              onChange={(e) => handleAddFormChange('email', e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              value={addFormData.password}
              onChange={(e) => handleAddFormChange('password', e.target.value)}
            />
            <TextField
              label="Phone"
              fullWidth
              value={addFormData.phone}
              onChange={(e) => handleAddFormChange('phone', e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={addFormData.role}
                label="Role"
                onChange={(e) => handleAddFormChange('role', e.target.value)}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="franchise">Franchise</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddUser}
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={16} /> : <Add />}
          >
            Add User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default User;
