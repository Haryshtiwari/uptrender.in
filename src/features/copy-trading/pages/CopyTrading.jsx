import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  Avatar,
  LinearProgress,
  Tabs,
  Tab,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
  Skeleton,
} from '@mui/material';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCopy,
  IconUsers,
  IconApi,
  IconTrendingUp,
  IconSettings,
  IconEye,
  IconChevronDown,
  IconActivity,
  IconWallet,
  IconBroadcast,
  IconTarget,
  IconArrowRight,
} from '@tabler/icons-react';
import { useToast } from '../../../hooks/useToast';
import { copyTradingService } from '../../../services/copyTradingService';

const CopyTrading = () => {
  const theme = useTheme();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedAccounts, setExpandedAccounts] = useState(new Set());
  const [formData, setFormData] = useState({
    name: '',
    type: 'master',
    apiKey: '',
    secretKey: '',
    broker: '',
    isActive: true,
    linkedAccounts: [],
    masterAccountId: '',
  });
  const { showToast } = useToast();

  // Early error boundary
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Copy Trading Error
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchAccounts();
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching copy trading accounts...');
      
      // Check if copyTradingService exists
      if (!copyTradingService || !copyTradingService.getAccounts) {
        throw new Error('Copy trading service not available');
      }
      
      const result = await copyTradingService.getAccounts();
      console.log('API result:', result);
      
      if (result && result.success) {
        console.log('Accounts fetched:', result.data);
        setAccounts(Array.isArray(result.data) ? result.data : []);
      } else {
        console.error('API error:', result?.error);
        setError(result?.error || 'Failed to fetch copy trading accounts');
        setAccounts([]);
      }
    } catch (error) {
      console.error('Network error fetching accounts:', error);
      setError(error.message || 'Failed to connect to server');
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (account = null) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        name: account.name,
        type: account.type,
        apiKey: account.apiKey,
        secretKey: account.secretKey,
        broker: account.broker,
        isActive: account.isActive,
        linkedAccounts: account.linkedAccounts || [],
        masterAccountId: account.masterAccountId || '',
      });
    } else {
      setEditingAccount(null);
      setFormData({
        name: '',
        type: 'master',
        apiKey: '',
        secretKey: '',
        broker: '',
        isActive: true,
        linkedAccounts: [],
        masterAccountId: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAccount(null);
    setFormData({
      name: '',
      type: 'master',
      apiKey: '',
      secretKey: '',
      broker: '',
      isActive: true,
      linkedAccounts: [],
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      let result;
      if (editingAccount) {
        result = await copyTradingService.updateAccount(editingAccount.id, formData);
      } else {
        result = await copyTradingService.createAccount(formData);
      }

      if (result.success) {
        showToast(result.message || `Account ${editingAccount ? 'updated' : 'created'} successfully`, 'success');
        fetchAccounts();
        handleCloseDialog();
      } else {
        showToast(result.error || `Failed to ${editingAccount ? 'update' : 'create'} account`, 'error');
      }
    } catch (error) {
      showToast(`Failed to ${editingAccount ? 'update' : 'create'} account`, 'error');
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (accountId) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        const result = await copyTradingService.deleteAccount(accountId);
        if (result.success) {
          showToast(result.message || 'Account deleted successfully', 'success');
          fetchAccounts();
        } else {
          showToast(result.error || 'Failed to delete account', 'error');
        }
      } catch (error) {
        showToast('Failed to delete account', 'error');
        console.error('Error deleting account:', error);
      }
    }
  };

  const handleToggleStatus = async (accountId, currentStatus) => {
    try {
      const result = await copyTradingService.toggleAccountStatus(accountId, !currentStatus);
      if (result.success) {
        showToast(result.message || 'Account status updated successfully', 'success');
        fetchAccounts();
      } else {
        showToast(result.error || 'Failed to update account status', 'error');
      }
    } catch (error) {
      showToast('Failed to update account status', 'error');
      console.error('Error updating status:', error);
    }
  };

  const masterAccounts = React.useMemo(() => {
    try {
      return Array.isArray(accounts) ? accounts.filter(acc => acc && acc.type === 'master') : [];
    } catch (error) {
      console.error('Error filtering master accounts:', error);
      return [];
    }
  }, [accounts]);

  const childAccounts = React.useMemo(() => {
    try {
      return Array.isArray(accounts) ? accounts.filter(acc => acc && acc.type === 'child') : [];
    } catch (error) {
      console.error('Error filtering child accounts:', error);
      return [];
    }
  }, [accounts]);

  // Calculate stats with error handling
  const stats = React.useMemo(() => {
    try {
      if (!Array.isArray(accounts)) {
        return { total: 0, masters: 0, children: 0, active: 0 };
      }
      return {
        total: accounts.length,
        masters: accounts.filter(acc => acc && acc.type === 'master').length,
        children: accounts.filter(acc => acc && acc.type === 'child').length,
        active: accounts.filter(acc => acc && acc.isActive).length,
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      return { total: 0, masters: 0, children: 0, active: 0 };
    }
  }, [accounts]);

  // Stats cards render function
  const renderStatsCard = (icon, title, value, color, subtitle) => (
    <Card 
      sx={{ 
        background: `linear-gradient(135deg, ${theme.palette[color].main}15, ${theme.palette[color].main}05)`,
        border: `1px solid ${alpha(theme.palette[color].main, 0.1)}`,
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar 
            sx={{ 
              bgcolor: `${color}.main`, 
              width: 56, 
              height: 56,
              '& svg': { fontSize: 24 }
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
              {value}
            </Typography>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  // Group accounts for display with error handling
  const masterWithChildren = React.useMemo(() => {
    try {
      return masterAccounts.map(master => ({
        ...master,
        children: childAccounts.filter(child => child.masterAccountId === master.id)
      }));
    } catch (error) {
      console.error('Error processing master accounts:', error);
      return [];
    }
  }, [masterAccounts, childAccounts]);

  const orphanedChildren = React.useMemo(() => {
    try {
      return childAccounts.filter(child => !child.masterAccountId);
    } catch (error) {
      console.error('Error processing orphaned children:', error);
      return [];
    }
  }, [childAccounts]);

  // Error boundary for the entire component
  if (loading && accounts.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Skeleton variant="rectangular" height={200} />
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map(i => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rectangular" height={120} />
              </Grid>
            ))}
          </Grid>
          <Skeleton variant="rectangular" height={400} />
        </Stack>
      </Box>
    );
  }

  // Main component render with error boundary
  try {
    return (
      <Box>
        {/* Header Section */}
        <Card 
        sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
          mb: 3,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'start', md: 'center' }} spacing={2}>
            <Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Copy Trading Hub
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Automate your trading strategy by copying successful traders
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<IconPlus />}
              onClick={() => handleOpenDialog()}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                backdropFilter: 'blur(10px)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
            >
              Add New Account
            </Button>
          </Stack>
        </CardContent>
        <Box 
          sx={{ 
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            zIndex: 1
          }}
        />
      </Card>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          {renderStatsCard(
            <IconUsers />,
            'Total Accounts',
            stats.total,
            'primary',
            'All trading accounts'
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderStatsCard(
            <IconTrendingUp />,
            'Master Accounts',
            stats.masters,
            'success',
            'Strategy providers'
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderStatsCard(
            <IconCopy />,
            'Copy Accounts',
            stats.children,
            'info',
            'Strategy followers'
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderStatsCard(
            <IconActivity />,
            'Active Accounts',
            stats.active,
            'warning',
            'Currently trading'
          )}
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ px: 3 }}
          >
            <Tab 
              label={`Trading Groups (${masterWithChildren.length})`}
              icon={<IconUsers size={20} />} 
              iconPosition="start"
            />
            <Tab 
              label={`Unlinked Accounts (${orphanedChildren.length})`}
              icon={<IconBroadcast size={20} />} 
              iconPosition="start"
            />
            <Tab 
              label="All Accounts"
              icon={<IconSettings size={20} />} 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 0 }}>
          {/* Tab 0: Trading Groups */}
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              {loading ? (
                <Stack spacing={2}>
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} variant="rectangular" height={120} />
                  ))}
                </Stack>
              ) : masterWithChildren.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'grey.100' }}>
                    <IconUsers size={40} />
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    No Trading Groups Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Create master accounts to start building your copy trading network
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<IconPlus />}
                    onClick={() => handleOpenDialog()}
                  >
                    Create Master Account
                  </Button>
                </Box>
              ) : (
                <Stack spacing={3}>
                  {masterWithChildren.map((master) => (
                    <Card 
                      key={master.id}
                      variant="outlined"
                      sx={{ 
                        border: `2px solid ${master.isActive ? theme.palette.success.light : theme.palette.grey[300]}`,
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}
                    >
                      {/* Master Account Header */}
                      <Box 
                        sx={{ 
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.primary.main}05)`,
                          p: 3,
                          borderBottom: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar 
                            sx={{ 
                              bgcolor: 'primary.main', 
                              width: 60, 
                              height: 60,
                              fontSize: 24 
                            }}
                          >
                            <IconTrendingUp />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight="bold">
                              {master.name}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Chip 
                                label="Master Account" 
                                size="small" 
                                color="primary" 
                                variant="filled"
                              />
                              <Typography variant="body2" color="text.secondary">
                                {master.broker}
                              </Typography>
                              <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: master.isActive ? 'success.main' : 'grey.400' }} />
                              <Typography variant="body2" color={master.isActive ? 'success.main' : 'text.secondary'}>
                                {master.isActive ? 'Active' : 'Inactive'}
                              </Typography>
                            </Stack>
                          </Box>
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              onClick={() => handleOpenDialog(master)}
                              sx={{ bgcolor: 'background.paper' }}
                            >
                              <IconEdit size={18} />
                            </IconButton>
                            <IconButton
                              onClick={() => handleToggleStatus(master.id, master.isActive)}
                              color={master.isActive ? 'warning' : 'success'}
                              sx={{ bgcolor: 'background.paper' }}
                            >
                              <IconActivity size={18} />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(master.id)}
                              color="error"
                              sx={{ bgcolor: 'background.paper' }}
                            >
                              <IconTrash size={18} />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </Box>

                      {/* Child Accounts */}
                      {master.children.length > 0 && (
                        <Box sx={{ p: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                            Copy Accounts ({master.children.length})
                          </Typography>
                          <Grid container spacing={2}>
                            {master.children.map((child) => (
                              <Grid item xs={12} md={6} key={child.id}>
                                <Card 
                                  variant="outlined" 
                                  sx={{ 
                                    bgcolor: alpha(theme.palette.info.main, 0.05),
                                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                                  }}
                                >
                                  <CardContent sx={{ p: 2 }}>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                      <Avatar sx={{ bgcolor: 'info.main', width: 40, height: 40 }}>
                                        <IconCopy size={20} />
                                      </Avatar>
                                      <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                          {child.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          {child.broker} • Copying {master.name}
                                        </Typography>
                                      </Box>
                                      <Stack direction="row" spacing={0.5}>
                                        <IconButton 
                                          size="small"
                                          onClick={() => handleOpenDialog(child)}
                                        >
                                          <IconEdit size={16} />
                                        </IconButton>
                                        <IconButton 
                                          size="small"
                                          onClick={() => handleDelete(child.id)}
                                          color="error"
                                        >
                                          <IconTrash size={16} />
                                        </IconButton>
                                      </Stack>
                                    </Stack>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      )}

                      {/* No Child Accounts */}
                      {master.children.length === 0 && (
                        <Box sx={{ p: 3, textAlign: 'center', bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                          <Typography variant="body2" color="text.secondary">
                            No copy accounts linked to this master
                          </Typography>
                          <Button 
                            size="small" 
                            startIcon={<IconPlus />}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, type: 'child', masterAccountId: master.id }));
                              handleOpenDialog();
                            }}
                            sx={{ mt: 1 }}
                          >
                            Add Copy Account
                          </Button>
                        </Box>
                      )}
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          )}

          {/* Tab 1: Unlinked Accounts */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              {orphanedChildren.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'success.light' }}>
                    <IconTarget size={40} />
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    All Accounts Properly Linked
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Every child account has a master to copy from
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      These child accounts need to be linked to a master account to start copy trading.
                    </Typography>
                  </Alert>
                  {orphanedChildren.map((orphan) => (
                    <Card 
                      key={orphan.id} 
                      variant="outlined"
                      sx={{ 
                        border: `1px solid ${theme.palette.warning.main}`,
                        bgcolor: alpha(theme.palette.warning.main, 0.05)
                      }}
                    >
                      <CardContent>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'warning.main', width: 50, height: 50 }}>
                            <IconBroadcast size={24} />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={600}>
                              {orphan.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {orphan.broker} • Not linked to any master account
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<IconArrowRight />}
                              onClick={() => handleOpenDialog(orphan)}
                            >
                              Link to Master
                            </Button>
                            <IconButton
                              onClick={() => handleDelete(orphan.id)}
                              color="error"
                            >
                              <IconTrash size={18} />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          )}

          {/* Tab 2: All Accounts */}
          {activeTab === 2 && (
            <Box sx={{ p: 3 }}>
              {accounts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'grey.100' }}>
                    <IconWallet size={40} />
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    No Accounts Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Start by creating your first trading account
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<IconPlus />}
                    onClick={() => handleOpenDialog()}
                  >
                    Create Account
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {accounts.map((account) => (
                    <Grid item xs={12} md={6} key={account.id}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar 
                              sx={{ 
                                bgcolor: account.type === 'master' ? 'primary.main' : 'info.main',
                                width: 48,
                                height: 48
                              }}
                            >
                              {account.type === 'master' ? <IconTrendingUp /> : <IconCopy />}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" fontWeight={600}>
                                {account.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {account.broker} • {account.type === 'master' ? 'Master' : 'Copy'} Account
                              </Typography>
                              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                <Chip
                                  label={account.isActive ? 'Active' : 'Inactive'}
                                  size="small"
                                  color={account.isActive ? 'success' : 'default'}
                                  variant="outlined"
                                />
                                {account.type === 'child' && account.masterAccountName && (
                                  <Chip
                                    label={`Following: ${account.masterAccountName}`}
                                    size="small"
                                    color="info"
                                    variant="outlined"
                                  />
                                )}
                              </Stack>
                            </Box>
                            <Stack direction="row" spacing={0.5}>
                              <IconButton 
                                size="small"
                                onClick={() => handleOpenDialog(account)}
                              >
                                <IconEdit size={16} />
                              </IconButton>
                              <IconButton 
                                size="small"
                                onClick={() => handleToggleStatus(account.id, account.isActive)}
                                color={account.isActive ? 'warning' : 'success'}
                              >
                                <IconActivity size={16} />
                              </IconButton>
                              <IconButton 
                                size="small"
                                onClick={() => handleDelete(account.id)}
                                color="error"
                              >
                                <IconTrash size={16} />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Account Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAccount ? 'Edit Account' : 'Add New Account'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Account Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Account Type"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  SelectProps={{
                    native: true,
                  }}
                  required
                >
                  <option value="master">Master Account</option>
                  <option value="child">Child Account</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Broker"
                  value={formData.broker}
                  onChange={(e) => handleInputChange('broker', e.target.value)}
                  required
                />
              </Grid>
              {formData.type === 'child' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Master Account to Follow"
                    value={formData.masterAccountId}
                    onChange={(e) => handleInputChange('masterAccountId', e.target.value)}
                    SelectProps={{
                      native: true,
                    }}
                    required
                  >
                    <option value="">Select Master Account</option>
                    {accounts
                      .filter(acc => acc.type === 'master')
                      .map(masterAccount => (
                        <option key={masterAccount.id} value={masterAccount.id}>
                          {masterAccount.name} ({masterAccount.broker})
                        </option>
                      ))}
                  </TextField>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="API Key"
                  value={formData.apiKey}
                  onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Secret Key"
                  value={formData.secretKey}
                  onChange={(e) => handleInputChange('secretKey', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.name || !formData.apiKey || !formData.secretKey || !formData.broker}
          >
            {editingAccount ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
  } catch (renderError) {
    console.error('Component render error:', renderError);
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Component Error
          </Typography>
          <Typography variant="body2">
            {renderError.message || 'Something went wrong rendering the copy trading page'}
          </Typography>
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
      </Box>
    );
  }
};

export default CopyTrading;