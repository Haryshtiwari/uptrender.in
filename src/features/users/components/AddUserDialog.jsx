
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Switch,
  FormControlLabel,
  Tooltip,
  Grid,
  InputAdornment,
  Typography,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Badge as BadgeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  WorkspacePremium as PlanIcon,
} from '@mui/icons-material';
import adminUserService from '../../../services/adminUserService';
import { planService } from '../../../services/planService';

const EMPTY_USER = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  planId: '',
  password: '',
  confirm: '',
  role: 'User',
};

export default function AddUserDialog({ open, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_USER);
  const [plans, setPlans] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPlans();
    }
  }, [open]);

  const fetchPlans = async () => {
    try {
      const result = await planService.getAllPlans();
      if (result.success && result.data) {
        setPlans(result.data);
        // Set default plan to first plan if available
        if (result.data.length > 0) {
          setForm((prev) => ({ ...prev, planId: result.data[0].id }));
        }
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handle = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const resetAndClose = () => {
    setForm(EMPTY_USER);
    setErrors({});
    onClose();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!form.confirm) {
      newErrors.confirm = 'Please confirm password';
    } else if (form.password !== form.confirm) {
      newErrors.confirm = 'Passwords do not match';
    }

    if (!form.planId) {
      newErrors.planId = 'Plan is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const userData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
        planId: form.planId,
        role: form.role,
      };

      const result = await adminUserService.createUser(userData);
      
      if (result.success) {
        onSuccess?.();
        resetAndClose();
      } else {
        setErrors({ submit: result.message || 'Failed to create user' });
      }
    } catch (error) {
      setErrors({ submit: error.message || 'An error occurred while creating user' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={resetAndClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Add New User</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} mt={0.5}>
          {/* First Name */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="First Name"
              value={form.firstName}
              onChange={handle('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName}
              required
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Last Name */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Last Name"
              value={form.lastName}
              onChange={handle('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName}
              required
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Email */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={form.email}
              onChange={handle('email')}
              error={!!errors.email}
              helperText={errors.email}
              required
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Phone Number */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Phone Number"
              value={form.phoneNumber}
              onChange={handle('phoneNumber')}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Plan */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              select
              label="Plan"
              value={form.planId}
              onChange={handle('planId')}
              error={!!errors.planId}
              helperText={errors.planId}
              required
              disabled={isSubmitting || plans.length === 0}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PlanIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            >
              {plans.map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.name} - ${plan.price}/month
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Role */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              select
              label="Role"
              value={form.role}
              onChange={handle('role')}
              error={!!errors.role}
              helperText={errors.role}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </TextField>
          </Grid>

          {/* Password */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={form.password}
              onChange={handle('password')}
              error={!!errors.password}
              helperText={errors.password || 'Min 8 chars with uppercase, lowercase, and number'}
              required
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Confirm Password */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="password"
              label="Confirm Password"
              value={form.confirm}
              onChange={handle('confirm')}
              error={!!errors.confirm}
              helperText={errors.confirm}
              required
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Status Note */}
          <Grid size={{ xs: 12 }}>
            <Tooltip title="New users are created with Active status and email verified by default">
              <FormControlLabel
                control={<Switch checked disabled color="success" />}
                label="Active & Verified (Default)"
              />
            </Tooltip>
          </Grid>

          {/* Submit Error */}
          {errors.submit && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="error">{errors.submit}</Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={resetAndClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
