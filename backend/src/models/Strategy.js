import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Strategy = sequelize.define('Strategy', {
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
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  type: {
    type: DataTypes.ENUM('Private', 'Public'),
    defaultValue: 'Private'
  },
  madeBy: {
    type: DataTypes.ENUM('Admin', 'User'),
    defaultValue: 'User'
  },
  createdBy: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  segment: {
    type: DataTypes.ENUM('Forex', 'Crypto', 'Indian'),
    allowNull: false
  },
  capital: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  symbol: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  symbolValue: {
    type: DataTypes.DECIMAL(20, 8),
    allowNull: true
  },
  legs: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  lots: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  expiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  isRunning: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isPaused: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tradeMode: {
    type: DataTypes.ENUM('paper', 'live'),
    defaultValue: 'paper',
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  performance: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: true
  },
  lastUpdated: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  isFavorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'strategies',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['segment'] },
    { fields: ['isPublic'] },
    { fields: ['tradeMode'] }
  ]
});

export default Strategy;