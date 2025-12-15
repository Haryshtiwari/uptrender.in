-- Complete MySQL schema aligned with Sequelize models
-- Drop existing tables if they exist
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `SupportMessages`;
DROP TABLE IF EXISTS `SupportTickets`;
DROP TABLE IF EXISTS `WalletTransactions`;
DROP TABLE IF EXISTS `Wallets`;
DROP TABLE IF EXISTS `Notifications`;
DROP TABLE IF EXISTS `ActivityLogs`;
DROP TABLE IF EXISTS `Settings`;
DROP TABLE IF EXISTS `UsageStats`;
DROP TABLE IF EXISTS `Plans`;
DROP TABLE IF EXISTS `Strategies`;
DROP TABLE IF EXISTS `ApiKeys`;
DROP TABLE IF EXISTS `Trades`;
DROP TABLE IF EXISTS `Brokers`;
DROP TABLE IF EXISTS `PlansCatalog`;
DROP TABLE IF EXISTS `Users`;
SET FOREIGN_KEY_CHECKS = 1;

-- Users table (matches User.js model exactly)
CREATE TABLE `Users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `phone` VARCHAR(20),
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  `currency` VARCHAR(10) DEFAULT 'IND',
  `emailVerified` ENUM('Yes', 'No') DEFAULT 'No',
  `phoneVerified` ENUM('Yes', 'No') DEFAULT 'No',
  `referralCode` VARCHAR(50) UNIQUE,
  `referralLink` VARCHAR(500),
  `referredBy` VARCHAR(100),
  `joinedBy` DATE,
  `clientId` VARCHAR(50) UNIQUE,
  `clientType` ENUM('Individual', 'Organization') DEFAULT 'Individual',
  `organizationName` VARCHAR(255),
  `incorporationNumber` VARCHAR(100),
  `taxId` VARCHAR(100),
  `gstNumber` VARCHAR(100),
  `panNumber` VARCHAR(100),
  `address1` VARCHAR(255),
  `address2` VARCHAR(255),
  `city` VARCHAR(100),
  `state` VARCHAR(100),
  `country` VARCHAR(100),
  `postalCode` VARCHAR(20),
  `contactPhone` VARCHAR(20),
  `contactEmail` VARCHAR(255),
  `kycStatus` ENUM('Verified', 'Pending', 'Rejected') DEFAULT 'Pending',
  `kycLevel` VARCHAR(50),
  `documents` TEXT,
  `verified` ENUM('Yes', 'No') DEFAULT 'No',
  `avatar` VARCHAR(500),
  `settings` JSON,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Brokers table
CREATE TABLE `Brokers` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `segment` ENUM('Crypto', 'Forex', 'Indian') NOT NULL,
  `apiBaseUrl` VARCHAR(255),
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `logoUrl` VARCHAR(500),
  `metadata` JSON,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trades table (matches Trade.js model exactly)
CREATE TABLE `Trades` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` INT UNSIGNED NOT NULL,
  `orderId` VARCHAR(50) NOT NULL UNIQUE,
  `market` ENUM('Forex', 'Crypto', 'Indian') NOT NULL,
  `symbol` VARCHAR(50) NOT NULL,
  `type` ENUM('Buy', 'Sell') NOT NULL,
  `amount` DECIMAL(20, 8) NOT NULL,
  `price` DECIMAL(20, 8) NOT NULL,
  `currentPrice` DECIMAL(20, 8),
  `pnl` DECIMAL(15, 2),
  `pnlPercentage` DECIMAL(7, 2),
  `status` ENUM('Completed', 'Pending', 'Failed') NOT NULL DEFAULT 'Pending',
  `date` DATE NOT NULL,
  `broker` VARCHAR(100) NOT NULL,
  `brokerType` VARCHAR(50),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_status` (`status`),
  KEY `idx_market` (`market`),
  CONSTRAINT `fk_trades_user` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ApiKeys table (matches ApiKey.js model exactly)
CREATE TABLE `ApiKeys` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` INT UNSIGNED NOT NULL,
  `segment` ENUM('Crypto', 'Forex', 'Indian') NOT NULL,
  `broker` VARCHAR(100) NOT NULL,
  `apiName` VARCHAR(255) NOT NULL,
  `brokerId` VARCHAR(100) NOT NULL,
  `mpin` VARCHAR(100),
  `totp` VARCHAR(100),
  `apiKey` VARCHAR(255) NOT NULL,
  `apiSecret` VARCHAR(255) NOT NULL,
  `passphrase` VARCHAR(255),
  `autologin` TINYINT(1) NOT NULL DEFAULT 0,
  `status` ENUM('Active', 'Pending', 'Inactive') NOT NULL DEFAULT 'Pending',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_segment` (`segment`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_apiKeys_user` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Strategies table (matches Strategy.js model exactly)
CREATE TABLE `Strategies` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` INT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `type` ENUM('Private', 'Public') NOT NULL DEFAULT 'Private',
  `madeBy` ENUM('Admin', 'User') NOT NULL DEFAULT 'User',
  `createdBy` VARCHAR(100),
  `segment` ENUM('Forex', 'Crypto', 'Indian') NOT NULL,
  `capital` DECIMAL(15, 2),
  `symbol` VARCHAR(50),
  `symbolValue` DECIMAL(20, 8),
  `legs` INT NOT NULL DEFAULT 1,
  `isRunning` TINYINT(1) NOT NULL DEFAULT 0,
  `isPublic` TINYINT(1) NOT NULL DEFAULT 0,
  `performance` DECIMAL(7, 2),
  `lastUpdated` VARCHAR(50),
  `isFavorite` TINYINT(1) NOT NULL DEFAULT 0,
  `description` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_segment` (`segment`),
  KEY `idx_isPublic` (`isPublic`),
  CONSTRAINT `fk_strategies_user` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Plans table (matches Plan.js model exactly)
CREATE TABLE `Plans` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` INT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `type` ENUM('Monthly', 'Yearly') NOT NULL DEFAULT 'Monthly',
  `price` DECIMAL(10, 2) NOT NULL,
  `totalDays` INT NOT NULL DEFAULT 30,
  `usedDays` INT NOT NULL DEFAULT 0,
  `remainingDays` INT NOT NULL DEFAULT 30,
  `startDate` DATE NOT NULL,
  `endDate` DATE NOT NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_isActive` (`isActive`),
  CONSTRAINT `fk_plans_user` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- UsageStats table (matches UsageStat.js model exactly)
CREATE TABLE `UsageStats` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` INT UNSIGNED NOT NULL,
  `userAccountsCurrent` INT NOT NULL DEFAULT 0,
  `userAccountsLimit` INT NOT NULL DEFAULT 1000,
  `apiIntegrationsCurrent` INT NOT NULL DEFAULT 0,
  `apiIntegrationsLimit` INT NOT NULL DEFAULT 200,
  `tradingStrategiesCurrent` INT NOT NULL DEFAULT 0,
  `tradingStrategiesLimit` INT NOT NULL DEFAULT 300,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  CONSTRAINT `fk_usageStats_user` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PlansCatalog table
CREATE TABLE `PlansCatalog` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `type` ENUM('Free', 'Basic', 'Pro', 'Enterprise') NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `billingCycle` ENUM('Monthly', 'Yearly') NOT NULL,
  `features` JSON,
  `limits` JSON,
  `isActive` TINYINT(1) DEFAULT 1,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Wallets table
CREATE TABLE `Wallets` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` INT UNSIGNED NOT NULL UNIQUE,
  `balance` DECIMAL(12, 2) DEFAULT 0.00,
  `currency` VARCHAR(10) DEFAULT 'INR',
  `status` ENUM('Active', 'Frozen', 'Closed') DEFAULT 'Active',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_wallet_user` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- WalletTransactions table
CREATE TABLE `WalletTransactions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `walletId` INT UNSIGNED NOT NULL,
  `type` ENUM('credit', 'debit') NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `description` VARCHAR(500),
  `reference` VARCHAR(100),
  `balanceAfter` DECIMAL(12, 2),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_transaction_wallet` FOREIGN KEY (`walletId`) REFERENCES `Wallets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications table
CREATE TABLE `Notifications` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` INT UNSIGNED NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `isRead` TINYINT(1) DEFAULT 0,
  `metadata` JSON,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_isRead` (`isRead`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ActivityLogs table
CREATE TABLE `ActivityLogs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` INT UNSIGNED,
  `action` VARCHAR(100) NOT NULL,
  `entityType` VARCHAR(50),
  `entityId` INT UNSIGNED,
  `description` TEXT,
  `ipAddress` VARCHAR(45),
  `userAgent` VARCHAR(500),
  `metadata` JSON,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_action` (`action`),
  CONSTRAINT `fk_activity_user` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Settings table
CREATE TABLE `Settings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` INT UNSIGNED NOT NULL UNIQUE,
  `notifications` JSON,
  `security` JSON,
  `preferences` JSON,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_settings_user` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SupportTickets table
CREATE TABLE `SupportTickets` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticketNumber` VARCHAR(20) NOT NULL UNIQUE,
  `userId` INT UNSIGNED NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `category` ENUM('Technical', 'Billing', 'General', 'Feature Request') NOT NULL,
  `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  `status` ENUM('open', 'in-progress', 'resolved', 'closed') DEFAULT 'open',
  `assignedTo` INT UNSIGNED,
  `description` TEXT NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_ticket_user` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ticket_assigned` FOREIGN KEY (`assignedTo`) REFERENCES `Users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SupportMessages table
CREATE TABLE `SupportMessages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticketId` INT UNSIGNED NOT NULL,
  `authorId` INT UNSIGNED NOT NULL,
  `message` TEXT NOT NULL,
  `attachments` JSON,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ticketId` (`ticketId`),
  CONSTRAINT `fk_message_ticket` FOREIGN KEY (`ticketId`) REFERENCES `SupportTickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_message_author` FOREIGN KEY (`authorId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- StrategySubscriptions table (for tracking user subscriptions to public strategies)
CREATE TABLE `StrategySubscriptions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` INT UNSIGNED NOT NULL,
  `strategyId` INT UNSIGNED NOT NULL,
  `lots` INT NOT NULL DEFAULT 1,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `subscribedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_strategy` (`userId`, `strategyId`),
  KEY `idx_userId` (`userId`),
  KEY `idx_strategyId` (`strategyId`),
  KEY `idx_isActive` (`isActive`),
  CONSTRAINT `fk_subscription_user` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_subscription_strategy` FOREIGN KEY (`strategyId`) REFERENCES `Strategies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert seed data
INSERT INTO `Brokers` (`name`, `segment`, `apiBaseUrl`) VALUES
('Zerodha', 'Indian', 'https://api.kite.trade'),
('Binance', 'Crypto', 'https://api.binance.com'),
('OANDA', 'Forex', 'https://api-fxtrade.oanda.com'),
('Upstox', 'Indian', 'https://api.upstox.com'),
('Coinbase', 'Crypto', 'https://api.coinbase.com');

-- Copy Trading Accounts table
CREATE TABLE `copy_trading_accounts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `type` ENUM('master', 'child') NOT NULL,
  `broker` VARCHAR(30) NOT NULL,
  `api_key` TEXT NOT NULL,
  `secret_key` TEXT NOT NULL,
  `master_account_id` INT UNSIGNED NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_account_name` (`user_id`, `name`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_master_account_id` (`master_account_id`),
  FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`master_account_id`) REFERENCES `copy_trading_accounts`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `PlansCatalog` (`code`, `name`, `type`, `price`, `billingCycle`, `features`, `limits`) VALUES
('FREE', 'Free Plan', 'Free', 0.00, 'Monthly',
 '["1 API Integration", "5 Strategies", "100 Trades/month"]',
 '{"apiKeys": 1, "strategies": 5, "trades": 100}'
),
('BASIC', 'Basic Plan', 'Basic', 199.00, 'Monthly',
 '["3 API Integrations", "20 Strategies", "Unlimited Trades"]',
 '{"apiKeys": 3, "strategies": 20, "trades": -1}'
),
('PRO', 'Pro Plan', 'Pro', 499.00, 'Monthly',
 '["10 API Integrations", "Unlimited Strategies", "Unlimited Trades", "Priority Support"]',
 '{"apiKeys": 10, "strategies": -1, "trades": -1}'
);

-- Insert seed users
INSERT INTO `Users` (`name`, `username`, `email`, `password`, `role`, `status`, `currency`, `emailVerified`, `phoneVerified`, `joinedBy`, `clientId`, `verified`) VALUES
('Admin User', 'admin', 'admin@example.com', '$2b$10$hashedpassword', 'admin', 'Active', 'IND', 'Yes', 'Yes', '2024-01-01', 'ADM001', 'Yes'),
('Demo User 1', 'demo1', 'demo1@example.com', '$2b$10$hashedpassword', 'user', 'Active', 'IND', 'Yes', 'Yes', '2024-01-01', 'USR001', 'Yes'),
('Demo User 2', 'demo2', 'demo2@example.com', '$2b$10$hashedpassword', 'user', 'Active', 'IND', 'Yes', 'Yes', '2024-01-01', 'USR002', 'Yes'),
('Strategy Provider', 'provider', 'provider@example.com', '$2b$10$hashedpassword', 'user', 'Active', 'IND', 'Yes', 'Yes', '2024-01-01', 'USR003', 'Yes');

-- Insert seed strategies (some public, some private)
INSERT INTO `Strategies` (`userId`, `name`, `isActive`, `type`, `madeBy`, `createdBy`, `segment`, `capital`, `symbol`, `symbolValue`, `legs`, `isRunning`, `isPublic`, `performance`, `lastUpdated`, `description`) VALUES
(4, 'Golden Cross Strategy', 1, 'Public', 'User', 'provider', 'Indian', 100000.00, 'NIFTY', 22000.00, 2, 0, 1, 15.50, '2024-01-15', 'A momentum strategy based on moving average crossovers'),
(4, 'RSI Divergence Strategy', 1, 'Public', 'User', 'provider', 'Forex', 50000.00, 'EURUSD', 1.0850, 1, 0, 1, 8.75, '2024-01-14', 'Identifies divergences between price and RSI for entry signals'),
(4, 'Bollinger Band Squeeze', 1, 'Public', 'User', 'provider', 'Crypto', 25000.00, 'BTCUSDT', 45000.00, 1, 0, 1, 22.30, '2024-01-13', 'Trades breakouts from Bollinger Band contractions'),
(2, 'My Private Strategy', 1, 'Private', 'User', 'demo1', 'Indian', 50000.00, 'BANKNIFTY', 48000.00, 1, 0, 0, 5.20, '2024-01-12', 'Personal strategy for bank nifty trading'),
(3, 'User Private Strategy', 1, 'Private', 'User', 'demo2', 'Forex', 30000.00, 'GBPUSD', 1.2750, 2, 0, 0, -2.10, '2024-01-11', 'Custom forex strategy');