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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Card,
  CardContent,
  CardHeader,
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
  AccountBalance,
  SwapHoriz,
  Person,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"

import StatsGrid from "../components/StatsGrid"
import ActivityTable from "../components/ActivityTable"
import Recommendations from "../components/Recommendations"
import AnalyticsTabs from "../components/AnalyticsTabs"
import Breadcrumb from "../../../components/layout/full/shared/breadcrumb/Breadcrumb"
import walletService from "../../../services/walletService"
import { formatDistanceToNow, format } from 'date-fns'



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
  
  // Transaction History State
  const [transactions, setTransactions] = useState([])
  const [transactionLoading, setTransactionLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    const handleScroll = () => {
      setShowFab(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    fetchAdminTransactions()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const fetchAdminTransactions = async () => {
    setTransactionLoading(true)
    try {
      const response = await walletService.getTransactions({ 
        type: 'DEBIT', 
        limit: 50,
        page: 1 
      })
      if (response.success) {
        // Filter admin transfer transactions
        const adminTransfers = response.data.filter(transaction => 
          transaction.description && transaction.description.includes('Transfer to user ID:')
        )
        setTransactions(adminTransfers)
      }
    } catch (error) {
      console.error('Error fetching admin transactions:', error)
    } finally {
      setTransactionLoading(false)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

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

        {/* Admin Wallet Transaction History */}
        <Box mb={{ xs: 3, sm: 4 }}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <AccountBalance />
                </Avatar>
              }
              title={
                <Typography variant="h6" fontWeight={600}>
                  Admin Wallet Transaction History
                </Typography>
              }
              subheader="Wallet transfers to user accounts"
              action={
                <IconButton onClick={fetchAdminTransactions} disabled={transactionLoading}>
                  <Refresh />
                </IconButton>
              }
            />
            <CardContent sx={{ pt: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Date & Time
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Amount Debited
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Transferred To
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Description
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Status
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactionLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell colSpan={5}>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Box 
                                sx={{ 
                                  width: 40, 
                                  height: 40, 
                                  borderRadius: '50%', 
                                  bgcolor: 'grey.200',
                                  animation: 'pulse 1.5s ease-in-out infinite'
                                }} 
                              />
                              <Box flex={1}>
                                <Box 
                                  sx={{ 
                                    height: 20, 
                                    bgcolor: 'grey.200', 
                                    borderRadius: 1,
                                    animation: 'pulse 1.5s ease-in-out infinite'
                                  }} 
                                />
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : transactions.length > 0 ? (
                      transactions
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((transaction, index) => {
                          // Extract user ID from description
                          const userIdMatch = transaction.description.match(/Transfer to user ID: (\d+)/);
                          const userId = userIdMatch ? userIdMatch[1] : 'Unknown';
                          
                          return (
                            <TableRow key={transaction.id || index}>
                              <TableCell>
                                <Box>
                                  <Typography variant="body2" fontWeight={500}>
                                    {format(new Date(transaction.createdAt), 'MMM dd, yyyy')}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {format(new Date(transaction.createdAt), 'hh:mm a')}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <SwapHoriz color="error" fontSize="small" />
                                  <Typography 
                                    variant="body2" 
                                    fontWeight={600} 
                                    color="error.main"
                                  >
                                    -₹{Number(transaction.amount).toLocaleString()}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.light' }}>
                                    <Person fontSize="small" />
                                  </Avatar>
                                  <Typography variant="body2">
                                    User ID: {userId}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {transaction.description}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={transaction.status}
                                  color={transaction.status === 'COMPLETED' ? 'success' : 'default'}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <Box textAlign="center" py={3}>
                            <Typography color="text.secondary">
                              No wallet transfer transactions found
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {transactions.length > 0 && (
                <TablePagination
                  component="div"
                  count={transactions.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                />
              )}
            </CardContent>
          </Card>
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
