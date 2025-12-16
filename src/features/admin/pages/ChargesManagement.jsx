import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import { Save, IndianRupee } from 'lucide-react';
import Breadcrumb from '../../../components/layout/full/shared/breadcrumb/Breadcrumb';
import { useToast } from '../../../hooks/useToast';
import chargeService from '../../../services/chargeService';

const ChargesManagement = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [charges, setCharges] = useState({
    api_key: { amount: 0, isActive: true, description: '' },
    copy_trading_account: { amount: 0, isActive: true, description: '' }
  });

  useEffect(() => {
    fetchCharges();
  }, []);

  const fetchCharges = async () => {
    setLoading(true);
    try {
      const response = await chargeService.getAllCharges();
      if (response.success) {
        const chargesMap = {};
        response.data.forEach(charge => {
          chargesMap[charge.chargeType] = {
            amount: parseFloat(charge.amount),
            isActive: charge.isActive,
            description: charge.description || ''
          };
        });
        setCharges(prev => ({ ...prev, ...chargesMap }));
      }
    } catch (error) {
      showToast('Failed to load charges', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (chargeType, field, value) => {
    setCharges(prev => ({
      ...prev,
      [chargeType]: {
        ...prev[chargeType],
        [field]: value
      }
    }));
  };

  const handleSave = async (chargeType) => {
    setSaving(true);
    try {
      const response = await chargeService.upsertCharge({
        chargeType,
        amount: charges[chargeType].amount,
        isActive: charges[chargeType].isActive,
        description: charges[chargeType].description
      });

      if (response.success) {
        showToast(response.message || 'Charge saved successfully', 'success');
        fetchCharges();
      } else {
        showToast(response.message || 'Failed to save charge', 'error');
      }
    } catch (error) {
      showToast('Error saving charge', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      <Breadcrumb title="Charges Management" />

      <Box px={4} mt={4}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Configure charges that will be automatically deducted from user wallets when they add API keys or copy trading accounts.
        </Alert>

        <Grid container spacing={3}>
          {/* API Key Charge */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <IndianRupee size={20} />
                    <Typography variant="h6">API Key Addition Charge</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Box display="flex" flexDirection="column" gap={3}>
                  <TextField
                    label="Charge Amount"
                    type="number"
                    fullWidth
                    value={charges.api_key.amount}
                    onChange={(e) => handleChange('api_key', 'amount', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    helperText="Amount to deduct when user adds a new API key"
                  />

                  <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={2}
                    value={charges.api_key.description}
                    onChange={(e) => handleChange('api_key', 'description', e.target.value)}
                    helperText="Optional description for this charge"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={charges.api_key.isActive}
                        onChange={(e) => handleChange('api_key', 'isActive', e.target.checked)}
                      />
                    }
                    label="Enable API Key Charge"
                  />

                  <Button
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={16} /> : <Save size={16} />}
                    onClick={() => handleSave('api_key')}
                    disabled={saving}
                    fullWidth
                  >
                    Save API Key Charge
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Copy Trading Account Charge */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <IndianRupee size={20} />
                    <Typography variant="h6">Copy Trading Account Charge</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Box display="flex" flexDirection="column" gap={3}>
                  <TextField
                    label="Charge Amount"
                    type="number"
                    fullWidth
                    value={charges.copy_trading_account.amount}
                    onChange={(e) => handleChange('copy_trading_account', 'amount', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    helperText="Amount to deduct when user adds a copy trading account"
                  />

                  <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={2}
                    value={charges.copy_trading_account.description}
                    onChange={(e) => handleChange('copy_trading_account', 'description', e.target.value)}
                    helperText="Optional description for this charge"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={charges.copy_trading_account.isActive}
                        onChange={(e) => handleChange('copy_trading_account', 'isActive', e.target.checked)}
                      />
                    }
                    label="Enable Copy Trading Charge"
                  />

                  <Button
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={16} /> : <Save size={16} />}
                    onClick={() => handleSave('copy_trading_account')}
                    disabled={saving}
                    fullWidth
                  >
                    Save Copy Trading Charge
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ChargesManagement;
