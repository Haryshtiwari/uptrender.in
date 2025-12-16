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
    description: '', 
    type: 'Private',
    price: null,
    isFree: false,
    instrumentType: '',
    symbol: '',
    marketType: '',
    strike: '',
    expiry: '',
    orderType: '',
    quantity: '',
    stopLossPercent: '',
    targetPercent: ''
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
        navigate('/user/strategy-info', { state: { tab: 1 } }); // Navigate to My Strategies tab
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
    <Box sx={{ p: 2, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' } }}>
        {/* Main Create Strategy Form */}
        <Paper elevation={2} sx={{ p: 2.5 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Create Strategy</Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          {/* Name Field - Full Width */}
          <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
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
              size="small"
              placeholder="e.g., Iron Condor Weekly"
              value={form.name}
              onChange={handleChange('name')}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Box>

          {/* Segment Field */}
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
              size="small"
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

          {/* Capital Field */}
          <Box>
            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
              <Typography variant="body2" color="text.secondary">
                Minimum Capital
              </Typography>
              <Tooltip title="Minimum capital required (₹10,000 minimum)">
                <IconButton size="small">
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              fullWidth
              size="small"
              type="number"
              placeholder="e.g., 50000"
              value={form.capital}
              onChange={handleChange('capital')}
              error={!!errors.capital}
              helperText={errors.capital || 'Min ₹10,000'}
              inputProps={{ min: 10000 }}
            />
          </Box>





          {/* Type Field */}
          <Box>
            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
              <Typography variant="body2" color="text.secondary">
                Visibility
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
              size="small"
              value={form.type}
              onChange={handleChange('type')}
            >
              <MenuItem value="Private">Private</MenuItem>
              <MenuItem value="Public">Public</MenuItem>
            </TextField>
          </Box>

          {/* Pricing Fields - Only show when Public */}
          {form.type === 'Public' && (
            <Box>
              <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                <Typography variant="body2" color="text.secondary">
                  Price (₹)
                </Typography>
                <Tooltip title="Set subscription price (0 for free)">
                  <IconButton size="small">
                    <Info fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                fullWidth
                size="small"
                type="number"
                placeholder="e.g., 499"
                value={form.price || ''}
                onChange={(e) => {
                  setForm((f) => ({ 
                    ...f, 
                    price: e.target.value ? Number(e.target.value) : null,
                    isFree: false
                  }));
                }}
                inputProps={{ min: 0, step: 1 }}
                helperText="0 for free"
              />
            </Box>
          )}

          {/* Description Field - Full Width */}
          <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
              <Typography variant="body2" color="text.secondary">
                Description
              </Typography>
              <Tooltip title="Strategy logic and approach">
                <IconButton size="small">
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              fullWidth
              size="small"
              multiline
              rows={3}
              placeholder="Describe your strategy, entry/exit rules, risk management..."
              value={form.description}
              onChange={handleChange('description')}
              error={!!errors.description}
              helperText={errors.description || 'Min 10 characters'}
            />
          </Box>

          <Divider sx={{ my: 1.5, gridColumn: { xs: '1', md: '1 / -1' } }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, gridColumn: { xs: '1', md: '1 / -1' } }}>
            <Button 
              variant="outlined" 
              size="medium"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="medium"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Strategy'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Strategy Selector Panel */}
      <Paper elevation={2} sx={{ p: 2.5, height: 'fit-content' }}>
        <Typography variant="h6" mb={2}>Strategy Options</Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Segment Selection */}
          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Segment *
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {['Crypto', 'Forex', 'Indian'].map((segment) => (
                <Button
                  key={segment}
                  variant={form.segment === segment ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setForm(f => ({ 
                    ...f, 
                    segment,
                    // Reset dependent fields when segment changes
                    instrumentType: '',
                    symbol: '',
                    marketType: '',
                    strike: '',
                    expiry: ''
                  }))}
                  sx={{ textTransform: 'none' }}
                >
                  {segment}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Instrument Type - Conditional based on segment */}
          {form.segment && (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Instrument Type *
              </Typography>
              <TextField
                fullWidth
                select
                size="small"
                value={form.instrumentType || ''}
                onChange={(e) => setForm(f => ({ 
                  ...f, 
                  instrumentType: e.target.value,
                  // Reset dependent fields
                  strike: '',
                  expiry: ''
                }))}
              >
                {form.segment === 'Indian' && [
                  <MenuItem key="fut" value="FUT">Futures (F&O)</MenuItem>,
                  <MenuItem key="cash" value="CASH">Cash (Equity)</MenuItem>,
                  <MenuItem key="opt" value="OPT">Options (F&O)</MenuItem>
                ]}
                {form.segment === 'Crypto' && [
                  <MenuItem key="spot" value="SPOT">Spot</MenuItem>,
                  <MenuItem key="futures" value="FUTURES">Futures</MenuItem>,
                  <MenuItem key="perpetual" value="PERPETUAL">Perpetual</MenuItem>
                ]}
                {form.segment === 'Forex' && [
                  <MenuItem key="spot" value="SPOT">Spot</MenuItem>,
                  <MenuItem key="forward" value="FORWARD">Forward</MenuItem>,
                  <MenuItem key="options" value="OPTIONS">Options</MenuItem>
                ]}
              </TextField>
            </Box>
          )}

          {/* Symbol Input */}
          {form.segment && (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Symbol *
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder={
                  form.segment === 'Indian' ? 'e.g., NIFTY, BANKNIFTY, RELIANCE' :
                  form.segment === 'Crypto' ? 'e.g., BTCUSDT, ETHUSDT' :
                  'e.g., EURUSD, GBPUSD'
                }
                value={form.symbol || ''}
                onChange={(e) => setForm(f => ({ ...f, symbol: e.target.value.toUpperCase() }))}
              />
            </Box>
          )}

          {/* Market Type - Only for Indian segment */}
          {form.segment === 'Indian' && (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Market Type *
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['Intraday', 'Carry'].map((type) => (
                  <Button
                    key={type}
                    variant={form.marketType === type ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setForm(f => ({ ...f, marketType: type }))}
                    sx={{ textTransform: 'none' }}
                  >
                    {type}
                  </Button>
                ))}
              </Box>
            </Box>
          )}

          {/* Strike Price - Only for Indian Options */}
          {form.segment === 'Indian' && form.instrumentType === 'OPT' && (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Strike Price
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                placeholder="e.g., 21000, 22000"
                value={form.strike || ''}
                onChange={(e) => setForm(f => ({ ...f, strike: e.target.value }))}
                inputProps={{ step: 50 }}
              />
            </Box>
          )}

          {/* Expiry - Only for Indian FUT/OPT */}
          {form.segment === 'Indian' && (form.instrumentType === 'FUT' || form.instrumentType === 'OPT') && (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Expiry *
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={form.expiry || ''}
                onChange={(e) => setForm(f => ({ ...f, expiry: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          )}

          {/* Order Type */}
          {form.segment && (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Order Type *
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['Buy', 'Sell', 'Auto'].map((order) => (
                  <Button
                    key={order}
                    variant={form.orderType === order ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setForm(f => ({ ...f, orderType: order }))}
                    sx={{ 
                      textTransform: 'none',
                      color: order === 'Buy' ? 'success.main' : order === 'Sell' ? 'error.main' : 'primary.main',
                      borderColor: order === 'Buy' ? 'success.main' : order === 'Sell' ? 'error.main' : 'primary.main',
                    }}
                  >
                    {order}
                  </Button>
                ))}
              </Box>
            </Box>
          )}

          {/* Quantity */}
          {form.segment && (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Quantity
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                placeholder={
                  form.segment === 'Indian' && form.instrumentType === 'OPT' ? 'Lots (e.g., 1, 2)' :
                  form.segment === 'Indian' && form.instrumentType === 'CASH' ? 'Shares (e.g., 100)' :
                  'Quantity'
                }
                value={form.quantity || ''}
                onChange={(e) => setForm(f => ({ ...f, quantity: e.target.value }))}
                inputProps={{ min: 1 }}
              />
            </Box>
          )}

          {/* Risk Management */}
          {form.segment && (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Risk Management
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                <TextField
                  size="small"
                  label="Stop Loss %"
                  type="number"
                  placeholder="5"
                  value={form.stopLossPercent || ''}
                  onChange={(e) => setForm(f => ({ ...f, stopLossPercent: e.target.value }))}
                  inputProps={{ min: 0, max: 100, step: 0.1 }}
                />
                <TextField
                  size="small"
                  label="Target %"
                  type="number"
                  placeholder="10"
                  value={form.targetPercent || ''}
                  onChange={(e) => setForm(f => ({ ...f, targetPercent: e.target.value }))}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Box>
            </Box>
          )}

          {/* Quick Templates */}
          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Quick Setup
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setForm(f => ({ 
                  ...f, 
                  segment: 'Indian',
                  instrumentType: 'OPT',
                  symbol: 'NIFTY',
                  marketType: 'Intraday',
                  orderType: 'Buy',
                  stopLossPercent: '20',
                  targetPercent: '50'
                }))}
                sx={{ textTransform: 'none' }}
              >
                Nifty Options Intraday
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setForm(f => ({ 
                  ...f, 
                  segment: 'Indian',
                  instrumentType: 'CASH',
                  symbol: 'RELIANCE',
                  marketType: 'Carry',
                  orderType: 'Buy',
                  stopLossPercent: '5',
                  targetPercent: '15'
                }))}
                sx={{ textTransform: 'none' }}
              >
                Equity Positional
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setForm(f => ({ 
                  ...f, 
                  segment: 'Crypto',
                  instrumentType: 'SPOT',
                  symbol: 'BTCUSDT',
                  orderType: 'Auto',
                  stopLossPercent: '3',
                  targetPercent: '8'
                }))}
                sx={{ textTransform: 'none' }}
              >
                Bitcoin Spot
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      </Box>

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
