-- Admin Plans table for comprehensive plan management (without foreign keys for now)
CREATE TABLE `AdminPlans` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `duration` INT NOT NULL DEFAULT 30,
  `durationType` ENUM('days', 'months', 'years') NOT NULL DEFAULT 'days',
  `walletBalance` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `features` JSON,
  `isPopular` TINYINT(1) DEFAULT 0,
  `isActive` TINYINT(1) DEFAULT 1,
  `planType` ENUM('basic', 'professional', 'enterprise') NOT NULL DEFAULT 'basic',
  `maxStrategies` INT UNSIGNED,
  `maxTrades` INT UNSIGNED,
  `apiAccess` TINYINT(1) DEFAULT 0,
  `priority` ENUM('low', 'standard', 'high', 'urgent') NOT NULL DEFAULT 'standard',
  `subscribers` INT UNSIGNED DEFAULT 0,
  `createdBy` INT UNSIGNED,
  `updatedBy` INT UNSIGNED,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_admin_plans_active` (`isActive`),
  INDEX `idx_admin_plans_type` (`planType`),
  INDEX `idx_admin_plans_popular` (`isPopular`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default plans
INSERT INTO `AdminPlans` (
  `name`, `description`, `price`, `duration`, `durationType`, `walletBalance`, 
  `features`, `isPopular`, `isActive`, `planType`, `maxStrategies`, `maxTrades`, 
  `apiAccess`, `priority`
) VALUES 
(
  'Basic Plan',
  'Perfect for beginners starting their trading journey',
  29.99,
  30,
  'days',
  1000.00,
  '["Basic Trading Strategies", "5 Active Strategies", "Email Support", "Basic Analytics Dashboard", "Paper Trading Mode"]',
  0,
  1,
  'basic',
  5,
  100,
  0,
  'standard'
),
(
  'Professional Plan',
  'Advanced features for serious traders',
  79.99,
  30,
  'days',
  5000.00,
  '["Advanced Trading Strategies", "20 Active Strategies", "API Access", "Priority Email Support", "Advanced Analytics", "Real-time Market Data", "Strategy Backtesting"]',
  1,
  1,
  'professional',
  20,
  1000,
  1,
  'high'
),
(
  'Enterprise Plan',
  'Complete solution for professional trading teams',
  199.99,
  30,
  'days',
  15000.00,
  '["Unlimited Trading Strategies", "Full API Access", "24/7 Priority Support", "Advanced Analytics Suite", "Multi-account Management", "Custom Strategy Development", "Dedicated Account Manager", "White-label Solutions"]',
  0,
  1,
  'enterprise',
  999,
  10000,
  1,
  'urgent'
);