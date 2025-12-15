import { Trade, User, Strategy, sequelize } from '../models/index.js';
import { Op } from 'sequelize';
import { emitTradeUpdate, emitDashboardUpdate } from '../config/socket.js';

// Get all trades for current user
export const getUserTrades = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, market, page = 1, limit = 10, search } = req.query;

    const where = { userId };
    if (status) where.status = status;
    if (market) where.market = market;
    if (search) {
      where[Op.or] = [
        { symbol: { [Op.like]: `%${search}%` } },
        { orderId: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const trades = await Trade.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: trades.rows,
      pagination: {
        total: trades.count,
        page: parseInt(page),
        pages: Math.ceil(trades.count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get trades error:', error);
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
};

// Create new trade
export const createTrade = async (req, res) => {
  console.log('Create trade request body:', req.body);
  try {
    const userId = req.user.id;
    const { orderId, market, symbol, type, amount, price, broker, brokerType, date } = req.body;

    // Normalize type
    const normalizedType = type === 'BUY' ? 'Buy' : type === 'SELL' ? 'Sell' : type;

    const trade = await Trade.create({
      userId,
      orderId,
      market,
      symbol,
      type: normalizedType,
      amount,
      price,
      broker,
      brokerType,
      date: date || new Date(),
      status: 'Pending'
    });
    console.log('Created trade for user', userId, 'tradeId', trade.id, 'symbol', trade.symbol, 'market', trade.market);

    // Emit real-time update
    emitTradeUpdate(userId, trade, 'create');
    emitDashboardUpdate(userId, { trades: { new: trade } });

    res.status(201).json({
      success: true,
      message: 'Trade created successfully',
      data: trade
    });
  } catch (error) {
    console.error('Create trade error:', error);
    res.status(500).json({ error: 'Failed to create trade' });
  }
};

// Get trade by ID
export const getTradeById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const trade = await Trade.findOne({
      where: { id, userId }
    });

    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    res.json({
      success: true,
      data: trade
    });
  } catch (error) {
    console.error('Get trade error:', error);
    res.status(500).json({ error: 'Failed to fetch trade' });
  }
};

// Update trade
export const updateTrade = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;

    const trade = await Trade.findOne({
      where: { id, userId }
    });

    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    // Don't allow updating certain fields
    delete updateData.userId;
    delete updateData.id;
    delete updateData.createdAt;

    await trade.update(updateData);

    // Emit real-time update
    emitTradeUpdate(userId, trade, 'update');
    emitDashboardUpdate(userId, { trades: { updated: trade } });

    res.json({
      success: true,
      message: 'Trade updated successfully',
      data: trade
    });
  } catch (error) {
    console.error('Update trade error:', error);
    res.status(500).json({ error: 'Failed to update trade' });
  }
};

// Delete trade
export const deleteTrade = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const trade = await Trade.findOne({
      where: { id, userId }
    });

    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    await trade.destroy();

    // Emit real-time update
    emitTradeUpdate(userId, { id }, 'delete');
    emitDashboardUpdate(userId, { trades: { deleted: id } });

    res.json({
      success: true,
      message: 'Trade deleted successfully'
    });
  } catch (error) {
    console.error('Delete trade error:', error);
    res.status(500).json({ error: 'Failed to delete trade' });
  }
};

// Get trade statistics
export const getTradeStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalTrades = await Trade.count({ where: { userId } });
    
    const completedTrades = await Trade.count({
      where: { userId, status: 'Completed' }
    });

    const pendingTrades = await Trade.count({
      where: { userId, status: 'Pending' }
    });

    const failedTrades = await Trade.count({
      where: { userId, status: 'Failed' }
    });

    // Calculate total P&L
    const pnlResult = await Trade.findAll({
      where: { userId, status: 'Completed' },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('pnl')), 'totalPnl'],
        [sequelize.fn('AVG', sequelize.col('pnl')), 'avgPnl']
      ],
      raw: true
    });

    const stats = {
      totalTrades,
      completedTrades,
      pendingTrades,
      failedTrades,
      totalPnl: pnlResult[0].totalPnl || 0,
      avgPnl: pnlResult[0].avgPnl || 0
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get trade stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

// Admin: Get all trades
export const getAllTrades = async (req, res) => {
  try {
    const { status, market, page = 1, limit = 20, search } = req.query;

    const where = {};
    if (status) where.status = status;
    if (market) where.market = market;
    if (search) {
      where[Op.or] = [
        { symbol: { [Op.like]: `%${search}%` } },
        { orderId: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const trades = await Trade.findAndCountAll({
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
      data: trades.rows,
      pagination: {
        total: trades.count,
        page: parseInt(page),
        pages: Math.ceil(trades.count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all trades error:', error);
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
};
