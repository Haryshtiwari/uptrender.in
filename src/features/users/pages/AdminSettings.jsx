"use client"

import { useState } from "react"
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  IconButton,
  InputAdornment,
  Alert,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import {
  Key,
  Settings,
  Save,
  ContentCopy,
  Visibility,
  VisibilityOff,
  Add,
  Delete,
  CheckCircle,
  CloudQueue,
  Security,
  Notifications,
  ExpandMore,
  Api,
  Storage,
  Analytics,
} from "@mui/icons-material"
import Breadcrumb from '../../../components/layout/full/shared/breadcrumb/Breadcrumb';
import { useEffect } from "react";
import PageContainer from "../../../components/common/PageContainer";

  const BCrumb = [
    { to: '/dashboard/profile', title: 'Account' },
    { title: 'Profile' },
  ];
function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}
export default function SettingsPage() {
  const theme = useTheme()
  
  const location = useLocation();
  const navigate = useNavigate();

  const [showApiKey, setShowApiKey] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const tabKeys = ['api', 'app', 'platform'];
  const currentHash = location.hash.replace('#', '') || 'api';
  const currentIndex = tabKeys.indexOf(currentHash) === -1 ? 0 : tabKeys.indexOf(currentHash);
const [tabValue, setTabValue] = useState(currentIndex)
  useEffect(() => {
  
    setTabValue(currentIndex);
  }, [location.hash]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    navigate(`#${tabKeys[newValue]}`);
  };

  return (
 
    
 <PageContainer title="Admin Settings" description="This is the Settings page">
    
     <Breadcrumb title=" Account "   items={BCrumb}/>
  <Box sx={{ minHeight: '100vh' }}>


      <Container maxWidth="xl">
        
      <Paper
        elevation={0}
        sx={{
          mb: 1,
          display: "flex",
          backdropFilter: "blur(10px)",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
       <Tabs
  value={tabValue}
  onChange={handleTabChange}
  variant="fullWidth"
  sx={{
    "& .MuiTab-root": {
      minHeight: 40,
      textTransform: "none",
      fontSize: "0.8rem",
      fontWeight: 600,
    },
    // selected label + icon
    "& .Mui-selected, & .Mui-selected svg": {
           color:theme.palette.primary.main, // <- white on a dark primary
    },
  }}
>
  <Tab
    icon={<Key size={18} />}
    label="API Settings"
    iconPosition="start"
    sx={{ color: theme.palette.primary.main }}
  />
  <Tab
    icon={<Settings size={18} />}
    label="App Settings"
    iconPosition="start"
    sx={{ color: theme.palette.primary.main }}
  />
  <Tab
    icon={<Security size={18} />}
    label="Platform Settings"
    iconPosition="start"
    sx={{ color: theme.palette.primary.main }}
  />
</Tabs>
      </Paper>

      {/* Tab Content */}
      <Box p={2}>
        {tabValue === 0 && <div>API Settings Content</div>}
        {tabValue === 1 && <div>App Settings Content</div>}
        {tabValue === 2 && <div>Platform Settings Content</div>}
      </Box>

        {/* API Settings Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* API Configuration */}
            <Grid size={{xs:12}}>
              <Card>
                <CardHeader
                  sx={{
                
                    color: "text.primary",
                  }}
                  avatar={<Key sx={{ color: "primary.main" }} />}
                  title="API Configuration"
                  subheader={
                    <Typography variant="body2" sx={{ color: "text.primary" ,mt:1}}>
                      Manage your API keys, endpoints, and authentication settings
                    </Typography>
                  }
                />
                <CardContent >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="API Key"
                        type={showApiKey ? "text" : "password"}
                        value="sk-1234567890abcdef..."
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowApiKey(!showApiKey)} edge="end">
                                {showApiKey ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                              <IconButton edge="end">
                                <ContentCopy />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                      <Alert severity="warning" sx={{ mt: 1 }}>
                        Keep your API key secure and never share it publicly
                      </Alert>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Base URL"
                        defaultValue="https://api.example.com/v1"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Request Timeout (seconds)"
                        type="number"
                        defaultValue="30"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Rate Limit (requests/minute)</InputLabel>
                        <Select
                          defaultValue="100"
                          label="Rate Limit (requests/minute)"
                          sx={{
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.palette.primary.main,
                            },
                          }}
                        >
                          <MenuItem value="50">50</MenuItem>
                          <MenuItem value="100">100</MenuItem>
                          <MenuItem value="200">200</MenuItem>
                          <MenuItem value="500">500</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  {/* Webhook Settings */}
                  <Box
                    sx={{
                     
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.primary.light}08)`,
                      border: `1px solid ${theme.palette.primary.light}40`,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: 'text.primary',
                      }}
                    >
                      <Api sx={{ color: "primary.main" }}/>
                      Webhook Settings
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Webhook URL" placeholder="https://your-app.com/webhook" />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Webhook Secret"
                          type="password"
                          placeholder="Enter webhook secret"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* API Status */}
            <Grid size={{xs:12,md:12,lg:12}}>
              <Card>
                <CardHeader
                  sx={{
                   
                    color: "text.primary",
                  }}
                  avatar={<CheckCircle sx={{ color: "primary.main" }} />}
                  title="API Status"
                  subheader={
                    <Typography variant="body2" sx={{ color: "text.primary",mt:1 }}>
                      Current API connection status and usage metrics
                    </Typography>
                  }
                />
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: theme.palette.success.main,
                          animation: "pulse 2s infinite",
                          "@keyframes pulse": {
                            "0%": { opacity: 1 },
                            "50%": { opacity: 0.5 },
                            "100%": { opacity: 1 },
                          },
                        }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        Connected
                      </Typography>
                    </Box>
                    <Chip
                      label="Active"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                        color: "white",
                      }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Requests this month: 1,234 / 10,000
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={12.34}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      mb: 3,
                      "& .MuiLinearProgress-bar": {
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      },
                    }}
                  />

                  <Grid container spacing={2}>
                    <Grid size={{xs:4,lg:4,md:4}}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: "center",
                          background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.primary.light}25)`,
                          border: `1px solid ${theme.palette.primary.light}40`,
                        }}
                      >
                        <Typography variant="h6" color="primary.main" fontWeight={700}>
                          98.9%
                        </Typography>
                        <Typography variant="caption" color="primary.dark">
                          Uptime
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{xs:4,lg:4,md:4}}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: "center",
                          background: `linear-gradient(135deg, ${theme.palette.success.light}15, ${theme.palette.success.light}25)`,
                          border: `1px solid ${theme.palette.success.light}40`,
                        }}
                      >
                        <Typography variant="h6" color="success.main" fontWeight={700}>
                          45ms
                        </Typography>
                        <Typography variant="caption" color="success.dark">
                          Avg Response
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{xs:4,lg:4,md:4}}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: "center",
                          background: `linear-gradient(135deg, ${theme.palette.secondary.light}15, ${theme.palette.secondary.light}25)`,
                          border: `1px solid ${theme.palette.secondary.light}40`,
                        }}
                      >
                        <Typography variant="h6" color="secondary.main" fontWeight={700}>
                          1.2K
                        </Typography>
                        <Typography variant="caption" color="secondary.dark">
                          Daily Requests
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Broker Management */}
         <Grid item xs={12}>
  <Card>
    <CardHeader
      sx={{ color: "text.primary" }}
      avatar={<CloudQueue sx={{ color: "primary.main" }} />}
      title="Broker Management"
      subheader={
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
          Manage API brokers and service providers
        </Typography>
      }
      action={
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            background: "rgba(255,255,255,0.2)",
            "&:hover": {
              background: "rgba(255,255,255,0.3)",
            },
          }}
        >
          Add Broker
        </Button>
      }
    />
    <CardContent>
      <List>
        {/* Primary Broker */}
        <ListItem
          sx={{
            mb: 2,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.light}10, ${theme.palette.primary.light}20)`,
            border: `1px solid ${theme.palette.primary.light}40`,
          }}
        >
          <ListItemAvatar>
            <Avatar
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              }}
            >
              <CloudQueue fontSize="small" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Primary Broker"
            secondary={
              <Box>
                <Typography variant="body2" color="text.secondary">
                  api.primarybroker.com
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: theme.palette.success.main,
                    }}
                  />
                  <Typography variant="caption" color="success.main" fontWeight={600}>
                    Online
                  </Typography>
                </Box>
              </Box>
            }
          />
          
        <Box
  sx={{
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    alignItems: "center",
    gap: 1,
    ml: { sm: "auto" }, // Push to right on sm and above
    mt: { xs: 1, sm: 0 }, // Top margin on small screens
  }}
>
  <Chip
    label="Active"
    size="small"
    sx={{
      background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
      color: "white",
    }}
  />
  <Switch defaultChecked color="primary" />
  <IconButton size="small">
    <Settings fontSize="small" />
  </IconButton>
  <IconButton size="small" color="error">
    <Delete fontSize="small" />
  </IconButton>
</Box>

        </ListItem>

        {/* Secondary Broker */}
        <ListItem
          sx={{
            mb: 2,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.warning.light}10, ${theme.palette.warning.light}20)`,
            border: `1px solid ${theme.palette.warning.light}40`,
          }}
        >
          <ListItemAvatar>
            <Avatar
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
              }}
            >
              <CloudQueue fontSize="small" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Secondary Broker"
            secondary={
              <Box>
                <Typography variant="body2" color="text.secondary">
                  api.secondarybroker.com
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: theme.palette.warning.main,
                    }}
                  />
                  <Typography variant="caption" color="warning.main" fontWeight={600}>
                    Standby
                  </Typography>
                </Box>
              </Box>
            }
          />
         <Box
  sx={{
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    alignItems: "center",
    gap: 1,
    ml: { sm: "auto" }, // Push to right on sm and above
    mt: { xs: 1, sm: 0 }, // Top margin on small screens
  }}
>
  <Chip
    label="Active"
    size="small"
    sx={{
      background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
      color: "white",
    }}
  />
  <Switch defaultChecked color="primary" />
  <IconButton size="small">
    <Settings fontSize="small" />
  </IconButton>
  <IconButton size="small" color="error">
    <Delete fontSize="small" />
  </IconButton>
</Box>

        </ListItem>
      </List>

      <Divider sx={{ my: 3 }} />

      {/* Add New Broker Form */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Add color="secondary" />
            Add New Broker
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Broker Name" placeholder="Enter broker name" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Broker URL" placeholder="https://api.broker.com" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="API Key" type="password" placeholder="Enter API key" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select label="Priority">
                  <MenuItem value="primary">Primary</MenuItem>
                  <MenuItem value="secondary">Secondary</MenuItem>
                  <MenuItem value="backup">Backup</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description (Optional)"
                placeholder="Brief description of the broker"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch color="secondary" />}
                label="Enable immediately after adding"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </CardContent>
  </Card>
</Grid>

          </Grid>
        </TabPanel>

        {/* App Settings Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid size={{
                xs:12,md:12,lg:12
            }}>
              <Card>
                <CardHeader
                  sx={{
                  
                    color: "text.primary",
                  }}
                  avatar={<Settings sx={{ color: "primary.main" }} />}
                  title="General Settings"
                  subheader={
                    <Typography variant="body2" sx={{ color: "text.primary" ,mt:1}}>
                      Configure your application preferences and behavior
                    </Typography>
                  }
                />
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Application Name"
                        defaultValue="My Application"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: theme.palette.success.main,
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Language</InputLabel>
                        <Select
                          defaultValue="en"
                          label="Language"
                          sx={{
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.palette.success.main,
                            },
                          }}
                        >
                          <MenuItem value="en">English</MenuItem>
                          <MenuItem value="es">Spanish</MenuItem>
                          <MenuItem value="fr">French</MenuItem>
                          <MenuItem value="de">German</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Timezone</InputLabel>
                        <Select
                          defaultValue="utc"
                          label="Timezone"
                          sx={{
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.palette.success.main,
                            },
                          }}
                        >
                          <MenuItem value="utc">UTC</MenuItem>
                          <MenuItem value="est">Eastern Time</MenuItem>
                          <MenuItem value="pst">Pacific Time</MenuItem>
                          <MenuItem value="cet">Central European Time</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{xs:12,md:12,lg:12,sm:12}}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        defaultValue="A powerful application for managing your workflow"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: theme.palette.success.main,
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardHeader
                  sx={{
                   
                    color: "text.primary",
                  }}
                  avatar={<Settings sx={{ color: "primary.main" }} />}
                  title="Preferences"
                  subheader={
                    <Typography variant="body2" sx={{ color: "text.primary",mt:1 }}>
                      Customize your application experience
                    </Typography>
                  }
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Paper
                        sx={{
                          p: 2,
                          background: `linear-gradient(135deg, ${theme.palette.primary.light}10, ${theme.palette.primary.light}20)`,
                          border: `1px solid ${theme.palette.primary.light}40`,
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notifications}
                              onChange={(e) => setNotifications(e.target.checked)}
                              color="primary"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body1" fontWeight={600}>
                                Enable Notifications
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Receive notifications about important updates
                              </Typography>
                            </Box>
                          }
                        />
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Paper
                        sx={{
                          p: 2,
                          background: `linear-gradient(135deg, ${theme.palette.success.light}10, ${theme.palette.success.light}20)`,
                          border: `1px solid ${theme.palette.success.light}40`,
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              checked={autoSave}
                              onChange={(e) => setAutoSave(e.target.checked)}
                              color="success"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body1" fontWeight={600}>
                                Auto-save
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Automatically save changes as you work
                              </Typography>
                            </Box>
                          }
                        />
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Paper
                        sx={{
                          p: 2,
                          background: `linear-gradient(135deg, ${theme.palette.secondary.light}10, ${theme.palette.secondary.light}20)`,
                          border: `1px solid ${theme.palette.secondary.light}40`,
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              checked={darkMode}
                              onChange={(e) => setDarkMode(e.target.checked)}
                              color="secondary"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body1" fontWeight={600}>
                                Dark Mode
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Use dark theme for the interface
                              </Typography>
                            </Box>
                          }
                        />
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Items per page</InputLabel>
                        <Select
                          defaultValue="25"
                          label="Items per page"
                          sx={{
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.palette.success.main,
                            },
                          }}
                        >
                          <MenuItem value="10">10</MenuItem>
                          <MenuItem value="25">25</MenuItem>
                          <MenuItem value="50">50</MenuItem>
                          <MenuItem value="100">100</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Platform Settings Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  sx={{
                  
                    color: "text.primary",
                  }}
                  avatar={<Security sx={{ color: "primary.main" }} />}
                  title="Security Settings"
                  subheader={
                    <Typography variant="body2" sx={{ color: "text.primary",mt:1 }}>
                      Manage security and access control settings
                    </Typography>
                  }
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid size={{xs:12,sm:5,lg:5,md:5}}>
                      <Paper
                        sx={{
                          p: 2,
                          background: `linear-gradient(135deg, ${theme.palette.error.light}10, ${theme.palette.error.light}20)`,
                          border: `1px solid ${theme.palette.error.light}40`,
                        }}
                      >
                        <FormControlLabel
                          control={<Switch color="error" />}
                          label={
                            <Box>
                              <Typography variant="body1" fontWeight={600}>
                                Two-Factor Authentication
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Add an extra layer of security to your account
                              </Typography>
                            </Box>
                          }
                        />
                      </Paper>
                    </Grid>

                    <Grid size={{xs:12,sm:5,lg:5,md:5}}>
                      <Paper
                        sx={{
                          p: 2,
                          background: `linear-gradient(135deg, ${theme.palette.warning.light}10, ${theme.palette.warning.light}20)`,
                          border: `1px solid ${theme.palette.warning.light}40`,
                        }}
                      >
                        <FormControlLabel
                          control={<Switch defaultChecked color="warning" />}
                          label={
                            <Box>
                              <Typography variant="body1" fontWeight={600}>
                                Session Timeout
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Automatically log out after inactivity
                              </Typography>
                            </Box>
                          }
                        />
                      </Paper>
                    </Grid>

                    <Grid size={{xs:12,sm:2,lg:2,md:2}}>
                      <FormControl fullWidth>
                        <InputLabel>Session Duration (hours)</InputLabel>
                        <Select
                          defaultValue="8"
                          label="Session Duration (hours)"
                          sx={{
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.palette.secondary.main,
                            },
                          }}
                        >
                          <MenuItem value="1">1 hour</MenuItem>
                          <MenuItem value="4">4 hours</MenuItem>
                          <MenuItem value="8">8 hours</MenuItem>
                          <MenuItem value="24">24 hours</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid size={{xs:12,sm:12,lg:12,md:12}}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Allowed Domains"
                        placeholder="example.com&#10;subdomain.example.com"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: theme.palette.secondary.main,
                            },
                          },
                        }}
                      />
                      <Alert severity="info" sx={{ mt: 1 }}>
                        Enter one domain per line. Leave empty to allow all domains.
                      </Alert>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{xs:12,md:4,lg:4,sm:4}}>
              <Card>
                <CardHeader
                  sx={{
    
                    color: "text.primary",
                  }}
                  avatar={<Storage sx={{ color: "primary.main" }} />}
                  title="Integration Settings"
                  subheader={
                    <Typography variant="body2" sx={{ color: "text.primary",mt:1 }}>
                      Configure third-party integrations
                    </Typography>
                  }
                />
                <CardContent>
                  <List>
                    <ListItem
                      sx={{
                        mb: 1,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.palette.primary.light}10, ${theme.palette.primary.light}20)`,
                        border: `1px solid ${theme.palette.primary.light}40`,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          <Storage size={18} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Slack Integration" secondary="Send notifications to Slack" />
                    
                        <Switch color="primary" />
                     
                    </ListItem>

                    <ListItem
                      sx={{
                        mb: 1,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.palette.success.light}10, ${theme.palette.success.light}20)`,
                        border: `1px solid ${theme.palette.success.light}40`,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                          <Notifications  size={18}/>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Email Integration" secondary="Send email notifications" />
                    
                        <Switch defaultChecked color="success"  />
                     </ListItem>

                    <ListItem
                      sx={{
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.palette.secondary.light}10, ${theme.palette.secondary.light}20)`,
                        border: `1px solid ${theme.palette.secondary.light}40`,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                          <Analytics  size={12}/>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Analytics Integration" secondary="Track usage analytics" />
                     
                        <Switch color="secondary"  />
                    
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{xs:12,md:8,lg:8,sm:8}}>
              <Card>
                <CardHeader
                  sx={{
                  
                    color: "text.primary",
                  }}
                  avatar={<Settings sx={{ color: "primary.main" }} />}
                  title="System Information"
                  subheader={
                    <Typography variant="body2" sx={{ color: "text.primary" }}>
                      Platform status and system details
                    </Typography>
                  }
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid size={{xs:12,md:4,lg:4,sm:4}}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: "center",
                          background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.primary.light}25)`,
                          border: `1px solid ${theme.palette.primary.light}40`,
                        }}
                      >
                        <Typography variant="h6" color="primary.main" fontWeight={700}>
                          v2.1.0
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Version
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{xs:12,md:4,lg:4,sm:4}}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: "center",
                          background: `linear-gradient(135deg, ${theme.palette.success.light}15, ${theme.palette.success.light}25)`,
                          border: `1px solid ${theme.palette.success.light}40`,
                        }}
                      >
                        <Typography variant="h6" color="success.main" fontWeight={700}>
                          Production
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Environment
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{xs:12,md:4,lg:4,sm:4}}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: "center",
                          background: `linear-gradient(135deg, ${theme.palette.secondary.light}15, ${theme.palette.secondary.light}25)`,
                          border: `1px solid ${theme.palette.secondary.light}40`,
                        }}
                      >
                        <Typography variant="h6" color="secondary.main" fontWeight={700}>
                          2 days ago
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Last Updated
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{xs:12,md:4,lg:4,sm:4}}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: "center",
                          background: `linear-gradient(135deg, ${theme.palette.warning.light}15, ${theme.palette.warning.light}25)`,
                          border: `1px solid ${theme.palette.warning.light}40`,
                        }}
                      >
                        <Typography variant="h6" color="warning.main" fontWeight={700}>
                          99.9%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Uptime
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Save Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 3 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Save />}
            sx={{
              background: `primary.main`,
              px: 1,
              py: 1,
              fontSize: "1rem",
              fontWeight: 600,
              boxShadow: 3,
             
            }}
          >
            Save All Changes
          </Button>
        </Box>
      </Container>
    </Box>
  </PageContainer>
  )
}
