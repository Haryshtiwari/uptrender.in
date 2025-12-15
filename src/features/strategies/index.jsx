// src/features/strategies/index.jsx

import StrategiesData from "./pages/AdminStrategiesData";
import StrategyPage from "./pages/AdminStrategyPage";
import AdminStrategyDetail from "./pages/AdminStrategyDetail";
import MarketPlace from "./pages/MarketPlace";
import CreateStrategy from "./pages/CreateStrategy";
import UserStrategy from "./pages/UserStrategy";
import StrategyBuilder from "./pages/StrategyBuilder";

export const AdminStrategyRoutes = [
  { path: 'startegies-data', element: <StrategiesData /> },
  { path: 'startegy-overview', element: <StrategyPage /> },
  { path: 'strategies/:id', element: <AdminStrategyDetail /> },
  { path: 'marketplace', element: <MarketPlace /> }, // Admin can view marketplace
  { path: 'create', element: <CreateStrategy /> }, // Admin can create strategies
  { path: 'strategy-builder', element: <StrategyBuilder /> }, // Admin can access strategy builder
];

export const UserStrategyRoutes = [
  { path: 'marketplace', element: <MarketPlace /> },
  { path: 'create', element: <CreateStrategy /> },
  { path: 'strategy-info', element: <UserStrategy /> },
  { path: 'strategy-builder', element: <StrategyBuilder /> },
];

