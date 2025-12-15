"use client"

import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
  TablePagination,
  CircularProgress,
  Stack,
} from "@mui/material"
import { Schedule, CheckCircle, Warning, Error } from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import Scrollbar from "../../../components/custom-scroll/Scrollbar"
import adminUserService from "../../../services/adminUserService"

const StyledCard = styled(Card)(({ theme }) => ({
  border: "none",
  boxShadow: theme.shadows[3],
  height: "100%",
  margin: theme.spacing(1),
}))

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  background: theme.palette.background.default,
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}))

const MobileActivityCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  boxShadow: theme.shadows[1],
}))

export default function ActivityTable() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [page, setPage] = useState(0)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const rowsPerPage = 10

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const result = await adminUserService.getRecentActivity({ limit: 50 })
        if (result.success) {
          const normalized = (result.data || []).map((log) => ({
            id: log.id,
            type: log.entityType || log.metadata?.entityType || 'System',
            action: log.action,
            name:
              log.description ||
              log.metadata?.details ||
              log.user?.email ||
              log.user?.name ||
              'Unknown',
            time: log.createdAt
              ? formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })
              : '—',
            status: (log.metadata?.status || 'info').toLowerCase(),
          }))
          setActivities(normalized)
        }
      } catch (error) {
        console.error('Error fetching activity logs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [])

  const handleChangePage = (_, newPage) => {
    setPage(newPage)
  }

  const getStatusIcon = (status) => {
    const iconProps = { fontSize: "small" }
    switch (status) {
      case "success":
        return <CheckCircle {...iconProps} color="success" />
      case "warning":
        return <Warning {...iconProps} color="warning" />
      case "error":
        return <Error {...iconProps} color="error" />
      default:
        return <Schedule {...iconProps} color="disabled" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "User":
        return "primary"
      case "API":
        return "success"
      case "Strategy":
        return "secondary"
      case "Trade":
        return "warning"
      default:
        return "default"
    }
  }

  const paginatedActivities = activities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  if (loading) {
    return (
      <StyledCard>
        <CardContent>
          <Stack alignItems="center" py={4}>
            <CircularProgress size={32} />
          </Stack>
        </CardContent>
      </StyledCard>
    )
  }

  if (!activities.length) {
    return (
      <StyledCard>
        <CardContent>
          <Stack alignItems="center" py={4}>
            <Typography variant="body2" color="text.secondary">
              No activity recorded yet.
            </Typography>
          </Stack>
        </CardContent>
      </StyledCard>
    )
  }

  if (isMobile) {
    return (
      <StyledCard>
        <StyledCardHeader
          avatar={<Avatar sx={{ bgcolor: theme.palette.primary.main }}><Schedule /></Avatar>}
          title={<Typography variant="h6" fontWeight="bold" sx={{ fontSize: "1rem" }}>Recent Activity</Typography>}
          subheader={<Typography variant="caption">Latest usage events</Typography>}
        />
        <CardContent sx={{ p: 1 }}>
          {paginatedActivities.map((activity) => (
            <MobileActivityCard key={activity.id}>
              <CardContent sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip label={activity.type} color={getTypeColor(activity.type)} size="small" />
                    <Typography variant="body2" fontWeight={500}>{activity.action}</Typography>
                  </Box>
                  {getStatusIcon(activity.status)}
                </Box>
                <Typography variant="caption" color="text.secondary" noWrap>{activity.name}</Typography>
                <Typography variant="caption" color="text.secondary">{activity.time}</Typography>
              </CardContent>
            </MobileActivityCard>
          ))}
        </CardContent>
        <Box px={2} pb={2}>
          <TablePagination
            component="div"
            count={activities.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
          />
        </Box>
      </StyledCard>
    )
  }

  return (
    <StyledCard>
      <StyledCardHeader
        avatar={<Avatar sx={{ bgcolor: theme.palette.primary.main }}><Schedule /></Avatar>}
        title={<Typography variant="h6" fontWeight="bold">Recent Activity</Typography>}
        subheader="Latest usage events and limit changes"
      />
      <CardContent sx={{ p: 0 }}>
        <Scrollbar style={{ maxHeight: 480 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell><Typography fontWeight="bold">Type</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Action</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Details</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Time</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedActivities.map((activity) => (
                <StyledTableRow key={activity.id}>
                  <TableCell>
                    <Chip label={activity.type} color={getTypeColor(activity.type)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500}>{activity.action}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" noWrap>{activity.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{activity.time}</Typography>
                  </TableCell>
                  <TableCell>{getStatusIcon(activity.status)}</TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </CardContent>
      <Box px={2} pb={2}>
        <TablePagination
          component="div"
          count={activities.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
        />
      </Box>
    </StyledCard>
  )
}
