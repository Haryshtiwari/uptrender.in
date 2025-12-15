import React from "react";
import { Box } from "@mui/material";
import AdminStrategiesTable from "../components/AdminStrategiesTable";
import Breadcrumb from "../../../components/layout/full/shared/breadcrumb/Breadcrumb";

const BCrumb = [
  { to: '/', title: 'Dashboard' },
  { title: 'Strategies Management' },
];

const StrategiesData = () => {
  return (
    <Box>
      <Breadcrumb title="Strategies Management" items={BCrumb} />
      <AdminStrategiesTable />
    </Box>
  );
};

export default StrategiesData;
