import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  TextField,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Close as CloseIcon, Save } from '@mui/icons-material';

const SaveDraftDialog = ({ open, onClose, onSave, strategyData }) => {
  const [draftName, setDraftName] = useState('');
  const [autoSave, setAutoSave] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!draftName.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({ name: draftName, autoSave, data: strategyData });
      onClose();
      setDraftName('');
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <Save color="primary" />
            <Typography variant="h6">Save Draft</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          autoFocus
          fullWidth
          label="Draft Name"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          placeholder="Enter a name for this draft"
          sx={{ mb: 2 }}
          helperText="Give your draft a descriptive name for easy identification"
        />

        <FormControlLabel
          control={
            <Switch
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
            />
          }
          label="Enable auto-save (saves every 2 minutes)"
        />
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!draftName.trim() || isSubmitting}
          startIcon={<Save />}
        >
          {isSubmitting ? 'Saving...' : 'Save Draft'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveDraftDialog;
