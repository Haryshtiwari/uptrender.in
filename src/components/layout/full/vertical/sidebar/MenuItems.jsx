import uniqueId from 'lodash/uniqueId';

import {
  // IconUserCircle,
  IconUsers,
  IconDeviceAnalytics,
  IconTrendingUp,
  // IconLayoutadmin,
  // IconSettings2,
  // IconDatabase,
  // IconShieldLock,
  // IconChartBar,
  IconClipboardText,
  IconNotes,
  // IconCloudDataConnection,
  IconListDetails,
  // IconUserCog,
  // IconLock,
  IconHelpCircle,
  IconMessage,
  IconCirclePlus,
  IconApiApp,
  // IconLayersLinked,
  IconGraph,
  IconChartDots2,
  // IconTree,
  IconUserCog,
  IconBuildingStore,
  IconCurrencyDollar,
  IconDashboard
} from '@tabler/icons-react';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'admin',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconDashboard,
    href: '/admin/dashboard',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'Users',
    icon: IconCirclePlus,
    href: '/admin/user-profile',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'Franchise',
    icon: IconBuildingStore,
    href: '/admin/franchise',
    chipColor: 'secondary',
  },
  // {
  //   id: uniqueId(),
  //   title: 'User',
  //   icon: IconUsers,
  //   href: '/admin/user-dashboard',
  //   chipColor: 'secondary',
  // },
 {
    id: uniqueId(),
    title: 'Strategy ',
    icon: IconDeviceAnalytics,
    href: '/admin/strategy-dashboard',
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
    navlabel: true,
    subheader: 'Strategies',
  },
  {
    id: uniqueId(),
    title: ' View Strategy ',
    icon: IconClipboardText,
  href: '/admin/startegies-data',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: ' Create Strategy ',
    icon: IconCirclePlus,
    href: '/admin/create',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: ' Strategy MarketPlace ',
    icon: IconCirclePlus,
    href: '/admin/marketplace',
    chipColor: 'secondary',
  },
  {
    navlabel: true,
    subheader: 'Trade View',
  },
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

  {
    navlabel: true,
    subheader: 'Subscription Management',
  },
  {
    id: uniqueId(),
    title: 'Plan Management',
    icon: IconCurrencyDollar,
    href: '/admin/plan-management',
    chipColor: 'secondary',
  },
  {
    navlabel: true,
    subheader: 'APP Management',
  },
  {
    id: uniqueId(),
    title: 'Platform Settings',
    icon: IconApiApp,
    href: '/admin/settings#platform',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'API settings',
    icon: IconListDetails,
    href: '/admin/settings#api',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'APP settings',
    icon: IconListDetails,
    href: '/admin/settings#app',
    chipColor: 'secondary',
  },


  
  {
    navlabel: true,
    subheader: 'Account',
  },
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
    icon: IconMessage,
    href: '/admin/profile',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'Settings',
    icon: IconMessage,
    href: '/admin/settings',
    chipColor: 'secondary',
  },  {
    id: uniqueId(),
    title: 'Contact Support',
    icon: IconMessage,
    href: '/admin/contact-support',
    chipColor: 'secondary',
  },
  {
    navlabel: true,
    subheader: 'Pages',
  },
  {
    id: uniqueId(),
    title: 'Strategy Overview',
    icon: IconGraph,
    href: '/admin/startegy-overview',
    chipColor: 'secondary',
  },
  // {
  //   id: uniqueId(),
  //   title: 'Add User',
  //   icon: IconCirclePlus,
  //   href: '/admin/user-profile',
  //   chipColor: 'secondary',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'API',
  //   icon: IconChartDots2,
  //   href: '/admin/api',
  //   chipColor: 'secondary',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Platform',
  //   icon: IconTree,
  //   href: '/admin/platform-support',
  //   chipColor: 'secondary',
  // },
];

export default Menuitems;
