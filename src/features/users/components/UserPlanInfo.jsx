import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Button,
  Divider,
  LinearProgress,
  useTheme,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import SecurityIcon from "@mui/icons-material/Security";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PieChart, Pie, Cell } from "recharts";
import { useWallet } from "../../../hooks/useWallet";
import Loader from "../../../components/common/Loader";
import { useEffect } from "react";
import planService from "../../../services/planService";
import { useToast } from "../../../hooks/useToast";
import UpgradePlanDialog from "./UpgradePlanDialog";
import DowngradePlanDialog from "./DowngradePlanDialog";
import PaymentMethodDialog from "./PaymentMethodDialog";
import BillingHistoryTable from "./BillingHistoryTable";
import CancelSubscriptionDialog from "./CancelSubscriptionDialog";

const UserPlanPage = () => {
  useTheme();
  const { balance, currency, loading: walletLoading, error: walletError, refresh } = useWallet();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [planData, setPlanData] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);
  
  // Dialog states
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [downgradeDialogOpen, setDowngradeDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [billingHistoryOpen, setBillingHistoryOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  
  // Payment method dialog states
  const [razorpayDialogOpen, setRazorpayDialogOpen] = useState(false);
  const [metamaskDialogOpen, setMetamaskDialogOpen] = useState(false);
  const [upiDialogOpen, setUpiDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  
  // Fetch current user plan from backend
  const fetchPlan = async () => {
    setPlanLoading(true);
    try {
      const result = await planService.getCurrentPlan();
      if (result.success && result.data) {
        const plan = result.data.plan || result.data;
        // Calculate days remaining
        const startDate = new Date(plan.startDate);
        const endDate = new Date(plan.endDate);
        const today = new Date();
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const usedDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
        const remainingDays = Math.max(0, totalDays - usedDays);
        
        setPlanData({
          name: plan.name || "Free Plan",
          type: plan.billingCycle || "Monthly",
          price: plan.price ? `₹${plan.price}` : "₹0",
          totalDays,
          usedDays: Math.min(usedDays, totalDays),
          remainingDays,
          startDate: plan.startDate,
          endDate: plan.endDate,
          status: plan.status
        });
      } else {
        // If no plan found, set default free plan
        setPlanData({
          name: "Free Plan",
          type: "Monthly",
          price: "₹0",
          totalDays: 30,
          usedDays: 0,
          remainingDays: 30,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active'
        });
      }
    } catch (err) {
      console.error('Error fetching plan:', err);
      showToast('Error loading plan details', 'error');
      // Set default plan on error
      setPlanData({
        name: "Free Plan",
        type: "Monthly",
        price: "₹0",
        totalDays: 30,
        usedDays: 0,
        remainingDays: 30,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      });
    } finally {
      setPlanLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const usagePercentage = planData ? (planData.usedDays / planData.totalDays) * 100 : 0;

  const chartData = planData ? [
    { name: "Used", value: planData.usedDays, color: "#1976d2" },
    { name: "Remaining", value: planData.remainingDays, color: "#e0e0e0" },
  ] : [];
  
  const loading = walletLoading || planLoading;
  const error = walletError;

  // Handler functions for buttons
  const handleUpgradePlan = () => {
    navigate('/user/pricing');
  };

  const handleViewBilling = () => {
    setBillingHistoryOpen(true);
  };

  const handleViewPastHistory = () => {
    setBillingHistoryOpen(true);
  };

  const handleUpdatePaymentMethod = () => {
    setPaymentDialogOpen(true);
  };

  const handleViewTransactionHistory = () => {
    setBillingHistoryOpen(true);
  };
  
  // Dialog action handlers
  const handleUpgrade = async (plan, billingCycle) => {
    try {
      const response = await planService.upgradePlan(plan.id, billingCycle);
      if (response.success) {
        showToast('Plan upgraded successfully!', 'success');
        fetchPlan();
      }
    } catch {
      showToast('Failed to upgrade plan', 'error');
    }
  };

  const handleDowngrade = async (plan, feedback) => {
    try {
      const response = await planService.downgradePlan(plan.id, feedback);
      if (response.success) {
        showToast('Plan downgrade scheduled successfully', 'success');
        fetchPlan();
      }
    } catch {
      showToast('Failed to downgrade plan', 'error');
    }
  };

  const handlePaymentSave = async (paymentData) => {
    try {
      const response = await planService.updatePaymentMethod(paymentData);
      if (response.success) {
        showToast('Payment method updated successfully', 'success');
      }
    } catch {
      showToast('Failed to update payment method', 'error');
    }
  };

  const handleCancel = async (cancelData) => {
    try {
      const response = await planService.cancelSubscription(cancelData);
      if (response.success) {
        showToast('Subscription cancelled successfully', 'success');
        fetchPlan();
      }
    } catch {
      showToast('Failed to cancel subscription', 'error');
    }
  };

  const handleDownloadInvoice = async (invoiceId) => {
    try {
      const response = await planService.downloadInvoice(invoiceId);
      if (response.success) {
        showToast('Invoice downloaded successfully', 'success');
      }
    } catch {
      showToast('Failed to download invoice', 'error');
    }
  };

  // Payment method handlers
  const handleRazorpayPayment = () => {
    setPaymentAmount('');
    setRazorpayDialogOpen(true);
  };

  const handleMetamaskPayment = () => {
    setPaymentAmount('');
    setMetamaskDialogOpen(true);
  };

  const handleUpiPayment = () => {
    setPaymentAmount('');
    setUpiDialogOpen(true);
  };

  const processPayment = async (method, amount) => {
    setPaymentLoading(true);
    try {
      // Add your payment processing logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      showToast(`Payment of ₹${amount} via ${method} processed successfully!`, 'success');
      refresh(); // Refresh wallet balance
      // Close dialog
      setRazorpayDialogOpen(false);
      setMetamaskDialogOpen(false);
      setUpiDialogOpen(false);
      setPaymentAmount('');
    } catch (error) {
      showToast(`Payment failed: ${error.message}`, 'error');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Alert severity="error" onClose={refresh}>
        {error}
      </Alert>
    );
  }

  const walletBalance = Number(balance) || 0;
  const walletCurrency = currency || 'INR';
  const currencySymbol = walletCurrency === 'USD' ? '$' : '₹';

  if (loading) {
    return <Loader />;
  }

  if (!planData) {
    return (
      <Box sx={{ minHeight: "100vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Alert severity="error">Failed to load plan information</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Grid container spacing={1} maxWidth="lg" margin="auto" direction="column">
        {/* Wallet + Plan Management + Payment Methods */}
        <Grid container spacing={3}>
          {/* Wallet Balance Overview */}
          <Grid size={{ xs: 12, md:4 }}>
            <Card elevation={2}>
              <CardHeader
                title={
                  <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                    <AccountBalanceWalletIcon color="primary" />
                    Wallet Balance
                  </Typography>
                }
              />
              <CardContent sx={{ textAlign: "center" }}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                  <AccountBalanceWalletIcon sx={{ fontSize: 48, color: "primary.main" }} />
                  <Typography variant="h4" fontWeight="bold">
                    {currencySymbol}{walletBalance.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">Available Balance</Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{ mt: 3}}
                    onClick={handleRazorpayPayment}
                  >
                    Add Funds
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Plan Management */}
<Grid size={{ xs: 12, md:4 }}>
  <Card >
    <CardHeader
      title={
        <Typography variant="h6" display="flex" alignItems="center" gap={1}>
          <SecurityIcon color="primary" /> Plan Management
        </Typography>
      }
      subheader="Manage your Plan and billing"
      action={
        <Button
          variant="text"
          sx={{ color: "red" }}
          
        >
          Cancel
        </Button>
      }
    />
    <CardContent>
      <Button 
        variant="contained" 
        fullWidth 
        startIcon={<ArrowUpwardIcon />} 
        sx={{ mb: 1 }}
        onClick={handleUpgradePlan}
      >
        Upgrade Plan
      </Button>
      <Button 
        variant="outlined" 
        fullWidth 
        startIcon={<AccountBalanceWalletIcon />}  
        sx={{ mb: 1 }}
        onClick={handleViewBilling}
      >
        View Billing
      </Button>
    <Divider/>
      <Button 
        variant="text" 
        fullWidth 
        sx={{ justifyContent: "flex-start", mt: 1 }}
        onClick={handleViewPastHistory}
      >
        View Past History
      </Button>
      <Button 
        variant="text" 
        fullWidth 
        sx={{ justifyContent: "flex-start",mt:1  }}
        onClick={handleUpdatePaymentMethod}
      >
        Update Payment Method
      </Button>
    </CardContent>
  </Card>
</Grid>
{/* Payment Methods */}
<Grid size={{ xs: 12, md:4 }}>
  <Card>
    <CardHeader
      title={
        <Typography variant="h6" display="flex" alignItems="center" >
          <FlashOnIcon color="warning" />
          Payment Methods
        </Typography>
      }
      subheader="Your preferred payment options"
    />
    <CardContent>
      <Box display="flex" flexDirection="column" gap={1.5}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<PaymentIcon />}
          onClick={handleRazorpayPayment}
          sx={{
            justifyContent: 'flex-start',
            p: 1.5,
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.light',
              borderColor: 'primary.main'
            }
          }}
        >
          Razorpay
        </Button>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<CurrencyBitcoinIcon />}
          onClick={handleMetamaskPayment}
          sx={{
            justifyContent: 'flex-start',
            p: 1.5,
            borderColor: 'warning.main',
            color: 'warning.main',
            '&:hover': {
              bgcolor: 'warning.light',
              borderColor: 'warning.main'
            }
          }}
        >
          MetaMask
        </Button>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleUpiPayment}
          sx={{
            justifyContent: 'flex-start',
            p: 1.5,
            borderColor: 'success.main',
            color: 'success.main',
            '&:hover': {
              bgcolor: 'success.light',
              borderColor: 'success.main'
            }
          }}
        >
          UPI
        </Button>
      </Box>
    </CardContent>
  </Card>
</Grid>


        </Grid>
      </Grid>
      
      {/* Dialogs */}
      <UpgradePlanDialog
        open={upgradeDialogOpen}
        onClose={() => setUpgradeDialogOpen(false)}
        currentPlan={planData}
        onUpgrade={handleUpgrade}
      />
      
      <DowngradePlanDialog
        open={downgradeDialogOpen}
        onClose={() => setDowngradeDialogOpen(false)}
        currentPlan={planData}
        targetPlan={{ name: 'Basic Plan', price: 19.99 }}
        onDowngrade={handleDowngrade}
      />
      
      <PaymentMethodDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        onSave={handlePaymentSave}
      />
      
      <CancelSubscriptionDialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        currentPlan={planData}
        onCancel={handleCancel}
      />
      
      <Dialog
        open={billingHistoryOpen}
        onClose={() => setBillingHistoryOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Billing History</Typography>
            <IconButton onClick={() => setBillingHistoryOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <BillingHistoryTable onDownloadInvoice={handleDownloadInvoice} />
        </DialogContent>
      </Dialog>

      {/* Razorpay Payment Dialog */}
      <Dialog
        open={razorpayDialogOpen}
        onClose={() => setRazorpayDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <PaymentIcon color="primary" />
            <Typography variant="h6">Razorpay Payment</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Amount (₹)"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            sx={{ mt: 2 }}
            InputProps={{
              inputProps: { min: 1 }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRazorpayDialogOpen(false)} disabled={paymentLoading}>
            Cancel
          </Button>
          <Button
            onClick={() => processPayment('Razorpay', paymentAmount)}
            disabled={!paymentAmount || paymentAmount <= 0 || paymentLoading}
            variant="contained"
            startIcon={paymentLoading ? <CircularProgress size={16} /> : <PaymentIcon />}
          >
            {paymentLoading ? 'Processing...' : 'Pay Now'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* MetaMask Payment Dialog */}
      <Dialog
        open={metamaskDialogOpen}
        onClose={() => setMetamaskDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <CurrencyBitcoinIcon color="warning" />
            <Typography variant="h6">MetaMask Payment</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Amount (₹)"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            sx={{ mt: 2 }}
            InputProps={{
              inputProps: { min: 1 }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMetamaskDialogOpen(false)} disabled={paymentLoading}>
            Cancel
          </Button>
          <Button
            onClick={() => processPayment('MetaMask', paymentAmount)}
            disabled={!paymentAmount || paymentAmount <= 0 || paymentLoading}
            variant="contained"
            startIcon={paymentLoading ? <CircularProgress size={16} /> : <CurrencyBitcoinIcon />}
            sx={{ bgcolor: 'warning.main', '&:hover': { bgcolor: 'warning.dark' } }}
          >
            {paymentLoading ? 'Processing...' : 'Pay Now'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* UPI Payment Dialog */}
      <Dialog
        open={upiDialogOpen}
        onClose={() => setUpiDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <AddCircleOutlineIcon color="success" />
            <Typography variant="h6">UPI Payment</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Amount (₹)"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            sx={{ mt: 2 }}
            InputProps={{
              inputProps: { min: 1 }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpiDialogOpen(false)} disabled={paymentLoading}>
            Cancel
          </Button>
          <Button
            onClick={() => processPayment('UPI', paymentAmount)}
            disabled={!paymentAmount || paymentAmount <= 0 || paymentLoading}
            variant="contained"
            startIcon={paymentLoading ? <CircularProgress size={16} /> : <AddCircleOutlineIcon />}
            sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
          >
            {paymentLoading ? 'Processing...' : 'Pay Now'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserPlanPage;
