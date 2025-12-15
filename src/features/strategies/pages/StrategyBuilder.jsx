import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Code,
  PlayArrow,
  Stop,
  Save,
  Download,
  Upload,
  Science,
  Timeline,
  Analytics,
  Refresh,
  CheckCircle,
  Error,
  Warning,
  ExpandMore,
  Add,
  Remove,
  SmartToy,
  Build
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../hooks/useToast';
import PageContainer from '../../../components/common/PageContainer';
import Breadcrumb from '../../../components/layout/full/shared/breadcrumb/Breadcrumb';
import CodeEditor from '../components/CodeEditor';
import BacktestResults from '../components/BacktestResults';
import PerformanceMetrics from '../components/PerformanceMetrics';
import AIStrategyWizard from '../components/AIStrategyWizard';
import strategyService from '../../../services/strategyService';

const BCrumb = [
  { to: '/user/dashboard', title: 'Dashboard' },
  { to: '/user/marketplace', title: 'Marketplace' },
  { title: 'Strategy Builder' },
];

const steps = ['Strategy Setup', 'Code Development', 'Backtesting', 'Deployment'];
const aiSteps = ['Describe Strategy', 'Review & Validate', 'Backtesting', 'Deployment'];

const defaultStrategyCode = `# Your AI Trading Strategy
# Define your strategy logic here

def initialize(context):
    """
    Initialize your strategy
    """
    context.stocks = ['RELIANCE', 'TCS', 'INFY']
    context.portfolio_target = {}
    
def handle_data(context, data):
    """
    Main strategy logic - called every trading period
    """
    # Example: Simple moving average crossover
    for stock in context.stocks:
        price = data.current(stock, 'price')
        ma_short = data.history(stock, 'price', 10).mean()
        ma_long = data.history(stock, 'price', 30).mean()
        
        if ma_short > ma_long:
            # Buy signal
            order_target_percent(stock, 0.33)
        else:
            # Sell signal
            order_target_percent(stock, 0)

def before_trading_start(context, data):
    """
    Called before each trading day
    """
    pass

def after_trading_end(context, data):
    """
    Called after each trading day
    """
    pass
`;

const StrategyBuilder = () => {
  const [builderTab, setBuilderTab] = useState(0); // 0 = AI Builder, 1 = Manual Builder
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Common state for both builders
  const [backtestParams, setBacktestParams] = useState({
    startDate: '',
    endDate: '',
    benchmark: 'NIFTY50',
    frequency: 'daily'
  });
  const [backtestResults, setBacktestResults] = useState(null);
  const [backtesting, setBacktesting] = useState(false);
  const [deployed, setDeployed] = useState(false);

  // Dialogs
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [deployDialogOpen, setDeployDialogOpen] = useState(false);

  // AI Builder state
  const [aiActiveStep, setAiActiveStep] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStrategyText, setAiStrategyText] = useState('');
  const [aiGeneratedStrategy, setAiGeneratedStrategy] = useState(null);
  const [aiStrategyConfig, setAiStrategyConfig] = useState({
    name: '',
    description: '',
    segment: 'Indian',
    capital: 100000,
    riskLevel: 'Medium',
    tags: [],
    isPublic: false
  });
  const [aiStrategyCode, setAiStrategyCode] = useState('');
  const [aiCodeErrors, setAiCodeErrors] = useState([]);
  const [aiIsCodeValid, setAiIsCodeValid] = useState(false);

  // Manual Builder state
  const [manualActiveStep, setManualActiveStep] = useState(0);
  const [manualLoading, setManualLoading] = useState(false);
  const [manualStrategyConfig, setManualStrategyConfig] = useState({
    name: '',
    description: '',
    segment: 'Indian',
    capital: 100000,
    riskLevel: 'Medium',
    tags: [],
    isPublic: false
  });
  const [manualStrategyCode, setManualStrategyCode] = useState(`# Manual Trading Strategy
# Write your Python trading strategy here

import numpy as np
import pandas as pd

def initialize(context):
    """
    Initialize your strategy parameters here
    """
    context.symbol = 'RELIANCE'  # Example symbol
    context.capital = 100000
    context.position_size = 0.1  # 10% of capital per trade

def handle_data(context, data):
    """
    Main trading logic goes here
    This function is called for each bar of data
    """
    # Get current price data
    current_price = data[context.symbol].price
    
    # Your trading logic here
    # Example: Simple moving average crossover
    sma_short = data[context.symbol].mavg(10)
    sma_long = data[context.symbol].mavg(20)
    
    # Buy signal
    if sma_short > sma_long and context.portfolio.positions[context.symbol].amount == 0:
        order_target_percent(context.symbol, context.position_size)
    
    # Sell signal
    elif sma_short < sma_long and context.portfolio.positions[context.symbol].amount > 0:
        order_target_percent(context.symbol, 0)`);
  const [manualCodeErrors, setManualCodeErrors] = useState([]);
  const [manualIsCodeValid, setManualIsCodeValid] = useState(false);

  useEffect(() => {
    // Set default dates for both builders
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);

    setBacktestParams(prev => ({
      ...prev,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }));
  }, []);

  // AI Builder Functions
  const aiGenerateStrategy = async () => {
    if (!aiStrategyText.trim()) {
      showToast('Please describe your trading strategy first', 'error');
      return;
    }

    setAiLoading(true);
    try {
      // Simulate AI strategy generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock generated strategy based on user input
      const generatedStrategy = {
        name: `AI Strategy - ${new Date().toLocaleDateString()}`,
        description: aiStrategyText,
        segment: 'Indian',
        capital: 100000,
        riskLevel: 'Medium',
        code: `# AI Generated Trading Strategy
# Based on: ${aiStrategyText}

import numpy as np
import pandas as pd

def initialize(context):
    """
    Initialize strategy based on user requirements
    """
    context.symbols = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK']
    context.capital = ${aiStrategyConfig.capital}
    context.position_size = 0.25  # 25% per position
    
def handle_data(context, data):
    """
    AI Generated Strategy Logic
    """
    for symbol in context.symbols:
        current_price = data.current(symbol, 'price')
        
        # Simple momentum strategy
        ma_10 = data.history(symbol, 'price', 10).mean()
        ma_20 = data.history(symbol, 'price', 20).mean()
        
        if ma_10 > ma_20 * 1.02:  # 2% above long MA
            order_target_percent(symbol, context.position_size)
        elif ma_10 < ma_20 * 0.98:  # 2% below long MA
            order_target_percent(symbol, 0)
            
# Strategy automatically generated by AI based on your description`,
        tags: ['AI Generated', 'Momentum', 'Multi-Asset']
      };
      
      setAiGeneratedStrategy(generatedStrategy);
      setAiStrategyConfig(prev => ({
        ...prev,
        name: generatedStrategy.name,
        description: generatedStrategy.description
      }));
      setAiStrategyCode(generatedStrategy.code);
      setAiIsCodeValid(true);
      
      showToast('Strategy generated successfully by AI!', 'success');
      setAiActiveStep(1); // Move to next step
    } catch (error) {
      showToast('Failed to generate strategy', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const aiHandleNext = () => {
    if (aiActiveStep === 0) {
      aiGenerateStrategy();
      return;
    }
    if (aiActiveStep === 1 && !aiIsCodeValid) {
      showToast('Please fix code errors before proceeding', 'error');
      return;
    }
    setAiActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const aiHandleBack = () => {
    setAiActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const aiValidateStrategyConfig = () => {
    return aiStrategyConfig.name &&
           aiStrategyConfig.description &&
           aiStrategyConfig.segment &&
           aiStrategyConfig.capital > 0;
  };

  const aiHandleConfigChange = (field) => (event) => {
    setAiStrategyConfig(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const aiValidateCode = async () => {
    setAiLoading(true);
    try {
      // Simulate code validation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock validation results
      const mockErrors = [];
      if (!aiStrategyCode.includes('def initialize')) {
        mockErrors.push({
          line: 1,
          message: 'initialize function is required',
          severity: 'error'
        });
      }
      if (!aiStrategyCode.includes('def handle_data')) {
        mockErrors.push({
          line: 1,
          message: 'handle_data function is required',
          severity: 'error'
        });
      }

      setAiCodeErrors(mockErrors);
      setAiIsCodeValid(mockErrors.length === 0);

      if (mockErrors.length === 0) {
        showToast('Code validation successful!', 'success');
      } else {
        showToast(`Found ${mockErrors.length} errors in code`, 'error');
      }
    } catch (error) {
      showToast('Code validation failed', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  // Manual Builder Functions
  const manualHandleNext = () => {
    if (manualActiveStep === 0 && !manualValidateStrategyConfig()) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    if (manualActiveStep === 1 && !manualIsCodeValid) {
      showToast('Please validate your code first', 'error');
      return;
    }
    setManualActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const manualHandleBack = () => {
    setManualActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const manualValidateStrategyConfig = () => {
    return manualStrategyConfig.name &&
           manualStrategyConfig.description &&
           manualStrategyConfig.segment &&
           manualStrategyConfig.capital > 0;
  };

  const manualHandleConfigChange = (field) => (event) => {
    setManualStrategyConfig(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const manualValidateCode = async () => {
    setManualLoading(true);
    try {
      // Simulate code validation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock validation results
      const mockErrors = [];
      if (!manualStrategyCode.includes('def initialize')) {
        mockErrors.push({
          line: 1,
          message: 'initialize function is required',
          severity: 'error'
        });
      }
      if (!manualStrategyCode.includes('def handle_data')) {
        mockErrors.push({
          line: 1,
          message: 'handle_data function is required',
          severity: 'error'
        });
      }

      setManualCodeErrors(mockErrors);
      setManualIsCodeValid(mockErrors.length === 0);

      if (mockErrors.length === 0) {
        showToast('Code validation successful!', 'success');
      } else {
        showToast(`Found ${mockErrors.length} errors in code`, 'error');
      }
    } catch (error) {
      showToast('Code validation failed', 'error');
    } finally {
      setManualLoading(false);
    }
  };

  // Common Functions
  const runBacktest = async () => {
    const isAiBuilder = builderTab === 0;
    const isCodeValid = isAiBuilder ? aiIsCodeValid : manualIsCodeValid;

    if (!isCodeValid) {
      showToast('Please validate your code first', 'error');
      return;
    }

    setBacktesting(true);
    try {
      // Simulate backtesting
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Mock backtest results
      const mockResults = {
        totalReturn: 18.5,
        annualizedReturn: 15.2,
        sharpeRatio: 1.34,
        maxDrawdown: -8.7,
        winRate: 64.2,
        totalTrades: 156,
        profitFactor: 1.89,
        performance: [
          { date: '2023-01-01', value: 100000 },
          { date: '2023-03-01', value: 105000 },
          { date: '2023-06-01', value: 112000 },
          { date: '2023-09-01', value: 108000 },
          { date: '2023-12-01', value: 118500 },
        ],
        trades: [
          { date: '2023-01-15', symbol: 'RELIANCE', action: 'BUY', quantity: 50, price: 2450, pnl: 2500 },
          { date: '2023-01-20', symbol: 'RELIANCE', action: 'SELL', quantity: 50, price: 2500, pnl: 2500 },
          { date: '2023-02-10', symbol: 'TCS', action: 'BUY', quantity: 30, price: 3200, pnl: -800 },
        ]
      };

      setBacktestResults(mockResults);
      showToast('Backtest completed successfully!', 'success');
    } catch (error) {
      showToast('Backtesting failed', 'error');
    } finally {
      setBacktesting(false);
    }
  };

  const saveStrategy = async () => {
    try {
      setAiLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      showToast('Strategy saved successfully!', 'success');
      setSaveDialogOpen(false);
    } catch (error) {
      showToast('Failed to save strategy', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const deployStrategy = async () => {
    if (!backtestResults) {
      showToast('Please run backtest before deployment', 'error');
      return;
    }

    try {
      setAiLoading(true);
      // Simulate deployment
      await new Promise(resolve => setTimeout(resolve, 3000));

      setDeployed(true);
      showToast('Strategy deployed successfully!', 'success');
      setDeployDialogOpen(false);
    } catch (error) {
      showToast('Deployment failed', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    // Set default dates
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);
    
    setBacktestParams(prev => ({
      ...prev,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }));
  }, []);

  const handleNext = () => {
    if (activeStep === 0 && !validateStrategyConfig()) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    if (activeStep === 1 && !isCodeValid) {
      showToast('Please fix code errors before proceeding', 'error');
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateStrategyConfig = () => {
    return strategyConfig.name && 
           strategyConfig.description && 
           strategyConfig.segment && 
           strategyConfig.capital > 0;
  };

  const handleConfigChange = (field) => (event) => {
    setStrategyConfig(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const validateCode = async () => {
    setLoading(true);
    try {
      // Simulate code validation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation results
      const mockErrors = [];
      if (!strategyCode.includes('def initialize')) {
        mockErrors.push({
          line: 1,
          message: 'initialize function is required',
          severity: 'error'
        });
      }
      if (!strategyCode.includes('def handle_data')) {
        mockErrors.push({
          line: 1,
          message: 'handle_data function is required',
          severity: 'error'
        });
      }

      setCodeErrors(mockErrors);
      setIsCodeValid(mockErrors.length === 0);
      
      if (mockErrors.length === 0) {
        showToast('Code validation successful!', 'success');
      } else {
        showToast(`Found ${mockErrors.length} errors in code`, 'error');
      }
    } catch (error) {
      showToast('Code validation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // AI Builder Render Functions
  const renderAiStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <SmartToy sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                AI Strategy Builder
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Describe your trading strategy in simple text and let our AI create the code for you
              </Typography>
              
              <Box sx={{ textAlign: 'left', mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  📝 Describe Your Trading Strategy
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  placeholder={`Example: "I want a momentum strategy that buys stocks when they are trending upward and sells when momentum weakens. Use moving averages to identify trends. Invest in large-cap Indian stocks like Reliance, TCS, HDFC Bank. Risk should be medium level with 25% allocation per stock."`}
                  value={aiStrategyText}
                  onChange={(e) => setAiStrategyText(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '16px',
                      lineHeight: 1.6
                    }
                  }}
                />
              </Box>
              
              <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
                <Typography variant="subtitle2" gutterBottom>
                  💡 Tips for better AI generation:
                </Typography>
                <Typography variant="body2">
                  • Mention specific indicators (RSI, Moving Averages, MACD, etc.)
                  <br />• Specify asset types (stocks, crypto, forex)
                  <br />• Include risk preferences and position sizing
                  <br />• Describe entry and exit conditions
                </Typography>
              </Alert>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Initial Capital (₹)"
                    value={aiStrategyConfig.capital}
                    onChange={aiHandleConfigChange('capital')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    label="Market Segment"
                    value={aiStrategyConfig.segment}
                    onChange={aiHandleConfigChange('segment')}
                  >
                    <MenuItem value="Indian">Indian Stocks</MenuItem>
                    <MenuItem value="US">US Stocks</MenuItem>
                    <MenuItem value="Crypto">Cryptocurrency</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              
              <LoadingButton
                variant="contained"
                size="large"
                startIcon={<SmartToy />}
                onClick={aiGenerateStrategy}
                loading={aiLoading}
                sx={{ minWidth: 200 }}
              >
                {aiLoading ? 'AI is generating...' : 'Generate Strategy with AI'}
              </LoadingButton>
            </Card>
          </Box>
        );
      case 1:
        return (
          <Box>
            {aiGeneratedStrategy && (
              <Alert severity="success" sx={{ mb: 3 }}>
                🎉 Your strategy has been generated successfully! Review the code below and proceed to backtesting.
              </Alert>
            )}
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Code sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        Generated Strategy Code
                      </Typography>
                    </Box>
                    {aiStrategyCode && (
                      <CodeEditor
                        value={aiStrategyCode}
                        onChange={setAiStrategyCode}
                        errors={aiCodeErrors}
                        language="python"
                      />
                    )}
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                      <LoadingButton
                        variant="outlined"
                        startIcon={<Science />}
                        onClick={aiValidateCode}
                        loading={aiLoading}
                      >
                        Validate Code
                      </LoadingButton>
                      <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={() => setAiActiveStep(0)}
                      >
                        Regenerate Strategy
                      </Button>
                    </Box>

                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Strategy Details
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Name
                      </Typography>
                      <Typography variant="body1">
                        {aiStrategyConfig.name}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Capital
                      </Typography>
                      <Typography variant="body1">
                        ₹{aiStrategyConfig.capital.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Market
                      </Typography>
                      <Typography variant="body1">
                        {aiStrategyConfig.segment}
                      </Typography>
                    </Box>
                    {aiGeneratedStrategy?.tags && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Strategy Type
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {aiGeneratedStrategy.tags.map((tag, index) => (
                            <Chip key={index} label={tag} size="small" />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card sx={{ width: '100%', p: 0 }}>
                  <CardContent sx={{ p: 0 }}>
                    <Typography variant="h6" gutterBottom>
                      Backtest Parameters
                    </Typography>
                    <Grid container spacing={3} sx={{ pl: 0 }}>
                      <Grid item xs={12} sx={{ p: 0 }}>
                        <TextField
                          fullWidth
                          type="date"
                          label="Start Date"
                          value={backtestParams.startDate}
                          onChange={(e) => setBacktestParams(prev => ({
                            ...prev,
                            startDate: e.target.value
                          }))}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          type="date"
                          label="End Date"
                          value={backtestParams.endDate}
                          onChange={(e) => setBacktestParams(prev => ({
                            ...prev,
                            endDate: e.target.value
                          }))}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          select
                          label="Benchmark"
                          value={backtestParams.benchmark}
                          onChange={(e) => setBacktestParams(prev => ({
                            ...prev,
                            benchmark: e.target.value
                          }))}
                        >
                          <MenuItem value="NIFTY50">NIFTY 50</MenuItem>
                          <MenuItem value="SENSEX">SENSEX</MenuItem>
                          <MenuItem value="NIFTY500">NIFTY 500</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          select
                          label="Frequency"
                          value={backtestParams.frequency}
                          onChange={(e) => setBacktestParams(prev => ({
                            ...prev,
                            frequency: e.target.value
                          }))}
                        >
                          <MenuItem value="daily">Daily</MenuItem>
                          <MenuItem value="hourly">Hourly</MenuItem>
                          <MenuItem value="minute">1 Minute</MenuItem>
                        </TextField>
                      </Grid>
                    </Grid>
                    <Box mt={3}>
                      <LoadingButton
                        fullWidth
                        size="large"
                        startIcon={<PlayArrow />}
                        onClick={runBacktest}
                        loading={backtesting}
                        variant="contained"
                        disabled={!aiIsCodeValid}
                      >
                        {backtesting ? 'Running Backtest...' : 'Start Backtest'}
                      </LoadingButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Strategy Status
                    </Typography>
                    <Box display="flex" alignItems="center" mb={2}>
                      {aiIsCodeValid ? (
                        <CheckCircle color="success" sx={{ mr: 1 }} />
                      ) : (
                        <Error color="error" sx={{ mr: 1 }} />
                      )}
                      <Typography>
                        Code {aiIsCodeValid ? 'Valid' : 'Invalid'}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={2}>
                      {backtestResults ? (
                        <CheckCircle color="success" sx={{ mr: 1 }} />
                      ) : (
                        <Warning color="warning" sx={{ mr: 1 }} />
                      )}
                      <Typography>
                        Backtest {backtestResults ? 'Complete' : 'Pending'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {backtesting && (
              <Box mt={3}>
                <Typography variant="body2" gutterBottom>
                  Running backtest... This may take a few minutes.
                </Typography>
                <LinearProgress />
              </Box>
            )}

            {backtestResults && (
              <Box mt={3}>
                <BacktestResults results={backtestResults} />
              </Box>
            )}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Deployment Settings
                    </Typography>
                    {backtestResults && (
                      <PerformanceMetrics results={backtestResults} />
                    )}
                    <Divider sx={{ my: 2 }} />
                    <Box display="flex" gap={2}>
                      <Button
                        variant="outlined"
                        startIcon={<Save />}
                        onClick={() => setSaveDialogOpen(true)}
                      >
                        Save Strategy
                      </Button>
                      <LoadingButton
                        variant="contained"
                        startIcon={deployed ? <CheckCircle /> : <PlayArrow />}
                        onClick={() => setDeployDialogOpen(true)}
                        disabled={!backtestResults || deployed}
                        color={deployed ? 'success' : 'primary'}
                      >
                        {deployed ? 'Deployed' : 'Deploy Strategy'}
                      </LoadingButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Deployment Checklist
                    </Typography>
                    <Box display="flex" alignItems="center" mb={1}>
                      <CheckCircle color="success" sx={{ mr: 1 }} />
                      <Typography variant="body2">Strategy configured</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      {aiIsCodeValid ? (
                        <CheckCircle color="success" sx={{ mr: 1 }} />
                      ) : (
                        <Error color="error" sx={{ mr: 1 }} />
                      )}
                      <Typography variant="body2">Code validated</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      {backtestResults ? (
                        <CheckCircle color="success" sx={{ mr: 1 }} />
                      ) : (
                        <Warning color="warning" sx={{ mr: 1 }} />
                      )}
                      <Typography variant="body2">Backtest completed</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      {deployed ? (
                        <CheckCircle color="success" sx={{ mr: 1 }} />
                      ) : (
                        <Warning color="warning" sx={{ mr: 1 }} />
                      )}
                      <Typography variant="body2">Strategy deployed</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  // Manual Builder Render Functions
  const renderManualStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Card sx={{ 
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Box sx={{ 
                    width: 44, 
                    height: 44, 
                    borderRadius: 2, 
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Build sx={{ color: 'white', fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Strategy Configuration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Define your strategy parameters and settings
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  {/* Strategy Name */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Strategy Name *"
                      placeholder="e.g., Momentum Breakout"
                      value={manualStrategyConfig.name}
                      onChange={manualHandleConfigChange('name')}
                      required
                      InputProps={{
                        sx: { py: 0.5 }
                      }}
                    />
                  </Grid>
                  
                  {/* Description */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Description *"
                      placeholder="Brief description of your strategy"
                      value={manualStrategyConfig.description}
                      onChange={manualHandleConfigChange('description')}
                      required
                      InputProps={{
                        sx: { py: 0.5 }
                      }}
                    />
                  </Grid>

                  {/* Market Segment */}
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Market Segment</InputLabel>
                      <Select
                        value={manualStrategyConfig.segment}
                        label="Market Segment"
                        onChange={manualHandleConfigChange('segment')}
                      >
                        <MenuItem value="Indian">Indian</MenuItem>
                        <MenuItem value="US">US</MenuItem>
                        <MenuItem value="Crypto">Crypto</MenuItem>
                        <MenuItem value="Forex">Forex</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  {/* Capital */}
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Capital (₹) *"
                      value={manualStrategyConfig.capital}
                      onChange={manualHandleConfigChange('capital')}
                      required
                      InputProps={{
                        sx: { py: 0.5 }
                      }}
                    />
                  </Grid>
                  
                  {/* Risk Level */}
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Risk Level</InputLabel>
                      <Select
                        value={manualStrategyConfig.riskLevel}
                        label="Risk Level"
                        onChange={manualHandleConfigChange('riskLevel')}
                      >
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  {/* Make Public Toggle */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      height: '100%',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      px: 2,
                      py: 1
                    }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={manualStrategyConfig.isPublic}
                            onChange={(e) => setManualStrategyConfig(prev => ({
                              ...prev,
                              isPublic: e.target.checked
                            }))}
                            color="primary"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              Make Public
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Allow others to subscribe
                            </Typography>
                          </Box>
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Card sx={{ 
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              {/* Header */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 1, 
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Code sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Strategy Code
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Write your trading strategy in Python using Quantopian/Zipline framework
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Upload />}
                    onClick={() => document.getElementById('manual-code-upload').click()}
                  >
                    Import
                  </Button>
                  <input
                    id="manual-code-upload"
                    type="file"
                    accept=".py,.txt"
                    style={{ display: 'none' }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Download />}
                  >
                    Export
                  </Button>
                  <LoadingButton
                    variant="contained"
                    size="small"
                    startIcon={<Science />}
                    onClick={manualValidateCode}
                    loading={manualLoading}
                  >
                    Validate Code
                  </LoadingButton>
                </Box>
              </Box>

              {/* Validation Messages */}
              <Box sx={{ px: 2, pt: 2 }}>
                {manualCodeErrors.length > 0 && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600}>Code Validation Errors:</Typography>
                    {manualCodeErrors.map((error, index) => (
                      <Typography key={index} variant="body2">
                        Line {error.line}: {error.message}
                      </Typography>
                    ))}
                  </Alert>
                )}

                {manualIsCodeValid && (
                  <Alert severity="success" sx={{ mb: 2 }} icon={<CheckCircle />}>
                    <Typography variant="body2" fontWeight={500}>
                      Code validation successful! Your strategy is ready for backtesting.
                    </Typography>
                  </Alert>
                )}
              </Box>

              {/* Code Editor */}
              <Box sx={{ p: 0 }}>
                <CodeEditor
                  value={manualStrategyCode}
                  onChange={setManualStrategyCode}
                  language="python"
                  height="500px"
                />
              </Box>
            </Card>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card sx={{ 
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: 1, 
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Timeline sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        Backtest Parameters
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="date"
                          label="Start Date"
                          value={backtestParams.startDate}
                          onChange={(e) => setBacktestParams(prev => ({
                            ...prev,
                            startDate: e.target.value
                          }))}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="date"
                          label="End Date"
                          value={backtestParams.endDate}
                          onChange={(e) => setBacktestParams(prev => ({
                            ...prev,
                            endDate: e.target.value
                          }))}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Benchmark</InputLabel>
                          <Select
                            value={backtestParams.benchmark}
                            label="Benchmark"
                            onChange={(e) => setBacktestParams(prev => ({
                              ...prev,
                              benchmark: e.target.value
                            }))}
                          >
                            <MenuItem value="NIFTY50">NIFTY 50</MenuItem>
                            <MenuItem value="SENSEX">SENSEX</MenuItem>
                            <MenuItem value="NIFTY500">NIFTY 500</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Frequency</InputLabel>
                          <Select
                            value={backtestParams.frequency}
                            label="Frequency"
                            onChange={(e) => setBacktestParams(prev => ({
                              ...prev,
                              frequency: e.target.value
                            }))}
                          >
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="hourly">Hourly</MenuItem>
                            <MenuItem value="minute">1 Minute</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Box mt={3}>
                      <LoadingButton
                        fullWidth
                        size="large"
                        startIcon={<PlayArrow />}
                        onClick={runBacktest}
                        loading={backtesting}
                        variant="contained"
                        disabled={!manualIsCodeValid}
                      >
                        {backtesting ? 'Running Backtest...' : 'Start Backtest'}
                      </LoadingButton>
                    </Box>
                  </CardContent>
                </Card>

                {backtestResults && (
                  <Card sx={{ mt: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" gap={2} mb={3}>
                        <Box sx={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: 1, 
                          bgcolor: 'success.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Analytics sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        <Typography variant="h6" fontWeight={600}>
                          Deployment Settings
                        </Typography>
                      </Box>
                      <PerformanceMetrics results={backtestResults} />
                      <Divider sx={{ my: 3 }} />
                      <Box display="flex" gap={2}>
                        <Button
                          variant="outlined"
                          startIcon={<Save />}
                          onClick={() => setSaveDialogOpen(true)}
                        >
                          Save Strategy
                        </Button>
                        <LoadingButton
                          variant="contained"
                          startIcon={deployed ? <CheckCircle /> : <PlayArrow />}
                          onClick={() => setDeployDialogOpen(true)}
                          disabled={!backtestResults || deployed}
                          color={deployed ? 'success' : 'primary'}
                        >
                          {deployed ? 'Deployed' : 'Deploy Strategy'}
                        </LoadingButton>
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ 
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Strategy Status
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: 1.5, 
                      borderRadius: 1, 
                      border: '1px solid',
                      borderColor: manualIsCodeValid ? 'success.main' : 'error.main',
                      mb: 2 
                    }}>
                      {manualIsCodeValid ? (
                        <CheckCircle sx={{ mr: 1.5, color: 'success.main' }} />
                      ) : (
                        <Error sx={{ mr: 1.5, color: 'error.main' }} />
                      )}
                      <Typography fontWeight={500}>
                        Code {manualIsCodeValid ? 'Valid' : 'Invalid'}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: 1.5, 
                      borderRadius: 1, 
                      border: '1px solid',
                      borderColor: backtestResults ? 'success.main' : 'warning.main',
                      mb: 2 
                    }}>
                      {backtestResults ? (
                        <CheckCircle sx={{ mr: 1.5, color: 'success.main' }} />
                      ) : (
                        <Warning sx={{ mr: 1.5, color: 'warning.main' }} />
                      )}
                      <Typography fontWeight={500}>
                        Backtest {backtestResults ? 'Complete' : 'Pending'}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: 1.5, 
                      borderRadius: 1, 
                      border: '1px solid',
                      borderColor: deployed ? 'success.main' : 'warning.main'
                    }}>
                      {deployed ? (
                        <CheckCircle sx={{ mr: 1.5, color: 'success.main' }} />
                      ) : (
                        <Warning sx={{ mr: 1.5, color: 'warning.main' }} />
                      )}
                      <Typography fontWeight={500}>
                        Strategy {deployed ? 'Deployed' : 'Not Deployed'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {backtesting && (
              <Box mt={3}>
                <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="body2" gutterBottom fontWeight={500}>
                      Running backtest... This may take a few minutes.
                    </Typography>
                    <LinearProgress />
                  </CardContent>
                </Card>
              </Box>
            )}

            {backtestResults && (
              <Box mt={3}>
                <BacktestResults results={backtestResults} />
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  // AI Builder Render Functions
  return (
    <PageContainer title="Strategy Builder" description="Build and deploy your trading strategies">
      <Breadcrumb title="Strategy Builder" items={BCrumb} />

      <Box mt={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Strategy Builder
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Create, backtest, and deploy your custom trading strategies using AI assistance or manual code writing
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={builderTab} onChange={(e, newValue) => setBuilderTab(newValue)}>
              <Tab
                icon={<SmartToy />}
                label="AI Builder"
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
              <Tab
                icon={<Build />}
                label="Manual Builder"
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
            </Tabs>
          </Box>

          {builderTab === 0 && (
            <AIStrategyWizard />
          )}

          {builderTab === 1 && (
            <>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Build color="primary" />
                Manual Strategy Builder
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Write your strategy code manually in Python
              </Typography>

              <Stepper activeStep={manualActiveStep} sx={{ mb: 4 }}>
                {[
                  'Strategy Setup',
                  'Write Code',
                  'Backtesting & Deployment'
                ].map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Box>
                {renderManualStepContent(manualActiveStep)}
              </Box>

              <Box display="flex" justifyContent="space-between" mt={4}>
                <Button
                  disabled={manualActiveStep === 0}
                  onClick={manualHandleBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={manualHandleNext}
                  disabled={manualActiveStep === 2}
                >
                  Next
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>

      {/* Save Strategy Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Strategy</DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={2}>
            Save your strategy for future use. You can continue working on it later.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <LoadingButton onClick={saveStrategy} loading={aiLoading} variant="contained">
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Deploy Strategy Dialog */}
      <Dialog open={deployDialogOpen} onClose={() => setDeployDialogOpen(false)}>
        <DialogTitle>Deploy Strategy</DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={2}>
            Deploy your strategy to start live trading. Make sure you have reviewed the backtest results.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This will start live trading with real money. Please ensure you understand the risks involved.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeployDialogOpen(false)}>Cancel</Button>
          <LoadingButton onClick={deployStrategy} loading={aiLoading} variant="contained" color="error">
            Deploy
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default StrategyBuilder;