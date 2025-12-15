"use client";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Switch,
  FormControlLabel,
  TextField,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

import PhoneIcon from "@mui/icons-material/Phone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LockIcon from "@mui/icons-material/Lock";
import SecurityIcon from "@mui/icons-material/Security";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ShieldIcon from "@mui/icons-material/Shield";

import { useState } from "react";

const UserProfileInfo = () => {
  const user = {
    name: "user",
    email: "user@example.com",
    phone: "+91 98765 43210",
    joinDate: "January 15, 2023",
    location: "Bangalore, India",
    avatarUrl: "/img/avatar.jpg", // Update path
  };

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotificationEnabled, setLoginNotificationEnabled] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardHeader
        avatar={<Avatar src={user.avatarUrl} sx={{ width: 56, height: 56 }} />}
        action={
          <Tooltip title="Edit Profile">
            <IconButton>
              <EditIcon />
            </IconButton>
          </Tooltip>
        }
        title={<Typography variant="h6">{user.name}</Typography>}
        subheader={user.email}
      />

      <Divider />

      <CardContent>
        {/* Basic Info */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <PhoneIcon color="primary" />
              <Typography variant="body2">{user.phone}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarTodayIcon color="primary" />
              <Typography variant="body2">Joined on {user.joinDate}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1}>
              <LocationOnIcon color="primary" />
              <Typography variant="body2">{user.location}</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Change Password */}
        <Box mt={4}>
          <Divider />
          <Box display="flex" alignItems="center" gap={1} mt={2}>
            <LockIcon color="primary" />
            <Typography variant="subtitle1">Security</Typography>
          </Box>

          {!showPasswordForm ? (
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              startIcon={<LockIcon />}
              fullWidth
              onClick={() => setShowPasswordForm(true)}
            >
              Change Password
            </Button>
          ) : (
            <Box mt={2} display="flex" flexDirection="column" gap={2}>
           
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
              />
              <Box display="flex" justifyContent="flex-end" gap={1}>
                <Button
                  variant="outlined"
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    // Optional: add validation/API logic here
                    console.log({
                      currentPassword,
                      newPassword,
                      confirmPassword,
                    });
                    setShowPasswordForm(false);
                  }}
                >
                  Save Password
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {/* Security Settings */}
        <Box mt={4}>
          <Divider />
          <Box display="flex" alignItems="center" gap={1} mt={2}>
            <ShieldIcon color="primary" />
            <Typography variant="subtitle1">Security Settings</Typography>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={twoFactorEnabled}
                onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
              />
            }
            label={
              <Box display="flex" alignItems="center" gap={1}>
                Two-Factor Authentication
                <Tooltip title="Adds an extra layer of security to your account">
                  <SecurityIcon fontSize="small" color="disabled" />
                </Tooltip>
              </Box>
            }
            sx={{ mt: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={loginNotificationEnabled}
                onChange={() =>
                  setLoginNotificationEnabled(!loginNotificationEnabled)
                }
              />
            }
            label={
              <Box display="flex" alignItems="center" gap={1}>
                Login Notifications
                <Tooltip title="Get notified on new logins">
                  <NotificationsActiveIcon fontSize="small" color="disabled" />
                </Tooltip>
              </Box>
            }
            sx={{ mt: 1 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserProfileInfo;
