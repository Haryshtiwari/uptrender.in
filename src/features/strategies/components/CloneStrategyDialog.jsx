import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Close as CloseIcon, ContentCopy } from '@mui/icons-material';

const CloneStrategyDialog = ({ open, onClose, strategy, onClone }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: false,
    isPublic: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (strategy) {
      setFormData({
        name: `${strategy.name} (Copy)`,
        description: strategy.description || '',
        isActive: false,
        isPublic: false,
      });
    }
  }, [strategy]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const cloneData = {
        ...strategy,
        ...formData,
        id: undefined, // Remove ID so backend creates new
        createdAt: undefined,
        updatedAt: undefined,
      };
      
      await onClone(cloneData);
      onClose();
    } catch (error) {
      console.error('Error cloning strategy:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!strategy) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <ContentCopy color="primary" />
            <Typography variant="h6">Clone Strategy</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Alert severity="info" sx={{ mb: 2 }}>
            Create a copy of "{strategy.name}" with all its settings. You can customize the name and description.
          </Alert>

          <TextField
            fullWidth
            label="New Strategy Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
            helperText="Give your cloned strategy a unique name"
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            sx={{ mb: 2 }}
            placeholder="Describe this cloned strategy..."
          />

          <Box sx={{ mb: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleChange}
                  name="isActive"
                  color="success"
                />
              }
              label="Activate immediately"
            />
          </Box>

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isPublic}
                  onChange={handleChange}
                  name="isPublic"
                  color="info"
                />
              }
              label="Make public"
            />
          </Box>

          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="caption">
              <strong>Note:</strong> All strategy parameters (segment, capital, symbol, legs) will be copied from the original strategy.
            </Typography>
          </Alert>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={<ContentCopy />}
          >
            {isSubmitting ? 'Cloning...' : 'Clone Strategy'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CloneStrategyDialog;
