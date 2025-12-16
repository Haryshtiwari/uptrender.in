import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
  Avatar,
  Tooltip,
  Container,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CurrencyExchange as CurrencyIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import Breadcrumb from '../../../components/layout/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../components/common/PageContainer';
import planService from '../../../services/planService';
import adminPlanService from '../../../services/adminPlanService';

const BCrumb = [
  {
    to: '/admin/dashboard',
    title: 'Dashboard',
  },
  {
    title: 'Plan Management',
  },
];

const AdminPlanManagement = () => {
  const theme = useTheme();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: 30,
    durationType: 'days',
    walletBalance: '',
    features: [''],
    isPopular: false,
    isActive: true,
    planType: 'basic',
    maxStrategies: '',
    maxTrades: '',
    apiAccess: false,
    priority: 'standard',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await adminPlanService.getPlans();
      if (response.success) {
        setPlans(response.data);
      } else {
        showAlert('error', response.error || 'Failed to fetch plans');
      }
    } catch (error) {
      console.error('Fetch plans error:', error);
      showAlert('error', 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleOpenDialog = (plan = null) => {
    if (plan) {
      setEditMode(true);
      setSelectedPlan(plan);
      setFormData({
        name: plan.name || '',
        description: plan.description || '',
        price: (plan.price || 0).toString(),
        duration: plan.duration || 30,
        durationType: plan.durationType || 'days',
        walletBalance: (plan.walletBalance || 0).toString(),
        features: (() => {
          if (Array.isArray(plan.features)) {
            return plan.features;
          }
          if (typeof plan.features === 'string') {
            try {
              const parsed = JSON.parse(plan.features);
              return Array.isArray(parsed) ? parsed : [plan.features];
            } catch {
              return [plan.features];
            }
          }
          return [''];
        })(),
        isPopular: plan.isPopular || false,
        isActive: plan.isActive !== undefined ? plan.isActive : true,
        planType: plan.planType || 'basic',
        maxStrategies: (plan.maxStrategies || '').toString(),
        maxTrades: (plan.maxTrades || '').toString(),
        apiAccess: plan.apiAccess || false,
        priority: plan.priority || 'standard',
      });
    } else {
      setEditMode(false);
      setSelectedPlan(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: 30,
        durationType: 'days',
        walletBalance: '',
        features: [''],
        isPopular: false,
        isActive: true,
        planType: 'basic',
        maxStrategies: '',
        maxTrades: '',
        apiAccess: false,
        priority: 'standard',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditMode(false);
    setSelectedPlan(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeatureChange = (index, value) => {
    const currentFeatures = Array.isArray(formData.features) ? formData.features : [''];
    const newFeatures = [...currentFeatures];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...(Array.isArray(prev.features) ? prev.features : ['']), '']
    }));
  };

  const removeFeature = (index) => {
    const currentFeatures = Array.isArray(formData.features) ? formData.features : [''];
    const newFeatures = currentFeatures.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const handleSavePlan = async () => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!formData.name || !formData.price || !formData.walletBalance) {
        showAlert('error', 'Please fill in all required fields');
        return;
      }

      const planData = {
        ...formData,
        price: parseFloat(formData.price),
        walletBalance: parseFloat(formData.walletBalance),
        maxStrategies: parseInt(formData.maxStrategies) || 0,
        maxTrades: parseInt(formData.maxTrades) || 0,
        features: formData.features.filter(f => f.trim() !== ''),
      };

      if (editMode) {
        // Update existing plan
        const response = await adminPlanService.updatePlan(selectedPlan.id, planData);
        if (response.success) {
          await fetchPlans(); // Refresh the list
          showAlert('success', 'Plan updated successfully');
        } else {
          showAlert('error', response.error || 'Failed to update plan');
          return;
        }
      } else {
        // Create new plan
        const response = await adminPlanService.createPlan(planData);
        if (response.success) {
          await fetchPlans(); // Refresh the list
          showAlert('success', 'Plan created successfully');
        } else {
          showAlert('error', response.error || 'Failed to create plan');
          return;
        }
      }

      handleCloseDialog();
    } catch (error) {
      showAlert('error', 'Failed to save plan');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        const response = await adminPlanService.deletePlan(planId);
        if (response.success) {
          await fetchPlans(); // Refresh the list
          showAlert('success', 'Plan deleted successfully');
        } else {
          showAlert('error', response.error || 'Failed to delete plan');
        }
      } catch (error) {
        console.error('Delete plan error:', error);
        showAlert('error', 'Failed to delete plan');
      }
    }
  };

  const getPlanTypeColor = (type) => {
    switch (type) {
      case 'basic': return theme.palette.info.main;
      case 'professional': return theme.palette.primary.main;
      case 'enterprise': return theme.palette.secondary.main;
      default: return theme.palette.grey[500];
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return theme.palette.grey[500];
      case 'standard': return theme.palette.info.main;
      case 'high': return theme.palette.warning.main;
      case 'urgent': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  return (
    <PageContainer title="Plan Management" description="Manage subscription plans">
      <Container maxWidth="xl">
        <Breadcrumb title="Plan Management" items={BCrumb} />

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h4" component="h1" gutterBottom>
                Subscription Plan Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create and manage subscription plans for your users
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Create New Plan
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Alert */}
        {alert.show && (
          <Alert severity={alert.type} sx={{ mb: 3 }}>
            {alert.message}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              bgcolor: 'background.paper', 
              border: '1px solid', 
              borderColor: 'divider',
              borderRadius: 2,
            }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                    <CurrencyIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">{plans.length}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Plans</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              bgcolor: 'background.paper', 
              border: '1px solid', 
              borderColor: 'divider',
              borderRadius: 2,
            }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'info.main', width: 48, height: 48 }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">{plans.reduce((sum, plan) => sum + (plan.subscribers || 0), 0)}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Subscribers</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              bgcolor: 'background.paper', 
              border: '1px solid', 
              borderColor: 'divider',
              borderRadius: 2,
            }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
                    <VerifiedIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="success.main">{plans.filter(plan => plan.isActive).length}</Typography>
                    <Typography variant="body2" color="text.secondary">Active Plans</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              bgcolor: 'background.paper', 
              border: '1px solid', 
              borderColor: 'divider',
              borderRadius: 2,
            }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48 }}>
                    <StarIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="warning.main">{plans.filter(plan => plan.isPopular).length}</Typography>
                    <Typography variant="body2" color="text.secondary">Popular Plans</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Plans Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Current Plans
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Plan Details</TableCell>
                    <TableCell>Pricing</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Wallet Balance</TableCell>
                    <TableCell>Limits</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Subscribers</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="600">
                            {plan.name}
                            {plan.isPopular && (
                              <Chip 
                                label="Popular" 
                                size="small" 
                                color="warning" 
                                sx={{ ml: 1 }} 
                              />
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {plan.description}
                          </Typography>
                          <Chip 
                            label={plan.planType} 
                            size="small" 
                            sx={{ 
                              mt: 1,
                              backgroundColor: alpha(getPlanTypeColor(plan.planType), 0.1),
                              color: getPlanTypeColor(plan.planType)
                            }} 
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" color="primary">
                          ${plan.price}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TimeIcon sx={{ mr: 1, fontSize: '1rem' }} />
                          {plan.duration} {plan.durationType}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" color="success.main">
                          ${plan.walletBalance?.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {plan.maxStrategies} strategies
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {plan.maxTrades} trades/month
                        </Typography>
                        {plan.apiAccess && (
                          <Chip label="API Access" size="small" color="info" sx={{ mt: 0.5 }} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack spacing={1}>
                          <Chip 
                            label={plan.isActive ? 'Active' : 'Inactive'}
                            color={plan.isActive ? 'success' : 'default'}
                            size="small"
                          />
                          <Chip 
                            label={plan.priority}
                            size="small"
                            sx={{
                              backgroundColor: alpha(getPriorityColor(plan.priority), 0.1),
                              color: getPriorityColor(plan.priority)
                            }}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">
                          {plan.subscribers || 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Edit Plan">
                            <IconButton 
                              color="primary" 
                              onClick={() => handleOpenDialog(plan)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Plan">
                            <IconButton 
                              color="error" 
                              onClick={() => handleDeletePlan(plan.id)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Create/Edit Plan Dialog */}
        <Dialog 
          open={dialogOpen} 
          onClose={handleCloseDialog} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle>
            <Typography variant="h5">
              {editMode ? 'Edit Plan' : 'Create New Plan'}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Plan Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Plan Type</InputLabel>
                  <Select
                    value={formData.planType}
                    onChange={(e) => handleInputChange('planType', e.target.value)}
                    label="Plan Type"
                  >
                    <MenuItem value="basic">Basic</MenuItem>
                    <MenuItem value="professional">Professional</MenuItem>
                    <MenuItem value="enterprise">Enterprise</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>

              {/* Pricing & Duration */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Pricing & Duration
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Price ($)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Duration Type</InputLabel>
                  <Select
                    value={formData.durationType}
                    onChange={(e) => handleInputChange('durationType', e.target.value)}
                    label="Duration Type"
                  >
                    <MenuItem value="days">Days</MenuItem>
                    <MenuItem value="months">Months</MenuItem>
                    <MenuItem value="years">Years</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Wallet Balance ($)"
                  type="number"
                  value={formData.walletBalance}
                  onChange={(e) => handleInputChange('walletBalance', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority Level</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    label="Priority Level"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="standard">Standard</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Limits & Features */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Limits & Access
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max Strategies"
                  type="number"
                  value={formData.maxStrategies}
                  onChange={(e) => handleInputChange('maxStrategies', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max Trades per Month"
                  type="number"
                  value={formData.maxTrades}
                  onChange={(e) => handleInputChange('maxTrades', e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.apiAccess}
                      onChange={(e) => handleInputChange('apiAccess', e.target.checked)}
                    />
                  }
                  label="API Access"
                />
              </Grid>

              {/* Plan Features */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                  Plan Features
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {(Array.isArray(formData.features) ? formData.features : []).map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      fullWidth
                      label={`Feature ${index + 1}`}
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                    />
                    <Button
                      color="error"
                      onClick={() => removeFeature(index)}
                      disabled={(Array.isArray(formData.features) ? formData.features : []).length === 1}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
                
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addFeature}
                  sx={{ mt: 1 }}
                >
                  Add Feature
                </Button>
              </Grid>

              {/* Plan Status */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                  Plan Status
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Stack direction="row" spacing={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      />
                    }
                    label="Active Plan"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isPopular}
                        onChange={(e) => handleInputChange('isPopular', e.target.checked)}
                      />
                    }
                    label="Mark as Popular"
                  />
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSavePlan}
              startIcon={<SaveIcon />}
              disabled={loading}
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }}
            >
              {loading ? 'Saving...' : (editMode ? 'Update Plan' : 'Create Plan')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </PageContainer>
  );
};

export default AdminPlanManagement;