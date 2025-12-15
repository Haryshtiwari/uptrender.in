-- Migration: Add franchise support to the system
-- Date: 2025-12-01

-- Step 1: Modify users table to support franchise role
ALTER TABLE `users` 
MODIFY COLUMN `role` ENUM('admin', 'user', 'franchise') NOT NULL DEFAULT 'user';

-- Step 2: Add franchise-related fields to users table
ALTER TABLE `users`
ADD COLUMN `franchiseId` VARCHAR(50) UNIQUE AFTER `clientId`,
ADD COLUMN `isFranchise` TINYINT(1) DEFAULT 0 AFTER `role`,
ADD COLUMN `parentFranchiseId` INT UNSIGNED NULL AFTER `franchiseId`,
ADD COLUMN `franchiseName` VARCHAR(255) NULL AFTER `parentFranchiseId`,
ADD COLUMN `franchiseCommission` DECIMAL(5,2) DEFAULT 0.00 AFTER `franchiseName`,
ADD COLUMN `franchiseStatus` ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active' AFTER `franchiseCommission`,
ADD COLUMN `franchiseJoinedDate` DATE NULL AFTER `franchiseStatus`;

-- Step 3: Create franchise_stats table for tracking franchise statistics
CREATE TABLE IF NOT EXISTS `franchise_stats` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `franchiseUserId` INT UNSIGNED NOT NULL,
  `totalUsers` INT DEFAULT 0,
  `activeUsers` INT DEFAULT 0,
  `totalTrades` INT DEFAULT 0,
  `totalVolume` DECIMAL(20, 2) DEFAULT 0.00,
  `totalRevenue` DECIMAL(20, 2) DEFAULT 0.00,
  `totalCommission` DECIMAL(20, 2) DEFAULT 0.00,
  `month` VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_franchise_month` (`franchiseUserId`, `month`),
  KEY `idx_franchiseUserId` (`franchiseUserId`),
  CONSTRAINT `fk_franchise_stats_user` FOREIGN KEY (`franchiseUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 4: Create franchise_users junction table to track which users belong to which franchise
CREATE TABLE IF NOT EXISTS `franchise_users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `franchiseUserId` INT UNSIGNED NOT NULL,
  `userId` INT UNSIGNED NOT NULL,
  `joinedDate` DATE NOT NULL,
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_franchise_user` (`franchiseUserId`, `userId`),
  KEY `idx_franchiseUserId` (`franchiseUserId`),
  KEY `idx_userId` (`userId`),
  CONSTRAINT `fk_franchise_users_franchise` FOREIGN KEY (`franchiseUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_franchise_users_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 5: Add index for better query performance
ALTER TABLE `users` ADD INDEX `idx_isFranchise` (`isFranchise`);
ALTER TABLE `users` ADD INDEX `idx_parentFranchiseId` (`parentFranchiseId`);
