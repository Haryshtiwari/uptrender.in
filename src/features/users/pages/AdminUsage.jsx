"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  InputAdornment,
  Chip,
  Grid,
  useTheme,
  useMediaQuery,
  Fab,
  Zoom,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material"
import {
  Search,
  FilterList,
  Add,
  Settings,
  Refresh,
  Download,
  FiberManualRecord,
  Menu as MenuIcon,
  Close,
  Notifications,
  Dashboard,
  TrendingUp,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"

import StatsGrid from "../components/StatsGrid"
import ActivityTable from "../components/ActivityTable"
import Recommendations from "../components/Recommendations"
import AnalyticsTabs from "../components/AnalyticsTabs"
import Breadcrumb from "../../../components/layout/full/shared/breadcrumb/Breadcrumb"



const PulsingDot = styled(FiberManualRecord)(({ theme }) => ({
  fontSize: 8,
  color: "#4caf50",
  animation: "pulse 2s infinite",
  "@keyframes pulse": {
    "0%": { opacity: 1 },
    "50%": { opacity: 0.5 },
    "100%": { opacity: 1 },
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: 6,
  },
}))



const FloatingActionButton = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  background: "linear-gradient(135deg, #2196f3, #9c27b0)",
  "&:hover": {
    background: "linear-gradient(135deg, #1976d2, #7b1fa2)",
  },
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}))

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 280,
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  },
}))

export default function UsagePage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showFab, setShowFab] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowFab(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleRefresh = () => {
    window.location.reload()
  }

  const quickActions = [
    { icon: <Dashboard />, text: "Dashboard", action: () => { } },
    { icon: <TrendingUp />, text: "Analytics", action: () => { } },
    { icon: <Settings />, text: "Settings", action: () => { } },
    { icon: <Notifications />, text: "Alerts", action: () => { } },
  ]

  const BCrumb = [
    { to: '/dashboard/account', title: 'Account' },
    { title: '  Usage' },
  ];

  return (
    <Box>
      <Breadcrumb title=" Account " items={BCrumb} />
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 1 }, px: { xs: 1, sm: 1 } }}>
        <MobileDrawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">Quick Actions</Typography>
              <IconButton onClick={() => setDrawerOpen(false)}><Close /></IconButton>
            </Box>
            <List>
              {quickActions.map((action, index) => (
                <ListItem button key={index} onClick={action.action}>
                  <ListItemIcon>{action.icon}</ListItemIcon>
                  <ListItemText primary={action.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </MobileDrawer>
        <Box mb={{ xs: 3, sm: 4 }}>
          <StatsGrid />
        </Box>
        <Grid
          container
          spacing={{ xs: 2, sm: 2 }}
          sx={{
            mb: { xs: 3, sm: 4 },

            display: "flex",
            alignItems: "stretch",
          }}
        >
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} sx={{ display: "flex" }}>
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
              <ActivityTable />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} sx={{ display: "flex", mt: 1 }}>
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
              <Recommendations />
            </Box>
          </Grid>
        </Grid>

        {/* Analytics Tabs */}
        <Box mb={{ xs: 3, sm: 4 }} >
          <AnalyticsTabs />
        </Box>

        {/* Footer */}
        <Box textAlign="center" py={{ xs: 2, sm: 4 }}>
          <Chip
            icon={<PulsingDot />}
            label={`Last updated: ${new Date().toLocaleTimeString()} • Auto-refresh enabled`}
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              fontSize: { xs: "0.7rem", sm: "0.875rem" },
            }}
          />
        </Box>

        {/* Floating Action Button for Mobile */}
        <Zoom in={showFab && isMobile}>
          <FloatingActionButton onClick={handleRefresh}>
            <Refresh />
          </FloatingActionButton>
        </Zoom>
      </Container>
    </Box>
  )
}
