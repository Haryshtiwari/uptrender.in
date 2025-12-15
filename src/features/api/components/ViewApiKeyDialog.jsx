import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Chip, Avatar, Divider, IconButton
} from '@mui/material';
import { Close as CloseIcon, CheckCircle, Cancel, VpnKey, Person, Business } from '@mui/icons-material';

const InfoRow = ({ label, value, icon: Icon }) => (
  <Box display="flex" alignItems="center" py={1}>
    {Icon && <Icon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />}
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value || 'N/A'}
      </Typography>
    </Box>
  </Box>
);

const ViewApiKeyDialog = ({ open, onClose, apiKey }) => {
  if (!apiKey) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <VpnKey />
            </Avatar>
            <Box>
              <Typography variant="h6">{apiKey.brokerName}</Typography>
              <Typography variant="caption" color="text.secondary">
                API Key Details
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Status Section */}
        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Status
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Chip
              label={apiKey.status}
              color={apiKey.status === 'Active' ? 'success' : 'default'}
              size="small"
              icon={apiKey.status === 'Active' ? <CheckCircle /> : <Cancel />}
            />
            <Chip
              label={apiKey.isVerified ? 'Verified' : 'Not Verified'}
              color={apiKey.isVerified ? 'success' : 'warning'}
              size="small"
              variant="outlined"
            />
            {apiKey.isDefault && (
              <Chip label="Default" color="primary" size="small" variant="outlined" />
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* User Information */}
        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            User Information
          </Typography>
          <InfoRow
            label="Username"
            value={apiKey.user?.username}
            icon={Person}
          />
          <InfoRow
            label="Email"
            value={apiKey.user?.email}
            icon={Person}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Broker Details */}
        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Broker Details
          </Typography>
          <InfoRow
            label="Broker Name"
            value={apiKey.brokerName}
            icon={Business}
          />
          <InfoRow
            label="Segment"
            value={apiKey.segment}
            icon={Business}
          />
          {apiKey.broker && (
            <InfoRow
              label="Broker ID"
              value={apiKey.broker.id}
              icon={Business}
            />
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Timestamps */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Timestamps
          </Typography>
          <InfoRow
            label="Created At"
            value={new Date(apiKey.createdAt).toLocaleString()}
          />
          <InfoRow
            label="Last Updated"
            value={new Date(apiKey.updatedAt).toLocaleString()}
          />
        </Box>

        {/* Additional Data */}
        {apiKey.additionalData && Object.keys(apiKey.additionalData).length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Additional Information
              </Typography>
              <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1 }}>
                <pre style={{ margin: 0, fontSize: '0.75rem', overflow: 'auto' }}>
                  {JSON.stringify(apiKey.additionalData, null, 2)}
                </pre>
              </Box>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewApiKeyDialog;
