import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  MenuItem,
  InputAdornment,
  Tooltip,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  Refresh,
  People,
  TrendingUp,
  AttachMoney,
  Store,
  Close,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import PageContainer from '../../../components/common/PageContainer';
import Breadcrumb from '../../../components/layout/full/shared/breadcrumb/Breadcrumb';
import { useToast } from '../../../hooks/useToast';
import adminFranchiseService from '../../../services/adminFranchiseService';

const BCrumb = [
  { to: '/admin/dashboard', title: 'Dashboard' },
  { title: 'Franchise Management' },
];

const AdminFranchise = () => {
  const { showToast } = useToast();
  
  // State management
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [viewTab, setViewTab] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    franchiseName: '',
    franchiseCommission: 0,
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  });

  useEffect(() => {
    fetchFranchises();
  }, [page, rowsPerPage, searchQuery, statusFilter]);

  const fetchFranchises = async () => {
    setLoading(true);
    try {
      const result = await adminFranchiseService.getAllFranchises({
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery,
        status: statusFilter,
      });
      
      if (result.success) {
        setFranchises(result.data);
        setTotalCount(result.pagination.total);
      }
    } catch (error) {
      showToast(error.message || 'Failed to fetch franchises', 'error');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      franchiseName: '',
      franchiseCommission: 0,
      address1: '',
      address2: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    });
  };

  const handleAddFranchise = async () => {
    try {
      const result = await adminFranchiseService.createFranchise(formData);
      if (result.success) {
        showToast('Franchise created successfully!', 'success');
        setOpenAddDialog(false);
        resetForm();
        fetchFranchises();
      }
    } catch (error) {
      showToast(error.message || 'Failed to create franchise', 'error');
    }
  };

  const handleUpdateFranchise = async () => {
    try {
      const result = await adminFranchiseService.updateFranchise(selectedFranchise.id, formData);
      if (result.success) {
        showToast('Franchise updated successfully!', 'success');
        setOpenEditDialog(false);
        resetForm();
        setSelectedFranchise(null);
        fetchFranchises();
      }
    } catch (error) {
      showToast(error.message || 'Failed to update franchise', 'error');
    }
  };

  const handleDeleteFranchise = async (id) => {
    if (!window.confirm('Are you sure you want to delete this franchise?')) {
      return;
    }

    try {
      const result = await adminFranchiseService.deleteFranchise(id);
      if (result.success) {
        showToast('Franchise deleted successfully!', 'success');
        fetchFranchises();
      }
    } catch (error) {
      showToast(error.message || 'Failed to delete franchise', 'error');
    }
  };

  const handleViewFranchise = async (franchise) => {
    try {
      const result = await adminFranchiseService.getFranchiseById(franchise.id);
      if (result.success) {
        setSelectedFranchise(result.data);
        setOpenViewDialog(true);
        setViewTab(0);
      }
    } catch (error) {
      showToast(error.message || 'Failed to fetch franchise details', 'error');
    }
  };

  const handleEditClick = (franchise) => {
    setSelectedFranchise(franchise);
    setFormData({
      name: franchise.name || '',
      email: franchise.email || '',
      phone: franchise.phone || '',
      username: franchise.username || '',
      password: '',
      franchiseName: franchise.franchiseName || '',
      franchiseCommission: franchise.franchiseCommission || 0,
      address1: franchise.address1 || '',
      address2: franchise.address2 || '',
      city: franchise.city || '',
      state: franchise.state || '',
      country: franchise.country || '',
      postalCode: franchise.postalCode || '',
    });
    setOpenEditDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'default';
      case 'Suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <PageContainer title="Franchise Management" description="Manage franchises">
      <Breadcrumb title="Franchise Management" items={BCrumb} />
      
      <Paper elevation={0} sx={{ p: 3 }}>
        {/* Header Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            <Store sx={{ mr: 1, verticalAlign: 'middle' }} />
            Franchise Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAddDialog(true)}
          >
            Add Franchise
          </Button>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by name, email, or franchise name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Suspended">Suspended</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchFranchises}
              sx={{ height: '100%' }}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>

        {/* Franchises Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Franchise ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Franchise Name</TableCell>
                <TableCell align="center">Commission %</TableCell>
                <TableCell align="center">Total Users</TableCell>
                <TableCell align="center">Active Users</TableCell>
                <TableCell align="center">Total Trades</TableCell>
                <TableCell align="right">Total Volume</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : franchises.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    No franchises found
                  </TableCell>
                </TableRow>
              ) : (
                franchises.map((franchise) => (
                  <TableRow key={franchise.id} hover>
                    <TableCell>{franchise.franchiseId}</TableCell>
                    <TableCell>{franchise.name}</TableCell>
                    <TableCell>{franchise.email}</TableCell>
                    <TableCell>{franchise.franchiseName}</TableCell>
                    <TableCell align="center">{franchise.franchiseCommission}%</TableCell>
                    <TableCell align="center">{franchise.totalUsers || 0}</TableCell>
                    <TableCell align="center">{franchise.activeUsers || 0}</TableCell>
                    <TableCell align="center">{franchise.totalTrades || 0}</TableCell>
                    <TableCell align="right">₹{parseFloat(franchise.totalVolume || 0).toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={franchise.franchiseStatus}
                        color={getStatusColor(franchise.franchiseStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => handleViewFranchise(franchise)}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEditClick(franchise)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDeleteFranchise(franchise.id)} color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Add Franchise Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Add New Franchise
          <IconButton
            onClick={() => setOpenAddDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name *"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username *"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password *"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Franchise Name *"
                name="franchiseName"
                value={formData.franchiseName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Commission %"
                name="franchiseCommission"
                type="number"
                value={formData.franchiseCommission}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="body2" color="text.secondary">Address Details</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 1"
                name="address1"
                value={formData.address1}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 2"
                name="address2"
                value={formData.address2}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Postal Code"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <LoadingButton
            variant="contained"
            onClick={handleAddFranchise}
            disabled={!formData.name || !formData.email || !formData.username || !formData.password || !formData.franchiseName}
          >
            Create Franchise
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Edit Franchise Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit Franchise
          <IconButton
            onClick={() => setOpenEditDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Franchise Name"
                name="franchiseName"
                value={formData.franchiseName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Commission %"
                name="franchiseCommission"
                type="number"
                value={formData.franchiseCommission}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Status"
                name="franchiseStatus"
                value={formData.franchiseStatus}
                onChange={handleInputChange}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <LoadingButton
            variant="contained"
            onClick={handleUpdateFranchise}
          >
            Update Franchise
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* View Franchise Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          Franchise Details
          <IconButton
            onClick={() => setOpenViewDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedFranchise && (
            <Box>
              <Tabs value={viewTab} onChange={(e, newValue) => setViewTab(newValue)} sx={{ mb: 2 }}>
                <Tab label="Overview" />
                <Tab label="Users" />
                <Tab label="Statistics" />
              </Tabs>

              {viewTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Basic Information
                      </Typography>
                      <Typography variant="body2"><strong>Name:</strong> {selectedFranchise.franchise.name}</Typography>
                      <Typography variant="body2"><strong>Email:</strong> {selectedFranchise.franchise.email}</Typography>
                      <Typography variant="body2"><strong>Phone:</strong> {selectedFranchise.franchise.phone || 'N/A'}</Typography>
                      <Typography variant="body2"><strong>Franchise ID:</strong> {selectedFranchise.franchise.franchiseId}</Typography>
                      <Typography variant="body2"><strong>Franchise Name:</strong> {selectedFranchise.franchise.franchiseName}</Typography>
                      <Typography variant="body2"><strong>Commission:</strong> {selectedFranchise.franchise.franchiseCommission}%</Typography>
                      <Typography variant="body2">
                        <strong>Status:</strong>{' '}
                        <Chip
                          label={selectedFranchise.franchise.franchiseStatus}
                          color={getStatusColor(selectedFranchise.franchise.franchiseStatus)}
                          size="small"
                        />
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Quick Statistics
                      </Typography>
                      <Typography variant="body2"><strong>Total Users:</strong> {selectedFranchise.users.length}</Typography>
                      <Typography variant="body2"><strong>Total Trades:</strong> {selectedFranchise.statistics.totalTrades || 0}</Typography>
                      <Typography variant="body2"><strong>Total Volume:</strong> ₹{parseFloat(selectedFranchise.statistics.totalVolume || 0).toFixed(2)}</Typography>
                      <Typography variant="body2"><strong>Total Revenue:</strong> ₹{parseFloat(selectedFranchise.statistics.totalRevenue || 0).toFixed(2)}</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              )}

              {viewTab === 1 && (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Joined Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedFranchise.users.map((user) => (
                        <TableRow key={user.userId}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone || 'N/A'}</TableCell>
                          <TableCell>
                            <Chip label={user.status} color={user.status === 'Active' ? 'success' : 'default'} size="small" />
                          </TableCell>
                          <TableCell>{user.joinedDate}</TableCell>
                        </TableRow>
                      ))}
                      {selectedFranchise.users.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center">No users found</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {viewTab === 2 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom variant="body2">
                          Total Trades
                        </Typography>
                        <Typography variant="h4">
                          {selectedFranchise.statistics.totalTrades || 0}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom variant="body2">
                          Total Volume
                        </Typography>
                        <Typography variant="h4">
                          ₹{(selectedFranchise.statistics.totalVolume || 0).toFixed(0)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom variant="body2">
                          Total Profit
                        </Typography>
                        <Typography variant="h4" color="success.main">
                          ₹{(selectedFranchise.statistics.totalProfit || 0).toFixed(0)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom variant="body2">
                          Total Loss
                        </Typography>
                        <Typography variant="h4" color="error.main">
                          ₹{(selectedFranchise.statistics.totalLoss || 0).toFixed(0)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Monthly Statistics
                      </Typography>
                      <List dense>
                        {selectedFranchise.statistics.monthlyStats && selectedFranchise.statistics.monthlyStats.map((stat, index) => (
                          <React.Fragment key={index}>
                            <ListItem>
                              <ListItemText
                                primary={stat.month}
                                secondary={`Trades: ${stat.trades} | Volume: ₹${parseFloat(stat.volume).toFixed(2)} | Revenue: ₹${parseFloat(stat.revenue).toFixed(2)}`}
                              />
                            </ListItem>
                            {index < selectedFranchise.statistics.monthlyStats.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                        {(!selectedFranchise.statistics.monthlyStats || selectedFranchise.statistics.monthlyStats.length === 0) && (
                          <ListItem>
                            <ListItemText primary="No monthly statistics available" />
                          </ListItem>
                        )}
                      </List>
                    </Paper>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default AdminFranchise;
