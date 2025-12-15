-- Migration: Add lots and expiryDate columns to strategies table
-- Date: 2025-12-15

-- Add lots column to strategies table
ALTER TABLE `strategies` 
ADD COLUMN `lots` int(11) NOT NULL DEFAULT 1 AFTER `legs`;

-- Add expiryDate column to strategies table
ALTER TABLE `strategies` 
ADD COLUMN `expiryDate` date DEFAULT NULL AFTER `lots`;

-- Update existing strategies to have default lot size of 1
UPDATE `strategies` SET `lots` = 1 WHERE `lots` IS NULL OR `lots` = 0;
