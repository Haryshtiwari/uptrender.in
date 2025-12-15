import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  CheckCircle,
  Close as CloseIcon,
  Star,
} from '@mui/icons-material';
import planService from '../../../services/planService';

const UpgradePlanDialog = ({ open, onClose, currentPlan, onUpgrade }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPlans();
    }
  }, [open]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const result = await planService.getAvailablePlans();
      if (result.success) {
        setPlans(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!selectedPlan) return;

    setIsSubmitting(true);
    try {
      await onUpgrade(selectedPlan, billingCycle);
      onClose();
    } catch (error) {
      console.error('Error upgrading plan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlanPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const calculateSavings = (plan) => {
    const monthly = plan.monthlyPrice * 12;
    const yearly = plan.yearlyPrice;
    return Math.round(((monthly - yearly) / monthly) * 100);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={700}>
            Upgrade Your Plan
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Choose the plan that best fits your trading needs
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Billing Cycle Toggle */}
            <Box textAlign="center" mb={4}>
              <RadioGroup
                row
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value)}
                sx={{ justifyContent: 'center' }}
              >
                <FormControlLabel
                  value="monthly"
                  control={<Radio />}
                  label="Monthly"
                />
                <FormControlLabel
                  value="yearly"
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      Yearly
                      <Chip
                        label="Save up to 20%"
                        size="small"
                        color="success"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  }
                />
              </RadioGroup>
            </Box>

            {/* Plans Grid */}
            <Grid container spacing={3}>
              {plans.map((plan) => {
                const isCurrentPlan = currentPlan?.name === plan.name;
                const isSelected = selectedPlan?.id === plan.id;
                const price = getPlanPrice(plan);
                const savings = billingCycle === 'yearly' ? calculateSavings(plan) : 0;

                return (
                  <Grid item xs={12} md={4} key={plan.id}>
                    <Card
                      sx={{
                        position: 'relative',
                        border: isSelected ? 3 : 1,
                        borderColor: isSelected ? 'primary.main' : 'divider',
                        cursor: isCurrentPlan ? 'not-allowed' : 'pointer',
                        opacity: isCurrentPlan ? 0.6 : 1,
                        height: '100%',
                        '&:hover': !isCurrentPlan && {
                          borderColor: 'primary.main',
                          boxShadow: 3,
                        },
                      }}
                      onClick={() => !isCurrentPlan && setSelectedPlan(plan)}
                    >
                      {plan.popular && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -12,
                            left: '50%',
                            transform: 'translateX(-50%)',
                          }}
                        >
                          <Chip
                            icon={<Star />}
                            label="Most Popular"
                            color="primary"
                            size="small"
                          />
                        </Box>
                      )}

                      <CardContent sx={{ textAlign: 'center', py: 3 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                          {plan.name}
                        </Typography>

                        <Box my={2}>
                          <Typography variant="h3" fontWeight={700} color="primary.main">
                            ₹{price}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            per {billingCycle === 'monthly' ? 'month' : 'year'}
                          </Typography>
                          {billingCycle === 'yearly' && savings > 0 && (
                            <Typography variant="caption" display="block" color="success.main" mt={0.5}>
                              Save {savings}%
                            </Typography>
                          )}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <List dense>
                          {plan.features?.map((feature, index) => (
                            <ListItem key={index} disableGutters>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <CheckCircle color="success" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText
                                primary={feature}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>

                        {isCurrentPlan && (
                          <Chip
                            label="Current Plan"
                            color="success"
                            size="small"
                            sx={{ mt: 2 }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {selectedPlan && (
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>Next billing date:</strong> {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" mt={1}>
                  You'll be charged ₹{getPlanPrice(selectedPlan)} for the {selectedPlan.name} plan.
                </Typography>
              </Alert>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleUpgrade}
          variant="contained"
          color="primary"
          disabled={!selectedPlan || isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Upgrade Now'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpgradePlanDialog;
