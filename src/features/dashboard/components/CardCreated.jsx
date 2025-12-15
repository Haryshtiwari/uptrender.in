import React from "react";
import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import { Public, Lock, AdminPanelSettings } from "@mui/icons-material";

const createdByData = [
  {
    title: "Public",
    value: "70",
    icon: Public,
    color: "#10b981",
    bgColor: "#d1fae5",
  },
  {
    title: "Private",
    value: "40",
    icon: Lock,
    color: "#ef4444",
    bgColor: "#fee2e2",
  },
  {
    title: "Admin Created",
    value: "30",
    icon: AdminPanelSettings,
    color: "#6366f1",
    bgColor: "#e0e7ff",
  },
];

const CreatedByCards = () => {
  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Created By
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {createdByData.map((item, index) => {
          const IconComponent = item.icon;
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
                    bgcolor: item.bgColor,
                    color: item.color,
                    width: 48,
                    height: 48,
                  }}
                >
                  <IconComponent />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.title}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: item.color }}>
                    {item.value}
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

export default CreatedByCards;
