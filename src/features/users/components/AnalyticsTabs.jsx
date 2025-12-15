"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Box,
  Grid,
  LinearProgress,
  Paper,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import { ExpandMore } from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import adminUserService from "../../../services/adminUserService"
import adminApiKeyService from "../../../services/adminApiKeyService"
import { adminStrategyService } from "../../../services/adminStrategyService"

const StyledCard = styled(Card)(({ theme }) => ({
  border: "none",
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  [theme.breakpoints.down("sm")]: {
    margin: theme.spacing(1),
  },
}))

const StyledPaper = styled(Paper)(({ theme, gradient }) => ({
  padding: theme.spacing(2),
  background: gradient,
  borderRadius: 12,
  height: "100%",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
  },
}))

const ColorDot = styled(Box)(({ color }) => ({
  width: 12,
  height: 12,
  borderRadius: "50%",
  backgroundColor: color,
  flexShrink: 0,
}))

const StyledTabs = styled(Tabs)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    "& .MuiTab-root": {
      fontSize: "0.75rem",
      minWidth: "auto",
      padding: theme.spacing(1, 2),
    },
  },
}))

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: { xs: 2, sm: 3 } }}>{children}</Box>}
    </div>
  )
}

const MobileAccordionContent = ({ title, data, colorDot }) => (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMore />}>
      <Box display="flex" alignItems="center" gap={1}>
        <ColorDot color={colorDot} />
        <Typography variant="body2" fontWeight="bold" color="text.primary">
          {title}
        </Typography>
      </Box>
    </AccordionSummary>
    <AccordionDetails>
      <Box display="flex" flexDirection="column" gap={1}>
        {data.map((item, index) => (
          <Paper key={index} sx={{ p: 1.5, display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" fontWeight={500} color="text.primary">
              {item.label || item.name}
            </Typography>
            <Typography
              variant="caption"
              fontWeight="bold"
              color={
                item.positive !== undefined
                  ? item.positive
                    ? "success.main"
                    : "error.main"
                  : item.status === "success"
                  ? "success.main"
                  : item.status === "warning"
                  ? "warning.main"
                  : item.status === "error"
                  ? "error.main"
                  : "text.primary"
              }
            >
              {item.value || item.count}
            </Typography>
          </Paper>
        ))}
      </Box>
    </AccordionDetails>
  </Accordion>
)

const DesktopSection = ({ title, data, type, gradient, colorDot }) => (
  <Grid size={{xs:12,md:6,sm:6,lg:6}}>
    <StyledPaper gradient={gradient}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <ColorDot color={colorDot} />
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: '#898989' }}
        >
          {title}
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={2}>
        {data.map((item, index) =>
          type === "progress" ? (
            <Box key={index}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" fontWeight={500} sx={{ color: '#898989' }}>
                  {item.label || item.name}
                </Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ color: '#898989' }}>
                  {item.value || item.count}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={item.percentage || (item.value / item.total) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          ) : (
            <Paper
              key={index}
              sx={{ p: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <Typography variant="body2" fontWeight={500} sx={{ color: '#898989' }}>
                {item.label || item.name}
              </Typography>
              <Typography variant="body2" fontWeight="bold" sx={{ color: '#898989' }}>
                {item.value || item.count}
              </Typography>
            </Paper>
          )
        )}
      </Box>
    </StyledPaper>
  </Grid>
)


export default function AnalyticsTabs() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [value, setValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    users: null,
    apis: null,
    strategies: null,
  })

  const handleChange = (_, newValue) => setValue(newValue)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [userStats, apiStats, strategyStats] = await Promise.all([
          adminUserService.getUserStats(),
          adminApiKeyService.getApiKeyStats(),
          adminStrategyService.getStrategyStats(),
        ])

        setStats({
          users: userStats.success ? userStats.data : null,
          apis: apiStats.success ? (apiStats.data?.data || apiStats.data) : null,
          strategies: strategyStats.success ? strategyStats.data : null,
        })
      } catch (error) {
        console.error('Error fetching analytics stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const tabs = useMemo(() => {
    const userStats = stats.users || {}
    const apiOverview = stats.apis?.overview || {}
    const strategyStats = stats.strategies || {}
    const totalStrategies = strategyStats.total || 0
    const segments = (strategyStats.bySegment || []).map((item) => {
      const count = Number(item.count ?? item.dataValues?.count ?? 0)
      return {
        name: item.segment || 'Unknown',
        count,
        percentage: totalStrategies ? Number(((count / totalStrategies) * 100).toFixed(1)) : 0,
      }
    })

    const apiDistribution = [
      { name: 'Indian', count: Number(apiOverview.indian || 0) },
      { name: 'Forex', count: Number(apiOverview.forex || 0) },
      { name: 'Crypto', count: Number(apiOverview.crypto || 0) },
    ].filter((item) => item.count > 0)

    return [
      {
        label: 'Users',
        sections: [
          {
            title: 'Usage Breakdown',
            data: [
              { label: 'Active Users', value: Number(userStats.active || 0), total: Number(userStats.total || 1) },
              { label: 'Inactive Users', value: Number(userStats.inactive || 0), total: Number(userStats.total || 1) },
              { label: 'Verified Users', value: Number(userStats.verified || 0), total: Number(userStats.total || 1) },
            ],
            type: 'progress',
            colorDot: '#2196f3',
            gradient: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
          },
          {
            title: 'Growth Metrics',
            data: [
              { label: 'New This Week', value: `+${userStats.recentSignups || 0}`, positive: true },
              { label: 'Total Users', value: userStats.total || 0, positive: true },
              { label: 'Pending Verification', value: Number(userStats.pending || 0), positive: false },
            ],
            type: 'card',
            colorDot: '#4caf50',
            gradient: 'linear-gradient(135deg, #e8f5e8, #c8e6c9)',
          },
        ],
      },
      {
        label: 'APIs',
        sections: [
          {
            title: 'API Distribution',
            data: apiDistribution.length ? apiDistribution : [{ name: 'No data', count: 0 }],
            type: 'card',
            colorDot: '#00bcd4',
            gradient: 'linear-gradient(135deg, #e0f2f1, #b2dfdb)',
          },
          {
            title: 'API Health Status',
            data: [
              { label: 'Active APIs', value: Number(apiOverview.active || 0), status: 'success' },
              { label: 'Pending Approval', value: Number(apiOverview.pending || 0), status: 'warning' },
              { label: 'Inactive', value: Number(apiOverview.inactive || 0), status: 'error' },
            ],
            type: 'card',
            colorDot: '#ff9800',
            gradient: 'linear-gradient(135deg, #fff3e0, #ffcc80)',
          },
        ],
      },
      {
        label: 'Strategies',
        sections: [
          {
            title: 'Strategy Segments',
            data: segments.length ? segments : [{ name: 'No strategies', count: 0, percentage: 0 }],
            type: 'progress',
            colorDot: '#9c27b0',
            gradient: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
          },
          {
            title: 'Performance Status',
            data: [
              { label: 'Active Strategies', value: Number(strategyStats.active || 0), status: 'success' },
              { label: 'Running', value: Number(strategyStats.running || 0), status: 'success' },
              { label: 'Public', value: Number(strategyStats.public || 0), status: 'warning' },
            ],
            type: 'card',
            colorDot: '#3f51b5',
            gradient: 'linear-gradient(135deg, #e8f5e8, #c8e6c9)',
          },
        ],
      },
    ]
  }, [stats])

  return (
    <StyledCard>
      <Box display="flex" justifyContent="space-between" flexDirection={{ xs: "column", sm: "row" }} gap={2} mb={2}>
        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} color="text.primary">
          Detailed Usage Analytics
        </Typography>
      </Box>

      {loading ? (
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="body2" color="text.secondary">
            Loading analytics…
          </Typography>
        </CardContent>
      ) : (
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <StyledTabs value={value} onChange={handleChange} aria-label="analytics tabs" variant={isMobile ? "fullWidth" : "standard"}>
              {tabs.map((tab, index) => (
                <Tab key={index} label={tab.label} />
              ))}
            </StyledTabs>
          </Box>

          {tabs.map((tab, tabIndex) => (
            <TabPanel key={tabIndex} value={value} index={tabIndex}>
              {isMobile ? (
                <Box>
                  {tab.sections.map((section, i) => (
                    <MobileAccordionContent key={i} title={section.title} data={section.data} colorDot={section.colorDot} />
                  ))}
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {tab.sections.map((section, i) => (
                    <DesktopSection key={i} {...section} />
                  ))}
                </Grid>
              )}
            </TabPanel>
          ))}
        </CardContent>
      )}
    </StyledCard>
  )
}
