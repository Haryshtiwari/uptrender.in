import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';

// import UserApiInfo from './UserApiInfo';
import UserStrategyInfo from './UserStrategyInfo';
import UserPlanInfo from './UserPlanInfo';
import UserTradeInfo from './UserTradeInfo';
import UserProfileInfo from './UserProfileInfo';
import UserUasgeInfo from './UserUasgeInfo';
import Breadcrumb from '../../../components/layout/full/shared/breadcrumb/Breadcrumb';

import ApiCards from '../../api/components/AdminApiCards';
import ApiTable from '../../api/components/ApiTable';
const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
  </div>
);

const UserInfoTab = ({ userData = {} }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const theme = useTheme();

  const tabLabels = [
    'API Info',
    'Strategy Info',
    'Trade Info',
    'Plan & Bill',
    'Usage',
    'User Profile',
  ];

  const BCrumb = [
    {
      to: '/dashboard/user-profile',
      title: 'User Profile',
    },
    {
      title: 'User Info',
    },
  ];

  const api = userData.api || [];
  const strategies = userData.strategies || [];
  const trades = userData.trades || [];
  const plan = userData.plan || {};
  const profile = userData.profile || {};
   const usage = userData.usage || {};

  return (
    <Box sx={{ p: 2 }}>
      <Breadcrumb title="User Info" items={BCrumb} />

      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={(e, newValue) => setTabIndex(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderRadius: 1,
          mb: 3,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            minWidth: 120,
            px: 2,
            mr: 1,
            borderRadius: 1,
          },
          '& .Mui-selected': {
            color: theme.palette.primary.main,
          },
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.main,
            height: 3,
            borderRadius: 2,
          },
        }}
      >
        {tabLabels.map((label, index) => (
          <Tab label={label} key={index} />
        ))}
      </Tabs>

      {/* Panels */}
      <TabPanel value={tabIndex} index={0}>
        {/* <UserApiInfo api={api} /> */}
        <ApiCards/>
        <ApiTable api={api}/>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <UserStrategyInfo strategies={strategies} />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <UserTradeInfo trades={trades} />
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <UserPlanInfo plan={plan} />
      </TabPanel>
         <TabPanel value={tabIndex} index={4}>
        <UserUasgeInfo plan={usage} />
      </TabPanel>
      <TabPanel value={tabIndex} index={5}>
        <UserProfileInfo profile={profile} />
      </TabPanel>
    </Box>
  );
};

export default UserInfoTab;
