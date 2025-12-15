import {
  Box,
  Button,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ListSubheader,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import DashboardCard from "../../../components/common/DashboardCard";
import { useStrategies } from "../../../hooks/useStrategies";
import { useToast } from "../../../hooks/useToast";
import strategySubscriptionService from "../../../services/strategySubscriptionService";

const OrderSidebar = ({ onCreate }) => {
  const [mode, setMode] = useState("direct");
  const { strategies } = useStrategies();
  const { showSuccess, showError } = useToast();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);

  // Load subscribed strategies
  useEffect(() => {
    const loadSubscriptions = async () => {
      setLoadingSubscriptions(true);
      try {
        const result = await strategySubscriptionService.getUserSubscriptions();
        if (result.success) {
          setSubscriptions(result.data || []);
        }
      } catch (err) {
        console.error('Error loading subscriptions:', err);
      } finally {
        setLoadingSubscriptions(false);
      }
    };
    loadSubscriptions();
  }, []);

  // Combine strategies: my strategies + subscribed strategies
  const allStrategies = [
    ...(strategies || []).map(s => ({ ...s, source: 'my' })),
    ...(subscriptions || []).map(sub => ({
      id: sub.strategy?.id || sub.strategyId,
      name: sub.strategy?.name || 'Unknown Strategy',
      source: 'subscribed',
      creator: sub.strategy?.user?.name || 'Unknown'
    }))
  ];
  const [formData, setFormData] = useState({
    symbol: '',
    quantity: '',
    price: '',
    tradeType: 'BUY',
    market: 'Indian',
    strategyId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.symbol.trim()) {
        showError('Symbol is required');
        return;
      }

      const quantity = parseFloat(formData.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        showError('Quantity must be a positive number');
        return;
      }

      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        showError('Price must be a positive number');
        return;
      }

      if (!['Forex', 'Crypto', 'Indian'].includes(formData.market)) {
        showError('Invalid market selected');
        return;
      }

      const tradeData = {
        orderId: `ORD${Date.now()}`, // Generate unique order ID
        market: formData.market,
        symbol: formData.symbol.trim(),
        // Normalize trade type to match backend enum (Buy|Sell)
        type: formData.tradeType === 'BUY' ? 'Buy' : 'Sell',
        amount: quantity,
        price: price,
        broker: 'Default Broker', // Default broker, could be made configurable
        brokerType: formData.market,
        date: new Date().toISOString(), // Current date in ISO format
      };

      setIsSubmitting(true);
      const result = await onCreate(tradeData);
      if (!result.success) {
        // show detailed validation errors if available
        const details = result.details?.details || result.details || result.error;
        if (Array.isArray(details)) {
          showError(details.map(d => `${d.field}: ${d.message}`).join(', '));
          // show inline field errors
          const errObj = {};
          details.forEach(d => {
            errObj[d.field] = d.message;
          });
          setFieldErrors(errObj);
        } else if (typeof details === 'object' && details !== null) {
          showError(details.error || JSON.stringify(details));
        } else {
          showError(details);
        }
        return;
      }
      // Clear field errors on success
      setFieldErrors({});
      // Helpful dev logs — remove in production
      console.debug('OrderSidebar create trade result', result);
      showSuccess('Trade order placed successfully');
      
      // Reset form
      setFormData({
        symbol: '',
        quantity: '',
        price: '',
        tradeType: 'BUY',
        market: 'Indian',
        strategyId: '',
      });
    } catch (error) {
      showError(error.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardCard title="Place Order">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(e, val) => val && setMode(val)}
          fullWidth
          size="small"
        >
          <ToggleButton value="direct">Direct</ToggleButton>
          <ToggleButton value="strategy">By Strategy</ToggleButton>
        </ToggleButtonGroup>

        <FormControl fullWidth size="small">
          <InputLabel>Market</InputLabel>
          <Select
            value={formData.market}
            label="Market"
            onChange={(e) => handleInputChange('market', e.target.value)}
          >
            <MenuItem value="Indian">Indian</MenuItem>
            <MenuItem value="Crypto">Crypto</MenuItem>
            <MenuItem value="Forex">Forex</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Symbol"
          variant="outlined"
          size="small"
          value={formData.symbol}
          onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
          placeholder="e.g., NIFTY"
          error={!!fieldErrors.symbol}
          helperText={fieldErrors.symbol}
        />

        <TextField
          fullWidth
          label="Quantity"
          variant="outlined"
          size="small"
          type="number"
          value={formData.quantity}
          onChange={(e) => handleInputChange('quantity', e.target.value)}
          inputProps={{ step: '0.00000001', min: '0.00000001' }}
          error={!!fieldErrors.amount}
          helperText={fieldErrors.amount}
        />

        <TextField
          fullWidth
          label="Price"
          variant="outlined"
          size="small"
          type="number"
          value={formData.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
          error={!!fieldErrors.price}
          helperText={fieldErrors.price}
        />

        <FormControl fullWidth size="small">
          <InputLabel>Trade Type</InputLabel>
          <Select
            value={formData.tradeType}
            label="Trade Type"
            onChange={(e) => handleInputChange('tradeType', e.target.value)}
            error={!!fieldErrors.type}
          >
            <MenuItem value="BUY">Buy</MenuItem>
            <MenuItem value="SELL">Sell</MenuItem>
          </Select>
        </FormControl>

        {mode === 'strategy' && (
            <FormControl fullWidth size="small">
            <InputLabel>Strategy</InputLabel>
            <Select
              value={formData.strategyId}
              label="Strategy"
              onChange={(e) => handleInputChange('strategyId', e.target.value)}
              error={!!fieldErrors.strategyId}
            >
              {/* My Strategies Section */}
              {strategies && strategies.length > 0 && (
                <ListSubheader sx={{ 
                  bgcolor: 'primary.dark', 
                  color: 'primary.contrastText',
                  fontWeight: 600,
                  lineHeight: '32px'
                }}>
                  📈 My Strategies
                </ListSubheader>
              )}
              {strategies && strategies.map((strategy) => (
                <MenuItem key={`my-${strategy.id}`} value={strategy.id}>
                  {strategy.name}
                </MenuItem>
              ))}
              
              {/* Subscribed Strategies Section */}
              {subscriptions && subscriptions.length > 0 && (
                <ListSubheader sx={{ 
                  bgcolor: 'secondary.dark', 
                  color: 'secondary.contrastText',
                  fontWeight: 600,
                  lineHeight: '32px',
                  mt: strategies && strategies.length > 0 ? 1 : 0
                }}>
                  ⭐ Subscribed Strategies
                </ListSubheader>
              )}
              {subscriptions && subscriptions.map((sub) => (
                <MenuItem key={`sub-${sub.id}`} value={sub.strategy?.id || sub.strategyId}>
                  {sub.strategy?.name || 'Unknown'} 
                  <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                    (by {sub.strategy?.user?.name || 'Unknown'})
                  </Typography>
                </MenuItem>
              ))}

              {/* Empty state */}
              {(!strategies || strategies.length === 0) && (!subscriptions || subscriptions.length === 0) && (
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    No strategies available. Create or subscribe to a strategy first.
                  </Typography>
                </MenuItem>
              )}
            </Select>
          </FormControl>
        )}

        <Button 
          variant="contained" 
          fullWidth 
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{ mt: 1 }}
        >
          Place Order
        </Button>
      </Box>
    </DashboardCard>
  );
};

export default OrderSidebar;
