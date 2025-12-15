import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Alert,
  Tooltip,
  Collapse,
  useTheme,
  alpha,
  Badge,
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Error,
  Warning,
  Pending,
  FilterList,
  Search,
  ExpandMore,
  ExpandLess,
  Refresh,
  Download,
  Info,
  Schedule,
  Done,
  Close,
} from '@mui/icons-material';
import Breadcrumb from '../../../components/layout/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../components/common/PageContainer';
import { useTrades } from '../../../hooks/useTrades';

const BCrumb = [
  { to: '/user/dashboard', title: 'Dashboard' },
  { title: 'Trade Info' },
];

const TradeInfo = () => {
  const theme = useTheme();
  const { trades, loading, error, refresh } = useTrades();
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Mock broker response data - In real app, this would come from your API
  const generateBrokerResponse = (trade) => {
    const orderStatuses = {
      'executed': {
        status: 'COMPLETE',
        message: 'Order executed successfully',
        orderId: `ORD${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        fillPrice: trade.price,
        fillQuantity: trade.quantity,
        timestamp: new Date(trade.createdAt).toISOString(),
        brokerRef: `REF${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        charges: {
          brokerage: (parseFloat(trade.price) * parseFloat(trade.quantity) * 0.0003).toFixed(2),
          stt: (parseFloat(trade.price) * parseFloat(trade.quantity) * 0.001).toFixed(2),
          exchangeFees: '12.50',
        }
      },
      'rejected': {
        status: 'REJECTED',
        message: 'Order rejected - Insufficient funds',
        orderId: `ORD${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        errorCode: 'RMS_001',
        timestamp: new Date(trade.createdAt).toISOString(),
      },
      'pending': {
        status: 'OPEN',
        message: 'Order placed and pending execution',
        orderId: `ORD${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        timestamp: new Date(trade.createdAt).toISOString(),
      }
    };

    const statusKey = trade.status?.toLowerCase() === 'completed' ? 'executed' : 
                     trade.status?.toLowerCase() === 'cancelled' ? 'rejected' : 'pending';
    
    return orderStatuses[statusKey];
  };

  // Calculate order statistics
  const calculateOrderStats = () => {
    if (!trades || trades.length === 0) {
      return { total: 0, executed: 0, pending: 0, rejected: 0 };
    }

    return trades.reduce((stats, trade) => {
      stats.total++;
      const status = trade.status?.toLowerCase();
      if (status === 'completed') stats.executed++;
      else if (status === 'cancelled') stats.rejected++;
      else stats.pending++;
      return stats;
    }, { total: 0, executed: 0, pending: 0, rejected: 0 });
  };

  const orderStats = calculateOrderStats();

  // Filter trades based on search and filter
  const filteredTrades = trades?.filter(trade => {
    const matchesSearch = trade.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.orderId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && trade.status?.toLowerCase() === selectedFilter;
  }) || [];

  const getOrderStatusDetails = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return { color: 'success', icon: CheckCircle, label: 'EXECUTED' };
      case 'cancelled':
        return { color: 'error', icon: Error, label: 'REJECTED' };
      case 'pending':
      case 'open':
        return { color: 'warning', icon: Schedule, label: 'PENDING' };
      default:
        return { color: 'info', icon: Info, label: 'UNKNOWN' };
    }
  };

  const toggleRowExpansion = (tradeId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(tradeId)) {
      newExpanded.delete(tradeId);
    } else {
      newExpanded.add(tradeId);
    }
    setExpandedRows(newExpanded);
  };

  const formatCurrency = (amount) => {
    return `₹${Math.abs(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <PageContainer title="Trade Info" description="Track your trading activities and performance">
        <Breadcrumb title="Trade Info" items={BCrumb} />
        <Box mt={3}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" mt={2} textAlign="center">
            Loading trade data...
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Trade Info" description="Track your trading activities and performance">
        <Breadcrumb title="Trade Info" items={BCrumb} />
        <Box mt={3}>
          <Alert severity="error" action={
            <Button color="inherit" size="small" onClick={refresh}>
              Retry
            </Button>
          }>
            {error}
          </Alert>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Trade Info" description="Order execution log with broker responses">
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Breadcrumb title="Order Log" items={BCrumb} />
        </Box>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2} mb={3}>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={refresh}
              size="small"
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              size="small"
            >
              Export Log
            </Button>
          </Stack>
        </Stack>

        {/* Order Status Summary */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4}>
          <Card sx={{ flex: 1, background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}05)` }}>
            <CardContent sx={{ py: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Badge badgeContent={orderStats.total} color="primary" max={999}>
                  <Assignment sx={{ color: 'primary.main', fontSize: 28 }} />
                </Badge>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {orderStats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, background: `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.success.main}05)` }}>
            <CardContent sx={{ py: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Badge badgeContent={orderStats.executed} color="success" max={999}>
                  <CheckCircle sx={{ color: 'success.main', fontSize: 28 }} />
                </Badge>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {orderStats.executed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Executed
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, background: `linear-gradient(135deg, ${theme.palette.warning.main}15, ${theme.palette.warning.main}05)` }}>
            <CardContent sx={{ py: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Badge badgeContent={orderStats.pending} color="warning" max={999}>
                  <Schedule sx={{ color: 'warning.main', fontSize: 28 }} />
                </Badge>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {orderStats.pending}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, background: `linear-gradient(135deg, ${theme.palette.error.main}15, ${theme.palette.error.main}05)` }}>
            <CardContent sx={{ py: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Badge badgeContent={orderStats.rejected} color="error" max={999}>
                  <Error sx={{ color: 'error.main', fontSize: 28 }} />
                </Badge>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {orderStats.rejected}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rejected
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        {/* Filter and Search Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
              <TextField
                placeholder="Search by symbol or order ID..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ flexGrow: 1 }}
              />
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={(e) => setFilterAnchor(e.currentTarget)}
                size="small"
              >
                Status: {selectedFilter === 'all' ? 'All Orders' : selectedFilter}
              </Button>
              <Menu
                anchorEl={filterAnchor}
                open={Boolean(filterAnchor)}
                onClose={() => setFilterAnchor(null)}
              >
                {['all', 'completed', 'pending', 'cancelled'].map((filter) => (
                  <MenuItem
                    key={filter}
                    onClick={() => {
                      setSelectedFilter(filter);
                      setFilterAnchor(null);
                    }}
                    selected={selectedFilter === filter}
                  >
                    {filter === 'all' ? 'All Orders' : 
                     filter === 'completed' ? 'Executed' :
                     filter === 'cancelled' ? 'Rejected' :
                     filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </MenuItem>
                ))}
              </Menu>
            </Stack>
          </CardContent>
        </Card>

        {/* Order Log Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, py: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Assignment />
                <Typography variant="h6" fontWeight={600}>
                  Order Execution Log ({filteredTrades.length})
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Real-time broker responses and order execution details
              </Typography>
            </Box>
            
            {filteredTrades.length === 0 ? (
              <Box p={6} textAlign="center">
                <Assignment sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No orders found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm || selectedFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Order execution logs will appear here once you place trades'}
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width="50"></TableCell>
                      <TableCell>Order Details</TableCell>
                      <TableCell>Execution Status</TableCell>
                      <TableCell>Broker Response</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTrades.map((trade) => {
                      const brokerResponse = generateBrokerResponse(trade);
                      const statusDetails = getOrderStatusDetails(trade.status);
                      const StatusIcon = statusDetails.icon;
                      const isExpanded = expandedRows.has(trade.id);
                      
                      return (
                        <React.Fragment key={trade.id}>
                          <TableRow hover>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => toggleRowExpansion(trade.id)}
                              >
                                {isExpanded ? <ExpandLess /> : <ExpandMore />}
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <Stack spacing={0.5}>
                                <Typography variant="body2" fontWeight={600}>
                                  {trade.symbol} - {trade.tradeType}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Qty: {trade.quantity} @ ₹{trade.price}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Order ID: {brokerResponse.orderId}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <StatusIcon sx={{ color: `${statusDetails.color}.main`, fontSize: 20 }} />
                                <Stack>
                                  <Chip
                                    label={statusDetails.label}
                                    size="small"
                                    color={statusDetails.color}
                                    variant="filled"
                                  />
                                  {brokerResponse.fillPrice && (
                                    <Typography variant="caption" color="text.secondary">
                                      Fill: ₹{brokerResponse.fillPrice}
                                    </Typography>
                                  )}
                                </Stack>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Stack spacing={0.5}>
                                <Typography variant="body2" fontWeight={500}>
                                  {brokerResponse.message}
                                </Typography>
                                {brokerResponse.errorCode && (
                                  <Chip 
                                    label={`Error: ${brokerResponse.errorCode}`}
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                  />
                                )}
                                {brokerResponse.brokerRef && (
                                  <Typography variant="caption" color="text.secondary">
                                    Ref: {brokerResponse.brokerRef}
                                  </Typography>
                                )}
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Stack spacing={0.5}>
                                <Typography variant="body2">
                                  {new Date(brokerResponse.timestamp).toLocaleDateString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(brokerResponse.timestamp).toLocaleTimeString()}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="View Details">
                                <IconButton size="small">
                                  <Info />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                          
                          {/* Expanded Row - Broker Response Details */}
                          <TableRow>
                            <TableCell sx={{ py: 0 }} colSpan={6}>
                              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, m: 1 }}>
                                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                                    📋 Detailed Broker Response
                                  </Typography>
                                  
                                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                                    {/* Order Information */}
                                    <Paper sx={{ p: 2, flex: 1 }}>
                                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                        ORDER INFORMATION
                                      </Typography>
                                      <Stack spacing={1} mt={1}>
                                        <Stack direction="row" justifyContent="space-between">
                                          <Typography variant="body2">Order ID:</Typography>
                                          <Typography variant="body2" fontWeight={600}>{brokerResponse.orderId}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                          <Typography variant="body2">Status:</Typography>
                                          <Typography variant="body2" fontWeight={600}>{brokerResponse.status}</Typography>
                                        </Stack>
                                        {brokerResponse.fillPrice && (
                                          <>
                                            <Stack direction="row" justifyContent="space-between">
                                              <Typography variant="body2">Fill Price:</Typography>
                                              <Typography variant="body2" fontWeight={600}>₹{brokerResponse.fillPrice}</Typography>
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between">
                                              <Typography variant="body2">Fill Quantity:</Typography>
                                              <Typography variant="body2" fontWeight={600}>{brokerResponse.fillQuantity}</Typography>
                                            </Stack>
                                          </>
                                        )}
                                      </Stack>
                                    </Paper>

                                    {/* Charges Breakdown */}
                                    {brokerResponse.charges && (
                                      <Paper sx={{ p: 2, flex: 1 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                          CHARGES BREAKDOWN
                                        </Typography>
                                        <Stack spacing={1} mt={1}>
                                          <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2">Brokerage:</Typography>
                                            <Typography variant="body2" fontWeight={600}>₹{brokerResponse.charges.brokerage}</Typography>
                                          </Stack>
                                          <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2">STT:</Typography>
                                            <Typography variant="body2" fontWeight={600}>₹{brokerResponse.charges.stt}</Typography>
                                          </Stack>
                                          <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2">Exchange Fees:</Typography>
                                            <Typography variant="body2" fontWeight={600}>₹{brokerResponse.charges.exchangeFees}</Typography>
                                          </Stack>
                                        </Stack>
                                      </Paper>
                                    )}

                                    {/* Raw Response */}
                                    <Paper sx={{ p: 2, flex: 1 }}>
                                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                        RAW BROKER RESPONSE
                                      </Typography>
                                      <Box 
                                        sx={{ 
                                          mt: 1, 
                                          p: 1, 
                                          bgcolor: 'grey.900', 
                                          borderRadius: 1, 
                                          color: 'common.white',
                                          fontFamily: 'monospace',
                                          fontSize: '0.75rem',
                                          maxHeight: 120,
                                          overflow: 'auto'
                                        }}
                                      >
                                        <pre>{JSON.stringify(brokerResponse, null, 2)}</pre>
                                      </Box>
                                    </Paper>
                                  </Stack>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default TradeInfo;