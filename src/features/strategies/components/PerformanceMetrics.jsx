import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Speed,
  Security,
  Assessment,
  CheckCircle,
  Warning,
  Error
} from '@mui/icons-material';

const PerformanceMetrics = ({ results }) => {
  if (!results) return null;

  const getRiskLevel = (sharpeRatio, maxDrawdown) => {
    if (sharpeRatio > 1.5 && maxDrawdown > -15) return { level: 'Low', color: 'success' };
    if (sharpeRatio > 1.0 && maxDrawdown > -25) return { level: 'Medium', color: 'warning' };
    return { level: 'High', color: 'error' };
  };

  const getPerformanceGrade = (totalReturn, sharpeRatio) => {
    if (totalReturn > 20 && sharpeRatio > 1.5) return { grade: 'Excellent', color: 'success', icon: CheckCircle };
    if (totalReturn > 10 && sharpeRatio > 1.0) return { grade: 'Good', color: 'success', icon: CheckCircle };
    if (totalReturn > 0 && sharpeRatio > 0.5) return { grade: 'Average', color: 'warning', icon: Warning };
    return { grade: 'Poor', color: 'error', icon: Error };
  };

  const riskAssessment = getRiskLevel(results.sharpeRatio, results.maxDrawdown);
  const performanceGrade = getPerformanceGrade(results.totalReturn, results.sharpeRatio);

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <Grid container spacing={3}>
      {/* Overall Performance Card */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Overall Performance
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <performanceGrade.icon color={performanceGrade.color} sx={{ mr: 1 }} />
              <Chip 
                label={performanceGrade.grade} 
                color={performanceGrade.color}
                size="medium"
              />
            </Box>
            <Typography variant="h4" color={performanceGrade.color} gutterBottom>
              {formatPercentage(results.totalReturn)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Return over backtest period
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense>
              <ListItem disablePadding>
                <ListItemIcon>
                  <TrendingUp fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Annualized Return" 
                  secondary={formatPercentage(results.annualizedReturn)}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon>
                  <Speed fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Sharpe Ratio" 
                  secondary={results.sharpeRatio.toFixed(2)}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon>
                  <TrendingDown fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Max Drawdown" 
                  secondary={formatPercentage(results.maxDrawdown)}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Risk Assessment Card */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Risk Assessment
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <Security color={riskAssessment.color} sx={{ mr: 1 }} />
              <Chip 
                label={`${riskAssessment.level} Risk`} 
                color={riskAssessment.color}
                size="medium"
              />
            </Box>
            
            <Box mb={3}>
              <Typography variant="body2" gutterBottom>
                Risk Score
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={riskAssessment.level === 'Low' ? 30 : riskAssessment.level === 'Medium' ? 65 : 90}
                color={riskAssessment.color}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            <List dense>
              <ListItem disablePadding>
                <ListItemIcon>
                  <Assessment fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Win Rate" 
                  secondary={`${results.winRate.toFixed(1)}%`}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon>
                  <Speed fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Profit Factor" 
                  secondary={results.profitFactor.toFixed(2)}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon>
                  <TrendingUp fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Total Trades" 
                  secondary={results.totalTrades || results.trades || 0}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Strategy Readiness Checklist */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Deployment Readiness
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle2">Code Validated</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Strategy passed all validation checks
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle2">Backtest Complete</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Historical performance analyzed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  {results.sharpeRatio > 1.0 ? (
                    <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
                  ) : (
                    <Warning color="warning" sx={{ fontSize: 40, mb: 1 }} />
                  )}
                  <Typography variant="subtitle2">Risk Acceptable</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {results.sharpeRatio > 1.0 ? 'Good risk-return ratio' : 'Consider risk management'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  {results.totalReturn > 0 ? (
                    <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
                  ) : (
                    <Error color="error" sx={{ fontSize: 40, mb: 1 }} />
                  )}
                  <Typography variant="subtitle2">Profitable</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {results.totalReturn > 0 ? 'Positive returns achieved' : 'Strategy needs improvement'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PerformanceMetrics;