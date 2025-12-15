-- Copy Trading Accounts Table Migration
-- Run this script to add the copy_trading_accounts table to the database

CREATE TABLE IF NOT EXISTS `copy_trading_accounts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  `type` enum('master', 'child') NOT NULL,
  `broker` varchar(30) NOT NULL,
  `api_key` text NOT NULL,
  `secret_key` text NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_account_name` (`user_id`, `name`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_is_active` (`is_active`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copy Trading Links Table (for master-child relationships)
CREATE TABLE IF NOT EXISTS `copy_trading_links` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `master_account_id` int(10) unsigned NOT NULL,
  `child_account_id` int(10) unsigned NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_master_child_link` (`master_account_id`, `child_account_id`),
  KEY `idx_master_account` (`master_account_id`),
  KEY `idx_child_account` (`child_account_id`),
  KEY `idx_is_active` (`is_active`),
  FOREIGN KEY (`master_account_id`) REFERENCES `copy_trading_accounts` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`child_account_id`) REFERENCES `copy_trading_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copy Trading Logs Table (for tracking copy trades)
CREATE TABLE IF NOT EXISTS `copy_trading_logs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `master_account_id` int(10) unsigned NOT NULL,
  `child_account_id` int(10) unsigned NOT NULL,
  `trade_type` enum('BUY', 'SELL') NOT NULL,
  `symbol` varchar(20) NOT NULL,
  `quantity` decimal(15,8) NOT NULL,
  `price` decimal(15,8) NOT NULL,
  `status` enum('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING',
  `error_message` text NULL,
  `master_trade_id` varchar(50) NULL,
  `child_trade_id` varchar(50) NULL,
  `executed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_master_account` (`master_account_id`),
  KEY `idx_child_account` (`child_account_id`),
  KEY `idx_status` (`status`),
  KEY `idx_symbol` (`symbol`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`master_account_id`) REFERENCES `copy_trading_accounts` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`child_account_id`) REFERENCES `copy_trading_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;