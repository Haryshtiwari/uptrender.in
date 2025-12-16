import {
  Box,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useState } from "react";
import TablePagination from '@mui/material/TablePagination';
import { isBuy } from '../../../utils/tradeUtils';
import DashboardCard from "../../../components/common/DashboardCard";
import Scrollbar from "../../../components/custom-scroll/Scrollbar";
import { useToast } from "../../../hooks/useToast";
import { useTrades } from "../../../hooks/useTrades";

const DashboardTradeManagement = () => {
  const [tab, setTab] = useState(0); // Defaulting to "Open Position"
  const [slTpModal, setSlTpModal] = useState({ open: false, trade: null, type: null });
  const [slTpValues, setSlTpValues] = useState({ sl: '', tp: '' });
  const { showSuccess, showError } = useToast();
  const { trades, loading, error, updateTrade, deleteTrade, refresh, goToPage, setLimit, pagination } = useTrades();

  const handleDelete = async (tradeId) => {
    try {
      if (!deleteTrade) {
        showError('Delete function not available');
        return;
      }
      await deleteTrade(tradeId);
      showSuccess('Trade deleted successfully');
      if (refresh) refresh();
    } catch (error) {
      console.error('Delete trade error:', error);
      showError(error.message || 'Failed to delete trade');
    }
  };

  const handleClose = async (trade) => {
    try {
      if (!updateTrade) {
        showError('Update function not available');
        return;
      }
      await updateTrade(trade.id, { status: 'Completed' });
      showSuccess('Trade closed successfully');
      if (refresh) refresh();
    } catch (error) {
      console.error('Close trade error:', error);
      showError(error.message || 'Failed to close trade');
    }
  };

  const handleSlTpClick = (trade, type) => {
    setSlTpModal({ open: true, trade, type });
    setSlTpValues({
      sl: trade.stopLoss || '',
      tp: trade.takeProfit || ''
    });
  };

  const handleSlTpClose = () => {
    setSlTpModal({ open: false, trade: null, type: null });
    setSlTpValues({ sl: '', tp: '' });
  };

  const handleSlTpSave = async () => {
    try {
      if (!updateTrade || !slTpModal.trade) {
        showError('Update function not available');
        return;
      }

      const updateData = {};
      if (slTpValues.sl) updateData.stopLoss = parseFloat(slTpValues.sl);
      if (slTpValues.tp) updateData.takeProfit = parseFloat(slTpValues.tp);

      await updateTrade(slTpModal.trade.id, updateData);
      showSuccess('SL/TP updated successfully');
      handleSlTpClose();
      if (refresh) refresh();
    } catch (error) {
      console.error('Update SL/TP error:', error);
      showError(error.message || 'Failed to update SL/TP');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'info';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter trades based on tab
  const filteredTrades = trades.filter((trade) => {
    if (tab === 0) return trade.status === 'Pending'; // Open Position (active/pending trades)
    if (tab === 1) return ['Failed', 'Completed'].includes(trade.status); // Closed Position (completed/failed trades)
    return true;
  });

  if (loading) {
    return (
      <DashboardCard title="Trade Management">
        <Box p={3} textAlign="center">
          <Typography>Loading trades...</Typography>
        </Box>
      </DashboardCard>
    );
  }

  if (error) {
    return (
      <DashboardCard title="Trade Management">
        <Box p={3} textAlign="center">
          <Typography color="error">{error}</Typography>
        </Box>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Trade Management">
      <Scrollbar>
        <Box>
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            sx={{
              mb: 2,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
              },
            }}
          >
            <Tab label="Open Position" />
            <Tab label="Closed Position" />
          </Tabs>

          {/* Table based on selected tab */}
          {filteredTrades.length === 0 ? (
            <Box p={3} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                No trades found
              </Typography>
            </Box>
          ) : (
            <>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>S.No.</strong></TableCell>
                    <TableCell><strong>Symbol</strong></TableCell>
                    <TableCell><strong>Type</strong></TableCell>
                    <TableCell><strong>Qty</strong></TableCell>
                    <TableCell><strong>Buy Price</strong></TableCell>
                    <TableCell><strong>LTP</strong></TableCell>
                    <TableCell><strong>Sell Price</strong></TableCell>
                    <TableCell><strong>P&L</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Time</strong></TableCell>
                    <TableCell align="center"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTrades.map((trade) => {
                    const profitLoss = parseFloat(trade.pnl) || 0;
                    const isProfit = profitLoss >= 0;

                    return (
                      <TableRow key={trade.id}>
                        <TableCell>
                          <Typography fontWeight={600}>{filteredTrades.indexOf(trade) + 1}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={600}>{trade.symbol}</Typography>
                          {trade.strategy?.name && (
                            <Typography variant="caption" color="textSecondary">
                              {trade.strategy.name}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={trade.tradeType || trade.type}
                            size="small"
                            color={isBuy(trade) ? 'success' : 'error'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{Math.round(parseFloat(trade.amount || trade.quantity || 0))}</TableCell>
                        <TableCell>₹{parseFloat(trade.price || 0).toFixed(2)}</TableCell>
                        <TableCell>
                          ₹{parseFloat(trade.currentPrice || trade.price || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {trade.type === 'Sell' ? `₹${parseFloat(trade.price || 0).toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell>
                          <Typography
                            color={isProfit ? 'success.main' : 'error.main'}
                            fontWeight={600}
                          >
                            {isProfit ? '+' : ''}₹{profitLoss.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={trade.status}
                            size="small"
                            color={getStatusColor(trade.status)}
                          />
                        </TableCell>
                        <TableCell>{formatTime(trade.createdAt)}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                            {tab === 0 && trade.status === 'Pending' && (
                              <>
                                <Tooltip title="Set Stop Loss / Take Profit">
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handleSlTpClick(trade, 'both')}
                                    sx={{ textTransform: 'none', minWidth: 'auto', px: 1 }}
                                  >
                                    SL/TP
                                  </Button>
                                </Tooltip>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="error"
                                  onClick={() => handleClose(trade)}
                                  sx={{ textTransform: 'none', minWidth: 'auto', px: 1 }}
                                >
                                  Close
                                </Button>
                              </>
                            )}
                            {tab === 1 && trade.status === 'Pending' && (
                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={() => handleClose(trade)}
                                sx={{ textTransform: 'none' }}
                              >
                                Close
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <TablePagination
                  component="div"
                  count={pagination?.total || 0}
                  page={(pagination?.page || 1) - 1}
                  onPageChange={(e, newPage) => goToPage && goToPage(newPage + 1)}
                  rowsPerPage={pagination?.limit || 10}
                  onRowsPerPageChange={(e) => setLimit && setLimit(parseInt(e.target.value, 10))}
                  rowsPerPageOptions={[10, 25, 50]}
                />
              </Box>
            </>
          )}
        </Box>
      </Scrollbar>

      {/* SL/TP Modal */}
      <Dialog
        open={slTpModal.open}
        onClose={handleSlTpClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Set Stop Loss & Take Profit
            </Typography>
            <IconButton onClick={handleSlTpClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ py: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Strategy: {slTpModal.trade?.symbol} ({slTpModal.trade?.strategy?.name})
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Set your profit and loss limits for this position
            </Typography>
            
            <Stack spacing={3}>
              <TextField
                label="Stop Loss Amount (₹)"
                value={slTpValues.sl}
                onChange={(e) => setSlTpValues(prev => ({ ...prev, sl: e.target.value }))}
                type="number"
                fullWidth
                placeholder="Enter stop loss amount"
                helperText="Amount at which you want to limit your loss"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>₹</Box>
                }}
              />
              
              <TextField
                label="Take Profit Amount (₹)"
                value={slTpValues.tp}
                onChange={(e) => setSlTpValues(prev => ({ ...prev, tp: e.target.value }))}
                type="number"
                fullWidth
                placeholder="Enter take profit amount"
                helperText="Amount at which you want to book your profit"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>₹</Box>
                }}
              />
            </Stack>
            
            <Box mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
              <Typography variant="caption" color="text.secondary">
                <strong>Current Position:</strong> ₹{parseFloat(slTpModal.trade?.price || 0).toFixed(2)} | 
                <strong> P&L:</strong> ₹{parseFloat(slTpModal.trade?.pnl || 0).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleSlTpClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSlTpSave} 
            variant="contained" 
            color="primary"
            disabled={!slTpValues.sl && !slTpValues.tp}
          >
            Save SL/TP
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardCard>
  );
};

export default DashboardTradeManagement;