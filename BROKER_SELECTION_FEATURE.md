# Strategy Broker Selection Feature

## Overview
This feature allows users to select multiple brokers (API keys) for each strategy. Users can manage which brokers are connected to their strategies through a user-friendly dialog interface.

## Implementation Summary

### Backend Changes

#### 1. Database Migration
- **File**: `/database/migrations/add_strategy_brokers_table.sql`
- **Table**: `strategy_brokers`
- **Purpose**: Stores many-to-many relationship between strategies and API keys/brokers
- **Columns**:
  - `id`: Primary key
  - `strategyId`: Foreign key to strategies table
  - `apiKeyId`: Foreign key to apikeys table
  - `isActive`: Boolean flag to enable/disable broker for strategy
  - `createdAt`, `updatedAt`: Timestamps

#### 2. Model
- **File**: `/backend/src/models/StrategyBroker.js`
- **Purpose**: Sequelize model for strategy_brokers table
- **Relationships**:
  - BelongsTo Strategy
  - BelongsTo ApiKey
  - Strategy belongsToMany ApiKey through StrategyBroker
  - ApiKey belongsToMany Strategy through StrategyBroker

#### 3. Controller
- **File**: `/backend/src/controllers/strategyBrokerController.js`
- **Endpoints**:
  - `getStrategyBrokers`: Get all brokers for a strategy
  - `addBrokerToStrategy`: Add single broker to strategy
  - `addMultipleBrokersToStrategy`: Bulk add/replace brokers
  - `removeBrokerFromStrategy`: Remove broker from strategy
  - `toggleStrategyBrokerStatus`: Toggle broker active/inactive

#### 4. Routes
- **File**: `/backend/src/routes/strategyBrokerRoutes.js`
- **Base Path**: `/api/strategy-brokers`
- **Routes**:
  - `GET /:strategyId/brokers` - List brokers for strategy
  - `POST /:strategyId/brokers` - Add single broker
  - `POST /:strategyId/brokers/bulk` - Add multiple brokers (replaces existing)
  - `DELETE /:strategyId/brokers/:strategyBrokerId` - Remove broker
  - `PATCH /:strategyId/brokers/:strategyBrokerId/toggle` - Toggle status

#### 5. App Integration
- **File**: `/backend/src/app.js`
- **Change**: Added strategyBrokerRoutes to Express app
- **Import**: Added StrategyBroker to models/index.js exports

### Frontend Changes

#### 1. Service Layer
- **File**: `/src/services/strategyBrokerService.js`
- **Purpose**: API client for strategy-broker operations
- **Methods**:
  - `getStrategyBrokers(strategyId)`
  - `addBrokerToStrategy(strategyId, apiKeyId)`
  - `addMultipleBrokersToStrategy(strategyId, apiKeyIds)`
  - `removeBrokerFromStrategy(strategyId, strategyBrokerId)`
  - `toggleStrategyBrokerStatus(strategyId, strategyBrokerId)`

#### 2. Broker Select Dialog Component
- **File**: `/src/features/strategies/components/BrokerSelectDialog.jsx`
- **Features**:
  - Lists all active API keys/brokers for the user
  - Shows current selection for the strategy
  - Checkbox selection with Select All option
  - Displays broker info (name, segment, broker ID)
  - Bulk save operation
  - Loading and error states
  - Visual feedback for changes

#### 3. User Strategy Info Page
- **File**: `/src/features/users/components/UserStrategyInfo.jsx`
- **Changes**:
  - Added import for BrokerSelectDialog component
  - Added AccountBalanceIcon import
  - Added brokerSelectDialog state
  - Added "Select Brokers" button in action column (both tabs)
  - Button opens dialog to select/manage brokers
  - Integrated with success callback to refresh data

## Features

### User Capabilities
1. **View Available Brokers**: See all their active API keys that can be connected
2. **Select Multiple Brokers**: Connect one or more brokers to a strategy
3. **Bulk Update**: Replace all broker connections in one operation
4. **Visual Feedback**: See which brokers are currently selected
5. **Segment Information**: View broker segment (Crypto, Forex, Indian)
6. **Broker Details**: See broker name, API name, and broker ID

### UI/UX Features
- Material-UI styled dialog
- Checkbox list for easy selection
- Select All/Deselect All functionality
- Loading states during API calls
- Error handling with user-friendly messages
- Success notifications via toast
- Disabled state during save operation
- Only shows active API keys

## API Endpoints

### Get Strategy Brokers
```
GET /api/strategy-brokers/:strategyId/brokers
Response: { success: true, data: [...], total: number }
```

### Add Single Broker
```
POST /api/strategy-brokers/:strategyId/brokers
Body: { apiKeyId: number }
Response: { success: true, message: string, data: {...} }
```

### Bulk Add Brokers
```
POST /api/strategy-brokers/:strategyId/brokers/bulk
Body: { apiKeyIds: [number, number, ...] }
Response: { success: true, message: string, data: { count: number } }
```

### Remove Broker
```
DELETE /api/strategy-brokers/:strategyId/brokers/:strategyBrokerId
Response: { success: true, message: string }
```

### Toggle Status
```
PATCH /api/strategy-brokers/:strategyId/brokers/:strategyBrokerId/toggle
Response: { success: true, message: string, data: { id, isActive } }
```

## Testing Guide

### 1. Prerequisites
- User must be logged in
- User must have at least one active API key/broker
- User must have at least one strategy

### 2. Test Steps

#### Add Brokers to Strategy
1. Navigate to Strategy Info page (`/user/strategy`)
2. Find a strategy in either "My Strategies" or "Subscribed Strategies" tab
3. Click the bank/broker icon button (AccountBalance icon)
4. Broker Select Dialog opens
5. Select one or more brokers from the list
6. Click "Save Changes"
7. Verify success message appears
8. Close dialog

#### Verify Selection Persists
1. Open the same strategy's broker dialog again
2. Verify previously selected brokers are still checked

#### Change Broker Selection
1. Open broker dialog for a strategy
2. Uncheck some brokers and check others
3. Save changes
4. Reopen dialog to verify changes

#### Edge Cases
- Try opening dialog when user has no API keys
- Try saving without making any changes (button should be disabled)
- Cancel dialog and verify changes are not saved

### 3. Database Verification
```sql
-- View all strategy-broker relationships
SELECT sb.id, s.name as strategy_name, a.apiName, a.broker, sb.isActive
FROM strategy_brokers sb
JOIN strategies s ON sb.strategyId = s.id
JOIN apikeys a ON sb.apiKeyId = a.id;

-- View brokers for specific strategy
SELECT a.apiName, a.broker, a.segment, sb.isActive
FROM strategy_brokers sb
JOIN apikeys a ON sb.apiKeyId = a.id
WHERE sb.strategyId = 1;
```

## Future Enhancements

1. **Show Active Brokers**: Display count of active brokers in strategy table
2. **Broker Status Indicator**: Visual indicator on strategy cards showing connected brokers
3. **Quick Toggle**: Add quick enable/disable for individual brokers without opening dialog
4. **Broker Filter**: Filter strategies by connected broker
5. **Broker Performance**: Track and display performance metrics per broker
6. **Default Broker**: Allow setting a default broker for new strategies
7. **Broker Logs**: Track when brokers are added/removed with audit trail

## Notes

- All API endpoints require authentication
- Only strategy owner can manage brokers for their strategies
- For subscribed strategies, users can still select their own brokers
- Inactive API keys are not shown in the selection dialog
- The bulk endpoint replaces all existing broker connections
- Removing a broker doesn't delete the API key, just the association

## Error Handling

- 401: User not authenticated
- 403: User doesn't own the strategy
- 404: Strategy or API key not found
- 400: Invalid request data or broker already added
- 500: Server error

All errors are displayed to user via toast notifications and dialog alerts.
