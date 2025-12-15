import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Timeline,
  Assessment
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BacktestResults = ({ results }) => {
  if (!results) return null;

  const getColorByValue = (value, reverse = false) => {
    if (reverse) {
      return value < 0 ? 'success' : 'error';
    }
    return value >= 0 ? 'success' : 'error';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Backtest Results
      </Typography>
      
      {/* Key Metrics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Return
                  </Typography>
                  <Typography variant="h5" color={getColorByValue(results.totalReturn)}>
                    {formatPercentage(results.totalReturn)}
                  </Typography>
                </Box>
                <TrendingUp color={getColorByValue(results.totalReturn)} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Sharpe Ratio
                  </Typography>
                  <Typography variant="h5">
                    {results.sharpeRatio.toFixed(2)}
                  </Typography>
                </Box>
                <Assessment color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Max Drawdown
                  </Typography>
                  <Typography variant="h5" color={getColorByValue(results.maxDrawdown, true)}>
                    {formatPercentage(results.maxDrawdown)}
                  </Typography>
                </Box>
                <TrendingDown color="error" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Win Rate
                  </Typography>
                  <Typography variant="h5" color="success">
                    {results.winRate.toFixed(1)}%
                  </Typography>
                </Box>
                <Timeline color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Metrics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Annualized Return
                  </Typography>
                  <Typography variant="h6">
                    {formatPercentage(results.annualizedReturn)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Trades
                  </Typography>
                  <Typography variant="h6">
                    {results.totalTrades || results.trades || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Profit Factor
                  </Typography>
                  <Typography variant="h6">
                    {results.profitFactor.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Win Rate
                  </Typography>
                  <Typography variant="h6">
                    {results.winRate.toFixed(1)}%
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Assessment
              </Typography>
              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Risk Score</Typography>
                  <Chip 
                    label="Medium" 
                    color="warning" 
                    size="small"
                  />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={65} 
                  color="warning"
                  sx={{ mt: 1 }}
                />
              </Box>
              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Volatility</Typography>
                  <Typography variant="body2">12.4%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={42} 
                  sx={{ mt: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Chart */}
      <Card mb={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Portfolio Performance
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={results.performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Portfolio Value']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Trades Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Trades
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Symbol</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">P&L</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.trades.slice(0, 10).map((trade, index) => (
                  <TableRow key={index}>
                    <TableCell>{trade.date}</TableCell>
                    <TableCell>{trade.symbol}</TableCell>
                    <TableCell>
                      <Chip 
                        label={trade.action} 
                        color={(trade.action || '').toString().toLowerCase() === 'buy' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{trade.quantity}</TableCell>
                    <TableCell align="right">{formatCurrency(trade.price)}</TableCell>
                    <TableCell align="right">
                      <Typography color={getColorByValue(trade.pnl)}>
                        {formatCurrency(trade.pnl)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BacktestResults;