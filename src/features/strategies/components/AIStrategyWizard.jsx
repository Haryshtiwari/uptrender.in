import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Alert,
  Divider,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  SmartToy,
  Send,
  Science,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Timeline,
  Refresh,
  ArrowBack,
  ArrowForward,
  Rocket,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useToast } from '../../../hooks/useToast';
import { useNavigate } from 'react-router-dom';

const AIStrategyWizard = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Step management
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Strategy Configuration', 'Backtest Results', 'Deploy Strategy'];

  // Step 1: Strategy Configuration
  const [segment, setSegment] = useState('indian');
  const [instrument, setInstrument] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [strategyPrompt, setStrategyPrompt] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);

  // Step 2: Backtest Results
  const [backtestResults, setBacktestResults] = useState(null);
  const [backtesting, setBacktesting] = useState(false);

  // Step 3: Deployment
  const [strategyName, setStrategyName] = useState('');
  const [strategyDescription, setStrategyDescription] = useState('');
  const [deploying, setDeploying] = useState(false);

  // Instrument options based on segment
  const instrumentOptions = {
    indian: ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'RELIANCE', 'TCS', 'INFY', 'HDFC'],
    crypto: ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT', 'SOL/USDT'],
    forex: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'],
  };

  const timeframeOptions = [
    { value: '1m', label: '1 Minute' },
    { value: '5m', label: '5 Minutes' },
    { value: '15m', label: '15 Minutes' },
    { value: '1h', label: '1 Hour' },
    { value: '4h', label: '4 Hours' },
    { value: '1d', label: '1 Day' },
    { value: '1w', label: '1 Week' },
  ];

  const handleBacktest = async () => {
    // Validation
    if (!segment || !instrument || !timeframe || !strategyPrompt.trim()) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    if (!startDate || !endDate) {
      showToast('Please select start and end dates for backtesting', 'error');
      return;
    }

    setBacktesting(true);
    
    try {
      // Simulate API call to generate and backtest strategy
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock backtest results
      const mockResults = {
        summary: {
          totalReturn: 24.5,
          annualizedReturn: 18.2,
          sharpeRatio: 1.45,
          maxDrawdown: -12.3,
          winRate: 62.5,
          totalTrades: 145,
          winningTrades: 91,
          losingTrades: 54,
          avgWin: 2.8,
          avgLoss: -1.5,
          profitFactor: 1.87,
        },
        monthlyReturns: [
          { month: 'Jan 2024', return: 3.2 },
          { month: 'Feb 2024', return: -1.5 },
          { month: 'Mar 2024', return: 4.8 },
          { month: 'Apr 2024', return: 2.1 },
          { month: 'May 2024', return: 5.3 },
          { month: 'Jun 2024', return: -2.2 },
        ],
        trades: [
          { date: '2024-01-15', symbol: instrument, type: 'BUY', entry: 18500, exit: 19100, pnl: 600, return: 3.24 },
          { date: '2024-01-22', symbol: instrument, type: 'SELL', entry: 19200, exit: 18900, pnl: 300, return: 1.56 },
          { date: '2024-02-05', symbol: instrument, type: 'BUY', entry: 18800, exit: 18500, pnl: -300, return: -1.60 },
          { date: '2024-02-18', symbol: instrument, type: 'BUY', entry: 19000, exit: 19800, pnl: 800, return: 4.21 },
          { date: '2024-03-10', symbol: instrument, type: 'SELL', entry: 20100, exit: 19600, pnl: 500, return: 2.49 },
        ],
        generatedCode: `# AI Generated Strategy
# Segment: ${segment.toUpperCase()}
# Instrument: ${instrument}
# Timeframe: ${timeframe}

def initialize(context):
    context.instrument = '${instrument}'
    context.timeframe = '${timeframe}'
    context.position_size = 0.1
    
def handle_data(context, data):
    # Strategy: ${strategyPrompt}
    price = data.current(context.instrument, 'close')
    
    # Your AI-generated strategy logic here
    pass
`,
      };

      setBacktestResults(mockResults);
      setActiveStep(1);
      showToast('Backtest completed successfully!', 'success');
    } catch (error) {
      showToast('Failed to run backtest', 'error');
    } finally {
      setBacktesting(false);
    }
  };

  const handleDeploy = async () => {
    if (!strategyName.trim() || !strategyDescription.trim()) {
      showToast('Please provide strategy name and description', 'error');
      return;
    }

    setDeploying(true);
    
    try {
      // Simulate API call to deploy strategy
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast('Strategy deployed successfully!', 'success');
      
      // Navigate to strategies list or show success page
      setTimeout(() => {
        navigate('/user/strategies');
      }, 1500);
    } catch (error) {
      showToast('Failed to deploy strategy', 'error');
    } finally {
      setDeploying(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToy color="primary" />
              Configure Your AI Strategy
            </Typography>

            <Grid container spacing={3}>
              {/* Left Column - Configuration */}
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Market Configuration
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 2 }}>
                    {/* Segment Selection */}
                    <FormControl fullWidth>
                      <InputLabel>Segment</InputLabel>
                      <Select
                        value={segment}
                        label="Segment"
                        onChange={(e) => {
                          setSegment(e.target.value);
                          setInstrument(''); // Reset instrument when segment changes
                        }}
                      >
                        <MenuItem value="indian">Indian Market</MenuItem>
                        <MenuItem value="crypto">Cryptocurrency</MenuItem>
                        <MenuItem value="forex">Forex</MenuItem>
                      </Select>
                    </FormControl>

                    {/* Instrument Selection */}
                    <FormControl fullWidth>
                      <InputLabel>Instrument</InputLabel>
                      <Select
                        value={instrument}
                        label="Instrument"
                        onChange={(e) => setInstrument(e.target.value)}
                        disabled={!segment}
                      >
                        {instrumentOptions[segment]?.map((inst) => (
                          <MenuItem key={inst} value={inst}>
                            {inst}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Timeframe Selection */}
                    <FormControl fullWidth>
                      <InputLabel>Timeframe</InputLabel>
                      <Select
                        value={timeframe}
                        label="Timeframe"
                        onChange={(e) => setTimeframe(e.target.value)}
                      >
                        {timeframeOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Divider sx={{ my: 1 }} />

                    {/* Date Range for Backtesting */}
                    <Typography variant="subtitle2" color="text.secondary">
                      Backtest Period
                    </Typography>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        maxDate={new Date()}
                      />
                      
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        maxDate={new Date()}
                        minDate={startDate}
                      />
                    </LocalizationProvider>
                  </Box>
                </Paper>
              </Grid>

              {/* Right Column - AI Chat Interface */}
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Strategy Instructions (AI)
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={12}
                      placeholder="Describe your trading strategy in natural language...

Examples:
• Buy when price crosses above 50-day MA and sell when it crosses below
• Enter long position when RSI is below 30, take profit at 5%, stop loss at 2%
• Scalping strategy: buy on 5-min chart when MACD crosses up, exit after 10 points or -5 points
• Mean reversion: buy when price is 2 standard deviations below 20-day average, sell when it returns to mean"
                      value={strategyPrompt}
                      onChange={(e) => setStrategyPrompt(e.target.value)}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontFamily: 'monospace',
                        },
                      }}
                    />

                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>Tip:</strong> Be specific about:
                        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                          <li>Entry and exit conditions</li>
                          <li>Stop loss and take profit levels</li>
                          <li>Position sizing rules</li>
                          <li>Technical indicators to use</li>
                        </ul>
                      </Typography>
                    </Alert>
                  </Box>
                </Paper>
              </Grid>

              {/* Action Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <LoadingButton
                    variant="contained"
                    size="large"
                    startIcon={<Science />}
                    onClick={handleBacktest}
                    loading={backtesting}
                    disabled={!segment || !instrument || !timeframe || !strategyPrompt.trim() || !startDate || !endDate}
                  >
                    {backtesting ? 'Running Backtest...' : 'Backtest Now'}
                  </LoadingButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Timeline color="primary" />
              Backtest Results
            </Typography>

            {backtestResults && (
              <Grid container spacing={3}>
                {/* Performance Summary Cards */}
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="text.secondary" gutterBottom variant="body2">
                            Total Return
                          </Typography>
                          <Typography variant="h4" color="success.main">
                            +{backtestResults.summary.totalReturn}%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="text.secondary" gutterBottom variant="body2">
                            Sharpe Ratio
                          </Typography>
                          <Typography variant="h4">
                            {backtestResults.summary.sharpeRatio}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="text.secondary" gutterBottom variant="body2">
                            Max Drawdown
                          </Typography>
                          <Typography variant="h4" color="error.main">
                            {backtestResults.summary.maxDrawdown}%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="text.secondary" gutterBottom variant="body2">
                            Win Rate
                          </Typography>
                          <Typography variant="h4" color="primary.main">
                            {backtestResults.summary.winRate}%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Detailed Metrics */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Performance Metrics
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="Annualized Return" secondary={`${backtestResults.summary.annualizedReturn}%`} />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText primary="Total Trades" secondary={backtestResults.summary.totalTrades} />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Win/Loss" 
                          secondary={`${backtestResults.summary.winningTrades} wins / ${backtestResults.summary.losingTrades} losses`} 
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText primary="Profit Factor" secondary={backtestResults.summary.profitFactor} />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Average Win/Loss" 
                          secondary={`+${backtestResults.summary.avgWin}% / ${backtestResults.summary.avgLoss}%`} 
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>

                {/* Monthly Returns */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Monthly Returns
                    </Typography>
                    <List dense>
                      {backtestResults.monthlyReturns.map((month, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemText primary={month.month} />
                            <Typography 
                              variant="body2" 
                              color={month.return >= 0 ? 'success.main' : 'error.main'}
                              sx={{ fontWeight: 'bold' }}
                            >
                              {month.return >= 0 ? '+' : ''}{month.return}%
                            </Typography>
                          </ListItem>
                          {index < backtestResults.monthlyReturns.length - 1 && <Divider component="li" />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Paper>
                </Grid>

                {/* Trade History */}
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Recent Trades
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Symbol</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell align="right">Entry</TableCell>
                            <TableCell align="right">Exit</TableCell>
                            <TableCell align="right">P&L</TableCell>
                            <TableCell align="right">Return</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {backtestResults.trades.map((trade, index) => (
                            <TableRow key={index}>
                              <TableCell>{trade.date}</TableCell>
                              <TableCell>{trade.symbol}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={trade.type} 
                                  size="small" 
                                  color={trade.type === 'BUY' ? 'success' : 'error'}
                                />
                              </TableCell>
                              <TableCell align="right">₹{trade.entry}</TableCell>
                              <TableCell align="right">₹{trade.exit}</TableCell>
                              <TableCell align="right">
                                <Typography color={trade.pnl >= 0 ? 'success.main' : 'error.main'}>
                                  ₹{trade.pnl}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography color={trade.return >= 0 ? 'success.main' : 'error.main'}>
                                  {trade.return >= 0 ? '+' : ''}{trade.return}%
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBack />}
                      onClick={() => setActiveStep(0)}
                    >
                      Back to Configuration
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      onClick={() => setActiveStep(2)}
                    >
                      Proceed to Deploy
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rocket color="primary" />
              Deploy Your Strategy
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Strategy Details
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Strategy Name"
                      value={strategyName}
                      onChange={(e) => setStrategyName(e.target.value)}
                      placeholder="e.g., NIFTY Moving Average Crossover"
                      required
                    />

                    <TextField
                      fullWidth
                      label="Strategy Description"
                      value={strategyDescription}
                      onChange={(e) => setStrategyDescription(e.target.value)}
                      multiline
                      rows={6}
                      placeholder="Describe your strategy, its objectives, and how it works..."
                      required
                    />

                    <Alert severity="success">
                      <Typography variant="body2">
                        <strong>Strategy Configuration Summary:</strong>
                        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                          <li>Segment: {segment.toUpperCase()}</li>
                          <li>Instrument: {instrument}</li>
                          <li>Timeframe: {timeframe}</li>
                          <li>Backtest Period: {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}</li>
                          <li>Total Return: +{backtestResults?.summary.totalReturn}%</li>
                          <li>Win Rate: {backtestResults?.summary.winRate}%</li>
                        </ul>
                      </Typography>
                    </Alert>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 3, bgcolor: 'primary.light', color: 'white' }}>
                  <Typography variant="h6" gutterBottom>
                    Deployment Checklist
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <CheckCircle sx={{ mr: 1 }} fontSize="small" />
                      <ListItemText primary="Strategy configured" />
                    </ListItem>
                    <ListItem>
                      <CheckCircle sx={{ mr: 1 }} fontSize="small" />
                      <ListItemText primary="Backtest completed" />
                    </ListItem>
                    <ListItem>
                      <CheckCircle sx={{ mr: 1 }} fontSize="small" />
                      <ListItemText primary="Results reviewed" />
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 2, borderColor: 'white' }} />

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Once deployed, your strategy will be available for:
                  </Typography>
                  <List dense>
                    <ListItem>• Live trading execution</ListItem>
                    <ListItem>• Performance monitoring</ListItem>
                    <ListItem>• Real-time alerts</ListItem>
                    <ListItem>• Portfolio integration</ListItem>
                  </List>
                </Paper>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => setActiveStep(1)}
                  >
                    Back to Results
                  </Button>
                  <LoadingButton
                    variant="contained"
                    size="large"
                    color="success"
                    startIcon={<Rocket />}
                    onClick={handleDeploy}
                    loading={deploying}
                    disabled={!strategyName.trim() || !strategyDescription.trim()}
                  >
                    {deploying ? 'Deploying...' : 'Deploy Strategy'}
                  </LoadingButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Stepper */}
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Progress Bar */}
      {(backtesting || deploying) && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
        </Box>
      )}

      {/* Step Content */}
      <Box sx={{ mt: 3 }}>
        {renderStepContent()}
      </Box>
    </Box>
  );
};

export default AIStrategyWizard;
