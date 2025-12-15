// src/features/api/index.jsx
import AdminApi from './pages/AdminApi';
import Api from './pages/Api';

export const AdminApiRoutes = [
  { path: 'api', element: <AdminApi /> },
];

export const UserApiRoutes = [
  { path: 'api-details', element: <Api /> },
];
