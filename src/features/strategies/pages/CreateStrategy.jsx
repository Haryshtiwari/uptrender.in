import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  MenuItem, 
  Typography, 
  Tooltip, 
  IconButton,
  Paper,
  Divider,
  ButtonGroup,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  Info, 
  Save, 
  Science, 
  Timeline, 
  Category,
} from '@mui/icons-material';
import { strategyService } from '../../../services/strategyService';
import { useToast } from '../../../hooks/useToast';
import Loader from '../../../components/common/Loader';
import SaveDraftDialog from '../components/SaveDraftDialog';
import TestStrategyDialog from '../components/TestStrategyDialog';
import BacktestDialog from '../components/BacktestDialog';
import TemplateSelectionDialog from '../components/TemplateSelectionDialog';

// Yup-like validation
const validate = (form) => {
  const errors = {};
  
  if (!form.name || form.name.trim().length < 3) {
    errors.name = 'Strategy name must be at least 3 characters';
  }
  
  if (!form.segment || form.segment.trim().length === 0) {
    errors.segment = 'Segment is required';
  } else if (!['Crypto', 'Forex', 'Indian'].includes(form.segment)) {
    errors.segment = 'Invalid segment selected';
  }
  
  if (!form.capital || Number(form.capital) < 10000) {
    errors.capital = 'Minimum capital is ₹10,000';
  }
  
  if (!form.symbol || form.symbol.trim().length === 0) {
    errors.symbol = 'Symbol is required';
  }
  
  if (!form.legs || Number(form.legs) < 1 || Number(form.legs) > 10) {
    errors.legs = 'Number of legs must be between 1 and 10';
  }
  
  if (!form.description || form.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }
  
  return errors;
};

export default function CreateStrategy() {
  const [form, setForm] = useState({ 
    name: '', 
    segment: '', 
    capital: '', 
    symbol: '', 
    legs: 1, 
    description: '', 
    type: 'Private' 
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Dialog states
  const [saveDraftOpen, setSaveDraftOpen] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [backtestOpen, setBacktestOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);

  const handleChange = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    // Clear error for this field
    if (errors[k]) {
      setErrors((prev) => ({ ...prev, [k]: '' }));
    }
  };

  const handleSubmit = async () => {
    // Validate form
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast('Please fix validation errors', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form, capital: Number(form.capital), legs: Number(form.legs) };
      const res = await strategyService.createStrategy(payload);
      if (res.success) {
        showToast('Strategy created successfully!', 'success');
        navigate('/user/marketplace');
      } else {
        showToast(res.error || res.message || 'Failed to create strategy', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error creating strategy', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async (draftData) => {
    try {
      // TODO: Implement draft save API
      console.log('Saving draft:', draftData);
      showToast('Draft saved successfully!', 'success');
    } catch {
      showToast('Failed to save draft', 'error');
    }
  };

  const handleTest = async (testData) => {
    try {
      // TODO: Implement test API
      console.log('Testing strategy:', testData);
      showToast(`${testData.mode === 'paper' ? 'Paper' : 'Live'} test started!`, 'success');
    } catch {
      showToast('Failed to start test', 'error');
    }
  };

  const handleBacktest = async (backtestData) => {
    try {
      // TODO: Implement backtest API
      console.log('Running backtest:', backtestData);
      showToast('Backtest completed!', 'success');
    } catch {
      showToast('Failed to run backtest', 'error');
    }
  };

  const handleSelectTemplate = (templateData) => {
    setForm((prev) => ({
      ...prev,
      ...templateData,
    }));
    showToast('Template applied successfully!', 'success');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">Create Strategy</Typography>
          <Button
            variant="outlined"
            startIcon={<Category />}
            onClick={() => setTemplateOpen(true)}
          >
            Use Template
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'grid', gap: 2.5 }}>
          {/* Name Field with Tooltip */}
          <Box>
            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
              <Typography variant="body2" color="text.secondary">
                Strategy Name
              </Typography>
              <Tooltip title="Enter a unique and descriptive name for your strategy">
                <IconButton size="small">
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              fullWidth
              placeholder="e.g., Iron Condor Weekly"
              value={form.name}
              onChange={handleChange('name')}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Box>

          {/* Segment Field with Tooltip */}
          <Box>
            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
              <Typography variant="body2" color="text.secondary">
                Market Segment
              </Typography>
              <Tooltip title="Select the market segment where this strategy will operate">
                <IconButton size="small">
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              fullWidth
              select
              value={form.segment}
              onChange={handleChange('segment')}
              error={!!errors.segment}
              helperText={errors.segment}
            >
              <MenuItem value="Crypto">Crypto</MenuItem>
              <MenuItem value="Forex">Forex</MenuItem>
              <MenuItem value="Indian">Indian (Equity/F&O)</MenuItem>
            </TextField>
          </Box>

          {/* Capital Field with Tooltip */}
          <Box>
            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
              <Typography variant="body2" color="text.secondary">
                Minimum Capital Required
              </Typography>
              <Tooltip title="Minimum capital required to execute this strategy (₹10,000 minimum)">
                <IconButton size="small">
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              fullWidth
              type="number"
              placeholder="e.g., 50000"
              value={form.capital}
              onChange={handleChange('capital')}
              error={!!errors.capital}
              helperText={errors.capital || 'Minimum ₹10,000'}
              inputProps={{ min: 10000 }}
            />
          </Box>

          {/* Symbol Field with Tooltip */}
          <Box>
            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
              <Typography variant="body2" color="text.secondary">
                Trading Symbol
              </Typography>
              <Tooltip title="Enter the primary trading symbol or instrument for this strategy">
                <IconButton size="small">
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              fullWidth
              placeholder="e.g., NIFTY, BANKNIFTY"
              value={form.symbol}
              onChange={handleChange('symbol')}
              error={!!errors.symbol}
              helperText={errors.symbol}
            />
          </Box>

          {/* Legs Field with Tooltip */}
          <Box>
            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
              <Typography variant="body2" color="text.secondary">
                Number of Legs
              </Typography>
              <Tooltip title="Number of individual positions in this strategy (1-10)">
                <IconButton size="small">
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              fullWidth
              type="number"
              value={form.legs}
              onChange={handleChange('legs')}
              error={!!errors.legs}
              helperText={errors.legs || 'Between 1 and 10'}
              inputProps={{ min: 1, max: 10 }}
            />
          </Box>

          {/* Type Field with Tooltip */}
          <Box>
            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
              <Typography variant="body2" color="text.secondary">
                Strategy Visibility
              </Typography>
              <Tooltip title="Private: Only you can see. Public: Visible in marketplace">
                <IconButton size="small">
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              fullWidth
              select
              value={form.type}
              onChange={handleChange('type')}
            >
              <MenuItem value="Private">Private</MenuItem>
              <MenuItem value="Public">Public</MenuItem>
            </TextField>
          </Box>

          {/* Description Field with Tooltip */}
          <Box>
            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
              <Typography variant="body2" color="text.secondary">
                Strategy Description
              </Typography>
              <Tooltip title="Detailed description of your strategy logic and approach">
                <IconButton size="small">
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Describe your strategy, entry/exit rules, risk management..."
              value={form.description}
              onChange={handleChange('description')}
              error={!!errors.description}
              helperText={errors.description || 'Minimum 10 characters'}
            />
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Action Buttons */}
          <Box display="flex" justifyContent="space-between" gap={2}>
            <ButtonGroup variant="outlined" size="large">
              <Button
                startIcon={<Save />}
                onClick={() => setSaveDraftOpen(true)}
              >
                Save Draft
              </Button>
              <Button
                startIcon={<Science />}
                onClick={() => setTestDialogOpen(true)}
              >
                Test
              </Button>
              <Button
                startIcon={<Timeline />}
                onClick={() => setBacktestOpen(true)}
              >
                Backtest
              </Button>
            </ButtonGroup>

            <Box display="flex" gap={2}>
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Strategy'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Dialogs */}
      <SaveDraftDialog
        open={saveDraftOpen}
        onClose={() => setSaveDraftOpen(false)}
        onSave={handleSaveDraft}
        strategyData={form}
      />

      <TestStrategyDialog
        open={testDialogOpen}
        onClose={() => setTestDialogOpen(false)}
        onTest={handleTest}
        strategy={{ ...form, id: 'draft' }}
      />

      <BacktestDialog
        open={backtestOpen}
        onClose={() => setBacktestOpen(false)}
        onBacktest={handleBacktest}
        strategy={{ ...form, id: 'draft' }}
      />

      <TemplateSelectionDialog
        open={templateOpen}
        onClose={() => setTemplateOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {loading && <Loader message="Creating strategy..." />}
    </Box>
  );
}
