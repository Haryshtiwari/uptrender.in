
import UserInfoTab from "./components/UserInfoTab";
import AdminProfile from "./pages/AdminProfile";
import SettingsPage from "./pages/AdminSettings";
import UsagePage from "./pages/AdminUsage";
import AdminContactSupport from "./pages/ContactSupport";
import PlanBill from "./pages/Plan&Bill";
import UserProfile from "./pages/Profile";
import User from "./pages/User";
import UserSupport from "./pages/UserSupport";
import AdminFranchise from "./pages/AdminFranchise";
import AdminPlanManagement from "./pages/AdminPlanManagement";

export const AdminUserRoutes = [

  { path: "profile", element: <AdminProfile /> },
  { path: "settings", element: <SettingsPage /> },
  { path: "usage", element: <UsagePage /> },
  { path: "user-profile", element: <User /> },
    { path: "User-data/1", element: <UserInfoTab /> },
   { path: "contact-support", element: <AdminContactSupport/> },
   { path: "franchise", element: <AdminFranchise /> },
   { path: "plan-management", element: <AdminPlanManagement /> },
];

export const UserUserRoutes = [

  { path: "profile", element: <UserProfile /> },
  { path: "plan-info", element: <PlanBill /> },
  { path: "support", element: <UserSupport /> },
   
  
];



// import { useAuth } from '../../auth/hooks/useAuth';

// import AdminOrderHistory from "./pages/AdminOrderHistory";
// import AdminProfile from "./pages/AdminProfile";
// import SettingsPage from "./pages/AdminSettings";
// import UsagePage from "./pages/AdminUsage";
// import OrderHistory from "./pages/OrderHistory";
// import PlanBill from "./pages/Plan&Bill";
// import UserProfile from "./pages/Profile";
// import User from "./pages/User";

// // Common routes for all roles
// const commonRoutes = [
//   { path: "settings", element: <SettingsPage /> },
//   { path: "user-profile", element: <User /> },
// ];

// // Admin-only
// const adminRoutes = [
//   { path: "order-history", element: <AdminOrderHistory /> },
//   { path: "profile", element: <AdminProfile /> },
//   { path: "usage", element: <UsagePage /> },
// ];

// // User-only
// const userRoutes = [
//   { path: "order-history", element: <OrderHistory /> },
//   { path: "profile", element: <UserProfile /> },
//   { path: "plan-info", element: <PlanBill /> },
// ];

// // Franchise (empty or limited)
// const franchiseRoutes = [
//   // Example: { path: "plan-info", element: <PlanBill /> },
// ];

// const UserRoutes = () => {
//   const { user } = useAuth();
//   const role = user?.role;

//   let routes = [...commonRoutes];

//   switch (role) {
//     case 'admin':
//       routes = [...routes, ...adminRoutes];
//       break;
//     case 'user':
//       routes = [...routes, ...userRoutes];
//       break;
//     case 'franchise':
//       routes = [...routes, ...franchiseRoutes];
//       break;
//     default:
//       routes = [...routes];
//   }

//   return routes;
// };

// export default UserRoutes;
