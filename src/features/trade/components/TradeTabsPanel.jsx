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
  IconButton,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import TablePagination from '@mui/material/TablePagination';
import { isBuy } from '../../../utils/tradeUtils';
import DashboardCard from "../../../components/common/DashboardCard";
import Scrollbar from "../../../components/custom-scroll/Scrollbar";
import { useToast } from "../../../hooks/useToast";

const TradeTabsPanel = ({ trades = [], onUpdate, onDelete, onRefresh, pagination }) => {
  const [tab, setTab] = useState(1); // Defaulting to "Orders"
  const { showSuccess, showError } = useToast();

  const handleDelete = async (tradeId) => {
    try {
      if (!onDelete) {
        showError('Delete function not available');
        return;
      }
      await onDelete(tradeId);
      showSuccess('Trade deleted successfully');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Delete trade error:', error);
      showError(error.message || 'Failed to delete trade');
    }
  };

  const handleClose = async (trade) => {
    try {
      if (!onUpdate) {
        showError('Update function not available');
        return;
      }
      await onUpdate(trade.id, { status: 'Completed' });
      showSuccess('Trade closed successfully');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Close trade error:', error);
      showError(error.message || 'Failed to close trade');
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
    if (tab === 0) return trade.status === 'Open'; // Positions
    if (tab === 1) return ['Pending', 'Failed', 'Completed'].includes(trade.status); // Orders
    return true;
  });

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
          <Tab label="Positions" />
          <Tab label="Orders" />
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
                  <TableCell><strong>Symbol</strong></TableCell>
                  <TableCell><strong>Qty</strong></TableCell>
                  <TableCell><strong>Type</strong></TableCell>
                  <TableCell><strong>Price</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>P&L</strong></TableCell>
                  <TableCell><strong>Time</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTrades.map((trade) => {
                  const profitLoss = parseFloat(trade.profitLoss) || 0;
                  const isProfit = profitLoss >= 0;

                  return (
                    <TableRow key={trade.id}>
                      <TableCell>
                        <Typography fontWeight={600}>{trade.symbol}</Typography>
                        {trade.strategy?.name && (
                          <Typography variant="caption" color="textSecondary">
                            {trade.strategy.name}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{trade.quantity || trade.amount}</TableCell>
                      <TableCell>
                        <Chip
                          label={trade.tradeType || trade.type}
                          size="small"
                          color={isBuy(trade) ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>₹{parseFloat(trade.price || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={trade.status}
                          size="small"
                          color={getStatusColor(trade.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          color={isProfit ? 'success.main' : 'error.main'}
                          fontWeight={600}
                        >
                          {isProfit ? '+' : ''}₹{profitLoss.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatTime(trade.createdAt)}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          {trade.status === 'Open' && (
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
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(trade.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
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
                onPageChange={(e, newPage) => onRefresh && onRefresh({ page: newPage + 1 })}
                rowsPerPage={pagination?.limit || 10}
                onRowsPerPageChange={(e) => onRefresh && onRefresh({ page: 1, limit: parseInt(e.target.value, 10) })}
                rowsPerPageOptions={[10, 25, 50]}
              />
            </Box>
          </>
        )}
      </Box>
      </Scrollbar>
    </DashboardCard>
  );
};

export default TradeTabsPanel;
