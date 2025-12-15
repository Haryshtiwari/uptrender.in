import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Badge,
} from '@mui/material';
import {
  Close as CloseIcon,
  Notifications,
  TrendingUp,
  ShowChart,
  Settings,
  Warning,
  CheckCircle,
  Info,
  Delete,
  MarkEmailRead,
} from '@mui/icons-material';

const NotificationsPanel = ({ open, onClose, notifications = [] }) => {
  const [filter, setFilter] = useState('all');

  // Mock notifications if none provided
  const defaultNotifications = [
    {
      id: 1,
      type: 'trade',
      title: 'Trade Executed',
      message: 'Your buy order for NIFTY 21000 CE has been executed',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
    },
    {
      id: 2,
      type: 'strategy',
      title: 'Strategy Alert',
      message: 'Iron Condor strategy has reached 80% profit target',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
    },
    {
      id: 3,
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance on Sunday 2:00 AM - 4:00 AM',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: 4,
      type: 'trade',
      title: 'Stop Loss Hit',
      message: 'Stop loss triggered for BANKNIFTY 45000 PE',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: 5,
      type: 'strategy',
      title: 'New Subscriber',
      message: 'Your strategy "Weekly Options" gained a new subscriber',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: false,
    },
  ];

  const displayNotifications = notifications.length > 0 ? notifications : defaultNotifications;

  const filteredNotifications =
    filter === 'all'
      ? displayNotifications
      : displayNotifications.filter((n) => n.type === filter);

  const unreadCount = displayNotifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'trade':
        return <TrendingUp color="primary" />;
      case 'strategy':
        return <ShowChart color="success" />;
      case 'system':
        return <Settings color="action" />;
      default:
        return <Info color="info" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'trade':
        return 'primary';
      case 'strategy':
        return 'success';
      case 'system':
        return 'default';
      default:
        return 'info';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleMarkAllRead = () => {
    console.log('Mark all as read');
  };

  const handleClearAll = () => {
    console.log('Clear all notifications');
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Badge badgeContent={unreadCount} color="error">
              <Notifications />
            </Badge>
            <Typography variant="h6">Notifications</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Filters */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(e, newFilter) => newFilter && setFilter(newFilter)}
            size="small"
            fullWidth
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="trade">Trades</ToggleButton>
            <ToggleButton value="strategy">Strategies</ToggleButton>
            <ToggleButton value="system">System</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Actions */}
        <Box sx={{ p: 1.5, display: 'flex', gap: 1 }}>
          <Button
            size="small"
            startIcon={<MarkEmailRead />}
            onClick={handleMarkAllRead}
            fullWidth
          >
            Mark All Read
          </Button>
          <Button
            size="small"
            startIcon={<Delete />}
            onClick={handleClearAll}
            color="error"
            fullWidth
          >
            Clear All
          </Button>
        </Box>

        <Divider />

        {/* Notifications List */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {filteredNotifications.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                p: 3,
              }}
            >
              <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                All Caught Up!
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                You have no {filter === 'all' ? '' : filter} notifications
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredNotifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      bgcolor: notification.read ? 'transparent' : 'action.hover',
                      '&:hover': { bgcolor: 'action.selected' },
                      cursor: 'pointer',
                      py: 2,
                    }}
                  >
                    <ListItemIcon>{getIcon(notification.type)}</ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="start">
                          <Typography
                            variant="subtitle2"
                            fontWeight={notification.read ? 400 : 600}
                          >
                            {notification.title}
                          </Typography>
                          <Chip
                            label={notification.type}
                            size="small"
                            color={getTypeColor(notification.type)}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5, mb: 0.5 }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimestamp(notification.timestamp)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default NotificationsPanel;
