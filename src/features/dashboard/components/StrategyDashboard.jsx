import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Chip,
  Avatar,
  Grid,
  Divider,
} from "@mui/material";
import {
  Search,
  Filter,
  Plus,
  Download,
  Settings,
  Play,
  Pause,
  BarChart3,
  Target,
  TrendingUp,
} from "lucide-react";

import StatsOverview from "./stats-overview";
import PerformanceChart from "./performance-chart";
import StrategyTable from "./strategy-table";
import TopSubscribedStrategies from "./top-subscribed-strategies";

const topPerformers = [
  { name: "Alpha Momentum", return: "+24.5%", risk: "Medium", winRate: "78%" },
  { name: "Beta Scalper", return: "+18.2%", risk: "Low", winRate: "72%" },
  { name: "Gamma Swing", return: "+15.8%", risk: "High", winRate: "65%" },
  { name: "Delta Hedge", return: "+21.3%", risk: "Low", winRate: "85%" },
  { name: "Epsilon Breakout", return: "+19.7%", risk: "High", winRate: "68%" },
  { name: "Zeta Momentum", return: "+16.4%", risk: "Medium", winRate: "74%" },
  { name: "Theta Scalper", return: "+14.9%", risk: "Low", winRate: "69%" },
];

const StrategyDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          bgcolor: "background.paper",
          px: 4,
          py: 2,
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ sm: "center" }}
          gap={2}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Strategy Dashboard
            </Typography>
            <Typography color="text.secondary">
              Manage and monitor your trading strategies
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Button variant="outlined" startIcon={<Download />}>
              Export
            </Button>
            <Button variant="contained" startIcon={<Plus />}>
              New Strategy
            </Button>
          </Box>
        </Box>
      </Box>

      <Box px={4} mt={4}>
        {/* Stats Overview */}
        <StatsOverview />

        {/* Main Grid */}
        <Grid container spacing={3} mt={1}>
          {/* Left Column */}
          <Grid size={{xs:12,lg:8}}>
            <Box display="flex" flexDirection="column" gap={3}>
              <PerformanceChart timeRange={timeRange} setTimeRange={setTimeRange} />

              {/* Strategy Table */}
              <Card>
                <CardHeader
                  title={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Target size={20} />
                      <Typography variant="h6">Active Strategies</Typography>
                    </Box>
                  }
                  action={
                    <Box display="flex" gap={2}>
                      <TextField
                        size="small"
                        placeholder="Search strategies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search size={16} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          label="Status"
                          startAdornment={<Filter size={16} style={{ marginRight: 4 }} />}
                        >
                          <MenuItem value="all">All</MenuItem>
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="paused">Paused</MenuItem>
                          <MenuItem value="stopped">Stopped</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  }
                />
                <CardContent>
                  <StrategyTable searchTerm={searchTerm} filterStatus={filterStatus} />
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid size={{xs:12,sm:6}}>
            <Box display="flex" flexDirection="column" gap={3}>
              {/* Quick Actions */}
              <Card>
                <CardHeader title="Quick Actions" />
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Button fullWidth variant="outlined" startIcon={<Play />}>
                    Start All Strategies
                  </Button>
                  <Button fullWidth variant="outlined" startIcon={<Pause />}>
                    Pause All Strategies
                  </Button>
                  <Button fullWidth variant="outlined" startIcon={<Settings />}>
                    Global Settings
                  </Button>
                  <Button fullWidth variant="outlined" startIcon={<BarChart3 />}>
                    Analytics Report
                  </Button>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card>
                <CardHeader
                  title={
                    <Box display="flex" alignItems="center" gap={1}>
                      <TrendingUp size={20} color="green" />
                      <Typography variant="h6">Top Performers</Typography>
                    </Box>
                  }
                />
                <CardContent sx={{ maxHeight: 300, overflowY: "auto" }}>
                  {topPerformers.map((strategy, idx) => (
                    <Box
                      key={idx}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      p={1}
                      borderRadius={2}
                      bgcolor="action.hover"
                      mb={1}
                    >
                      <Box>
                        <Typography fontSize="0.9rem" fontWeight="500">
                          {strategy.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {strategy.risk} Risk • Win: {strategy.winRate}
                        </Typography>
                      </Box>
                      <Chip
                        label={strategy.return}
                        size="small"
                        sx={{ bgcolor: "#dcfce7", color: "#16a34a", fontWeight: 500 }}
                      />
                    </Box>
                  ))}
                </CardContent>
              </Card>

              {/* Top Subscribed Strategies */}
              <TopSubscribedStrategies />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default StrategyDashboard;
