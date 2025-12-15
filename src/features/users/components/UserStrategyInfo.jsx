import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  Avatar,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  Select,
  MenuItem,
  Pagination,
  IconButton,
  Tooltip,
  Alert,
  Switch,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Icons
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { useStrategies } from '../../../hooks/useStrategies';
import { useToast } from '../../../hooks/useToast';
import strategySubscriptionService from '../../../services/strategySubscriptionService';
import Loader from '../../../components/common/Loader';
import ViewUserStrategyDialog from '../../strategies/components/ViewUserStrategyDialog';
import EditUserStrategyDialog from '../../strategies/components/EditUserStrategyDialog';
import CloneStrategyDialog from '../../strategies/components/CloneStrategyDialog';
import DeleteUserStrategyConfirm from '../../strategies/components/DeleteUserStrategyConfirm';
import ToggleStatusConfirmDialog from '../../strategies/components/ToggleStatusConfirmDialog';

const UserStrategyInfo = () => {
  const theme = useTheme();
  const { strategies, loading, error, updateStrategy, deleteStrategy, createStrategy, refresh } = useStrategies();
  const { showToast } = useToast();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [unsubscribeDialog, setUnsubscribeDialog] = useState({ open: false, subscriptionId: null });
  const [editStrategy, setEditStrategy] = useState(null);
  const [cloneStrategy, setCloneStrategy] = useState(null);
  const [deleteStrategyConfirm, setDeleteStrategyConfirm] = useState(null);
  const [toggleStatusStrategy, setToggleStatusStrategy] = useState(null);

  // Tab and subscription state
  const [activeTab, setActiveTab] = useState(0); // 0 = My Strategies, 1 = Subscribed Strategies
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);
  const [editSubscription, setEditSubscription] = useState(null);
  const [viewStrategy, setViewStrategy] = useState(null);

  const handleToggleActive = async (strategyId, currentStatus) => {
    try {
      await updateStrategy(strategyId, { isActive: !currentStatus });
      showToast('Strategy status updated successfully', 'success');
      refresh();
    } catch (err) {
      showToast(err.message || 'Failed to update strategy', 'error');
    }
  };

  const handleEdit = async (strategyId, data) => {
    try {
      await updateStrategy(strategyId, data);
      showToast('Strategy updated successfully', 'success');
      refresh();
    } catch (err) {
      showToast(err.message || 'Failed to update strategy', 'error');
    }
  };

  const handleClone = async (clonedData) => {
    try {
      await createStrategy(clonedData);
      showToast('Strategy cloned successfully', 'success');
      refresh();
    } catch (err) {
      showToast(err.message || 'Failed to clone strategy', 'error');
    }
  };

  const handleDelete = async (strategyId) => {
    try {
      await deleteStrategy(strategyId);
      showToast('Strategy deleted successfully', 'success');
      refresh();
    } catch (err) {
      showToast(err.message || 'Failed to delete strategy', 'error');
    }
  };

  // Load subscriptions when component mounts
  useEffect(() => {
    const loadSubscriptions = async () => {
      setSubscriptionsLoading(true);
      try {
        const result = await strategySubscriptionService.getUserSubscriptions();
        if (result.success) {
          setSubscriptions(result.data);
        } else {
          console.error('Failed to load subscriptions:', result.error);
        }
      } catch (err) {
        console.error('Error loading subscriptions:', err);
      } finally {
        setSubscriptionsLoading(false);
      }
    };

    loadSubscriptions();
  }, []);

  // Handle subscription updates
  const handleUpdateSubscription = async (subscriptionId, lots) => {
    try {
      const result = await strategySubscriptionService.updateSubscription(subscriptionId, lots);
      if (result.success) {
        setSubscriptions(prev => prev.map(sub =>
          sub.id === subscriptionId ? { ...sub, lots } : sub
        ));
        showToast('Subscription updated successfully', 'success');
      } else {
        showToast(result.error || 'Failed to update subscription', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update subscription', 'error');
    }
  };

  // Handle unsubscribe
  const handleUnsubscribe = async (subscriptionId) => {
    try {
      const result = await strategySubscriptionService.unsubscribeFromStrategy(subscriptionId);
      if (result.success) {
        setSubscriptions(prev => prev.filter(sub => sub.id !== subscriptionId));
        showToast('Unsubscribed successfully', 'success');
      } else {
        showToast(result.error || 'Failed to unsubscribe', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to unsubscribe', 'error');
    }
  };

  if (loading || subscriptionsLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Alert severity="error" onClose={refresh}>
        {error}
      </Alert>
    );
  }

  const paginatedStrategies = strategies.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const paginatedSubscriptions = subscriptions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Dynamic cards based on active tab
  const getCards = () => {
    if (activeTab === 0) { // My Strategies
      return [
        {
          icon: <GroupIcon />,
          title: 'Total',
          digits: strategies.length.toString(),
          color: 'primary',
        },
        {
          icon: <CheckCircleIcon />,
          title: 'Active',
          digits: strategies.filter((s) => s.isActive).length.toString(),
          color: 'success',
        },
        {
          icon: <CancelIcon />,
          title: 'Inactive',
          digits: strategies.filter((s) => !s.isActive).length.toString(),
          color: 'error',
        },
        {
          icon: <PublicIcon />,
          title: 'Public',
          digits: strategies.filter((s) => s.isPublic).length.toString(),
          color: 'info',
        },
        {
          icon: <LockIcon />,
          title: 'Private',
          digits: strategies.filter((s) => !s.isPublic).length.toString(),
          color: 'secondary',
        },
      ];
    } else { // Subscribed Strategies
      return [
        {
          icon: <GroupIcon />,
          title: 'Subscribed',
          digits: subscriptions.length.toString(),
          color: 'primary',
        },
        {
          icon: <CheckCircleIcon />,
          title: 'Active',
          digits: subscriptions.filter((s) => s.isActive).length.toString(),
          color: 'success',
        },
        {
          icon: <CancelIcon />,
          title: 'Total Lots',
          digits: subscriptions.reduce((sum, s) => sum + (s.lots || 1), 0).toString(),
          color: 'info',
        },
      ];
    }
  };

  const cards = getCards();

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={2} mb={3}>
        {cards.map((card, index) => {
          const iconColor = theme.palette[card.color]?.main || theme.palette.primary.main;
          const gradientBg = `linear-gradient(135deg, ${iconColor}33, ${iconColor}22)`;

          return (
            <Grid size= {{xs:12 ,sm:4 ,lg:2.4}} key={index}>
              <Card
                elevation={3}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 4,
                  height: '100%',
                  background: gradientBg,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 8px 20px ${iconColor}44`,
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: iconColor,
                    color: theme.palette.common.white,
                    width: 48,
                    height: 48,
                    mr: 2,
                    boxShadow: `0 2px 6px ${iconColor}88`,
                  }}
                >
                  {card.icon}
                </Avatar>

                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    {card.title}
                  </Typography>
                  <Typography variant="h5" color="text.primary" fontWeight={700}>
                    {card.digits}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => {
          setActiveTab(newValue);
          setPage(0);
        }}>
          <Tab label="My Strategies" />
          <Tab label="Subscribed Strategies" />
        </Tabs>
      </Box>

      {/* Strategy Table */}
      <Paper variant="outlined">
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <TableContainer>
            <Table size="medium" sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  {activeTab === 0 ? (
                    <>
                      <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Visibility</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell sx={{ fontWeight: 'bold' }}>Creator</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Lots</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Subscribed At</TableCell>
                    </>
                  )}
                  <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeTab === 0 ? (
                  // My Strategies Tab
                  paginatedStrategies.map((strategy, index) => (
                    <TableRow key={strategy.id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>
                        <Typography fontWeight={600}>{strategy.name}</Typography>
                        {strategy.description && (
                          <Typography variant="caption" color="textSecondary">
                            {strategy.description.substring(0, 50)}...
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={strategy.strategyType || 'Intraday'}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={strategy.isActive}
                          onChange={() => handleToggleActive(strategy.id, strategy.isActive)}
                          color="success"
                          size="small"
                        />
                        <Typography
                          variant="caption"
                          color={strategy.isActive ? 'success.main' : 'error.main'}
                          fontWeight="bold"
                          ml={1}
                        >
                          {strategy.isActive ? 'Active' : 'Inactive'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={strategy.isPublic ? <PublicIcon /> : <LockIcon />}
                          label={strategy.isPublic ? 'Public' : 'Private'}
                          size="small"
                          color={strategy.isPublic ? 'info' : 'default'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{new Date(strategy.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Strategy" arrow>
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => setViewStrategy(strategy)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Clone Strategy" arrow>
                            <IconButton
                              color="secondary"
                              size="small"
                              onClick={() => setCloneStrategy(strategy)}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Strategy" arrow>
                            <IconButton
                              color="info"
                              size="small"
                              onClick={() => setEditStrategy(strategy)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Strategy" arrow>
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => setDeleteStrategyConfirm(strategy)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  // Subscribed Strategies Tab
                  paginatedSubscriptions.map((subscription, index) => (
                    <TableRow key={subscription.id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>
                        <Typography fontWeight={600}>{subscription.strategy?.name}</Typography>
                        {subscription.strategy?.description && (
                          <Typography variant="caption" color="textSecondary">
                            {subscription.strategy.description.substring(0, 50)}...
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {subscription.strategy?.user?.name || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          @{subscription.strategy?.user?.username || 'unknown'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={subscription.lots}
                          onChange={(e) => handleUpdateSubscription(subscription.id, parseInt(e.target.value))}
                          size="small"
                          sx={{ minWidth: 80 }}
                        >
                          {[1, 2, 3, 4, 5, 10, 20, 50, 100].map(num => (
                            <MenuItem key={num} value={num}>{num}</MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>{new Date(subscription.subscribedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Strategy" arrow>
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => setViewStrategy(subscription.strategy)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Unsubscribe" arrow>
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => setUnsubscribeDialog({ open: true, subscriptionId: subscription.id })}
                            >
                              <DeleteIcon fontSize="small" />
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
        </Box>

        {/* Pagination Controls */}
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
              {[5, 10, 25].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Typography>
            Showing {activeTab === 0 ? (
              strategies.length === 0 ? 0 : page * rowsPerPage + 1
            ) : (
              subscriptions.length === 0 ? 0 : page * rowsPerPage + 1
            )}-
            {activeTab === 0 ? (
              Math.min((page + 1) * rowsPerPage, strategies.length)
            ) : (
              Math.min((page + 1) * rowsPerPage, subscriptions.length)
            )} of {activeTab === 0 ? strategies.length : subscriptions.length}
          </Typography>

          <Pagination
            count={Math.ceil((activeTab === 0 ? strategies.length : subscriptions.length) / rowsPerPage)}
            page={page + 1}
            onChange={(e, value) => setPage(value - 1)}
            shape="rounded"
            color="primary"
          />
        </Box>
      </Paper>

      {/* Dialogs */}
      <ViewUserStrategyDialog
        open={Boolean(viewStrategy)}
        strategy={viewStrategy}
        onClose={() => setViewStrategy(null)}
        onEdit={setEditStrategy}
        onClone={setCloneStrategy}
        onToggleStatus={() => {
          setToggleStatusStrategy(viewStrategy);
          setViewStrategy(null);
        }}
      />

      <EditUserStrategyDialog
        open={Boolean(editStrategy)}
        strategy={editStrategy}
        onClose={() => setEditStrategy(null)}
        onSave={handleEdit}
      />

      <CloneStrategyDialog
        open={Boolean(cloneStrategy)}
        strategy={cloneStrategy}
        onClose={() => setCloneStrategy(null)}
        onClone={handleClone}
      />

      <DeleteUserStrategyConfirm
        open={Boolean(deleteStrategyConfirm)}
        strategy={deleteStrategyConfirm}
        onClose={() => setDeleteStrategyConfirm(null)}
        onConfirm={handleDelete}
      />

      <ToggleStatusConfirmDialog
        open={Boolean(toggleStatusStrategy)}
        strategy={toggleStatusStrategy}
        onClose={() => setToggleStatusStrategy(null)}
        onConfirm={handleToggleActive}
      />

      {/* Confirmation Dialog for Unsubscribe */}
      <Dialog
        open={unsubscribeDialog.open}
        onClose={() => setUnsubscribeDialog({ open: false, subscriptionId: null })}
      >
        <DialogTitle>Confirm Unsubscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to unsubscribe from this strategy? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUnsubscribeDialog({ open: false, subscriptionId: null })}>
            Cancel
          </Button>
          <Button onClick={() => {
            handleUnsubscribe(unsubscribeDialog.subscriptionId);
            setUnsubscribeDialog({ open: false, subscriptionId: null });
          }} color="error" variant="contained">
            Unsubscribe
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserStrategyInfo;