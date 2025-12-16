-- Migration: Add tradeMode field to strategies and StrategySubscriptions tables
-- Date: 2025-12-15
-- Description: Add tradeMode field to support paper trading and live trading modes

-- Add tradeMode column to strategies table
ALTER TABLE strategies 
ADD COLUMN tradeMode ENUM('paper', 'live') DEFAULT 'paper' AFTER isPaused;

-- Add tradeMode column to StrategySubscriptions table  
ALTER TABLE StrategySubscriptions 
ADD COLUMN tradeMode ENUM('paper', 'live') DEFAULT 'paper' AFTER isActive;

-- Update existing records to default to paper mode
UPDATE strategies SET tradeMode = 'paper' WHERE tradeMode IS NULL;
UPDATE StrategySubscriptions SET tradeMode = 'paper' WHERE tradeMode IS NULL;

-- Add index for better query performance
CREATE INDEX idx_strategies_trade_mode ON strategies(tradeMode);
CREATE INDEX idx_strategy_subscriptions_trade_mode ON StrategySubscriptions(tradeMode);