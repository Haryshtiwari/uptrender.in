import { useState, useEffect, useCallback } from "react";
import { Pagination } from '@mui/material';
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Divider,
  Button,
  Grid,
  Paper,
  Avatar,
  Tooltip,
  Drawer,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  Delete,
  DeleteOutlined,
  PlayArrow,
  Pause,
  Public,
  Lock,
  FilterList,
  Search,
  TrendingUp,
  Settings,
  TrendingDown,
  Star,
  StarBorder,
  Close,
  AddOutlined,
  CheckCircle,
} from "@mui/icons-material";
import Scrollbar from '../../../components/custom-scroll/Scrollbar';
import Loader from '../../../components/common/Loader';
import { useNavigate, useLocation } from 'react-router-dom';
import { strategyService } from '../../../services/strategyService';
import strategySubscriptionService from '../../../services/strategySubscriptionService';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar } from '@mui/material';
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FilterListIcon from '@mui/icons-material/FilterList';
import Breadcrumb from "../../../components/layout/full/shared/breadcrumb/Breadcrumb";
import { useAuth } from '../../../app/authContext';

const segmentColors = {
  Forex: { backgroundColor: "#dbeafe", color: "#1d4ed8" },
  Indian: { backgroundColor: "#fed7aa", color: "#c2410c" },
  Crypto: { backgroundColor: "#e9d5ff", color: "#7c3aed" },
};

const typeColors = {
  Private: { backgroundColor: "#f3f4f6", color: "#374151" },
  Public: { backgroundColor: "#dcfce7", color: "#166534" },
};
export default function MarketPlace() {
  const formatNumber = (value) => {
    // handle null/undefined/sometimes non-number values gracefully
    if (value === null || value === undefined) return 0;
    const num = Number(value);
    if (Number.isNaN(num)) return 0;
    return num.toLocaleString();
  };
  const [strategies, setStrategies] = useState([]);
  // Map of strategyId -> subscriptionId for unsubscribe
  const [subscriptionMap, setSubscriptionMap] = useState({});
  const [subscriptionLoading, setSubscriptionLoading] = useState({});
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '' });
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Load user's subscribed strategies - defined first with useCallback
  const loadSubscribedStrategies = useCallback(async () => {
    console.log('loadSubscribedStrategies called');
    try {
      const res = await strategySubscriptionService.getSubscribedStrategies();
      console.log('Subscribed strategies API response:', res);
      if (res.success && res.data) {
        // Create a map of strategyId -> subscriptionId
        const subMap = {};
        res.data.forEach(sub => {
          // Handle both direct strategyId and nested strategy.id
          const strategyId = parseInt(sub.strategyId || sub.strategy_id || sub.strategy?.id);
          console.log('Processing subscription:', sub.id, 'strategyId:', strategyId, 'type:', typeof strategyId);
          if (strategyId) {
            subMap[String(strategyId)] = sub.id;
          }
        });
        console.log('Subscription map built:', subMap);
        setSubscriptionMap(subMap);
      } else {
        console.log('Failed to load subscriptions:', res.error);
      }
    } catch (err) {
      console.error('Failed to load subscribed strategies', err);
    }
  }, []);

  // Reload subscriptions when route changes or user changes
  useEffect(() => {
    // don't block UI; fire-and-forget
    loadSubscribedStrategies();
  }, [location.pathname, user?.id, loadSubscribedStrategies]);

  // Reload subscriptions when page becomes visible (e.g., tab switch or navigation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadSubscribedStrategies();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadSubscribedStrategies]);

  // load marketplace strategies from backend when component mounts
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        // Load user's subscriptions first
        if (mounted) await loadSubscribedStrategies();
        
        // Then load public strategies
        const res = await strategyService.getPublicStrategies();
        console.log('Marketplace API response:', res);
        if (res.success && mounted) {
          const strategies = res.data || [];
          console.log('Setting strategies:', strategies);
          setStrategies(strategies);
          if (strategies.length === 0) {
            setSnack({ open: true, message: 'No public strategies available yet. Create a public strategy to see it here!' });
          }
        } else {
          console.error('Failed to load strategies:', res.error);
          setSnack({ open: true, message: res.error || 'Failed to load strategies' });
        }
      } catch (err) {
        console.error('Failed to load marketplace strategies', err);
        setSnack({ open: true, message: 'Error loading strategies: ' + (err.message || 'Unknown error') });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Filters and search state
  const [filters, setFilters] = useState({
    status: [],
    type: [],
    madeBy: [],
    createdBy: [],
    segment: [],
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [mobileOpen, setMobileOpen] = useState(false);
  const itemsPerPage = 4;
  const [page, setPage] = useState(0);

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.primary.light;
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleFilterChange = (category, value, checked) => {
    setFilters((prev) => ({
      ...prev,
      [category]: checked
        ? [...prev[category], value]
        : prev[category].filter((item) => item !== value),
    }));
  };

  const toggleStrategyActive = (id) => {
    setStrategies((prev) =>
      prev.map((strategy) =>
        strategy.id === id
          ? { ...strategy, isActive: !strategy.isActive }
          : strategy
      )
    );
  };

  const toggleStrategyRunning = async (id) => {
    // Optimistic update: toggle locally first for snappy UI, revert if API fails
    const s = strategies.find((st) => st.id === id || st._id === id);
    if (!s) return;
    const prev = strategies;
    setStrategies((prevList) =>
      prevList.map((strategy) =>
        (strategy.id === id || strategy._id === id)
          ? { ...strategy, isRunning: !strategy.isRunning }
          : strategy
      )
    );
    try {
      let res;
      if (s.isRunning) res = await strategyService.stopStrategy(id);
      else res = await strategyService.startStrategy(id);
      if (res.success) {
        setSnack({ open: true, message: s.isRunning ? 'Strategy stopped' : 'Strategy started' });
      } else {
        // revert
        setStrategies(prev);
        setSnack({ open: true, message: res.message || 'Failed to toggle running' });
      }
    } catch (err) {
      console.error(err);
      setStrategies(prev);
      setSnack({ open: true, message: 'Error toggling running state' });
    }
  };

  const toggleStrategyPublic = async (id) => {
    // optimistic update: flip locally then call API; revert on failure
    const s = strategies.find((st) => st.id === id || st._id === id);
    if (!s) return;
    const prev = strategies;
    
    // If making private, remove from list since marketplace only shows public strategies
    if (s.isPublic) {
      setStrategies((prevList) => prevList.filter((strategy) => (strategy.id || strategy._id) !== id));
    } else {
      // If making public, update the isPublic flag
      setStrategies((prevList) =>
        prevList.map((strategy) =>
          (strategy.id === id || strategy._id === id)
            ? { ...strategy, isPublic: !strategy.isPublic }
            : strategy
        )
      );
    }
    
    try {
      let res;
      if (s.isPublic) res = await strategyService.deactivateStrategy(id);
      else res = await strategyService.activateStrategy(id);
      if (res.success) {
        setSnack({ open: true, message: s.isPublic ? 'Strategy set to Private' : 'Strategy published' });
      } else {
        setStrategies(prev);
        setSnack({ open: true, message: res.message || 'Failed to toggle visibility' });
      }
    } catch (err) {
      console.error(err);
      setStrategies(prev);
      setSnack({ open: true, message: 'Error toggling visibility' });
    }
  };

  const toggleStrategyFavorite = (id) => {
    setStrategies((prev) =>
      prev.map((strategy) =>
        strategy.id === id
          ? { ...strategy, isFavorite: !strategy.isFavorite }
          : strategy
      )
    );
  };

  const handleView = async (id) => {
    // Try to show local data immediately, then attempt to refresh from API
    const local = strategies.find((s) => s.id === id || s._id === id);
    if (local) {
      setSelectedStrategy(local);
      setDetailsOpen(true);
    }
    try {
      const res = await strategyService.getStrategyById(id);
      if (res.success) {
        setSelectedStrategy(res.data);
        setDetailsOpen(true);
      } else {
        if (!local) setSnack({ open: true, message: res.message || 'Failed to load details' });
      }
    } catch (err) {
      console.error(err);
      if (!local) setSnack({ open: true, message: 'Error loading details' });
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Are you sure you want to delete this strategy?');
    if (!ok) return;
    // optimistic removal with revert on failure
    const backup = strategies;
    setStrategies((prev) => prev.filter((st) => st.id !== id && st._id !== id));
    try {
      const res = await strategyService.deleteStrategy(id);
      if (res.success) {
        setSnack({ open: true, message: 'Strategy deleted' });
      } else {
        setStrategies(backup);
        setSnack({ open: true, message: res.message || 'Failed to delete' });
      }
    } catch (err) {
      console.error(err);
      setStrategies(backup);
      setSnack({ open: true, message: 'Error deleting strategy' });
    }
  };

  const handleClone = async () => {
    setSnack({ open: true, message: 'Clone functionality coming soon!' });
  };

  const handleSubscribe = async (strategyId) => {
    const key = String(strategyId);
    setSubscriptionLoading(prev => ({ ...prev, [key]: true }));
    try {
      const result = await strategySubscriptionService.subscribeToStrategy(strategyId, 1);
      if (result.success) {
        // Update subscription map with the new subscription ID (use string key)
        const subscriptionId = result.data?.id;
        if (subscriptionId) {
          setSubscriptionMap(prev => ({ ...prev, [key]: subscriptionId }));
        }
        setSnack({ open: true, message: result.message || 'Subscribed to strategy successfully!' });
      } else {
        setSnack({ open: true, message: result.error || 'Failed to subscribe to strategy' });
      }
    } catch (error) {
      console.error('Subscribe error:', error);
      setSnack({ open: true, message: 'Failed to subscribe to strategy' });
    } finally {
      setSubscriptionLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleUnsubscribe = async (strategyId) => {
    const key = String(strategyId);
    const subscriptionId = subscriptionMap[key];
    if (!subscriptionId) {
      setSnack({ open: true, message: 'Subscription not found' });
      return;
    }
    
    setSubscriptionLoading(prev => ({ ...prev, [key]: true }));
    try {
      const result = await strategySubscriptionService.unsubscribeFromStrategy(subscriptionId);
      if (result.success) {
        // Remove from subscription map
        setSubscriptionMap(prev => {
          const newMap = { ...prev };
          delete newMap[key];
          return newMap;
        });
        setSnack({ open: true, message: result.message || 'Unsubscribed from strategy successfully!' });
      } else {
        setSnack({ open: true, message: result.error || 'Failed to unsubscribe from strategy' });
      }
    } catch (error) {
      console.error('Unsubscribe error:', error);
      setSnack({ open: true, message: 'Failed to unsubscribe from strategy' });
    } finally {
      setSubscriptionLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleTogglePause = async (strategyId) => {
    setSubscriptionLoading(prev => ({ ...prev, [strategyId]: true }));
    try {
      const result = await strategySubscriptionService.toggleSubscriptionPause(strategyId);
      if (result.success) {
        setSnack({ open: true, message: result.message || 'Subscription updated!' });
      } else {
        setSnack({ open: true, message: result.error || 'Failed to update subscription' });
      }
    } catch (error) {
      console.error('Toggle pause error:', error);
      setSnack({ open: true, message: 'Failed to update subscription' });
    } finally {
      setSubscriptionLoading(prev => ({ ...prev, [strategyId]: false }));
    }
  };

  // navigate to the user create strategy route
  const handleCreate = () => navigate('/user/create');

  const filteredStrategies = strategies.filter((strategy) => {
    const matchesSearch = strategy.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilters =
      (filters.type.length === 0 || filters.type.includes(strategy.type)) &&
      (filters.madeBy.length === 0 ||
        filters.madeBy.includes(strategy.madeBy)) &&
      (filters.createdBy.length === 0 ||
        filters.createdBy.includes(strategy.createdBy)) &&
      (filters.segment.length === 0 ||
        filters.segment.includes(strategy.segment)) &&
      (filters.status.length === 0 ||
        filters.status.includes("Total") ||
        (filters.status.includes("Active") && strategy.isActive) ||
        (filters.status.includes("Inactive") && !strategy.isActive));

    return matchesSearch && matchesFilters;
  });

  const totalStrategies = strategies.length;
  const activeStrategies = strategies.filter((s) => s.isActive).length;
  const inactiveStrategies = strategies.filter((s) => !s.isActive).length;

  const FilterSection = ({ title, options, category, showCounts = false }) => (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
      >
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {options.map((option) => {
          const optionValue = showCounts ? option.label : option;
          const optionLabel = showCounts
            ? `${option.label} (${option.count})`
            : option;

          return (
            <FormControlLabel
              key={optionValue}
              control={
                <Checkbox
                  size="small"
                  checked={filters[category].includes(optionValue)}
                  onChange={(e) =>
                    handleFilterChange(category, optionValue, e.target.checked)
                  }
                  sx={{ color: "primary.main" }}
                />
              }
              label={<Typography variant="body2">{optionLabel}</Typography>}
              sx={{ margin: 0 }}
            />
          );
        })}
      </Box>
    </Box>
  );

  const SidebarContent = () => {
    const activeFilterCount = Object.values(filters).reduce(
      (acc, val) => acc + (Array.isArray(val) ? val.length : 0),
      0
    );

    const resetFilters = () => {
      setFilters({
        status: [],
        type: [],
        madeBy: [],
        createdBy: [],
        segment: [],
      });
    };

    return (
      <>

     
        {/* Mobile Header */}
        {isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Filters & Overview
            </Typography>
            <IconButton onClick={handleDrawerToggle}>
              <Close />
            </IconButton>
          </Box>
        )}

        {/* Filters Section Header */}
        <Box sx={{ p: 1, borderBottom: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Avatar sx={{ bgcolor: "primary.light", width: 40, height: 40 }}>
              <FilterList sx={{ color: "primary.main" }} />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Filters
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Refine your strategies
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Filter Summary & Reset */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""}{" "}
            applied
          </Typography>
          <Button
            size="small"
            onClick={resetFilters}
            disabled={activeFilterCount === 0}
            startIcon={<RestartAltIcon />}
            sx={{
              textTransform: "none",
              bgcolor: activeFilterCount > 0 ? "secondary.main" : "transparent",
              color: activeFilterCount > 0 ? "#fff" : "text.secondary",
              "&:hover": {
                bgcolor:
                  activeFilterCount > 0 ? "secondary.dark" : "transparent",
                color: activeFilterCount > 0 ? "#fff" : "text.secondary",
              },
            }}
          >
            Reset
          </Button>
        </Box>

       {/* Filter Sections */}
<Box
  sx={{
     p: 1,
    pt: 0,

  }}
>
 <Scrollbar
  sx={{
    maxHeight: { xs: '700px', md: 'auto' },
    pr: 1,
    '& .simplebar-scrollbar:before': {
      backgroundColor: primary,
    },
  }}
>
  <FilterSection
    title="Status"
    options={[
      { label: "Total", count: totalStrategies },
      { label: "Active", count: activeStrategies },
      { label: "Inactive", count: inactiveStrategies },
    ]}
    category="status"
    showCounts
  />
  <Divider sx={{ my: 0.5 }} />

  <FilterSection title="Type" category="type" options={["Public"]} />
  <Divider sx={{ my: 0.5 }} />

  <FilterSection title="Made By" category="madeBy" options={["Admin", "User"]} />
  <Divider sx={{ my: 0.5 }} />

  <FilterSection title="Segment" category="segment" options={["Forex", "Indian", "Crypto"]} />
</Scrollbar>

</Box>


      </>
    );
  };

  const totalPages = Math.ceil(filteredStrategies.length / itemsPerPage);
  const paginatedStrategies = filteredStrategies.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );
 const BCrumb = [
    { to: '/user/user-dashboard', title: 'User' },
    { title: 'MarketPlace' },
  ];
  return (
    <>
    <Breadcrumb title="MarketPlace"  items={BCrumb}/>
    <Box
      sx={{
        display: "flex",
        minHeight: "80vh",
        backgroundColor: "background.default",
      }}
    >
      {/* Mobile App Bar */}
      {isMobile && (
        <IconButton
          onClick={handleDrawerToggle}
           sx={{
                position: 'fixed',
                bottom: 16,
                left: 16,
                zIndex: 1300,
              }}
          size="large"
       
        >
              <FilterListIcon sx={{ color: 'primary.main' }} />
        </IconButton>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Paper
          elevation={1}
          sx={{
            width: 250,
            height:930,
            borderRadius: 0,
            borderRight: "1px solid",
            borderColor: "divider",
          }}
        >
          <SidebarContent />
        </Paper>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 320,
            },
          }}
        >
          <SidebarContent />
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: isMobile ? 0 : 4,
          pt: isMobile ? 0 : 4, // Add top padding for mobile app bar
        }}
      >
        {/* Desktop Header */}
        {!isMobile && (
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  Market Place Trading Strategies
                </Typography>
           
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

                <TextField
                size="small"
                placeholder="Search strategies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="flex-end">
                      <Search sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: "100%",
                  maxWidth: 200,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "transparent",
                    borderRadius: 4,
                  },
                }}
              />
                <Button
                  variant="contained"
                  startIcon={<AddOutlined />}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    px: 1,
                  }}
                  onClick={handleCreate}
                >
                  New Strategy
                </Button>
              </Box>
            </Box>
          
          </Box>
        )}

        {/* Mobile Action Section */}
        {isMobile && (
          <Box
            sx={{
              mb: 2,
              display: "flex",
              flexDirection: "column", 
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              startIcon={<Settings />}
              size="small"
              fullWidth
              sx={{
                textTransform: "none",
                borderRadius: 2,
                whiteSpace: "nowrap",
              }}
              onClick={handleCreate}
            >
              New Strategy
            </Button>
            <TextField
              fullWidth
              size="small"
              placeholder="Search strategies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "text.secondary", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: "100%",

                "& .MuiOutlinedInput-root": {
                  backgroundColor: "transparent",
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        )}

        {/* Strategy Grid */}
        {loading ? (
          <Loader message="Loading strategies..." />
        ) : filteredStrategies.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No strategies found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {strategies.length === 0 
                ? 'There are no public strategies available yet.' 
                : 'Try adjusting your filters or search term.'}
            </Typography>
          </Box>
        ) : (
        <Grid
          container
          spacing={3}
          px={2}
          sx={{
            justifyContent: "flex-start",
          }}
        >

          {paginatedStrategies.map((strategy) => (
            <Grid item xs={12} sm={12} md={6} lg={4} key={strategy.id}>
              <Card
  sx={{
    height: 420,
    mx: "auto",
    maxWidth: 360,
    width: "100%",
    display: "flex",
    flexDirection: "column",
  }}
>
                <CardContent
                  sx={{
                    "&:last-child": { pb: 0.5 },
                    px: 1,
                    pt: 2,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Top: Name and Switch aligned in same row, space-between */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 0.5,
                      gap: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, fontSize: "1rem" }}
                      noWrap
                    >
                      {strategy.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => toggleStrategyFavorite(strategy.id)}
                      sx={{ p: 0.25 }}
                    >
                      {strategy.isFavorite ? (
                        <Star sx={{ fontSize: 16, color: "warning.main" }} />
                      ) : (
                        <StarBorder
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                      )}
                    </IconButton>

                    <Tooltip title={strategy.isActive ? "Active" : "Inactive"}>
                      <Switch
                        size="small"
                        checked={strategy.isActive}
                        onChange={() => toggleStrategyActive(strategy.id)}
                        inputProps={{ "aria-label": "toggle active status" }}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "secondary.main",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            { backgroundColor: "secondary.main" },
                          gap: 2,
                        }}
                      />
                    </Tooltip>
                  </Box>

                  {/* Last Updated Row */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 2,
                      mt: 1
                    }}
                  >
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="caption" color="text.secondary">
                      {strategy.lastUpdated}
                    </Typography>
                  </Box>

                  {/* Status Chips Row */}
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                  >
                    <Chip
                      label={strategy.type}
                      size="small"
                      sx={{
                        ...typeColors[strategy.type],
                        fontSize: "0.7rem",
                        height: 20,
                        fontWeight: 500,
                      }}
                    />
                    <Chip
                      label={strategy.segment}
                      size="small"
                      sx={{
                        ...segmentColors[strategy.segment],
                        fontSize: "0.7rem",
                        height: 20,
                        fontWeight: 500,
                      }}
                    />
                    <Chip
                      label={`By ${strategy.madeBy}`}
                      variant="outlined"
                      size="small"
                      sx={{ fontSize: "0.7rem", height: 20, fontWeight: 500 }}
                    />
                  </Box>

                  {/* Performance */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 2,
                    }}
                  >
                    {strategy.performance >= 0 ? (
                      <TrendingUp
                        sx={{ fontSize: 16, color: "success.main" }}
                      />
                    ) : (
                      <TrendingDown
                        sx={{ fontSize: 16, color: "error.main" }}
                      />
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color:
                          strategy.performance >= 0
                            ? "success.main"
                            : "error.main",
                      }}
                    >
                      {strategy.performance >= 0 ? "+" : ""}
                      {strategy.performance}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      performance
                    </Typography>
                  </Box>

                  {/* Metrics */}
                  <Paper
                    elevation={0}
                    sx={{
                      background: secondary,
                      p: 1.5,
                      mb: 2,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Grid container direction="column" spacing={1}>
                      {[
                        ["Capital", `₹${formatNumber(strategy.capital)}`],
                        ["Symbol", strategy.symbol],
                        ["Value", formatNumber(strategy.symbolValue)],
                        ["Legs", strategy.legs],
                      ].map(([label, value]) => (
                        <Grid item key={label}>
                          <Grid container justifyContent="space-between">
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontWeight: 500 }}
                            >
                              {label}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700 }}
                            >
                              {value}
                            </Typography>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>

                  {/* Action Buttons */}
                  {strategy.user?.id === user?.id ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mt: "auto",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleView(strategy.id)}
                            sx={{
                              "&:hover": {
                                backgroundColor: "primary.light",
                                color: "primary.main",
                              },
                            }}
                          >
                            <Visibility sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>

                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Tooltip title={strategy.isRunning ? "Pause" : "Start"}>
                          <IconButton
                            size="small"
                            onClick={() => toggleStrategyRunning(strategy.id)}
                            sx={{
                              "&:hover": {
                                backgroundColor: strategy.isRunning
                                  ? "warning.light"
                                  : "success.light",
                                color: strategy.isRunning
                                  ? "warning.main"
                                  : "success.main",
                              },
                            }}
                          >
                            {strategy.isRunning ? (
                              <Pause sx={{ fontSize: 16 }} />
                            ) : (
                              <PlayArrow sx={{ fontSize: 16 }} />
                            )}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title={strategy.isPublic ? "Public" : "Private"}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 32,
                              height: 32,
                              borderRadius: 1,
                              backgroundColor: strategy.isPublic
                                ? "info.light"
                                : "grey.200",
                              color: strategy.isPublic
                                ? "info.main"
                                : "text.secondary",
                            }}
                          >
                            {strategy.isPublic ? (
                              <Public sx={{ fontSize: 16 }} />
                            ) : (
                              <Lock sx={{ fontSize: 16 }} />
                            )}
                          </Box>
                        </Tooltip>
                      </Box>
                    </Box>
                  ) : subscriptionMap[String(strategy.id)] ? (
                    /* Subscribed user - show View, Subscribed button with unsubscribe */
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleView(strategy.id)}
                          sx={{
                            "&:hover": {
                              backgroundColor: "primary.light",
                              color: "primary.main",
                            },
                          }}
                        >
                          <Visibility sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        disabled
                        sx={{
                          cursor: "default",
                          "&.Mui-disabled": {
                            backgroundColor: "success.main",
                            color: "white",
                            opacity: 0.9,
                          },
                        }}
                      >
                        ✓ Subscribed
                      </Button>
                      <Tooltip title="Unsubscribe">
                        <IconButton
                          size="small"
                          onClick={() => handleUnsubscribe(strategy.id)}
                          disabled={subscriptionLoading[String(strategy.id)]}
                          sx={{
                            color: "error.main",
                            "&:hover": {
                              backgroundColor: "error.light",
                            },
                          }}
                        >
                          {subscriptionLoading[String(strategy.id)] ? (
                            <CircularProgress size={16} />
                          ) : (
                            <DeleteOutlined sx={{ fontSize: 16 }} />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : (
                    /* Non-subscribed user - show View and Subscribe button */
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleView(strategy.id)}
                          sx={{
                            "&:hover": {
                              backgroundColor: "primary.light",
                              color: "primary.main",
                            },
                          }}
                        >
                          <Visibility sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Subscribe to Strategy">
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => handleSubscribe(strategy.id)}
                          disabled={subscriptionLoading[String(strategy.id)]}
                          sx={{
                            "&:hover": {
                              backgroundColor: "primary.dark",
                            },
                          }}
                        >
                          {subscriptionLoading[String(strategy.id)] ? (
                            <CircularProgress size={16} sx={{ mr: 1 }} />
                          ) : null}
                          Subscribe
                        </Button>
                      </Tooltip>
                    </Box>
                  )}                  {/* Running Indicator */}
                  {strategy.isRunning && (
                    <Box
                      sx={{
                        mt: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "success.main",
                          animation: "pulse 2s infinite",
                          "@keyframes pulse": {
                            "0%, 100%": { opacity: 1 },
                            "50%": { opacity: 0.5 },
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: "success.main", fontWeight: 500 }}
                      >
                        Running
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}

 

  </Grid>
  )}
     {/* Pagination */}
   <Box mt={4} display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap={1}>
  <Typography variant="caption" color="text.secondary">
    Showing {page * itemsPerPage + 1} - {Math.min((page + 1) * itemsPerPage, filteredStrategies.length)} of {filteredStrategies.length} strategies
  </Typography>

  <Pagination
  count={totalPages}
  page={page + 1}
  onChange={(event, value) => setPage(value - 1)}
  shape="rounded"
  color="primary"
  variant="outlined" 
  sx={{
    "& .MuiPaginationItem-root": {
      border: "1px solid",               
      borderColor: "divider",            
    },
    "& .Mui-selected": {
      backgroundColor: "primary.main",   
      color: "#fff",
      borderColor: "primary.main",
    },
  }}
/>

</Box>
      {/* Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Strategy details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedStrategy ? (
              <Box>
                <Typography variant='h6'>{selectedStrategy.name}</Typography>
                <Typography variant='body2' color='text.secondary'>{selectedStrategy.description}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant='body2'>Performance: {selectedStrategy.performance ?? 0}%</Typography>
                  <Typography variant='body2'>Capital: ₹{Number(selectedStrategy.capital || 0).toLocaleString()}</Typography>
                </Box>
              </Box>
            ) : 'Loading...'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          {selectedStrategy && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => {
                handleSubscribe(selectedStrategy.id);
                setDetailsOpen(false);
              }}
            >
              Subscribe
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack((s) => ({ ...s, open: false }))} message={snack.message} />
      </Box>
    </Box></>
  );
}
