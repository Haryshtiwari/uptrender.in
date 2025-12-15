#!/bin/bash

# Add lots and expiry columns to strategies table
# Date: 2025-12-15

echo "Running migration: add_lots_expiry_to_strategies.sql"

# Load database credentials from environment or use defaults
DB_USER="${DB_USER:-root}"
DB_PASS="${DB_PASS:-}"
DB_NAME="${DB_NAME:-algo_trading_db}"
DB_HOST="${DB_HOST:-localhost}"

# Run the migration
mysql -h "$DB_HOST" -u "$DB_USER" ${DB_PASS:+-p"$DB_PASS"} "$DB_NAME" < "$(dirname "$0")/add_lots_expiry_to_strategies.sql"

if [ $? -eq 0 ]; then
    echo "Migration completed successfully!"
else
    echo "Migration failed!"
    exit 1
fi
