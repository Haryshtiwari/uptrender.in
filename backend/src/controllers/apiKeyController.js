import { ApiKey, Broker, Charge, Wallet, WalletTransaction, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

// Get user's API keys
export const getUserApiKeys = async (req, res) => {
  try {
    const userId = req.user.id;
    const { segment, status, page = 1, limit = 10 } = req.query;

    const where = { userId };
    if (segment) where.segment = segment;
    if (status) where.status = status;

    const offset = (page - 1) * limit;

    const apiKeys = await ApiKey.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['apiKey', 'apiSecret'] } // Don't send actual keys
    });

    // Map fields for frontend compatibility
    const mappedApiKeys = apiKeys.rows.map(apiKey => {
      const data = apiKey.toJSON();
      return {
        ...data,
        brokerName: data.broker, // Map broker to brokerName for frontend
        isActive: data.status === 'Active', // Map status to boolean isActive
        autoLogin: data.autologin || false // Ensure autoLogin is boolean
      };
    });

    res.json({
      success: true,
      data: mappedApiKeys,
      pagination: {
        total: apiKeys.count,
        page: parseInt(page),
        pages: Math.ceil(apiKeys.count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
};

// Create API key
export const createApiKey = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const userId = req.user.id;
    const { 
      segment, broker, apiName, brokerId, mpin, totp, 
      apiKey, apiSecret, passphrase, autoLogin
    } = req.body;

    // Validate required fields
    if (!segment || !broker || !apiName || !brokerId || !apiKey || !apiSecret) {
      await transaction.rollback();
      return res.status(400).json({ 
        error: 'Missing required fields: segment, broker, apiName, brokerId, apiKey, apiSecret' 
      });
    }

    // Check for API key charge
    const charge = await Charge.findOne({
      where: { chargeType: 'api_key', isActive: true }
    });

    if (charge && charge.amount > 0) {
      // Get user wallet
      const wallet = await Wallet.findOne({ where: { userId } });
      
      if (!wallet) {
        await transaction.rollback();
        return res.status(400).json({ 
          success: false,
          error: 'Wallet not found. Please contact support.' 
        });
      }

      // Check if wallet has sufficient balance
      if (parseFloat(wallet.balance) < parseFloat(charge.amount)) {
        await transaction.rollback();
        return res.status(400).json({ 
          success: false,
          error: `Insufficient wallet balance. ₹${charge.amount} required to add API key.`,
          requiredAmount: parseFloat(charge.amount),
          currentBalance: parseFloat(wallet.balance)
        });
      }

      // Deduct charge from wallet
      const newBalance = parseFloat(wallet.balance) - parseFloat(charge.amount);
      await wallet.update({ balance: newBalance }, { transaction });

      // Create wallet transaction
      await WalletTransaction.create({
        walletId: wallet.id,
        type: 'debit',
        amount: charge.amount,
        balanceAfter: newBalance,
        description: `API key addition charge - ${apiName}`,
        reference: `api_key_${Date.now()}`,
        status: 'completed'
      }, { transaction });
    }

    const newApiKey = await ApiKey.create({
      userId,
      segment,
      broker,
      apiName,
      brokerId,
      mpin: mpin || null,
      totp: totp || null,
      apiKey,
      apiSecret,
      passphrase: passphrase || null,
      autologin: autoLogin || false,
      status: 'Active'
    }, { transaction });

    await transaction.commit();

    // Don't return actual keys in response and map fields for frontend
    const response = newApiKey.toJSON();
    delete response.apiKey;
    delete response.apiSecret;
    
    // Map fields for frontend compatibility
    const mappedResponse = {
      ...response,
      brokerName: response.broker,
      isActive: response.status === 'Active',
      autoLogin: response.autologin || false
    };

    res.status(201).json({
      success: true,
      message: charge && charge.amount > 0 
        ? `API key created successfully. ₹${charge.amount} deducted from wallet.`
        : 'API key created successfully',
      data: mappedResponse,
      chargeDeducted: charge ? parseFloat(charge.amount) : 0
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create API key error:', error);
    res.status(500).json({ error: 'Failed to create API key' });
  }
};

// Get API key by ID (with actual keys for verification)
export const getApiKeyById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const apiKey = await ApiKey.findOne({
      where: { id, userId },
      include: [
        {
          model: Broker,
          as: 'broker',
          attributes: ['id', 'name', 'segment', 'apiBaseUrl']
        }
      ]
    });

    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }

    res.json({
      success: true,
      data: apiKey
    });
  } catch (error) {
    console.error('Get API key error:', error);
    res.status(500).json({ error: 'Failed to fetch API key' });
  }
};

// Update API key
export const updateApiKey = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;

    const apiKey = await ApiKey.findOne({
      where: { id, userId }
    });

    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }

    // If setting as default, unset other defaults for this segment
    if (updateData.isDefault) {
      await ApiKey.update(
        { isDefault: false },
        { where: { userId, segment: apiKey.segment, id: { [Op.ne]: id } } }
      );
    }

    // Map frontend fields to database fields
    if ('isActive' in updateData) {
      updateData.status = updateData.isActive ? 'Active' : 'Inactive';
      delete updateData.isActive;
    }
    if ('autoLogin' in updateData) {
      updateData.autologin = updateData.autoLogin;
      delete updateData.autoLogin;
    }
    
    // Don't allow updating certain fields
    delete updateData.userId;
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.brokerName; // This is computed from broker field

    await apiKey.update(updateData);

    // Don't return actual keys and map fields for frontend
    const response = apiKey.toJSON();
    delete response.apiKey;
    delete response.apiSecret;
    
    // Map fields for frontend compatibility
    const mappedResponse = {
      ...response,
      brokerName: response.broker,
      isActive: response.status === 'Active',
      autoLogin: response.autologin || false
    };

    res.json({
      success: true,
      message: 'API key updated successfully',
      data: mappedResponse
    });
  } catch (error) {
    console.error('Update API key error:', error);
    res.status(500).json({ error: 'Failed to update API key' });
  }
};

// Delete API key
export const deleteApiKey = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const apiKey = await ApiKey.findOne({
      where: { id, userId }
    });

    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }

    await apiKey.destroy();

    res.json({
      success: true,
      message: 'API key deleted successfully'
    });
  } catch (error) {
    console.error('Delete API key error:', error);
    res.status(500).json({ error: 'Failed to delete API key' });
  }
};

// Verify API key
export const verifyApiKey = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const apiKey = await ApiKey.findOne({
      where: { id, userId },
      include: [
        {
          model: Broker,
          as: 'broker'
        }
      ]
    });

    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }

    // TODO: Implement actual verification logic with broker API
    // This is a placeholder - you'll need to integrate with each broker's API
    const isValid = true; // Replace with actual verification

    await apiKey.update({
      isVerified: isValid,
      lastVerified: new Date(),
      status: isValid ? 'Active' : 'Invalid'
    });

    res.json({
      success: true,
      message: isValid ? 'API key verified successfully' : 'API key verification failed',
      data: {
        isVerified: isValid,
        status: apiKey.status
      }
    });
  } catch (error) {
    console.error('Verify API key error:', error);
    res.status(500).json({ error: 'Failed to verify API key' });
  }
};

// Set default API key for segment
export const setDefaultApiKey = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const apiKey = await ApiKey.findOne({
      where: { id, userId }
    });

    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }

    // Unset other defaults for this segment
    await ApiKey.update(
      { isDefault: false },
      { where: { userId, segment: apiKey.segment, id: { [Op.ne]: id } } }
    );

    // Set this one as default
    await apiKey.update({ isDefault: true });

    res.json({
      success: true,
      message: 'Default API key set successfully',
      data: apiKey
    });
  } catch (error) {
    console.error('Set default API key error:', error);
    res.status(500).json({ error: 'Failed to set default API key' });
  }
};

// Admin: Get all API keys
export const getAllApiKeys = async (req, res) => {
  try {
    const { segment, status, page = 1, limit = 20 } = req.query;

    const where = {};
    if (segment) where.segment = segment;
    if (status) where.status = status;

    const offset = (page - 1) * limit;

    const apiKeys = await ApiKey.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Broker,
          as: 'broker',
          attributes: ['id', 'name', 'segment']
        }
      ],
      attributes: { exclude: ['apiKey', 'apiSecret'] }
    });

    res.json({
      success: true,
      data: apiKeys.rows,
      pagination: {
        total: apiKeys.count,
        page: parseInt(page),
        pages: Math.ceil(apiKeys.count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all API keys error:', error);
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
};
