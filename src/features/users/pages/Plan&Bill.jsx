import React from 'react'
import UserPlanPage from "../components/UserPlanInfo"
import Breadcrumb from '../../../components/layout/full/shared/breadcrumb/Breadcrumb';
const PlanBill = () => {

    const BCrumb = [
  { to: '/dashboard/profile', title: 'Account' },
  { title: 'Plan & Bill' },
];
  return (
    <>
    <Breadcrumb title="Plan Info" items={BCrumb}/>
    <UserPlanPage/>
    </>
  )
}

export default PlanBill;