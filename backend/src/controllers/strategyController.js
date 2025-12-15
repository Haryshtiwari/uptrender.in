import { Strategy, User } from '../models/index.js';
import { Op } from 'sequelize';
import { emitStrategyUpdate, emitDashboardUpdate } from '../config/socket.js';

// Get user's strategies
export const getUserStrategies = async (req, res) => {
  try {
    const userId = req.user.id;
    const { segment, isActive, page = 1, limit = 10, search } = req.query;

    const where = { userId };
    if (segment) where.segment = segment;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const strategies = await Strategy.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: strategies.rows,
      pagination: {
        total: strategies.count,
        page: parseInt(page),
        pages: Math.ceil(strategies.count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get strategies error:', error);
    res.status(500).json({ error: 'Failed to fetch strategies' });
  }
};

// Create strategy
export const createStrategy = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      name, segment, capital, symbol, symbolValue, legs, 
      description, type, madeBy 
    } = req.body;

    // Get user's name for createdBy field
    const user = await User.findByPk(userId, { attributes: ['name'] });
    const createdByName = user ? user.name : 'Unknown User';

    const strategy = await Strategy.create({
      userId,
      name,
      segment,
      capital,
      symbol,
      symbolValue,
      legs: legs || 1,
      description,
      type: type || 'Private',
      madeBy: madeBy || 'User',
      createdBy: createdByName,
      isActive: true,
      isRunning: false,
      isPublic: type === 'Public',
      isFavorite: false
    });

    // Emit real-time update
    emitStrategyUpdate(userId, strategy, 'create');
    emitDashboardUpdate(userId, { strategies: { new: strategy } });

    res.status(201).json({
      success: true,
      message: 'Strategy created successfully',
      data: strategy
    });
  } catch (error) {
    console.error('Create strategy error:', error);
    res.status(500).json({ error: 'Failed to create strategy' });
  }
};

// Get strategy by ID
export const getStrategyById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const strategy = await Strategy.findOne({
      where: { id, userId }
    });

    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }

    res.json({
      success: true,
      data: strategy
    });
  } catch (error) {
    console.error('Get strategy error:', error);
    res.status(500).json({ error: 'Failed to fetch strategy' });
  }
};

// Update strategy
export const updateStrategy = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;

    const strategy = await Strategy.findOne({
      where: { id, userId }
    });

    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }

    // Don't allow updating certain fields
    delete updateData.userId;
    delete updateData.id;
    delete updateData.createdAt;

    await strategy.update(updateData);

    res.json({
      success: true,
      message: 'Strategy updated successfully',
      data: strategy
    });
  } catch (error) {
    console.error('Update strategy error:', error);
    res.status(500).json({ error: 'Failed to update strategy' });
  }
};

// Delete strategy
export const deleteStrategy = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const strategy = await Strategy.findOne({
      where: { id, userId }
    });

    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }

    await strategy.destroy();

    res.json({
      success: true,
      message: 'Strategy deleted successfully'
    });
  } catch (error) {
    console.error('Delete strategy error:', error);
    res.status(500).json({ error: 'Failed to delete strategy' });
  }
};

// Toggle strategy running status
export const toggleStrategyRunning = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const strategy = await Strategy.findOne({
      where: { id, userId }
    });

    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }

    await strategy.update({
      isRunning: !strategy.isRunning,
      lastUpdated: new Date().toISOString()
    });

    // Emit real-time update for status change
    emitStrategyUpdate(userId, strategy, 'status_change');
    emitDashboardUpdate(userId, { strategies: { statusChanged: strategy } });

    res.json({
      success: true,
      message: `Strategy ${strategy.isRunning ? 'started' : 'stopped'} successfully`,
      data: strategy
    });
  } catch (error) {
    console.error('Toggle strategy error:', error);
    res.status(500).json({ error: 'Failed to toggle strategy' });
  }
};

// Start strategy
export const startStrategy = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const strategy = await Strategy.findOne({ where: { id, userId } });
    if (!strategy) return res.status(404).json({ error: 'Strategy not found' });
    await strategy.update({ isRunning: true, lastUpdated: new Date().toISOString() });
    emitStrategyUpdate(userId, strategy, 'started');
    emitDashboardUpdate(userId, { strategies: { statusChanged: strategy } });
    res.json({ success: true, message: 'Strategy started successfully', data: strategy });
  } catch (error) {
    console.error('Start strategy error:', error);
    res.status(500).json({ error: 'Failed to start strategy' });
  }
};

// Stop strategy
export const stopStrategy = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const strategy = await Strategy.findOne({ where: { id, userId } });
    if (!strategy) return res.status(404).json({ error: 'Strategy not found' });
    await strategy.update({ isRunning: false, lastUpdated: new Date().toISOString() });
    emitStrategyUpdate(userId, strategy, 'stopped');
    emitDashboardUpdate(userId, { strategies: { statusChanged: strategy } });
    res.json({ success: true, message: 'Strategy stopped successfully', data: strategy });
  } catch (error) {
    console.error('Stop strategy error:', error);
    res.status(500).json({ error: 'Failed to stop strategy' });
  }
};

// Activate strategy (make public)
export const activateStrategy = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const strategy = await Strategy.findOne({ where: { id, userId } });
    if (!strategy) return res.status(404).json({ error: 'Strategy not found' });
    await strategy.update({ 
      isPublic: true, 
      type: 'Public',
      isActive: true, 
      lastUpdated: new Date().toISOString() 
    });
    res.json({ success: true, message: 'Strategy activated successfully', data: strategy });
  } catch (error) {
    console.error('Activate strategy error:', error);
    res.status(500).json({ error: 'Failed to activate strategy' });
  }
};

// Deactivate strategy (make private)
export const deactivateStrategy = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const strategy = await Strategy.findOne({ where: { id, userId } });
    if (!strategy) return res.status(404).json({ error: 'Strategy not found' });
    await strategy.update({ 
      isPublic: false, 
      type: 'Private',
      lastUpdated: new Date().toISOString() 
    });
    res.json({ success: true, message: 'Strategy deactivated successfully', data: strategy });
  } catch (error) {
    console.error('Deactivate strategy error:', error);
    res.status(500).json({ error: 'Failed to deactivate strategy' });
  }
};

// Toggle favorite status
export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const strategy = await Strategy.findOne({
      where: { id, userId }
    });

    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }

    await strategy.update({
      isFavorite: !strategy.isFavorite
    });

    res.json({
      success: true,
      message: `Strategy ${strategy.isFavorite ? 'added to' : 'removed from'} favorites`,
      data: strategy
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
};

// Get marketplace (public strategies)
export const getMarketplaceStrategies = async (req, res) => {
  try {
    const userId = req.user?.id; // Get current user ID
    const { segment, page = 1, limit, search } = req.query;

    // Build where clause - show ALL public strategies (from all users including current user)
    const where = { 
      isPublic: 1
    };
    
    // Do NOT exclude current user's strategies - marketplace shows all public strategies
    
    if (segment && segment !== 'all') {
      where.segment = segment;
    }
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = limit ? (page - 1) * limit : 0;

    console.log('=== MARKETPLACE QUERY ===');
    console.log('User ID:', userId);
    console.log('Where clause:', JSON.stringify(where, null, 2));

    const queryOptions = {
      where,
      order: [['createdAt', 'DESC']], // Changed from performance to createdAt
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'username', 'email'],
          required: false
        }
      ]
    };

    // Only apply limit and offset if limit is specified
    if (limit) {
      queryOptions.limit = parseInt(limit);
      queryOptions.offset = offset;
    }

    const strategies = await Strategy.findAndCountAll(queryOptions);

    console.log(`Found ${strategies.count} marketplace strategies`);
    console.log('Strategy details:', strategies.rows.map(s => ({
      id: s.id,
      name: s.name,
      type: s.type,
      isPublic: s.isPublic,
      userId: s.userId,
      userName: s.user?.name
    })));

    res.json({
      success: true,
      data: strategies.rows,
      pagination: limit ? {
        total: strategies.count,
        page: parseInt(page),
        pages: Math.ceil(strategies.count / parseInt(limit)),
        limit: parseInt(limit)
      } : {
        total: strategies.count,
        page: 1,
        pages: 1,
        limit: strategies.count
      }
    });
  } catch (error) {
    console.error('Get marketplace error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch marketplace strategies',
      message: error.message 
    });
  }
};

// Admin: Get all strategies
export const getAllStrategies = async (req, res) => {
  try {
    const { segment, page = 1, limit = 20, search } = req.query;

    const where = {};
    if (segment) where.segment = segment;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const strategies = await Strategy.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'username']
        }
      ]
    });

    res.json({
      success: true,
      data: strategies.rows,
      pagination: {
        total: strategies.count,
        page: parseInt(page),
        pages: Math.ceil(strategies.count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all strategies error:', error);
    res.status(500).json({ error: 'Failed to fetch strategies' });
  }
};

// Debug: Get all public strategies (without user filter)
export const debugPublicStrategies = async (req, res) => {
  try {
    const strategies = await Strategy.findAll({
      where: {
        [Op.or]: [
          { type: 'Public' },
          { isPublic: true }
        ]
      },
      attributes: ['id', 'name', 'type', 'isPublic', 'userId', 'segment'],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }]
    });
    
    res.json({
      success: true,
      count: strategies.length,
      data: strategies
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Generate code from manual rules
export const generateStrategyCode = async (req, res) => {
  try {
    const { rules, config } = req.body;

    if (!rules || !config) {
      return res.status(400).json({ error: 'Rules and config are required' });
    }

    // Generate Python code from rules
    let code = `# Auto-generated Trading Strategy
# Generated on: ${new Date().toISOString()}

def initialize(context):
    """
    Initialize your strategy
    """
    context.stocks = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK']
    context.portfolio_target = {}
    context.position_size = ${rules.riskManagement?.maxPositionSize ? rules.riskManagement.maxPositionSize / 100 : 0.1}

    # Risk management settings
    context.stop_loss_pct = ${rules.riskManagement?.stopLoss ? rules.riskManagement.stopLoss / 100 : 0.02}
    context.take_profit_pct = ${rules.riskManagement?.takeProfit ? rules.riskManagement.takeProfit / 100 : 0.05}
    context.max_drawdown_pct = ${rules.riskManagement?.maxDrawdown ? rules.riskManagement.maxDrawdown / 100 : 0.1}

def handle_data(context, data):
    """
    Main strategy logic - called every trading period
    """
    for stock in context.stocks:
        try:
            price = data.current(stock, 'price')
            volume = data.current(stock, 'volume')

            # Apply filters
            if volume < ${rules.filters?.volume || 100000}:
                continue
            if price < ${rules.filters?.price?.min || 100} or price > ${rules.filters?.price?.max || 5000}:
                continue

            # Calculate indicators
`;

    // Add indicator calculations
    const indicators = new Set();
    if (rules.entryConditions) {
      rules.entryConditions.forEach(rule => {
        if (rule.indicator === 'SMA') {
          indicators.add(`sma_${rule.period}`);
          code += `            sma_${rule.period} = data.history(stock, 'price', ${rule.period}).mean()\n`;
        } else if (rule.indicator === 'EMA') {
          indicators.add(`ema_${rule.period}`);
          code += `            ema_${rule.period} = data.history(stock, 'price', ${rule.period}, 'ema').iloc[-1]\n`;
        } else if (rule.indicator === 'RSI') {
          indicators.add(`rsi_${rule.period}`);
          code += `            rsi_${rule.period} = data.history(stock, 'price', ${rule.period}, 'rsi').iloc[-1]\n`;
        }
      });
    }

    if (rules.exitConditions) {
      rules.exitConditions.forEach(rule => {
        if (rule.indicator === 'SMA') {
          indicators.add(`sma_${rule.period}`);
          code += `            sma_${rule.period} = data.history(stock, 'price', ${rule.period}).mean()\n`;
        } else if (rule.indicator === 'EMA') {
          indicators.add(`ema_${rule.period}`);
          code += `            ema_${rule.period} = data.history(stock, 'price', ${rule.period}, 'ema').iloc[-1]\n`;
        } else if (rule.indicator === 'RSI') {
          indicators.add(`rsi_${rule.period}`);
          code += `            rsi_${rule.period} = data.history(stock, 'price', ${rule.period}, 'rsi').iloc[-1]\n`;
        }
      });
    }

    code += `
            # Entry conditions
            entry_signal = False
`;

    if (rules.entryConditions) {
      rules.entryConditions.forEach((condition, index) => {
        code += `            # Entry condition ${index + 1}: ${condition.indicator}\n`;
        if (condition.indicator === 'SMA' && condition.comparison === 'crosses_above') {
          const targetSMA = condition.value.replace('SMA_', '');
          code += `            if sma_${condition.period} > sma_${targetSMA} and data.history(stock, 'price', ${condition.period}).iloc[-2] <= data.history(stock, 'price', ${targetSMA}).iloc[-2]:
                entry_signal = True\n`;
        } else if (condition.comparison === 'greater_than') {
          code += `            if sma_${condition.period} > ${condition.value}:
                entry_signal = True\n`;
        } else if (condition.comparison === 'less_than') {
          code += `            if sma_${condition.period} < ${condition.value}:
                entry_signal = True\n`;
        }
      });
    }

    code += `
            # Exit conditions
            exit_signal = False
`;

    if (rules.exitConditions) {
      rules.exitConditions.forEach((condition, index) => {
        code += `            # Exit condition ${index + 1}: ${condition.indicator}\n`;
        if (condition.indicator === 'SMA' && condition.comparison === 'crosses_below') {
          const targetSMA = condition.value.replace('SMA_', '');
          code += `            if sma_${condition.period} < sma_${targetSMA} and data.history(stock, 'price', ${condition.period}).iloc[-2] >= data.history(stock, 'price', ${targetSMA}).iloc[-2]:
                exit_signal = True\n`;
        } else if (condition.comparison === 'greater_than') {
          code += `            if sma_${condition.period} > ${condition.value}:
                exit_signal = True\n`;
        } else if (condition.comparison === 'less_than') {
          code += `            if sma_${condition.period} < ${condition.value}:
                exit_signal = True\n`;
        }
      });
    }

    code += `
            # Execute trades
            current_position = context.portfolio.positions.get(stock, 0)

            if entry_signal and current_position == 0:
                # Buy signal
                order_target_percent(stock, context.position_size)
            elif exit_signal and current_position > 0:
                # Sell signal
                order_target_percent(stock, 0)

        except Exception as e:
            # Skip this stock if there's an error
            continue

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

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.json({
      success: true,
      data: {
        code,
        message: 'Code generated successfully'
      }
    });
  } catch (error) {
    console.error('Code generation error:', error);
    res.status(500).json({ error: 'Failed to generate code' });
  }
};

// Validate strategy code
export const validateStrategyCode = async (req, res) => {
  try {
    const { code, language = 'python' } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // Mock code validation - in production, you would use actual Python/R code validation
    const errors = [];
    const warnings = [];

    // Basic validation checks
    if (!code.includes('def initialize')) {
      errors.push({
        line: 1,
        message: 'initialize function is required',
        severity: 'error'
      });
    }

    if (!code.includes('def handle_data')) {
      errors.push({
        line: 1,
        message: 'handle_data function is required',
        severity: 'error'
      });
    }

    // Check for common issues
    if (code.includes('print(')) {
      warnings.push({
        line: 1,
        message: 'Consider using logging instead of print statements',
        severity: 'warning'
      });
    }

    const isValid = errors.length === 0;

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.json({
      success: true,
      data: {
        isValid,
        errors,
        warnings,
        message: isValid ? 'Code validation successful' : 'Code validation failed'
      }
    });
  } catch (error) {
    console.error('Code validation error:', error);
    res.status(500).json({ error: 'Failed to validate code' });
  }
};

// Run backtest
export const runBacktest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      code, 
      config, 
      backtestParams = {
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        benchmark: 'NIFTY50',
        frequency: 'daily'
      }
    } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Strategy code is required' });
    }

    // Simulate backtest processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock backtest results - in production, you would run actual backtesting
    const mockResults = {
      totalReturn: Math.random() * 30 - 5, // -5% to 25%
      annualizedReturn: Math.random() * 25 - 2, // -2% to 23%
      sharpeRatio: Math.random() * 2 + 0.5, // 0.5 to 2.5
      maxDrawdown: -(Math.random() * 20 + 5), // -5% to -25%
      winRate: Math.random() * 40 + 45, // 45% to 85%
      trades: Math.floor(Math.random() * 200 + 50), // 50 to 250 trades
      profitFactor: Math.random() * 2 + 0.5, // 0.5 to 2.5
      performance: generateMockPerformanceData(backtestParams.startDate, backtestParams.endDate),
      trades: generateMockTrades(),
      startDate: backtestParams.startDate,
      endDate: backtestParams.endDate,
      benchmark: backtestParams.benchmark
    };

    res.json({
      success: true,
      data: mockResults,
      message: 'Backtest completed successfully'
    });
  } catch (error) {
    console.error('Backtest error:', error);
    res.status(500).json({ error: 'Failed to run backtest' });
  }
};

// Deploy strategy
export const deployStrategy = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      name,
      description,
      code, 
      config, 
      backtestResults,
      isPublic = false
    } = req.body;

    if (!name || !code || !backtestResults) {
      return res.status(400).json({ 
        error: 'Strategy name, code, and backtest results are required' 
      });
    }

    // Create the strategy in database
    const strategy = await Strategy.create({
      userId,
      name,
      description: description || '',
      segment: config?.segment || 'Indian',
      capital: config?.capital || 100000,
      legs: 1,
      symbol: config?.symbol || 'NIFTY',
      type: isPublic ? 'Public' : 'Private',
      isPublic,
      isActive: true,
      status: 'deployed',
      code,
      backtestResults: JSON.stringify(backtestResults),
      config: JSON.stringify(config),
      totalReturn: backtestResults.totalReturn || 0,
      sharpeRatio: backtestResults.sharpeRatio || 0,
      maxDrawdown: backtestResults.maxDrawdown || 0,
      winRate: backtestResults.winRate || 0
    });

    // Emit real-time update
    emitStrategyUpdate(userId, {
      type: 'STRATEGY_DEPLOYED',
      strategy: {
        id: strategy.id,
        name: strategy.name,
        status: 'deployed'
      }
    });

    res.json({
      success: true,
      data: strategy,
      message: 'Strategy deployed successfully'
    });
  } catch (error) {
    console.error('Deploy strategy error:', error);
    res.status(500).json({ error: 'Failed to deploy strategy' });
  }
};

// Save draft
export const saveDraft = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      name,
      description,
      code, 
      config,
      draftId
    } = req.body;

    let strategy;
    
    if (draftId) {
      // Update existing draft
      strategy = await Strategy.findOne({
        where: { id: draftId, userId, status: 'draft' }
      });
      
      if (!strategy) {
        return res.status(404).json({ error: 'Draft not found' });
      }
      
      await strategy.update({
        name: name || strategy.name,
        description: description || strategy.description,
        code: code || strategy.code,
        config: JSON.stringify(config || JSON.parse(strategy.config || '{}'))
      });
    } else {
      // Create new draft
      strategy = await Strategy.create({
        userId,
        name: name || 'Untitled Strategy',
        description: description || '',
        segment: config?.segment || 'Indian',
        capital: config?.capital || 100000,
        legs: 1,
        symbol: config?.symbol || 'NIFTY',
        type: 'Private',
        isPublic: false,
        isActive: false,
        status: 'draft',
        code: code || '',
        config: JSON.stringify(config || {})
      });
    }

    res.json({
      success: true,
      data: strategy,
      message: 'Draft saved successfully'
    });
  } catch (error) {
    console.error('Save draft error:', error);
    res.status(500).json({ error: 'Failed to save draft' });
  }
};

// Get user drafts
export const getUserDrafts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const drafts = await Strategy.findAndCountAll({
      where: { 
        userId,
        status: 'draft'
      },
      limit: parseInt(limit),
      offset,
      order: [['updatedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: drafts.rows,
      pagination: {
        total: drafts.count,
        page: parseInt(page),
        pages: Math.ceil(drafts.count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get drafts error:', error);
    res.status(500).json({ error: 'Failed to fetch drafts' });
  }
};

// Helper functions for mock data
function generateMockPerformanceData(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const data = [];
  const initialValue = 100000;
  let currentValue = initialValue;

  for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
    const randomChange = (Math.random() - 0.5) * 0.1; // ±5% monthly change
    currentValue *= (1 + randomChange);
    
    data.push({
      date: d.toISOString().split('T')[0],
      value: Math.round(currentValue)
    });
  }

  return data;
}

function generateMockTrades() {
  const symbols = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK'];
  const trades = [];
  
  for (let i = 0; i < 10; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const action = Math.random() > 0.5 ? 'BUY' : 'SELL';
    const quantity = Math.floor(Math.random() * 100) + 10;
    const price = Math.floor(Math.random() * 1000) + 1000;
    const pnl = (Math.random() - 0.5) * 5000;
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    trades.push({
      date: date.toISOString().split('T')[0],
      symbol,
      action,
      quantity,
      price,
      pnl: Math.round(pnl)
    });
  }
  
  return trades;
}
