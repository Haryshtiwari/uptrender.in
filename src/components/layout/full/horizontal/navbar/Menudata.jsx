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
