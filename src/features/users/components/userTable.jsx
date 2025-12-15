import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Tooltip, Typography,
  TextField, MenuItem, Pagination, Select, Switch, Checkbox, Divider, Drawer, useMediaQuery, Avatar, Button,
  InputAdornment, CircularProgress, Alert, Chip
} from '@mui/material';
import Scrollbar from '../../../components/custom-scroll/Scrollbar';
import PageContainer from '../../../components/common/PageContainer';
import { IconEye, IconEdit } from '@tabler/icons-react';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FilterListIcon from '@mui/icons-material/FilterList';
import LockResetIcon from '@mui/icons-material/LockReset';

import { Close, Delete, Search } from '@mui/icons-material';
import AddUserDialog from './AddUserDialog';
import DeleteConfirm from './DeleteConfirm';
import ViewUserDialog from './ViewUserDialog';
import EditUserDialog from './EditUserDialog';
import ResetPasswordDialog from './ResetPasswordDialog';
import adminUserService from '../../../services/adminUserService';

const filterOptions = {
  status: ['active', 'inactive', 'suspended'],
  subscription: ['Subscribed', 'Not Subscribed'],
  plan: ['Free', 'Pro', 'Enterprise'],
  verification: ['Verified', 'Pending']
};

const UserTable = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [deleteUser, setDeleteUser] = React.useState(null);
  const [filters, setFilters] = React.useState({ status: [], subscription: [], plan: [], verification: [] });
  const [userRows, setUserRows] = React.useState([]);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [totalCount, setTotalCount] = React.useState(0);

  // Dialog states
  const [openAdd, setOpenAdd] = React.useState(false);
  const [viewUser, setViewUser] = React.useState(null);
  const [editUser, setEditUser] = React.useState(null);
  const [resetPasswordUser, setResetPasswordUser] = React.useState(null);

  const isMobile = useMediaQuery('(max-width:768px)');
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  // Fetch users from API
  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Build filters for API
      const apiFilters = {};
      if (filters.status.length > 0) {
        apiFilters.status = filters.status.join(',');
      }
      if (filters.verification.length > 0) {
        apiFilters.emailVerified = filters.verification.includes('Verified') ? 'true' : 'false';
      }

      const result = await adminUserService.getAllUsers({
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery || undefined,
        ...apiFilters,
      });

      if (result.success) {
        setUserRows(result.data.users || []);
        setTotalCount(result.data.total || 0);
      } else {
        setError(result.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleStatusToggle = async (user) => {
    try {
      const result = await adminUserService.toggleUserStatus(user.id);
      if (result.success) {
        fetchUsers(); // Reload data
      }
    } catch (err) {
      console.error('Error toggling user status:', err);
    }
  };

  const handleFilterChange = (category, value) => {
    setFilters((prev) => {
      const current = prev[category];
      return {
        ...prev,
        [category]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const handleResetFilters = () => {
    setFilters({ status: [], subscription: [], plan: [], verification: [] });
    setSearchQuery('');
  };

  const hasFilters = Object.values(filters).some(val => val.length > 0);
  const drawer = (
    <Scrollbar
      sx={{
        width: 250,
        height: 600,
        '& .simplebar-scrollbar:before': {
          backgroundColor: primary,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ bgcolor: 'primary.light' }}>
              <FilterListIcon sx={{ color: 'primary.main' }} />
            </Avatar>
            <Box>
              <Typography variant="h6">Filters</Typography>
              <Typography variant="body2" color="text.secondary">Refine your users</Typography>
            </Box>
          </Box>
          <IconButton onClick={handleDrawerToggle}>
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ my: 0.5 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body2" color="text.secondary">
            {Object.values(filters).reduce((acc, val) => acc + val.length, 0)} filter(s) applied
          </Typography>

          <Button
            size="small"
            onClick={handleResetFilters}
            startIcon={<RestartAltIcon />}
            sx={{
              color: hasFilters ? '#fff' : 'text.secondary',
              bgcolor: hasFilters ? 'secondary.main' : 'transparent',
              '&:hover': {
                bgcolor: 'secondary.dark',
              },
              fontWeight: hasFilters ? 600 : 400,
              borderRadius: 2,
            }}
          >
            Reset
          </Button>
        </Box>

        <Divider sx={{ my: 0.5 }} />

        {Object.entries(filterOptions).map(([key, options]) => (
          <Box key={key} mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Typography>
            {options.map((option) => (
              <Box key={option} display="flex" alignItems="center">
                <Checkbox
                  size="small"
                  checked={filters[key].includes(option)}
                  onChange={() => handleFilterChange(key, option)}
                  sx={{ color: 'primary.main' }}
                />
                <Typography variant="body2">{option}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1 }} />
          </Box>
        ))}
      </Box>
    </Scrollbar>
  );


  return (
    <PageContainer title="User Table" description="This is the User Table page">

      <Box display="flex" overflow="hidden">
        {isMobile ? (
          <>
            <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
              {drawer}
            </Drawer>
            <Box
              sx={{
                position: 'fixed',
                bottom: 16,
                left: 16,
                zIndex: 1300,
              }}
            >
              <IconButton
                onClick={handleDrawerToggle}
                sx={{
                  bgcolor: 'background.paper',
                  boxShadow: 3,
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  '&:hover': { bgcolor: 'background.default' },
                }}
              >
                <FilterListIcon sx={{ color: 'primary.main' }} />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box sx={{ width: 250, borderRight: '1px solid #e0e0e0' }}>{drawer}</Box>
        )}

        <Box flex={1} p={2} overflow="auto">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            flexDirection={{ xs: 'column', sm: 'row' }}
            gap={2}
            mb={2}
          >

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              User Information
            </Typography>



            <Box
              display="flex"
              flexDirection={{ xs: 'column-reverse', sm: 'row' }}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="flex-end"
              gap={2}
              width="100%"
            >
              {/* Search Bar */}
              <TextField
                size="small"
                placeholder="Search strategies..."
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

              {/* New API Button */}
             <Button
  variant="contained"
  sx={{ bgcolor: 'primary.main', color: '#fff', px: 3, borderRadius: 4 }}
  onClick={() => setOpenAdd(true)}
>
  + New User
</Button>
            </Box>

          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Dialogs */}
          <AddUserDialog
            open={openAdd}
            onClose={() => setOpenAdd(false)}
            onSuccess={fetchUsers}
          />

          <ViewUserDialog
            open={Boolean(viewUser)}
            user={viewUser}
            onClose={() => setViewUser(null)}
          />

          <EditUserDialog
            open={Boolean(editUser)}
            user={editUser}
            onClose={() => setEditUser(null)}
            onSuccess={fetchUsers}
          />

          <ResetPasswordDialog
            open={Boolean(resetPasswordUser)}
            user={resetPasswordUser}
            onClose={() => setResetPasswordUser(null)}
            onSuccess={fetchUsers}
          />

          <DeleteConfirm
            open={Boolean(deleteUser)}
            user={deleteUser}
            onClose={() => setDeleteUser(null)}
            onSuccess={fetchUsers}
          />

          <Paper variant="outlined">
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                  <CircularProgress />
                </Box>
              ) : userRows.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                  <Typography variant="body1" color="text.secondary">
                    No users found
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="medium" sx={{ minWidth: 700 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Plan</TableCell>
                        <TableCell>Joined Date</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userRows.map((row) => (
                        <TableRow hover key={row.id}>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                {row.firstName?.[0]}{row.lastName?.[0]}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2">
                                  {row.firstName} {row.lastName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ID: {row.id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{row.email}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {row.phoneNumber || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Tooltip title={row.status === 'active' ? 'Click to deactivate' : 'Click to activate'}>
                                <Switch
                                  checked={row.status === 'active'}
                                  onChange={() => handleStatusToggle(row)}
                                  size="small"
                                  color="success"
                                />
                              </Tooltip>
                              {row.emailVerified && (
                                <Chip label="Verified" size="small" color="success" sx={{ height: 20 }} />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={row.role}
                              size="small"
                              color={row.role === 'Admin' ? 'error' : 'default'}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {row.Plan?.name || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(row.createdAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box display="flex" gap={0.5}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  color="info"
                                  onClick={() => setViewUser(row)}
                                >
                                  <IconEye size={18} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit User">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => setEditUser(row)}
                                >
                                  <IconEdit size={18} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reset Password">
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() => setResetPasswordUser(row)}
                                >
                                  <LockResetIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete User">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => setDeleteUser(row)}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>

            <Box
              mt={4}
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems="center"
              gap={2}
              p={2}
            >
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
                    <MenuItem key={option} value={option}>{option}</MenuItem>
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
                sx={{ mb: 1, mr: 1 }}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default UserTable;
