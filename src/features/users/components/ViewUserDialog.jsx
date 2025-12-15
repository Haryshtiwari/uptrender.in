import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Divider,
  Chip,
  Box,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Close,
  Email,
  Phone,
  Person,
  AccountCircle,
  CheckCircle,
  Cancel,
  CreditCard,
  CalendarToday,
} from '@mui/icons-material';
import { formatDate } from '../../../utils/formatDate';

const ViewUserDialog = ({ open, onClose, user }) => {
  if (!user) return null;

  const InfoRow = ({ icon, label, value }) => {
    const IconComponent = icon;
    return (
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconComponent fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {label}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="body1">{value || 'N/A'}</Typography>
        </Grid>
      </Grid>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">User Details</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Header with Avatar */}
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Avatar
            src={user.avatar}
            alt={user.name}
            sx={{ width: 80, height: 80, fontSize: '2rem' }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5">{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
            <Box display="flex" gap={1} mt={1}>
              <Chip
                label={user.role}
                color={user.role === 'Admin' ? 'secondary' : 'primary'}
                size="small"
              />
              <Chip
                label={user.status}
                color={user.status === 'Active' ? 'success' : 'error'}
                size="small"
                icon={user.status === 'Active' ? <CheckCircle /> : <Cancel />}
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Personal Information */}
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <InfoRow icon={Email} label="Email" value={user.email} />
        <InfoRow icon={Phone} label="Phone" value={user.phone} />
        <InfoRow icon={Person} label="Role" value={user.role} />
        <InfoRow 
          icon={AccountCircle} 
          label="Status" 
          value={
            <Chip
              label={user.status}
              color={user.status === 'Active' ? 'success' : 'error'}
              size="small"
            />
          } 
        />

        <Divider sx={{ my: 3 }} />

        {/* Verification Status */}
        <Typography variant="h6" gutterBottom>
          Verification Status
        </Typography>
        <InfoRow
          icon={CheckCircle}
          label="Email Verified"
          value={
            <Chip
              label={user.emailVerified ? 'Verified' : 'Not Verified'}
              color={user.emailVerified ? 'success' : 'warning'}
              size="small"
            />
          }
        />
        <InfoRow
          icon={CheckCircle}
          label="Phone Verified"
          value={
            <Chip
              label={user.phoneVerified ? 'Verified' : 'Not Verified'}
              color={user.phoneVerified ? 'success' : 'warning'}
              size="small"
            />
          }
        />

        <Divider sx={{ my: 3 }} />

        {/* Subscription Information */}
        <Typography variant="h6" gutterBottom>
          Subscription & Wallet
        </Typography>
        <InfoRow
          icon={CreditCard}
          label="Plan"
          value={
            <Box>
              <Typography variant="body1">
                {user.plan?.name || 'Free'}
              </Typography>
              {user.plan?.price > 0 && (
                <Typography variant="caption" color="text.secondary">
                  ₹{Number(user.plan.price).toFixed(2)} · {user.plan.type}
                </Typography>
              )}
              {user.plan?.startDate && user.plan?.endDate && (
                <Typography variant="caption" color="text.secondary">
                  {formatDate(user.plan.startDate)} - {formatDate(user.plan.endDate)}
                </Typography>
              )}
            </Box>
          }
        />
        <InfoRow
          icon={AccountCircle}
          label="Subscription"
          value={
            <Chip
              label={user.subscription}
              color={user.subscription === 'Subscribed' ? 'success' : 'default'}
              size="small"
            />
          }
        />
        <InfoRow
          icon={CreditCard}
          label="Wallet Balance"
          value={`${user.wallet?.currency === 'USD' ? '$' : '₹'}${Number(user.wallet?.balance ?? 0).toFixed(2)}`}
        />

        <Divider sx={{ my: 3 }} />

        {/* Account Information */}
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>
        <InfoRow
          icon={CalendarToday}
          label="Joined Date"
          value={formatDate(user.joinedDate)}
        />
        <InfoRow icon={Person} label="User ID" value={user.id} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewUserDialog;
