-- Create charges table
CREATE TABLE IF NOT EXISTS `charges` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `chargeType` ENUM('api_key', 'copy_trading_account') NOT NULL UNIQUE COMMENT 'Type of charge',
  `amount` DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT 'Charge amount in rupees',
  `isActive` BOOLEAN DEFAULT TRUE COMMENT 'Whether this charge is currently active',
  `description` VARCHAR(255) DEFAULT NULL COMMENT 'Description of the charge',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `chargeType_unique` (`chargeType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default charges (initially set to 0)
INSERT INTO `charges` (`chargeType`, `amount`, `isActive`, `description`, `createdAt`, `updatedAt`)
VALUES 
  ('api_key', 0.00, TRUE, 'Charge for adding a new API key', NOW(), NOW()),
  ('copy_trading_account', 0.00, TRUE, 'Charge for adding a new copy trading account', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  `updatedAt` = NOW();
