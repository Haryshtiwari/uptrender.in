import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { Close as CloseIcon, Timeline, TrendingUp, TrendingDown } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const BacktestDialog = ({ open, onClose, onBacktest, strategy }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleBacktest = async () => {
    if (!startDate || !endDate) {
      return;
    }

    setLoading(true);
    try {
      await onBacktest({
        strategyId: strategy.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      
      // Mock results for demonstration
      setResults({
        totalTrades: 45,
        winningTrades: 32,
        losingTrades: 13,
        winRate: 71.1,
        totalProfit: 45230.50,
        totalLoss: 12340.25,
        netProfit: 32890.25,
        maxDrawdown: 8.5,
        sharpeRatio: 2.34,
        avgWin: 1413.45,
        avgLoss: 949.25,
        profitFactor: 3.66,
      });
    } catch (error) {
      console.error('Error running backtest:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetBacktest = () => {
    setResults(null);
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <Timeline color="primary" />
            <Typography variant="h6">Backtest Strategy</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {!results ? (
          <>
            <Alert severity="info" sx={{ mb: 3 }}>
              Test your strategy against historical market data to evaluate its performance.
            </Alert>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    slotProps={{ textField: { fullWidth: true } }}
                    maxDate={new Date()}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                    slotProps={{ textField: { fullWidth: true } }}
                    maxDate={new Date()}
                    minDate={startDate}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>

            {loading && (
              <Box display="flex" flexDirection="column" alignItems="center" py={4}>
                <CircularProgress size={60} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Running backtest... This may take a few moments
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <>
            <Alert severity="success" sx={{ mb: 3 }}>
              Backtest completed successfully for the period {startDate?.toLocaleDateString()} to{' '}
              {endDate?.toLocaleDateString()}
            </Alert>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" variant="body2">
                      Total Trades
                    </Typography>
                    <Typography variant="h5">{results.totalTrades}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" variant="body2">
                      Win Rate
                    </Typography>
                    <Typography variant="h5" color="success.main">
                      {results.winRate}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" variant="body2">
                      Net Profit
                    </Typography>
                    <Typography variant="h5" color="success.main">
                      ₹{results.netProfit.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" variant="body2">
                      Sharpe Ratio
                    </Typography>
                    <Typography variant="h5">{results.sharpeRatio}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Metric</TableCell>
                    <TableCell align="right">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <TrendingUp color="success" fontSize="small" />
                        Winning Trades
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Chip label={results.winningTrades} color="success" size="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <TrendingDown color="error" fontSize="small" />
                        Losing Trades
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Chip label={results.losingTrades} color="error" size="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Profit</TableCell>
                    <TableCell align="right" sx={{ color: 'success.main', fontWeight: 600 }}>
                      ₹{results.totalProfit.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Loss</TableCell>
                    <TableCell align="right" sx={{ color: 'error.main', fontWeight: 600 }}>
                      ₹{results.totalLoss.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Average Win</TableCell>
                    <TableCell align="right">₹{results.avgWin.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Average Loss</TableCell>
                    <TableCell align="right">₹{results.avgLoss.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Profit Factor</TableCell>
                    <TableCell align="right">{results.profitFactor}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Max Drawdown</TableCell>
                    <TableCell align="right">{results.maxDrawdown}%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {!results ? (
          <>
            <Button onClick={onClose} variant="outlined" disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleBacktest}
              variant="contained"
              color="primary"
              disabled={!startDate || !endDate || loading}
              startIcon={<Timeline />}
            >
              Run Backtest
            </Button>
          </>
        ) : (
          <>
            <Button onClick={resetBacktest} variant="outlined">
              Run Another Test
            </Button>
            <Button onClick={onClose} variant="contained" color="primary">
              Close
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BacktestDialog;
