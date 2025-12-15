import AdminOrderHistory from '../users/pages/AdminOrderHistory';
import OrderHistory from '../users/pages/OrderHistory';
import TradeInfo from './pages/TradeInfo'; 
import UserTradePanel from './pages/UserTradePanel'; 
import AdminTradeManagement from './pages/AdminTradeManagement';

export const AdminTradeRoutes = [
    { path: "trade", element: <AdminTradeManagement /> },
    { path: "order-history", element: <AdminOrderHistory /> },
];

export const UserTradeRoutes = [
  { path: 'trade-info', element: <TradeInfo /> },
  { path: 'trade-panel', element: <UserTradePanel /> },
    { path: "order-history", element: <OrderHistory /> },
];