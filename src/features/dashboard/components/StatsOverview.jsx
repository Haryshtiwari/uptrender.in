import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Typography,
  Avatar,
  useTheme,
  Skeleton,
  Box,
} from "@mui/material";
import {
  TrendingUp,
  Activity,
  DollarSign,
  Target,
  Clock,
  BarChart3,
} from "lucide-react";
import { adminStrategyService } from "../../../services/adminStrategyService";

const StatsOverview = () => {
  const theme = useTheme();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const result = await adminStrategyService.getStrategyStats();
        
        if (result.success && result.data) {
          const data = result.data;
          // Backend returns: total, active, public, running
          setStats([
            {
              title: "Total Strategies",
              value: (data.total || data.totalStrategies || 0).toString(),
              icon: Target,
              color: "#3b82f6",
            },
            {
              title: "Active Strategies",
              value: (data.active || data.activeStrategies || 0).toString(),
              icon: Activity,
              color: "#10b981",
            },
            {
              title: "Running Strategies",
              value: (data.running || 0).toString(),
              icon: DollarSign,
              color: "#059669",
            },
            {
              title: "Public Strategies",
              value: (data.public || data.publicStrategies || 0).toString(),
              icon: TrendingUp,
              color: "#8b5cf6",
            },
            {
              title: "Options",
              value: (data.bySegment?.find(s => s.segment === 'OPTIONS')?.count || 0).toString(),
              icon: BarChart3,
              color: "#f97316",
            },
            {
              title: "Equity",
              value: (data.bySegment?.find(s => s.segment === 'EQUITY')?.count || 0).toString(),
              icon: Clock,
              color: "#06b6d4",
            },
          ]);
        } else {
          // Fallback to default values
          setStats([
            { title: "Total Strategies", value: "0", icon: Target, color: "#3b82f6" },
            { title: "Active Strategies", value: "0", icon: Activity, color: "#10b981" },
            { title: "Running Strategies", value: "0", icon: DollarSign, color: "#059669" },
            { title: "Public Strategies", value: "0", icon: TrendingUp, color: "#8b5cf6" },
            { title: "Options", value: "0", icon: BarChart3, color: "#f97316" },
            { title: "Equity", value: "0", icon: Clock, color: "#06b6d4" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats([
          { title: "Total Strategies", value: "0", icon: Target, color: "#3b82f6" },
          { title: "Active Strategies", value: "0", icon: Activity, color: "#10b981" },
          { title: "Running Strategies", value: "0", icon: DollarSign, color: "#059669" },
          { title: "Public Strategies", value: "0", icon: TrendingUp, color: "#8b5cf6" },
          { title: "Options", value: "0", icon: BarChart3, color: "#f97316" },
          { title: "Equity", value: "0", icon: Clock, color: "#06b6d4" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Grid size={{ xs: 12, sm: 4, md: 4, lg: 2 }} key={index}>
            <Card
              elevation={3}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderRadius: 4,
                height: "100%",
              }}
            >
              <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
              <Box>
                <Skeleton variant="text" width={80} />
                <Skeleton variant="text" width={60} height={32} />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
  
        const gradientBg = `linear-gradient(135deg, ${stat.color}22, ${stat.color}08)`;

        return (
          <Grid size={{xs:12,sm:4,md:4,lg:2}} key={index}>
            <Card
              elevation={3}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderRadius: 4,
                height: "100%",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                background: gradientBg,
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: `0 8px 20px ${stat.color}44`,
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: stat.color,
                  color: theme.palette.common.white,
                  width: 48,
                  height: 48,
                  mr: 2,
                  boxShadow: `0 2px 6px ${stat.color}88`,
                }}
              >
                <Icon size={24} />
              </Avatar>

              <div>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={600}
                >
                  {stat.title}
                </Typography>
                <Typography
                  variant="h5"
                  color="text.primary"
                  fontWeight={700}
                >
                  {stat.value}
                </Typography>
                
              </div>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StatsOverview;
