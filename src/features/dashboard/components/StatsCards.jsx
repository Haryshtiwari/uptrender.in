import React from "react";
import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import { Assessment, CheckCircle, Cancel } from "@mui/icons-material";

const statsData = [
  {
    title: "Total",
    value: "100",
    icon: Assessment,
    color: "#3b82f6",
    bgColor: "#dbeafe",
  },
  {
    title: "Active",
    value: "100",
    icon: CheckCircle,
    color: "#10b981",
    bgColor: "#d1fae5",
  },
  {
    title: "Inactive",
    value: "0",
    icon: Cancel,
    color: "#ef4444",
    bgColor: "#fee2e2",
  },
];

const StatsCards = () => {
  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Strategies
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} sx={{ p: 1 }}>
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: "16px !important",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: stat.bgColor,
                    color: stat.color,
                    width: 48,
                    height: 48,
                  }}
                >
                  <IconComponent />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default StatsCards;
