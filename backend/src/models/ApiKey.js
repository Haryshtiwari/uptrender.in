import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const ApiKey = sequelize.define('ApiKey', {
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
  segment: {
    type: DataTypes.ENUM('Crypto', 'Forex', 'Indian'),
    allowNull: false
  },
  broker: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apiName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  brokerId: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  mpin: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  totp: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  apiKey: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  apiSecret: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  passphrase: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  autologin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('Active', 'Pending', 'Inactive'),
    defaultValue: 'Pending'
  }
}, {
  tableName: 'apikeys',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['segment'] },
    { fields: ['status'] }
  ]
});

export default ApiKey;