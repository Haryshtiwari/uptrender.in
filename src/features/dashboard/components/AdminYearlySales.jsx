import React from 'react';
import DashboardWidgetCard from '../../../components/common/DashboardWidgetCard';
import iconInactive from '../../../assets/images/svgs/icons8-strategy-50.png';

const YearlySales = () => {
  return (
    <DashboardWidgetCard
      icon={iconInactive}  
      title="Total Strategies"
      subtitle="30"
      dataLabel1="Active"
      dataItem1="25"
      dataLabel2="Inactive"
      dataItem2="5"
    />
  );
};

export default YearlySales;
