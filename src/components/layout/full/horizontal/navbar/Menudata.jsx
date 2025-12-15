import {
  IconUsers,
  IconTrendingUp,
  IconClipboardText,
  IconNotes,
  IconListDetails,
  IconUserCog,
  IconHelpCircle,
  IconMessage,
  IconCirclePlus,
  IconApiApp,
  IconGraph,
  IconChartDots2,
  IconDeviceAnalytics,
} from '@tabler/icons-react';

import uniqueId from 'lodash/uniqueId';

const Menuitems = [
  {
    id: uniqueId(),
    title: 'Admin',
    icon: IconUserCog,
    children: [
      {
        id: uniqueId(),
        title: 'User',
        icon: IconUsers,
        href: '/admin/user-dashboard',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Trade',
        icon: IconTrendingUp,
        href: '/admin/trade',
        chipColor: 'secondary',
      },
         {
        id: uniqueId(),
        title: 'Strategy',
        icon: IconDeviceAnalytics,
        href: '/admin/strategy-dashboard',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Strategy Overview',
        icon: IconGraph,
        href: '/admin/strategy-overview',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Add User',
        icon: IconCirclePlus,
        href: '/admin/user-profile',
        chipColor: 'secondary',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Strategies',
    icon: IconClipboardText,
    children: [
      {
        id: uniqueId(),
        title: 'View Strategy',
        icon: IconClipboardText,
        href: '/admin/strategies-data',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Create Strategy',
        icon: IconCirclePlus,
        href: '/admin/create',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Strategy Marketplace',
        icon: IconCirclePlus,
        href: '/admin/marketplace',
        chipColor: 'secondary',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Trade View',
    icon: IconNotes,
    children: [
      {
        id: uniqueId(),
        title: 'User Order History',
        icon: IconNotes,
        href: '/admin/order-history',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Strategy Order History',
        icon: IconUserCog,
        href: '/trade/strategy-history',
        chipColor: 'secondary',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'App Management',
    icon: IconApiApp,
    children: [
  {
    id: uniqueId(),
    title: 'Platform Settings',
    icon: IconApiApp,
    href: '/admin/settings#platform',   // ✅
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'API Settings',
    icon: IconListDetails,
    href: '/admin/settings#api',        // ✅
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'App Settings',
    icon: IconListDetails,
    href: '/admin/settings#app',        // ✅
    chipColor: 'secondary',
  },
],

  },
  {
    id: uniqueId(),
    title: 'Account',
    icon: IconHelpCircle,
    children: [
      {
        id: uniqueId(),
        title: 'Usage',
        icon: IconHelpCircle,
        href: '/admin/usage',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Profile',
        icon: IconHelpCircle,
        href: '/admin/profile',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Settings',
        icon: IconHelpCircle,
        href: '/admin/settings',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'Contact Support',
        icon: IconMessage,
        href: '/admin/contact-support',
        chipColor: 'secondary',
      },
    ],
  },
];

export default Menuitems;
