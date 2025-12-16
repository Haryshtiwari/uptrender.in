-- Migration: Create strategy_brokers table
-- Purpose: Store many-to-many relationship between strategies and API keys/brokers
-- Date: 2025-12-16

-- Create strategy_brokers table
CREATE TABLE IF NOT EXISTS `strategy_brokers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `strategyId` int unsigned NOT NULL,
  `apiKeyId` int unsigned NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_strategy_apikey` (`strategyId`, `apiKeyId`),
  KEY `idx_strategyId` (`strategyId`),
  KEY `idx_apiKeyId` (`apiKeyId`),
  CONSTRAINT `fk_strategy_broker_strategy` FOREIGN KEY (`strategyId`) REFERENCES `strategies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_strategy_broker_apikey` FOREIGN KEY (`apiKeyId`) REFERENCES `apikeys` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add index for faster queries
CREATE INDEX `idx_strategy_broker_active` ON `strategy_brokers` (`strategyId`, `isActive`);
