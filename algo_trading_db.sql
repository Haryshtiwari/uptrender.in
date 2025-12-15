-- phpMyAdmin SQL Dump
-- version 5.2.3-1.el10_0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 08, 2025 at 11:23 AM
-- Server version: 10.11.11-MariaDB
-- PHP Version: 8.3.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `algo_trading_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `activitylogs`
--

CREATE TABLE `activitylogs` (
  `id` int(10) UNSIGNED NOT NULL,
  `userId` int(10) UNSIGNED DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `entityType` varchar(50) DEFAULT NULL,
  `entityId` int(10) UNSIGNED DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ipAddress` varchar(45) DEFAULT NULL,
  `userAgent` varchar(500) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `AdminPlans`
--

CREATE TABLE `AdminPlans` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `duration` int(11) NOT NULL DEFAULT 30,
  `durationType` enum('days','months','years') NOT NULL DEFAULT 'days',
  `walletBalance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `isPopular` tinyint(1) DEFAULT 0,
  `isActive` tinyint(1) DEFAULT 1,
  `planType` enum('basic','professional','enterprise') NOT NULL DEFAULT 'basic',
  `maxStrategies` int(10) UNSIGNED DEFAULT NULL,
  `maxTrades` int(10) UNSIGNED DEFAULT NULL,
  `apiAccess` tinyint(1) DEFAULT 0,
  `priority` enum('low','standard','high','urgent') NOT NULL DEFAULT 'standard',
  `subscribers` int(10) UNSIGNED DEFAULT 0,
  `createdBy` int(10) UNSIGNED DEFAULT NULL,
  `updatedBy` int(10) UNSIGNED DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `AdminPlans`
--

INSERT INTO `AdminPlans` (`id`, `name`, `description`, `price`, `duration`, `durationType`, `walletBalance`, `features`, `isPopular`, `isActive`, `planType`, `maxStrategies`, `maxTrades`, `apiAccess`, `priority`, `subscribers`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`) VALUES
(1, 'Basic Plan', 'Perfect for beginners starting their trading journey', 29.99, 30, 'days', 1000.00, '[\"Basic Trading Strategies\", \"5 Active Strategies\", \"Email Support\", \"Basic Analytics Dashboard\", \"Paper Trading Mode\"]', 0, 1, 'basic', 5, 100, 0, 'standard', 0, NULL, NULL, '2025-12-02 09:43:28', '2025-12-02 09:43:28'),
(2, 'Professional Plan', 'Advanced features for serious traders', 79.99, 30, 'days', 5000.00, '[\"Advanced Trading Strategies\", \"20 Active Strategies\", \"API Access\", \"Priority Email Support\", \"Advanced Analytics\", \"Real-time Market Data\", \"Strategy Backtesting\"]', 1, 1, 'professional', 20, 1000, 1, 'high', 0, NULL, NULL, '2025-12-02 09:43:28', '2025-12-02 09:43:28'),
(3, 'Enterprise Plan', 'Complete solution for professional trading teams', 199.99, 30, 'days', 15000.00, '[\"Unlimited Trading Strategies\", \"Full API Access\", \"24/7 Priority Support\", \"Advanced Analytics Suite\", \"Multi-account Management\", \"Custom Strategy Development\", \"Dedicated Account Manager\", \"White-label Solutions\"]', 0, 1, 'enterprise', 999, 10000, 1, 'urgent', 0, NULL, NULL, '2025-12-02 09:43:28', '2025-12-02 09:43:28'),
(4, 'dfdfdf', 'zxzxz', 1212.00, 30, 'days', 1212.00, '[\"1212wsdsx\"]', 0, 1, 'basic', 1212, 1212, 0, 'standard', 0, 11, 11, '2025-12-02 09:50:25', '2025-12-02 09:50:25');

-- --------------------------------------------------------

--
-- Table structure for table `apikeys`
--

CREATE TABLE `apikeys` (
  `id` int(10) UNSIGNED NOT NULL,
  `userId` int(10) UNSIGNED NOT NULL,
  `segment` enum('Crypto','Forex','Indian') NOT NULL,
  `broker` varchar(100) NOT NULL,
  `apiName` varchar(255) NOT NULL,
  `brokerId` varchar(100) NOT NULL,
  `mpin` varchar(100) DEFAULT NULL,
  `totp` varchar(100) DEFAULT NULL,
  `apiKey` varchar(255) NOT NULL,
  `apiSecret` varchar(255) NOT NULL,
  `passphrase` varchar(255) DEFAULT NULL,
  `autologin` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('Active','Pending','Inactive') NOT NULL DEFAULT 'Pending',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `apikeys`
--

INSERT INTO `apikeys` (`id`, `userId`, `segment`, `broker`, `apiName`, `brokerId`, `mpin`, `totp`, `apiKey`, `apiSecret`, `passphrase`, `autologin`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 7, 'Crypto', 'Binance', 'dfdfdf', 'dfdfdf', 'dfdfd', 'fdfdf', 'dfdfdf', 'dfdfdfd', 'fdfdf', 1, 'Active', '2025-12-01 09:22:13', '2025-12-01 09:22:45'),
(2, 7, 'Crypto', 'Binance', 'cxcx', 'cxcxc', 'xcxcx', 'cxcxc', 'xcxcx', 'cxcxc', 'xc', 1, 'Active', '2025-12-01 09:22:25', '2025-12-01 09:22:44'),
(3, 7, 'Indian', 'AngelOne', 'xfcxdfd', 'fdfdf', 'dfdfd', 'fdfdf', 'dfdfxdfcx', ' vbvbvb', NULL, 1, 'Active', '2025-12-01 09:22:36', '2025-12-01 09:22:48');

-- --------------------------------------------------------

--
-- Table structure for table `brokers`
--

CREATE TABLE `brokers` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `segment` enum('Crypto','Forex','Indian') NOT NULL,
  `apiBaseUrl` varchar(255) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `logoUrl` varchar(500) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brokers`
--

INSERT INTO `brokers` (`id`, `name`, `segment`, `apiBaseUrl`, `status`, `logoUrl`, `metadata`, `createdAt`, `updatedAt`) VALUES
(1, 'Zerodha', 'Indian', 'https://api.kite.trade', 'Active', NULL, NULL, '2025-11-11 11:28:34', '2025-11-11 11:28:34'),
(2, 'Binance', 'Crypto', 'https://api.binance.com', 'Active', NULL, NULL, '2025-11-11 11:28:34', '2025-11-11 11:28:34'),
(3, 'OANDA', 'Forex', 'https://api-fxtrade.oanda.com', 'Active', NULL, NULL, '2025-11-11 11:28:34', '2025-11-11 11:28:34'),
(4, 'Upstox', 'Indian', 'https://api.upstox.com', 'Active', NULL, NULL, '2025-11-11 11:28:34', '2025-11-11 11:28:34'),
(5, 'Coinbase', 'Crypto', 'https://api.coinbase.com', 'Active', NULL, NULL, '2025-11-11 11:28:34', '2025-11-11 11:28:34'),
(6, 'Angel One', 'Indian', 'https://smartapi.angelbroking.com', 'Active', 'https://www.angelone.in/images/logo.svg', '{\"description\":\"Full-service broker with SmartAPI\",\"supportedMarkets\":[\"NSE\",\"BSE\",\"MCX\",\"NFO\"],\"features\":[\"Equity\",\"F&O\",\"Commodity\",\"Currency\",\"Mutual Funds\"]}', '2025-11-11 06:20:05', '2025-11-11 06:20:05'),
(7, 'WazirX', 'Crypto', 'https://api.wazirx.com', 'Active', 'https://wazirx.com/static/media/logo.svg', '{\"description\":\"India\'s most trusted crypto exchange\",\"supportedMarkets\":[\"Spot\",\"P2P\"],\"features\":[\"100+ Cryptocurrencies\",\"INR Deposits\",\"P2P Trading\"]}', '2025-11-11 06:20:05', '2025-11-11 06:20:05'),
(8, 'FXCM', 'Forex', 'https://api.fxcm.com', 'Active', 'https://www.fxcm.com/img/logo.svg', '{\"description\":\"Global forex and CFD broker\",\"supportedMarkets\":[\"Forex\",\"Indices\",\"Commodities\",\"Crypto\"],\"features\":[\"Forex Trading\",\"Advanced Charting\",\"Copy Trading\"]}', '2025-11-11 06:20:05', '2025-11-11 06:20:05');

-- --------------------------------------------------------

--
-- Table structure for table `copy_trading_accounts`
--

CREATE TABLE `copy_trading_accounts` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `type` enum('master','child') NOT NULL,
  `broker` varchar(30) NOT NULL,
  `api_key` text NOT NULL,
  `secret_key` text NOT NULL,
  `master_account_id` int(10) UNSIGNED DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `copy_trading_accounts`
--

INSERT INTO `copy_trading_accounts` (`id`, `user_id`, `name`, `type`, `broker`, `api_key`, `secret_key`, `master_account_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 7, 'john.trdfdsfdsfdsfader@example.com', 'master', 'sefrsdrf', 'ec154315076e744caa022300e83285e6:09dde35832d46225c81c90aa9a6386aa', 'e35f52c9982e9ddc0e6712be84b6ff51:13a6bc383408121f1bd633fa3461c57a', NULL, 1, '2025-12-01 10:23:59', '2025-12-01 10:23:59'),
(2, 7, 'ghgfh', 'child', 'ghgfhgfh', 'f6421fddaaed0b610863829a3f673cc3:bb84dfba81a5ef79c404ef19cc6a776a883f2b1d11afa3d85daf950a1cb6ec95', '3b04ed43662e65bc4fbce47347f0e155:c7dd0d54cf602c6bfaf87124c5540c7f', NULL, 1, '2025-12-01 10:24:19', '2025-12-01 10:24:19'),
(3, 7, 'ghghgh', 'child', 'ghghgh', '9878738f3133bfa7e76f09ed3934638b:c39a04741b3c835d7a2c2436a5ba0250d1e6e6a0f09eb33896db1db196397d3f', 'cb129416050d25723293ba46a7cd57f3:9bdcf6a9a698b8dfb04f61040ff99fdc981c9eb8072d52ef05012beea2ffc4f6', NULL, 1, '2025-12-01 10:24:28', '2025-12-01 10:24:28'),
(4, 7, 'ghgjhjjj', 'master', 'hjjgh', '3b9e79af79efac7d4489fbb28d9466f3:0689267db8423aeed3f7845e238716dc78bf34444a2bf5893134a3c6360b9931', 'a678634c5d9e9abc5a5116af9d26f7a3:7eeffc72721c06ae2ce1e5c20a0eefd7', NULL, 1, '2025-12-01 10:24:39', '2025-12-01 10:24:39'),
(5, 7, 'zxczxczxc', 'master', 'xcxzcxzc', 'df924ffab02e78c5d3656f29cb15e183:2ec6bcddda199ce49396d28049999ceee3ffa108e1c450592620e0ca774b7320', 'f49401ceffce0a171e93af89a48bf85b:11edcd4d69ee68c2ef5a30b57a6572b7', NULL, 1, '2025-12-01 12:40:02', '2025-12-01 12:50:56'),
(6, 7, 'xcxzc', 'child', 'xcxc', '2eedd141d65c67d794984aee69c75851:219e3faad4c1ce96d83b3374a767844f508d8963e44f431634ae7cc75fb416e9', '3c7532ffeba9baf69c3a4067d4d60bf2:c2706169fdf7f8f915e113f3147bfb0d', 5, 1, '2025-12-01 12:40:11', '2025-12-01 12:40:11'),
(7, 7, 'xcxzccxcx', 'child', 'xzcxzccxc', 'e1cd1fde669a66c9bb619ac88aeed1e6:f1fa97a69fd4f0254ba7440933064e2d20e8579edbc28f421da16cb454b7f01a26663679de15d909b11f6ce86ab0d006', '84a0d6aae17854e1f7b8b13a5213d90a:e172ba3e721ce9cde3eb07c2f2a2c9a3a620acfc8336cef93f1690ca1ebfaa51', 4, 1, '2025-12-01 12:40:43', '2025-12-01 12:40:43'),
(8, 7, 'cvbvbv', 'child', 'vbvbvb', '48ba9c1ff19d95185e6a6f94c3c338f4:bd06f91e34abccf12af8d567b232649cea598dcb80798c6d6db25d62a68ef0035c395f2e92b2b241a2d0bbb7fd779356', '4b39352516eebf393d1f929d579862e8:35c8c3f974c41e930cc70660f1437b95644e0b4be2303c6b2f76e49a2d72fd2a', 5, 1, '2025-12-01 12:41:02', '2025-12-01 12:41:02');

-- --------------------------------------------------------

--
-- Table structure for table `copy_trading_links`
--

CREATE TABLE `copy_trading_links` (
  `id` int(10) UNSIGNED NOT NULL,
  `master_account_id` int(10) UNSIGNED NOT NULL,
  `child_account_id` int(10) UNSIGNED NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `copy_trading_logs`
--

CREATE TABLE `copy_trading_logs` (
  `id` int(10) UNSIGNED NOT NULL,
  `master_account_id` int(10) UNSIGNED NOT NULL,
  `child_account_id` int(10) UNSIGNED NOT NULL,
  `trade_type` enum('BUY','SELL') NOT NULL,
  `symbol` varchar(20) NOT NULL,
  `quantity` decimal(15,8) NOT NULL,
  `price` decimal(15,8) NOT NULL,
  `status` enum('PENDING','SUCCESS','FAILED') DEFAULT 'PENDING',
  `error_message` text DEFAULT NULL,
  `master_trade_id` varchar(50) DEFAULT NULL,
  `child_trade_id` varchar(50) DEFAULT NULL,
  `executed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `franchise_stats`
--

CREATE TABLE `franchise_stats` (
  `id` int(10) UNSIGNED NOT NULL,
  `franchiseUserId` int(10) UNSIGNED NOT NULL,
  `totalUsers` int(11) DEFAULT 0,
  `activeUsers` int(11) DEFAULT 0,
  `totalTrades` int(11) DEFAULT 0,
  `totalVolume` decimal(20,2) DEFAULT 0.00,
  `totalRevenue` decimal(20,2) DEFAULT 0.00,
  `totalCommission` decimal(20,2) DEFAULT 0.00,
  `month` varchar(7) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `franchise_users`
--

CREATE TABLE `franchise_users` (
  `id` int(10) UNSIGNED NOT NULL,
  `franchiseUserId` int(10) UNSIGNED NOT NULL,
  `userId` int(10) UNSIGNED NOT NULL,
  `joinedDate` date NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(10) UNSIGNED NOT NULL,
  `userId` int(10) UNSIGNED NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `isRead` tinyint(1) DEFAULT 0,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `userId`, `type`, `title`, `message`, `isRead`, `metadata`, `createdAt`) VALUES
(1, 7, 'trade', 'Trade Executed Successfully', 'Your buy order for NIFTY has been executed at ₹21,500', 0, '{\"tradeId\":1,\"symbol\":\"NIFTY\"}', '2025-11-12 18:31:43'),
(2, 7, 'strategy', 'Strategy Performance Alert', 'Your \"Scalping Master\" strategy has achieved 75% win rate', 0, '{\"strategyName\":\"Scalping Master\"}', '2025-11-12 06:31:43'),
(3, 7, 'system', 'Welcome to AlgoTrading Pro!', 'Thank you for subscribing to Pro plan', 1, '{}', '2025-10-24 06:31:43'),
(4, 7, 'trade', 'Trade Completed', 'Your BANKNIFTY sell order completed with profit of ₹625', 1, '{\"tradeId\":2,\"pnl\":625}', '2025-11-09 06:31:43'),
(5, 7, 'wallet', 'Wallet Updated', 'Your wallet balance has been updated. Current balance: ₹47,976', 0, '{\"balance\":47976}', '2025-11-12 06:31:43'),
(6, 8, 'trade', 'Crypto Trade Alert', 'BTC price reached your target. Trade executed at $44,200', 0, '{\"symbol\":\"BTCUSDT\",\"price\":44200}', '2025-11-12 11:19:43'),
(7, 8, 'strategy', 'New Strategy Created', 'Your \"Crypto Momentum\" strategy is now active', 1, '{\"strategyName\":\"Crypto Momentum\"}', '2025-11-03 06:31:43'),
(8, 8, 'system', 'Plan Subscription', 'Basic plan activated successfully', 1, '{}', '2025-10-19 06:31:43'),
(9, 8, 'trade', 'Trade Update', 'Your ETH position is showing positive momentum (+$40)', 0, '{\"symbol\":\"ETHUSDT\",\"pnl\":40}', '2025-11-12 18:31:43'),
(10, 9, 'system', 'Welcome to AlgoTrading!', 'Start your trading journey with our Free plan', 1, '{}', '2025-10-14 06:31:43'),
(11, 9, 'trade', 'First Trade Executed', 'Congratulations! Your first trade has been executed successfully', 1, '{\"tradeId\":1}', '2025-10-29 06:31:43'),
(12, 9, 'system', 'KYC Verification Pending', 'Please complete your KYC verification to unlock all features', 0, '{}', '2025-11-08 06:31:43'),
(13, 9, 'strategy', 'Strategy Limit Warning', 'You have used 3 out of 5 strategies allowed in Free plan', 0, '{\"used\":3,\"limit\":5}', '2025-11-11 06:31:43'),
(14, 9, 'trade', 'Trade Pending', 'Your buy order for HDFC is pending execution', 0, '{\"symbol\":\"HDFC\"}', '2025-11-12 18:31:43');

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `id` int(10) UNSIGNED NOT NULL,
  `userId` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('Monthly','Yearly') NOT NULL DEFAULT 'Monthly',
  `price` decimal(10,2) NOT NULL,
  `totalDays` int(11) NOT NULL DEFAULT 30,
  `usedDays` int(11) NOT NULL DEFAULT 0,
  `remainingDays` int(11) NOT NULL DEFAULT 30,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `userId`, `name`, `type`, `price`, `totalDays`, `usedDays`, `remainingDays`, `startDate`, `endDate`, `isActive`, `createdAt`, `updatedAt`) VALUES
(4, 7, 'Pro Plan (Monthly)', 'Monthly', 1999.00, 30, 5, 25, '2025-11-13', '2025-12-13', 1, '2025-11-13 06:31:43', '2025-11-13 06:31:43'),
(5, 8, 'Basic Plan (Monthly)', 'Monthly', 499.00, 30, 10, 20, '2025-11-13', '2025-12-13', 1, '2025-11-13 06:31:43', '2025-11-13 06:31:43'),
(6, 9, 'Free Plan', 'Monthly', 0.00, 365, 15, 350, '2025-10-29', '2026-10-29', 1, '2025-11-13 06:31:43', '2025-11-13 06:31:43');

-- --------------------------------------------------------

--
-- Table structure for table `planscatalog`
--

CREATE TABLE `planscatalog` (
  `id` int(10) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('Free','Basic','Pro','Enterprise') NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `billingCycle` enum('Monthly','Yearly') NOT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `limits` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`limits`)),
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `planscatalog`
--

INSERT INTO `planscatalog` (`id`, `code`, `name`, `type`, `price`, `billingCycle`, `features`, `limits`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'FREE', 'Free Plan', 'Free', 0.00, 'Monthly', '[\"1 API Integration\", \"5 Strategies\", \"100 Trades/month\"]', '{\"apiKeys\": 1, \"strategies\": 5, \"trades\": 100}', 1, '2025-11-11 11:28:34', '2025-11-11 11:28:34'),
(2, 'BASIC', 'Basic Plan', 'Basic', 199.00, 'Monthly', '[\"3 API Integrations\", \"20 Strategies\", \"Unlimited Trades\"]', '{\"apiKeys\": 3, \"strategies\": 20, \"trades\": -1}', 1, '2025-11-11 11:28:34', '2025-11-11 11:28:34'),
(3, 'PRO', 'Pro Plan', 'Pro', 499.00, 'Monthly', '[\"10 API Integrations\", \"Unlimited Strategies\", \"Unlimited Trades\", \"Priority Support\"]', '{\"apiKeys\": 10, \"strategies\": -1, \"trades\": -1}', 1, '2025-11-11 11:28:34', '2025-11-11 11:28:34'),
(4, 'BASIC_MONTHLY', 'Basic Plan (Monthly)', 'Basic', 499.00, 'Monthly', '[\"3 API Integrations\",\"20 Strategies\",\"Unlimited Trades\",\"Priority Support\",\"All Notifications\",\"Basic Analytics\"]', '{\"apiKeys\":3,\"strategies\":20,\"trades\":-1,\"support\":\"priority\"}', 1, '2025-11-11 06:20:05', '2025-11-11 06:20:05'),
(5, 'BASIC_YEARLY', 'Basic Plan (Yearly)', 'Basic', 4999.00, 'Yearly', '[\"3 API Integrations\",\"20 Strategies\",\"Unlimited Trades\",\"Priority Support\",\"All Notifications\",\"Basic Analytics\",\"2 months free\"]', '{\"apiKeys\":3,\"strategies\":20,\"trades\":-1,\"support\":\"priority\"}', 1, '2025-11-11 06:20:05', '2025-11-11 06:20:05'),
(6, 'PRO_MONTHLY', 'Pro Plan (Monthly)', 'Pro', 1999.00, 'Monthly', '[\"10 API Integrations\",\"Unlimited Strategies\",\"Unlimited Trades\",\"Premium Support (24/7)\",\"Advanced Analytics\",\"Custom Indicators\",\"Backtesting\",\"Real-time Alerts\"]', '{\"apiKeys\":10,\"strategies\":-1,\"trades\":-1,\"support\":\"premium\"}', 1, '2025-11-11 06:20:05', '2025-11-11 06:20:05'),
(7, 'PRO_YEARLY', 'Pro Plan (Yearly)', 'Pro', 19999.00, 'Yearly', '[\"10 API Integrations\",\"Unlimited Strategies\",\"Unlimited Trades\",\"Premium Support (24/7)\",\"Advanced Analytics\",\"Custom Indicators\",\"Backtesting\",\"Real-time Alerts\",\"2 months free\"]', '{\"apiKeys\":10,\"strategies\":-1,\"trades\":-1,\"support\":\"premium\"}', 1, '2025-11-11 06:20:05', '2025-11-11 06:20:05'),
(8, 'ENTERPRISE', 'Enterprise Plan', 'Enterprise', 49999.00, 'Yearly', '[\"Unlimited API Integrations\",\"Unlimited Strategies\",\"Unlimited Trades\",\"Dedicated Account Manager\",\"White-label Solution\",\"Custom Development\",\"On-premise Deployment\",\"SLA Guarantee\",\"Training & Onboarding\"]', '{\"apiKeys\":-1,\"strategies\":-1,\"trades\":-1,\"support\":\"dedicated\"}', 1, '2025-11-11 06:20:05', '2025-11-11 06:20:05');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(10) UNSIGNED NOT NULL,
  `userId` int(10) UNSIGNED NOT NULL,
  `notifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`notifications`)),
  `security` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`security`)),
  `preferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferences`)),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `userId`, `notifications`, `security`, `preferences`, `createdAt`, `updatedAt`) VALUES
(7, 7, '{\"email\":true,\"push\":true,\"sms\":true,\"tradeAlerts\":true,\"strategyAlerts\":true,\"systemAlerts\":true}', '{\"twoFactorAuth\":true,\"sessionTimeout\":3600,\"ipWhitelist\":[]}', '{\"theme\":\"dark\",\"language\":\"en\",\"timezone\":\"Asia/Kolkata\",\"currency\":\"INR\",\"dateFormat\":\"DD/MM/YYYY\"}', '2025-11-13 06:31:43', '2025-11-13 06:31:43'),
(8, 8, '{\"email\":true,\"push\":false,\"sms\":false,\"tradeAlerts\":true,\"strategyAlerts\":true,\"systemAlerts\":false}', '{\"twoFactorAuth\":false,\"sessionTimeout\":7200,\"ipWhitelist\":[]}', '{\"theme\":\"light\",\"language\":\"en\",\"timezone\":\"Asia/Kolkata\",\"currency\":\"INR\",\"dateFormat\":\"DD/MM/YYYY\"}', '2025-11-13 06:31:43', '2025-11-13 06:31:43'),
(9, 9, '{\"email\":true,\"push\":false,\"sms\":false,\"tradeAlerts\":false,\"strategyAlerts\":false,\"systemAlerts\":true}', '{\"twoFactorAuth\":false,\"sessionTimeout\":3600,\"ipWhitelist\":[]}', '{\"theme\":\"light\",\"language\":\"en\",\"timezone\":\"Asia/Kolkata\",\"currency\":\"INR\",\"dateFormat\":\"DD/MM/YYYY\"}', '2025-11-13 06:31:43', '2025-11-13 06:31:43'),
(10, 11, 'true', '{\"twoFactorAuth\":false,\"loginAlerts\":true}', '{\"theme\":\"light\",\"language\":\"en\",\"timezone\":\"UTC\"}', '2025-11-30 13:24:42', '2025-11-30 13:24:42');

-- --------------------------------------------------------

--
-- Table structure for table `strategies`
--

CREATE TABLE `strategies` (
  `id` int(10) UNSIGNED NOT NULL,
  `userId` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `type` enum('Private','Public') NOT NULL DEFAULT 'Private',
  `madeBy` enum('Admin','User') NOT NULL DEFAULT 'User',
  `createdBy` varchar(100) DEFAULT NULL,
  `segment` enum('Forex','Crypto','Indian') NOT NULL,
  `capital` decimal(15,2) DEFAULT NULL,
  `symbol` varchar(50) DEFAULT NULL,
  `symbolValue` decimal(20,8) DEFAULT NULL,
  `legs` int(11) NOT NULL DEFAULT 1,
  `lots` int(11) NOT NULL DEFAULT 1,
  `expiryDate` date DEFAULT NULL,
  `isRunning` tinyint(1) NOT NULL DEFAULT 0,
  `isPublic` tinyint(1) NOT NULL DEFAULT 0,
  `performance` decimal(7,2) DEFAULT NULL,
  `lastUpdated` varchar(50) DEFAULT NULL,
  `isFavorite` tinyint(1) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `strategies`
--

INSERT INTO `strategies` (`id`, `userId`, `name`, `isActive`, `type`, `madeBy`, `createdBy`, `segment`, `capital`, `symbol`, `symbolValue`, `legs`, `isRunning`, `isPublic`, `performance`, `lastUpdated`, `isFavorite`, `description`, `createdAt`, `updatedAt`) VALUES
(10, 7, 'Scalping Master', 1, 'Private', 'User', 'John Trader', 'Indian', 2000.00, 'NIFTY', 0.00000000, 1, 0, 0, NULL, '2025-11-19T10:19:43.894Z', 0, 'High-frequency scalping strategy for NIFTY futures', '2025-11-13 06:31:43', '2025-11-19 10:19:43'),
(11, 7, 'Swing Trading Pro', 1, 'Private', 'User', 'John Trader', 'Indian', 15000.00, 'BANKNIFTY', 0.00000000, 1, 0, 1, NULL, NULL, 0, 'Medium-term swing trading strategy for Bank NIFTY', '2025-11-13 06:31:43', '2025-11-17 06:31:31'),
(12, 7, 'Options Spreads', 1, 'Private', 'User', 'John Trader', 'Indian', 10000.00, 'RELIANCE', 0.00000000, 1, 0, 1, NULL, NULL, 0, 'Conservative options spread strategy', '2025-11-13 06:31:43', '2025-11-17 06:31:31'),
(13, 8, 'Crypto Momentum', 1, 'Public', 'User', 'Sarah Investor', 'Crypto', 12000.00, 'BTCUSDT', 0.00000000, 1, 0, 0, NULL, NULL, 0, 'Bitcoin momentum trading strategy', '2025-11-13 06:31:43', '2025-11-13 06:31:43'),
(14, 8, 'ETH Long Term', 1, 'Private', 'User', 'Sarah Investor', 'Crypto', 8000.00, 'ETHUSDT', 0.00000000, 1, 0, 0, NULL, NULL, 0, 'Long-term Ethereum investment strategy', '2025-11-13 06:31:43', '2025-11-13 06:31:43'),
(15, 8, 'Safe Diversified', 1, 'Private', 'User', 'Sarah Investor', 'Indian', 5000.00, 'SENSEX', 0.00000000, 1, 0, 0, NULL, NULL, 0, 'Diversified portfolio strategy', '2025-11-13 06:31:43', '2025-11-13 06:31:43'),
(16, 9, 'Learning Strategy 1', 1, 'Private', 'User', 'Mike Beginner', 'Indian', 5000.00, 'INFY', 0.00000000, 1, 0, 0, NULL, NULL, 0, 'First experimental strategy', '2025-11-13 06:31:43', '2025-11-13 06:31:43'),
(17, 9, 'Test Forex Strategy', 0, 'Private', 'User', 'Mike Beginner', 'Forex', 3000.00, 'EURUSD', 0.00000000, 1, 0, 0, NULL, NULL, 0, 'Testing forex trading waters', '2025-11-13 06:31:43', '2025-11-13 06:31:43'),
(18, 9, 'Demo Crypto', 1, 'Private', 'User', 'Mike Beginner', 'Crypto', 2000.00, 'BTCUSDT', 0.00000000, 1, 0, 0, NULL, NULL, 0, 'Demo cryptocurrency strategy', '2025-11-13 06:31:43', '2025-11-13 06:31:43'),
(19, 7, 'asdsad', 1, 'Private', 'User', 'John Trader', 'Crypto', 42423.00, 'cbcvbcvb', NULL, 1, 0, 0, NULL, '2025-11-19T10:19:42.062Z', 0, 'vbvcbvbcvbvcbvcb', '2025-11-15 08:43:32', '2025-11-19 10:19:42'),
(20, 7, 'MA Crossover Strategy', 1, 'Public', 'User', 'John Trader', 'Forex', 10000.00, 'Xauusd', NULL, 2, 1, 1, NULL, NULL, 0, 'A trend-following strategy using 20 and 50 period moving averages', '2025-11-19 10:21:07', '2025-11-30 14:06:14'),
(21, 7, 'RSI Reversal Strategy', 1, 'Public', 'User', 'John Trader', 'Forex', 10000.00, 'Eurusd', NULL, 1, 1, 1, NULL, NULL, 0, 'Mean reversion strategy using RSI with 30/70 levels', '2025-11-19 10:23:53', '2025-11-30 14:06:15'),
(22, 7, 'Breakout Strategy', 1, 'Public', 'User', 'John Trader', 'Indian', 100000.00, 'Nifty', NULL, 2, 1, 1, NULL, '2025-12-04T06:56:56.356Z', 0, 'Trade breakouts from consolidation zones with volume confirmation', '2025-11-19 10:24:12', '2025-12-04 06:56:56');

-- --------------------------------------------------------

--
-- Table structure for table `StrategySubscriptions`
--

CREATE TABLE `StrategySubscriptions` (
  `id` int(10) UNSIGNED NOT NULL,
  `userId` int(10) UNSIGNED NOT NULL,
  `strategyId` int(10) UNSIGNED NOT NULL,
  `lots` int(11) NOT NULL DEFAULT 1,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `subscribedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `StrategySubscriptions`
--

INSERT INTO `StrategySubscriptions` (`id`, `userId`, `strategyId`, `lots`, `isActive`, `subscribedAt`, `updatedAt`) VALUES
(2, 14, 22, 1, 1, '2025-12-03 07:42:05', '2025-12-03 07:42:05'),
(3, 14, 21, 1, 1, '2025-12-04 06:55:01', '2025-12-04 06:55:01'),
(12, 13, 22, 1, 1, '2025-12-04 10:43:44', '2025-12-04 10:43:44'),
(13, 13, 20, 1, 1, '2025-12-04 10:56:55', '2025-12-04 10:56:55');

-- --------------------------------------------------------

--
-- Table structure for table `supportmessages`
--

CREATE TABLE `supportmessages` (
  `id` int(10) UNSIGNED NOT NULL,
  `ticketId` int(10) UNSIGNED NOT NULL,
  `authorId` int(10) UNSIGNED NOT NULL,
  `message` text NOT NULL,
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attachments`)),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `supportmessages`
--

INSERT INTO `supportmessages` (`id`, `ticketId`, `authorId`, `message`, `attachments`, `createdAt`) VALUES
(1, 8, 13, 'hello test', '[]', '2025-12-02 18:46:35'),
(2, 8, 11, 'ok', NULL, '2025-12-02 18:47:26'),
(3, 8, 13, 'what ok', '[]', '2025-12-02 18:47:56'),
(4, 8, 11, 'just ok ook ', NULL, '2025-12-02 18:48:37');

-- --------------------------------------------------------

--
-- Table structure for table `supporttickets`
--

CREATE TABLE `supporttickets` (
  `id` int(10) UNSIGNED NOT NULL,
  `ticketNumber` varchar(20) NOT NULL,
  `userId` int(10) UNSIGNED NOT NULL,
  `subject` varchar(255) NOT NULL,
  `category` enum('Technical','Billing','General','Feature Request') NOT NULL,
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `status` enum('open','in-progress','resolved','closed') DEFAULT 'open',
  `assignedTo` int(10) UNSIGNED DEFAULT NULL,
  `description` text NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `supporttickets`
--

INSERT INTO `supporttickets` (`id`, `ticketNumber`, `userId`, `subject`, `category`, `priority`, `status`, `assignedTo`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'TKT001', 7, 'API Integration Issue with Zerodha', 'Technical', 'high', 'resolved', NULL, 'Unable to connect my Zerodha account. Getting authentication error.', '2025-11-03 06:31:43', '2025-11-13 06:31:43'),
(2, 'TKT002', 7, 'Request for Custom Indicator', 'Feature Request', 'medium', 'in-progress', NULL, 'Would like to have RSI with custom period settings in my strategy.', '2025-11-08 06:31:43', '2025-11-13 06:31:43'),
(3, 'TKT003', 8, 'Billing Query - Upgrade to Pro', 'Billing', 'low', 'open', NULL, 'What are the benefits if I upgrade from Basic to Pro plan?', '2025-11-11 06:31:43', '2025-11-13 06:31:43'),
(4, 'TKT004', 8, 'Crypto Trading Bot Setup', 'General', 'medium', 'resolved', NULL, 'Need help setting up automated crypto trading bot.', '2025-10-29 06:31:43', '2025-11-13 06:31:43'),
(5, 'TKT005', 9, 'How to Verify KYC?', 'General', 'medium', 'in-progress', NULL, 'I want to complete my KYC verification. What documents are required?', '2025-11-08 06:31:43', '2025-11-13 06:31:43'),
(6, 'TKT006', 9, 'Understanding Strategy Parameters', 'General', 'low', 'open', NULL, 'Can you explain what capital, symbol and segment mean in strategy creation?', '2025-11-12 06:31:43', '2025-11-13 06:31:43'),
(7, 'TKT007', 9, 'Free Plan Limitations', 'General', 'low', 'closed', NULL, 'What are the exact limitations of the free plan?', '2025-10-24 06:31:43', '2025-11-13 06:31:43'),
(8, 'TKTMIOXJ1C1', 13, 'testlogin', 'General', 'medium', 'closed', NULL, 'hello test', '2025-12-02 18:46:35', '2025-12-02 18:49:12');

-- --------------------------------------------------------

--
-- Table structure for table `trades`
--

CREATE TABLE `trades` (
  `id` int(10) UNSIGNED NOT NULL,
  `userId` int(10) UNSIGNED NOT NULL,
  `orderId` varchar(50) NOT NULL,
  `market` enum('Forex','Crypto','Indian') NOT NULL,
  `symbol` varchar(50) NOT NULL,
  `type` enum('Buy','Sell') NOT NULL,
  `amount` decimal(20,8) NOT NULL,
  `price` decimal(20,8) NOT NULL,
  `currentPrice` decimal(20,8) DEFAULT NULL,
  `pnl` decimal(15,2) DEFAULT NULL,
  `pnlPercentage` decimal(7,2) DEFAULT NULL,
  `status` enum('Completed','Pending','Failed') NOT NULL DEFAULT 'Pending',
  `date` date NOT NULL,
  `broker` varchar(100) NOT NULL,
  `brokerType` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `trades`
--

INSERT INTO `trades` (`id`, `userId`, `orderId`, `market`, `symbol`, `type`, `amount`, `price`, `currentPrice`, `pnl`, `pnlPercentage`, `status`, `date`, `broker`, `brokerType`, `createdAt`, `updatedAt`) VALUES
(76, 7, 'ORD1764531572399', 'Indian', 'NIFTY', 'Buy', 100.00000000, 97.00000000, NULL, NULL, NULL, 'Completed', '2025-11-30', 'Default Broker', 'Indian', '2025-11-30 19:39:32', '2025-11-30 20:56:15'),
(77, 7, 'ORD1764536190425', 'Indian', 'NIFTY', 'Buy', 100.00000000, 566.00000000, NULL, NULL, NULL, 'Pending', '2025-11-30', 'Default Broker', 'Indian', '2025-11-30 20:56:30', '2025-11-30 20:56:30'),
(78, 7, 'ORD1764536216093', 'Indian', 'NIFTY', 'Buy', 1000.00000000, 1.00000000, NULL, NULL, NULL, 'Pending', '2025-11-30', 'Default Broker', 'Indian', '2025-11-30 20:56:56', '2025-11-30 20:56:56'),
(79, 13, 'ORD1764678924695', 'Indian', 'NIFTY', 'Buy', 75.00000000, 1000.00000000, NULL, NULL, NULL, 'Pending', '2025-12-02', 'Default Broker', 'Indian', '2025-12-02 12:35:24', '2025-12-02 12:35:24'),
(80, 7, 'ORD1764745076061', 'Forex', 'CXCXC', 'Buy', 1.00000000, 3323.00000000, NULL, NULL, NULL, 'Pending', '2025-12-03', 'Default Broker', 'Forex', '2025-12-03 06:57:55', '2025-12-03 06:57:55');

-- --------------------------------------------------------

--
-- Table structure for table `usagestats`
--

CREATE TABLE `usagestats` (
  `id` int(10) UNSIGNED NOT NULL,
  `userId` int(10) UNSIGNED NOT NULL,
  `userAccountsCurrent` int(11) NOT NULL DEFAULT 0,
  `userAccountsLimit` int(11) NOT NULL DEFAULT 1000,
  `apiIntegrationsCurrent` int(11) NOT NULL DEFAULT 0,
  `apiIntegrationsLimit` int(11) NOT NULL DEFAULT 200,
  `tradingStrategiesCurrent` int(11) NOT NULL DEFAULT 0,
  `tradingStrategiesLimit` int(11) NOT NULL DEFAULT 300,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user','franchise') NOT NULL DEFAULT 'user',
  `isFranchise` tinyint(1) DEFAULT 0,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `currency` varchar(10) DEFAULT 'IND',
  `emailVerified` enum('Yes','No') DEFAULT 'No',
  `phoneVerified` enum('Yes','No') DEFAULT 'No',
  `referralCode` varchar(50) DEFAULT NULL,
  `referralLink` varchar(500) DEFAULT NULL,
  `referredBy` varchar(100) DEFAULT NULL,
  `joinedBy` date DEFAULT NULL,
  `clientId` varchar(50) DEFAULT NULL,
  `franchiseId` varchar(50) DEFAULT NULL,
  `parentFranchiseId` int(10) UNSIGNED DEFAULT NULL,
  `franchiseName` varchar(255) DEFAULT NULL,
  `franchiseCommission` decimal(5,2) DEFAULT 0.00,
  `franchiseStatus` enum('Active','Inactive','Suspended') DEFAULT 'Active',
  `franchiseJoinedDate` date DEFAULT NULL,
  `clientType` enum('Individual','Organization') DEFAULT 'Individual',
  `organizationName` varchar(255) DEFAULT NULL,
  `incorporationNumber` varchar(100) DEFAULT NULL,
  `taxId` varchar(100) DEFAULT NULL,
  `gstNumber` varchar(100) DEFAULT NULL,
  `panNumber` varchar(100) DEFAULT NULL,
  `address1` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `postalCode` varchar(20) DEFAULT NULL,
  `contactPhone` varchar(20) DEFAULT NULL,
  `contactEmail` varchar(255) DEFAULT NULL,
  `kycStatus` enum('Verified','Pending','Rejected') DEFAULT 'Pending',
  `kycLevel` varchar(50) DEFAULT NULL,
  `documents` text DEFAULT NULL,
  `verified` enum('Yes','No') DEFAULT 'No',
  `avatar` varchar(500) DEFAULT NULL,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`settings`)),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `phone`, `password`, `role`, `isFranchise`, `status`, `currency`, `emailVerified`, `phoneVerified`, `referralCode`, `referralLink`, `referredBy`, `joinedBy`, `clientId`, `franchiseId`, `parentFranchiseId`, `franchiseName`, `franchiseCommission`, `franchiseStatus`, `franchiseJoinedDate`, `clientType`, `organizationName`, `incorporationNumber`, `taxId`, `gstNumber`, `panNumber`, `address1`, `address2`, `city`, `state`, `country`, `postalCode`, `contactPhone`, `contactEmail`, `kycStatus`, `kycLevel`, `documents`, `verified`, `avatar`, `settings`, `createdAt`, `updatedAt`) VALUES
(7, 'John Trader', 'johntrader', 'john.trader@example.com', '+919876543210', '$2a$10$bgnylJUdmVv1AxGbl/ZAZO/QHI85oTyHAsjD.rtw3zUvMqXiK06hW', 'user', 0, 'Active', 'IND', 'Yes', 'No', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 'Active', NULL, 'Individual', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Verified', ' mjb', 'hbhjbj', 'Yes', '/uploads/avatars/avatar-7-1764593574713-820166060.png', '{}', '2025-11-13 06:31:43', '2025-12-01 12:52:54'),
(8, 'Sarah Investor', 'sarahinvestor', 'sarah.investor@example.com', '+919123456789', '$2a$10$o4bHiYJ6JWTNCGmi/QUPJOLOC1VzXd75sovEeOjwOJhdfQeFYu35i', 'user', 0, 'Active', 'IND', 'Yes', 'Yes', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 'Active', NULL, 'Individual', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Verified', NULL, NULL, 'Yes', NULL, '{}', '2025-11-13 06:31:43', '2025-11-13 06:31:43'),
(9, 'Mike Beginner', 'mikebeginner', 'mike.beginner@example.com', '+919988776655', '$2a$10$a1UfzWohAICsed80kb9r1OttDfQdAlI8ZHXIOnyjlu/xjogqGOlSu', 'user', 0, 'Active', 'IND', 'Yes', 'No', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 'Active', NULL, 'Individual', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, 'No', NULL, '{}', '2025-11-13 06:31:43', '2025-11-13 06:31:43'),
(10, 'harish', 'hhhh', 'test@example.com', NULL, '$2a$10$oKl99f9pVdEU.a2tt5IJ4eiauD6W7Ul9ech7bf0gLsCn3ThB477M2', 'user', 0, 'Active', 'IND', 'No', 'No', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 'Active', NULL, 'Individual', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, 'No', NULL, '{}', '2025-11-30 13:19:31', '2025-11-30 13:19:31'),
(11, 'System Administrator', 'admin', 'admin@algotrading.com', '+1234567890', '$2a$10$dGZp9hJfDIpEScgru13hJePCCxVhh4mbNgTGU1d2tSqLBNoRqiuqS', 'admin', 0, 'Active', 'IND', 'Yes', 'Yes', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 'Active', NULL, 'Individual', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Verified', NULL, NULL, 'Yes', NULL, '{}', '2025-11-30 13:24:41', '2025-11-30 13:24:41'),
(12, 'products', 'ggg', 'adminhh@admin.com', '96 44 466612', '$2a$10$EIQabWZ1knYD4lH8AiX6QOjzwk6v0WHltgnfcRnGYlGFvHS6d/qJu', 'franchise', 1, 'Active', 'IND', 'No', 'No', NULL, NULL, NULL, NULL, NULL, 'FRN1764621389915F2K34', NULL, 'asdfgh', 0.40, 'Active', '2025-12-01', 'Individual', NULL, NULL, NULL, NULL, NULL, 'hvh', 'sdfgb', 'raipur', 'Chhattīsgarh', 'sdfgh', '492001', NULL, NULL, 'Pending', NULL, NULL, 'No', NULL, NULL, '2025-12-01 20:36:30', '2025-12-01 20:36:30'),
(13, 'prabhat chaubey', 'prabhat123', 'prabhat@ssipmt.com', NULL, '$2a$10$LGcayxFImgn6xvvQWxwZMulBUSfUqmmB30CWQ3/N0fGjUG8s4J3Ce', 'user', 0, 'Active', 'IND', 'No', 'No', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 'Active', NULL, 'Individual', 'Quantech trends pvt ltd', '234567', '98765ghjk', '45678987654rtyui', 'erte3456y', 'dm tower birgaon', '', 'raipur', 'chhattisghar', 'india ', '493221', '7000901447', 'prabhat@ssipmt.com', 'Pending', NULL, NULL, 'No', '/uploads/avatars/avatar-13-1764693473606-813122339.jpg', '{}', '2025-12-02 12:26:39', '2025-12-02 16:37:53'),
(14, 'harish', 'haryshtiwari', 'haryshtiwari@gmail.com', NULL, '$2a$10$qNwq78cp13cw5Sl2Cda.nOkhEn6kEqgI11hCOz7qLdVcR/D2IQiyq', 'user', 0, 'Active', 'IND', 'No', 'No', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 'Active', NULL, 'Individual', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, 'No', NULL, '{}', '2025-12-03 07:41:46', '2025-12-03 07:41:46'),
(15, 'Dilpreet', 'Perfectalgo777', 'singhdilpreet2710@gmail.com', NULL, '$2a$10$W0t/3geavM3lb2cxYcR3KeAWpB/MJw3YVXdWVDmX2m8ihBwMQrSFS', 'user', 0, 'Active', 'IND', 'No', 'No', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 'Active', NULL, 'Individual', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, 'No', NULL, '{}', '2025-12-03 07:47:02', '2025-12-03 07:47:02');

-- --------------------------------------------------------

--
-- Table structure for table `wallets`
--

CREATE TABLE `wallets` (
  `id` int(10) UNSIGNED NOT NULL,
  `userId` int(10) UNSIGNED NOT NULL,
  `balance` decimal(12,2) DEFAULT 0.00,
  `currency` varchar(10) DEFAULT 'INR',
  `status` enum('Active','Frozen','Closed') DEFAULT 'Active',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wallets`
--

INSERT INTO `wallets` (`id`, `userId`, `balance`, `currency`, `status`, `createdAt`, `updatedAt`) VALUES
(7, 7, 50000.00, 'INR', 'Active', '2025-11-13 06:31:43', '2025-11-13 06:31:43'),
(8, 8, 25000.00, 'INR', 'Active', '2025-11-13 06:31:43', '2025-11-13 06:31:43'),
(9, 9, 10000.00, 'INR', 'Active', '2025-11-13 06:31:43', '2025-11-13 06:31:43'),
(10, 10, 0.00, 'INR', 'Active', '2025-11-30 13:19:31', '2025-11-30 13:19:31'),
(11, 11, 100001.00, 'INR', 'Active', '2025-11-30 13:24:42', '2025-12-01 19:49:29'),
(12, 13, 0.00, 'INR', 'Active', '2025-12-02 12:26:40', '2025-12-02 12:26:40'),
(13, 14, 0.00, 'INR', 'Active', '2025-12-03 07:41:47', '2025-12-03 07:41:47'),
(14, 15, 0.00, 'INR', 'Active', '2025-12-03 07:47:03', '2025-12-03 07:47:03');

-- --------------------------------------------------------

--
-- Table structure for table `wallettransactions`
--

CREATE TABLE `wallettransactions` (
  `id` int(10) UNSIGNED NOT NULL,
  `walletId` int(10) UNSIGNED NOT NULL,
  `type` enum('credit','debit') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `balanceAfter` decimal(12,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wallettransactions`
--

INSERT INTO `wallettransactions` (`id`, `walletId`, `type`, `amount`, `description`, `reference`, `balanceAfter`, `createdAt`) VALUES
(1, 7, 'credit', 50000.00, 'Initial deposit', 'INIT001', 50000.00, '2025-10-24 06:31:43'),
(2, 7, 'debit', 900.00, 'Trade profit withdrawn', 'TXN001', 49100.00, '2025-11-08 06:31:43'),
(3, 7, 'credit', 625.00, 'Trade profit added', 'TXN002', 49725.00, '2025-11-09 06:31:43'),
(4, 7, 'credit', 450.00, 'Trade profit added', 'TXN003', 50175.00, '2025-11-10 06:31:43'),
(5, 7, 'debit', 200.00, 'Trade loss deducted', 'TXN004', 49975.00, '2025-11-07 06:31:43'),
(6, 7, 'debit', 1999.00, 'Pro plan subscription', 'PLAN001', 47976.00, '2025-11-12 06:31:43'),
(7, 8, 'credit', 25000.00, 'Initial deposit', 'INIT002', 25000.00, '2025-10-19 06:31:43'),
(8, 8, 'credit', 350.00, 'BTC trade profit', 'TXN005', 25350.00, '2025-11-03 06:31:43'),
(9, 8, 'credit', 210.00, 'ETH trade profit', 'TXN006', 25560.00, '2025-11-05 06:31:43'),
(10, 8, 'debit', 66.00, 'SOL trade loss', 'TXN007', 25494.00, '2025-11-07 06:31:43'),
(11, 8, 'debit', 499.00, 'Basic plan subscription', 'PLAN002', 24995.00, '2025-11-11 06:31:43'),
(12, 9, 'credit', 10000.00, 'Initial deposit', 'INIT003', 10000.00, '2025-10-14 06:31:43'),
(13, 9, 'credit', 12.50, 'INFY trade profit', 'TXN008', 10012.50, '2025-10-29 06:31:43'),
(14, 9, 'debit', 30.00, 'BTC trade loss', 'TXN009', 9982.50, '2025-10-31 06:31:43'),
(15, 9, 'credit', 22.50, 'TCS trade profit', 'TXN010', 10005.00, '2025-10-30 06:31:43');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activitylogs`
--
ALTER TABLE `activitylogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_action` (`action`),
  ADD KEY `activity_logs_user_id` (`userId`),
  ADD KEY `activity_logs_action` (`action`);

--
-- Indexes for table `AdminPlans`
--
ALTER TABLE `AdminPlans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_admin_plans_active` (`isActive`),
  ADD KEY `idx_admin_plans_type` (`planType`),
  ADD KEY `idx_admin_plans_popular` (`isPopular`);

--
-- Indexes for table `apikeys`
--
ALTER TABLE `apikeys`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_segment` (`segment`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `api_keys_user_id` (`userId`),
  ADD KEY `api_keys_segment` (`segment`),
  ADD KEY `api_keys_status` (`status`);

--
-- Indexes for table `brokers`
--
ALTER TABLE `brokers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `copy_trading_accounts`
--
ALTER TABLE `copy_trading_accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_account_name` (`user_id`,`name`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_master_account_id` (`master_account_id`);

--
-- Indexes for table `copy_trading_links`
--
ALTER TABLE `copy_trading_links`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_master_child_link` (`master_account_id`,`child_account_id`),
  ADD KEY `idx_master_account` (`master_account_id`),
  ADD KEY `idx_child_account` (`child_account_id`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `copy_trading_logs`
--
ALTER TABLE `copy_trading_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_master_account` (`master_account_id`),
  ADD KEY `idx_child_account` (`child_account_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_symbol` (`symbol`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `franchise_stats`
--
ALTER TABLE `franchise_stats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_franchise_month` (`franchiseUserId`,`month`),
  ADD KEY `idx_franchiseUserId` (`franchiseUserId`);

--
-- Indexes for table `franchise_users`
--
ALTER TABLE `franchise_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_franchise_user` (`franchiseUserId`,`userId`),
  ADD KEY `idx_franchiseUserId` (`franchiseUserId`),
  ADD KEY `idx_userId` (`userId`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_isRead` (`isRead`),
  ADD KEY `notifications_user_id` (`userId`),
  ADD KEY `notifications_is_read` (`isRead`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_isActive` (`isActive`),
  ADD KEY `plans_user_id` (`userId`),
  ADD KEY `plans_is_active` (`isActive`);

--
-- Indexes for table `planscatalog`
--
ALTER TABLE `planscatalog`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`);

--
-- Indexes for table `strategies`
--
ALTER TABLE `strategies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_segment` (`segment`),
  ADD KEY `idx_isPublic` (`isPublic`),
  ADD KEY `strategies_user_id` (`userId`),
  ADD KEY `strategies_segment` (`segment`),
  ADD KEY `strategies_is_public` (`isPublic`);

--
-- Indexes for table `StrategySubscriptions`
--
ALTER TABLE `StrategySubscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_strategy` (`userId`,`strategyId`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_strategyId` (`strategyId`),
  ADD KEY `idx_isActive` (`isActive`);

--
-- Indexes for table `supportmessages`
--
ALTER TABLE `supportmessages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ticketId` (`ticketId`),
  ADD KEY `fk_message_author` (`authorId`),
  ADD KEY `support_messages_ticket_id` (`ticketId`);

--
-- Indexes for table `supporttickets`
--
ALTER TABLE `supporttickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ticketNumber` (`ticketNumber`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `fk_ticket_assigned` (`assignedTo`),
  ADD KEY `support_tickets_user_id` (`userId`),
  ADD KEY `support_tickets_status` (`status`);

--
-- Indexes for table `trades`
--
ALTER TABLE `trades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orderId` (`orderId`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_market` (`market`),
  ADD KEY `trades_user_id` (`userId`),
  ADD KEY `trades_status` (`status`),
  ADD KEY `trades_market` (`market`),
  ADD KEY `trades_date` (`date`);

--
-- Indexes for table `usagestats`
--
ALTER TABLE `usagestats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `usage_stats_user_id` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `referralCode` (`referralCode`),
  ADD UNIQUE KEY `clientId` (`clientId`),
  ADD UNIQUE KEY `franchiseId` (`franchiseId`),
  ADD KEY `idx_isFranchise` (`isFranchise`),
  ADD KEY `idx_parentFranchiseId` (`parentFranchiseId`);

--
-- Indexes for table `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`);

--
-- Indexes for table `wallettransactions`
--
ALTER TABLE `wallettransactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_transaction_wallet` (`walletId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activitylogs`
--
ALTER TABLE `activitylogs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `AdminPlans`
--
ALTER TABLE `AdminPlans`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `apikeys`
--
ALTER TABLE `apikeys`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `brokers`
--
ALTER TABLE `brokers`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `copy_trading_accounts`
--
ALTER TABLE `copy_trading_accounts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `copy_trading_links`
--
ALTER TABLE `copy_trading_links`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `copy_trading_logs`
--
ALTER TABLE `copy_trading_logs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `franchise_stats`
--
ALTER TABLE `franchise_stats`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `franchise_users`
--
ALTER TABLE `franchise_users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `planscatalog`
--
ALTER TABLE `planscatalog`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `strategies`
--
ALTER TABLE `strategies`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `StrategySubscriptions`
--
ALTER TABLE `StrategySubscriptions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `supportmessages`
--
ALTER TABLE `supportmessages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `supporttickets`
--
ALTER TABLE `supporttickets`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `trades`
--
ALTER TABLE `trades`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `usagestats`
--
ALTER TABLE `usagestats`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `wallets`
--
ALTER TABLE `wallets`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `wallettransactions`
--
ALTER TABLE `wallettransactions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activitylogs`
--
ALTER TABLE `activitylogs`
  ADD CONSTRAINT `fk_activity_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `apikeys`
--
ALTER TABLE `apikeys`
  ADD CONSTRAINT `fk_apiKeys_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `copy_trading_accounts`
--
ALTER TABLE `copy_trading_accounts`
  ADD CONSTRAINT `copy_trading_accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `copy_trading_accounts_ibfk_2` FOREIGN KEY (`master_account_id`) REFERENCES `copy_trading_accounts` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `copy_trading_links`
--
ALTER TABLE `copy_trading_links`
  ADD CONSTRAINT `copy_trading_links_ibfk_1` FOREIGN KEY (`master_account_id`) REFERENCES `copy_trading_accounts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `copy_trading_links_ibfk_2` FOREIGN KEY (`child_account_id`) REFERENCES `copy_trading_accounts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `copy_trading_logs`
--
ALTER TABLE `copy_trading_logs`
  ADD CONSTRAINT `copy_trading_logs_ibfk_1` FOREIGN KEY (`master_account_id`) REFERENCES `copy_trading_accounts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `copy_trading_logs_ibfk_2` FOREIGN KEY (`child_account_id`) REFERENCES `copy_trading_accounts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `franchise_stats`
--
ALTER TABLE `franchise_stats`
  ADD CONSTRAINT `fk_franchise_stats_user` FOREIGN KEY (`franchiseUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `franchise_users`
--
ALTER TABLE `franchise_users`
  ADD CONSTRAINT `fk_franchise_users_franchise` FOREIGN KEY (`franchiseUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_franchise_users_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notification_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `plans`
--
ALTER TABLE `plans`
  ADD CONSTRAINT `fk_plans_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `fk_settings_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `strategies`
--
ALTER TABLE `strategies`
  ADD CONSTRAINT `fk_strategies_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `StrategySubscriptions`
--
ALTER TABLE `StrategySubscriptions`
  ADD CONSTRAINT `fk_subscription_strategy` FOREIGN KEY (`strategyId`) REFERENCES `strategies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_subscription_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `supportmessages`
--
ALTER TABLE `supportmessages`
  ADD CONSTRAINT `fk_message_author` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_message_ticket` FOREIGN KEY (`ticketId`) REFERENCES `supporttickets` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `supporttickets`
--
ALTER TABLE `supporttickets`
  ADD CONSTRAINT `fk_ticket_assigned` FOREIGN KEY (`assignedTo`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ticket_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `trades`
--
ALTER TABLE `trades`
  ADD CONSTRAINT `fk_trades_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `usagestats`
--
ALTER TABLE `usagestats`
  ADD CONSTRAINT `fk_usageStats_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wallets`
--
ALTER TABLE `wallets`
  ADD CONSTRAINT `fk_wallet_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wallettransactions`
--
ALTER TABLE `wallettransactions`
  ADD CONSTRAINT `fk_transaction_wallet` FOREIGN KEY (`walletId`) REFERENCES `wallets` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
