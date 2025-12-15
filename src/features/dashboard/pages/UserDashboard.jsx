import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Avatar,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Grid,
  CircularProgress,
  Alert,
  Switch,
  IconButton,
  Tooltip,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from '@mui/material';
import {
  Search,
  People,
  PersonAdd,
  Verified,
  Refresh,
  Download,
  Edit,
  Delete,
  Visibility,
  Email,
  Phone,
  Close,
  Lock,
} from '@mui/icons-material';
import Breadcrumb from '../../../components/layout/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../components/common/PageContainer';
import adminUserService from '../../../services/adminUserService';
import dashboardService from '../../../services/dashboardService';
import { formatDistanceToNow, format } from 'date-fns';

const BCrumb = [
  { to: '/admin', title: 'Admin' },
  { title: 'User Dashboard' },
];

const UserDashboard = () => {
  // User data state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Dashboard stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    verifiedUsers: 0,
    totalBalance: 0,
    newUsersToday: 0,
    revenue: 0,
  });
  
  // Pagination and search
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const result = await dashboardService.getAdminDashboard();
      
      if (result.success && result.data) {
        const data = result.data;
        setStats({
          totalUsers: data.users?.total || 0,
          activeUsers: data.users?.active || 0,
          verifiedUsers: data.users?.verified || 0,
          totalBalance: parseFloat(data.wallets?.totalBalance || 0),
          newUsersToday: data.recentActivity?.users?.length || 0,
          revenue: parseFloat(data.plans?.estimatedMonthlyRevenue || 0),
        });
      }
    } catch (err) {
      console.error('[UserDashboard] Error fetching dashboard stats:', err);
    }
  };
  
  // Fetch all users
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
        setUsers(result.data.users || []);
        setTotalUsers(result.data.pagination?.total || result.data.users?.length || 0);
      } else {
        setError(result.error || 'Failed to fetch users');
        setUsers([]);
      }
    } catch (err) {
      console.error('[UserDashboard] Error fetching users:', err);
      setError('An error occurred while fetching users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Refresh all data
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchDashboardStats(), fetchUsers()]);
    setRefreshing(false);
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
  }, []);
  
  // Refetch users when pagination or search changes
  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, searchTerm]);
  
  // Handle search input
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle user status toggle
  const handleToggleUserStatus = async (userId) => {
    try {
      const result = await adminUserService.toggleUserStatus(userId);
      if (result.success) {
        setSnackbar({ open: true, message: 'User status updated successfully', severity: 'success' });
        fetchUsers();
        fetchDashboardStats();
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to update status', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Error toggling user status', severity: 'error' });
    }
  };

  // View User Modal
  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  // Edit User Modal
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'user',
      status: user.status || 'Active',
    });
    setEditModalOpen(true);
  };

  // Handle Edit Form Change
  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  // Save User Edit
  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    
    setActionLoading(true);
    try {
      const result = await adminUserService.updateUser(selectedUser.id, editFormData);
      if (result.success) {
        setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' });
        setEditModalOpen(false);
        fetchUsers();
        fetchDashboardStats();
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to update user', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Error updating user', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  // Delete User
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
        setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
        setDeleteModalOpen(false);
        fetchUsers();
        fetchDashboardStats();
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to delete user', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Error deleting user', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async (userId) => {
    setActionLoading(true);
    try {
      const result = await adminUserService.resetUserPassword(userId);
      if (result.success) {
        setSnackbar({ 
          open: true, 
          message: result.message || 'Password reset email sent', 
          severity: 'success' 
        });
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to reset password', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Error resetting password', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };
  
  // Utility functions
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
  
  if (loading && users.length === 0) {
    return (
      <PageContainer title="Admin User Dashboard" description="Comprehensive user management dashboard">
        <Box display="flex" justifyContent="center" alignItems="center" height={400}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading user dashboard...</Typography>
        </Box>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer title="Admin User Dashboard" description="Comprehensive user management dashboard">
      <Breadcrumb title="User Dashboard" items={BCrumb} />
      
      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card sx={{ 
            height: '100%', 
            bgcolor: 'background.paper', 
            border: '1px solid', 
            borderColor: 'divider',
            borderRadius: 2,
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">{stats.totalUsers}</Typography>
                  <Typography color="textSecondary" variant="body2">Total Users</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card sx={{ 
            height: '100%', 
            bgcolor: 'background.paper', 
            border: '1px solid', 
            borderColor: 'divider',
            borderRadius: 2,
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
                  <PersonAdd />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">{stats.activeUsers}</Typography>
                  <Typography color="textSecondary" variant="body2">Active Users</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card sx={{ 
            height: '100%', 
            bgcolor: 'background.paper', 
            border: '1px solid', 
            borderColor: 'divider',
            borderRadius: 2,
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">{stats.totalUsers - stats.activeUsers}</Typography>
                  <Typography color="textSecondary" variant="body2">Inactive Users</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card sx={{ 
            height: '100%', 
            bgcolor: 'background.paper', 
            border: '1px solid', 
            borderColor: 'divider',
            borderRadius: 2,
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'info.main', width: 48, height: 48 }}>
                  <Verified />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">{stats.verifiedUsers}</Typography>
                  <Typography color="textSecondary" variant="body2">Verified Users</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Users Table */}
      <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <CardContent>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
            <Typography variant="h5" component="h2">
              All Registered Users ({totalUsers})
            </Typography>
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
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
                variant="outlined"
                onClick={handleRefresh}
                disabled={refreshing}
                startIcon={refreshing ? <CircularProgress size={16} /> : <Refresh />}
              >
                Refresh
              </Button>
              <Button variant="contained" startIcon={<Download />}>
                Export
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

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
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User Details</TableCell>
                      <TableCell>Contact Info</TableCell>
                      <TableCell>Role & Status</TableCell>
                      <TableCell>Verification</TableCell>
                      <TableCell>Wallet Balance</TableCell>
                      <TableCell>Joined Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography variant="body2" color="textSecondary" py={4}>
                            {searchTerm ? 'No users found matching your search.' : 'No users registered yet.'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id} hover>
                          <TableCell>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                                {user.username?.charAt(0)?.toUpperCase() || user.name?.charAt(0)?.toUpperCase() || 'U'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {user.name || user.username || 'N/A'}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  ID: {user.id}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          
                          <TableCell>
                            <Stack spacing={0.5}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Email fontSize="small" color="action" />
                                <Typography variant="body2">{user.email || 'N/A'}</Typography>
                              </Stack>
                              {user.phone && (
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Phone fontSize="small" color="action" />
                                  <Typography variant="body2">{user.phone}</Typography>
                                </Stack>
                              )}
                            </Stack>
                          </TableCell>
                          
                          <TableCell>
                            <Stack spacing={1}>
                              <Chip
                                label={user.role || 'user'}
                                color={getRoleColor(user.role)}
                                size="small"
                                variant="outlined"
                                sx={{ textTransform: 'capitalize' }}
                              />
                              <Box display="flex" alignItems="center" gap={1}>
                                <Chip
                                  label={user.status || 'Unknown'}
                                  color={getStatusColor(user.status)}
                                  size="small"
                                />
                                <Switch
                                  checked={user.status === 'Active'}
                                  onChange={() => handleToggleUserStatus(user.id)}
                                  size="small"
                                />
                              </Box>
                            </Stack>
                          </TableCell>
                          
                          <TableCell>
                            <Stack spacing={1}>
                              <Chip
                                label={user.emailVerified ? 'Email ✓' : 'Email ✗'}
                                color={user.emailVerified ? 'success' : 'warning'}
                                size="small"
                                variant="outlined"
                              />
                              {user.phoneVerified !== undefined && (
                                <Chip
                                  label={user.phoneVerified ? 'Phone ✓' : 'Phone ✗'}
                                  color={user.phoneVerified ? 'success' : 'warning'}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Stack>
                          </TableCell>
                          
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              ₹{user.wallet?.balance ? Number(user.wallet.balance).toLocaleString() : '0'}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {user.wallet?.currency || 'INR'}
                            </Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Typography variant="body2">
                              {user.createdAt || user.joinedDate
                                ? formatDistanceToNow(new Date(user.createdAt || user.joinedDate), { addSuffix: true })
                                : 'N/A'}
                            </Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Stack direction="row" spacing={0.5}>
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
                            </Stack>
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
                count={totalUsers}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                showFirstButton
                showLastButton
              />
            </>
          )}
        </CardContent>
      </Card>

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
                    <Chip label={selectedUser.role} color={getRoleColor(selectedUser.role)} size="small" />
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">Status</Typography>
                  <Box mt={0.5}>
                    <Chip label={selectedUser.status} color={getStatusColor(selectedUser.status)} size="small" />
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
          <Button 
            startIcon={<Lock />} 
            onClick={() => selectedUser && handleResetPassword(selectedUser.id)}
            disabled={actionLoading}
          >
            Reset Password
          </Button>
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
              value={editFormData.name || ''}
              onChange={(e) => handleEditFormChange('name', e.target.value)}
            />
            <TextField
              label="Email"
              fullWidth
              value={editFormData.email || ''}
              onChange={(e) => handleEditFormChange('email', e.target.value)}
            />
            <TextField
              label="Phone"
              fullWidth
              value={editFormData.phone || ''}
              onChange={(e) => handleEditFormChange('phone', e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={editFormData.role || 'user'}
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
                value={editFormData.status || 'Active'}
                label="Status"
                onChange={(e) => handleEditFormChange('status', e.target.value)}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
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
    </PageContainer>
  );
};

export default UserDashboard;
