import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const StrategySubscription = sequelize.define('StrategySubscription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  strategyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Strategies',
      key: 'id'
    }
  },
  lots: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  tradeMode: {
    type: DataTypes.ENUM('paper', 'live'),
    defaultValue: 'paper',
    allowNull: true
  },
  subscribedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'StrategySubscriptions',
  timestamps: true,
  createdAt: 'subscribedAt',
  updatedAt: 'updatedAt',
  indexes: [
    { fields: ['userId'] },
    { fields: ['strategyId'] },
    { fields: ['isActive'] },
    { fields: ['tradeMode'] },
    { unique: true, fields: ['userId', 'strategyId'] }
  ]
});

export default StrategySubscription;