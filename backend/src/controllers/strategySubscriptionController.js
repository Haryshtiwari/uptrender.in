import { StrategySubscription, Strategy, User, Wallet, WalletTransaction } from '../models/index.js';
import { sequelize } from '../config/database.js';

/**
 * Subscribe to a strategy
 */
export const subscribeToStrategy = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const userId = req.user.id;
    const { strategyId, lots = 1 } = req.body;

    // Check if strategy exists and is public
    const strategy = await Strategy.findByPk(strategyId);
    if (!strategy) {
      await transaction.rollback();
      return res.status(404).json({ success: false, error: 'Strategy not found' });
    }

    if (!strategy.isPublic) {
      await transaction.rollback();
      return res.status(400).json({ success: false, error: 'Cannot subscribe to private strategy' });
    }

    // Check if user is trying to subscribe to their own strategy
    if (strategy.userId === userId) {
      await transaction.rollback();
      return res.status(400).json({ success: false, error: 'Cannot subscribe to your own strategy' });
    }

    // Check if already subscribed
    const existingSubscription = await StrategySubscription.findOne({
      where: { userId, strategyId }
    });

    if (existingSubscription) {
      await transaction.rollback();
      return res.status(400).json({ success: false, error: 'Already subscribed to this strategy' });
    }

    // Check price and wallet balance
    const price = parseFloat(strategy.price) || 0;
    
    if (price > 0) {
      // Get user's wallet
      const wallet = await Wallet.findOne({
        where: { userId },
        transaction
      });

      if (!wallet) {
        await transaction.rollback();
        return res.status(400).json({ success: false, error: 'Wallet not found' });
      }

      const currentBalance = parseFloat(wallet.balance) || 0;
      
      if (currentBalance < price) {
        await transaction.rollback();
        return res.status(400).json({ 
          success: false, 
          error: `Insufficient balance. Required: ₹${price}, Available: ₹${currentBalance}` 
        });
      }

      // Deduct amount from wallet
      await wallet.update({
        balance: currentBalance - price
      }, { transaction });

      // Create wallet transaction record
      await WalletTransaction.create({
        userId,
        walletId: wallet.id,
        type: 'debit',
        amount: price,
        description: `Subscription to strategy: ${strategy.name}`,
        status: 'completed',
        balanceBefore: currentBalance,
        balanceAfter: currentBalance - price
      }, { transaction });
    }

    // Create subscription
    const subscription = await StrategySubscription.create({
      userId,
      strategyId,
      lots: parseInt(lots) || 1,
      isActive: true
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: price > 0 
        ? `Successfully subscribed! ₹${price} deducted from wallet.`
        : 'Successfully subscribed to strategy',
      data: subscription
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Subscribe to strategy error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to subscribe to strategy',
      message: error.message
    });
  }
};

/**
 * Unsubscribe from a strategy
 */
export const unsubscribeFromStrategy = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const subscription = await StrategySubscription.findOne({
      where: { id, userId }
    });

    if (!subscription) {
      return res.status(404).json({ success: false, error: 'Subscription not found' });
    }

    await subscription.destroy();

    res.json({
      success: true,
      message: 'Successfully unsubscribed from strategy'
    });
  } catch (error) {
    console.error('Unsubscribe from strategy error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unsubscribe from strategy',
      message: error.message
    });
  }
};

/**
 * Update subscription (only lots can be updated)
 */
export const updateSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { lots, isActive, tradeMode } = req.body;

    const subscription = await StrategySubscription.findOne({
      where: { id, userId }
    });

    if (!subscription) {
      return res.status(404).json({ success: false, error: 'Subscription not found' });
    }

    const updates = {};
    if (typeof lots !== 'undefined') {
      updates.lots = parseInt(lots) || 1;
    }
    if (typeof isActive !== 'undefined') {
      updates.isActive = !!isActive;
    }
    if (typeof tradeMode !== 'undefined' && ['paper', 'live'].includes(tradeMode)) {
      updates.tradeMode = tradeMode;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No valid fields to update' });
    }

    await subscription.update(updates);

    res.json({
      success: true,
      message: 'Subscription updated successfully',
      data: subscription
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update subscription',
      message: error.message
    });
  }
};

/**
 * Get user's subscriptions
 */
export const getUserSubscriptions = async (req, res) => {
  console.log('getUserSubscriptions called');
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    console.log('Get subscriptions for user:', userId, 'page:', page, 'limit:', limit);

    const offset = (page - 1) * limit;

    console.log('StrategySubscription model:', !!StrategySubscription);
    console.log('Strategy model:', !!Strategy);
    console.log('User model:', !!User);

    const subscriptions = await StrategySubscription.findAndCountAll({
      where: { userId, isActive: true },
      limit: parseInt(limit),
      offset,
      order: [['subscribedAt', 'DESC']],
      include: [
        {
          model: Strategy,
          as: 'strategy',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'username']
            }
          ]
        }
      ]
    });

    console.log('Found subscriptions:', subscriptions.count);

    res.json({
      success: true,
      data: subscriptions.rows,
      pagination: {
        total: subscriptions.count,
        page: page,
        pages: Math.ceil(subscriptions.count / limit),
        limit: limit
      }
    });
  } catch (error) {
    console.error('Get user subscriptions error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscriptions',
      message: error.message,
      details: error.errors ? error.errors.map(e => e.message) : undefined
    });
  }
};

/**
 * Get subscription by ID
 */
export const getSubscriptionById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const subscription = await StrategySubscription.findOne({
      where: { id, userId },
      include: [
        {
          model: Strategy,
          as: 'strategy',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'username']
            }
          ]
        }
      ]
    });

    if (!subscription) {
      return res.status(404).json({ success: false, error: 'Subscription not found' });
    }

    res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscription',
      message: error.message
    });
  }
};