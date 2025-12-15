import {
  IconLayoutDashboard,
  IconChartBar,
  IconShoppingCart,
  IconApi,
  IconHistory,
  IconLayersSubtract,
  IconTrendingUp,
  IconFileInvoice,
  IconUser,
  IconCategory,
  IconCopy,
  IconCurrencyDollar,
  IconHelpCircle,
  IconPlus,
} from '@tabler/icons-react';

import uniqueId from 'lodash/uniqueId';

const UserMenuItems = [
  {
    navlabel: true,
    subheader: 'Main',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/user/dashboard',
  },

  {
    navlabel: true,
    subheader: 'Trading',
  },
  {
    id: uniqueId(),
    title: 'Trade Panel',
    icon: IconChartBar,
    href: '/user/trade-panel',
  },
  {
    id: uniqueId(),
    title: 'Marketplace',
    icon: IconShoppingCart,
    href: '/user/marketplace',
  },
  {
    id: uniqueId(),
    title: 'Strategy Builder',
    icon: IconCategory,
    href: '/user/strategy-builder',
  },
  {
    id: uniqueId(),
    title: 'Strategy Info',
    icon: IconLayersSubtract,
    href: '/user/strategy-info',
  },
  {
    id: uniqueId(),
    title: 'Trade Info',
    icon: IconTrendingUp,
    href: '/user/trade-info',
  },
  {
    id: uniqueId(),
    title: 'Copy Trading',
    icon: IconCopy,
    href: '/user/copy-trading',
  },

  {
    navlabel: true,
    subheader: 'API & Orders',
  },
  {
    id: uniqueId(),
    title: 'API Details',
    icon: IconApi,
    href: '/user/api-details',
  },
  {
    id: uniqueId(),
    title: 'Order History',
    icon: IconHistory,
    href: '/user/order-history',
  },

  {
    navlabel: true,
    subheader: 'Account',
  },
  {
    id: uniqueId(),
    title: 'Plan & Bill',
    icon: IconFileInvoice,
    href: '/user/plan-info',
  },
  {
    id: uniqueId(),
    title: 'Profile',
    icon: IconUser,
    href: '/user/profile',
  },
  {
    id: uniqueId(),
    title: 'Support',
    icon: IconHelpCircle,
    href: '/user/support',
  },
];

export default UserMenuItems;
