"use client";

import {
  Box,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Divider,
  Tooltip,
  Switch,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Phone,
  Mail,
  User,
  Building,
  KeyRound,
  MapPin,
  FileText,
  Key,
  Globe,
  Link,
  Tag,
  UserCheck,
  Calendar,
  ShieldCheck,
  ClipboardList,
  CheckCircle,
  Flag,
  Home,
  Hash,
} from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import LabelValueBox from "../components/LabelValueBox";
import SectionCard from "../components/SectionCard";
import Breadcrumb from '../../../components/layout/full/shared/breadcrumb/Breadcrumb';
import { getUserProfile, updateUserProfile, uploadAvatar } from "../services/userService";
import userService from "../../../services/userService";
import { useToast } from "../../../hooks/useToast";
import { getAvatarUrl, getDefaultAvatar } from "../../../utils/avatarUtils";

const BCrumb = [
  { to: '/dashboard/profile', title: 'Account' },
  { title: 'Profile' },
];

const formatBoolean = (value) => (value ? 'Yes' : 'No');
const getDisplayValue = (value, fallback = '-') =>
  value === null || value === undefined || value === '' ? fallback : value;

// Mapping icons to each field
const fieldIcons = {
  phone: <Phone size={16} />,
  emailVerified: <Mail size={16} />,
  phoneVerified: <Phone size={16} />,
  password: <Key size={16} />,
  status: <CheckCircle size={16} />,
  currency: <Globe size={16} />,
  referralCode: <Tag size={16} />,
  referralLink: <Link size={16} />,
  referredBy: <UserCheck size={16} />,
  joinedBy: <Calendar size={16} />,
  clientId: <ClipboardList size={16} />,
  clientType: <User size={16} />,
  organizationName: <Building size={16} />,
  incorporationNumber: <Hash size={16} />,
  taxId: <Hash size={16} />,
  gstNumber: <Hash size={16} />,
  panNumber: <Hash size={16} />,
  address1: <Home size={16} />,
  address2: <Home size={16} />,
  city: <MapPin size={16} />,
  state: <Flag size={16} />,
  country: <Globe size={16} />,
  postalCode: <Hash size={16} />,
  contactPhone: <Phone size={16} />,
  contactEmail: <Mail size={16} />,
  kycStatus: <ShieldCheck size={16} />,
  kycLevel: <ShieldCheck size={16} />,
  documents: <FileText size={16} />,
  verified: <CheckCircle size={16} />,
};

const ChangePasswordModal = ({ open, onClose, onSave, saving }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData.currentPassword, formData.newPassword);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Current Password"
          type="password"
          value={formData.currentPassword}
          onChange={handleChange('currentPassword')}
          error={!!errors.currentPassword}
          helperText={errors.currentPassword}
          margin="normal"
          fullWidth
          disabled={saving}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <KeyRound size={16} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="New Password"
          type="password"
          value={formData.newPassword}
          onChange={handleChange('newPassword')}
          error={!!errors.newPassword}
          helperText={errors.newPassword}
          margin="normal"
          fullWidth
          disabled={saving}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Key size={16} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          margin="normal"
          fullWidth
          disabled={saving}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Key size={16} />
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSave} 
          disabled={saving} 
          startIcon={saving ? <CircularProgress size={16} /> : null}
        >
          {saving ? 'Changing...' : 'Change Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EditProfileModal = ({ open, onClose, onSave, data, section, saving }) => {
  const [formData, setFormData] = useState({ ...data });

  useEffect(() => {
    setFormData({ ...data });
  }, [data]);

  const handleChange = (key) => (e) => {
    setFormData({ ...formData, [key]: e.target.value });
  };

  const handleSave = () => {
    onSave(section, formData);
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit {section} Information</DialogTitle>
      <DialogContent dividers>
        {Object.keys(data).map((key, index) => (
          <Box key={key}>
            <TextField
              label={key.replace(/([A-Z])/g, " $1")}
              value={formData?.[key] ?? ''}
              onChange={handleChange(key)}
              margin="normal"
              fullWidth
              disabled={saving}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {fieldIcons[key]}
                  </InputAdornment>
                ),
              }}
            />
            {index < Object.keys(data).length - 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving} startIcon={saving ? <CircularProgress size={16} /> : null}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AdminProfile = () => {
  const [avatar, setAvatar] = useState("");
  const fileInputRef = useRef(null);
  const [editOpen, setEditOpen] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState("");
  const [sectionData, setSectionData] = useState({});
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const { showToast } = useToast();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserProfile();
      if (response.success) {
        setProfile(response.data);
        const avatarUrl = getAvatarUrl(response.data.avatar) || getDefaultAvatar();
        setAvatar(avatarUrl);
      } else {
        setProfile(null);
        setError(response.error || "Failed to load profile data.");
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setProfile(null);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setAvatarUploading(true);
    const previousAvatar = avatar;
    const previewUrl = URL.createObjectURL(file);
    setAvatar(previewUrl);
    try {
      const response = await uploadAvatar(file);
      if (response.success) {
        const newAvatarUrl = getAvatarUrl(response.data.avatarUrl || response.data.avatar);
        setAvatar(newAvatarUrl);
        showToast(response.message || 'Avatar updated successfully', 'success');
        await fetchProfile();
      } else {
        const message = response.error || 'Failed to upload avatar';
        setError(message);
        showToast(message, 'error');
        setAvatar(previousAvatar);
      }
    } catch (err) {
      console.error('Error uploading avatar:', err);
      const message = err.message || 'Failed to upload avatar';
      setError(message);
      showToast(message, 'error');
      setAvatar(previousAvatar);
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleEditClick = (section, data) => {
    if (!profile) return;
    setError(null);
    setSectionToEdit(section);
    setSectionData(data);
    setEditOpen(true);
  };

  const handleSaveEdit = async (section, updatedData) => {
    try {
      setSaving(true);
      setError(null);
      // eslint-disable-next-line no-unused-vars
      const { password, ...payload } = updatedData;
      const response = await updateUserProfile(payload);
      if (response.success) {
        setProfile((prev) => ({ ...prev, ...payload }));
        setEditOpen(false);
        showToast(response.message || 'Profile updated successfully', 'success');
      } else {
        const message = response.error || response.message || 'Failed to update profile';
        setError(message);
        showToast(message, 'error');
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      const message = err.message || 'Failed to update profile. Please try again.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusToggle = async (newStatus) => {
    try {
      setStatusUpdating(true);
      setError(null);
      const response = await updateUserProfile({ status: newStatus });
      if (response.success) {
        setProfile((prev) => ({ ...prev, status: newStatus }));
        showToast('Account status updated', 'success');
      } else {
        const message = response.error || response.message || 'Failed to update account status';
        setError(message);
        showToast(message, 'error');
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      const message = err.message || 'Failed to update account status';
      setError(message);
      showToast(message, 'error');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleChangePassword = async (currentPassword, newPassword) => {
    try {
      setChangingPassword(true);
      setError(null);
      
      const response = await userService.changePassword(currentPassword, newPassword);
      
      if (response.success) {
        showToast(response.message || 'Password changed successfully', 'success');
        setChangePasswordOpen(false);
      } else {
        setError(response.error || 'Failed to change password');
        showToast(response.error || 'Failed to change password', 'error');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      const message = err.message || 'Failed to change password';
      setError(message);
      showToast(message, 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <>
        <Breadcrumb title="Account" items={BCrumb} />
        <Box p={3}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Button variant="contained" onClick={fetchProfile}>
            Retry
          </Button>
        </Box>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title="Account" items={BCrumb} />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box>
        <SectionCard
          title="Profile Details"
          icon={<User size={18} />}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 3,
            p: 3,
            mb: 4,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Avatar sx={{ width: 80, height: 80 }} src={avatar} />

          <Box flexGrow={1}>
            <Typography variant="h6" fontWeight="bold">
              {profile.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profile.username}
            </Typography>
            <Box display="flex" gap={2} mt={1} flexWrap="wrap">
              <LabelValueBox label="Email" value={profile.email} icon={<Mail size={16} />} />
            </Box>
          </Box>

          {/* RIGHT CONTROLS: Switch + Upload */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "row", sm: "column" },
              alignItems: "center",
              justifyContent: { xs: "space-between", sm: "flex-end" },
              gap: 1,
              width: { xs: "100%", sm: "auto" },
              mt: { xs: 2, sm: 0 },
            }}
          >
            <Tooltip title="Toggle Active/Inactive">
              <Switch
                checked={profile.status === 'Active'}
                onChange={(e) => handleStatusToggle(e.target.checked ? 'Active' : 'Inactive')}
                color="success"
                disabled={statusUpdating}
              />
            </Tooltip>

            <Button
              variant="contained"
              size="small"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              sx={{
                fontWeight: 600,
                height: 32,
                fontSize: "0.8125rem",
                borderRadius: "4px",
                px: 2,
              }}
            >
              {avatarUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </Box>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleAvatarChange}
            disabled={avatarUploading}
          />
        </SectionCard>


        {/* Sections */}
        <SectionCard
          title="Basic Information"
          icon={<User size={18} />}
          onEdit={() => handleEditClick("Basic Information", {
            phone: profile.phone,
            emailVerified: profile.emailVerified,
            phoneVerified: profile.phoneVerified,
            status: profile.status,
            currency: profile.currency,
          })}
        >
          <LabelValueBox label="Mobile Phone" value={getDisplayValue(profile.phone)} icon={<Phone size={16} />} />
          <LabelValueBox label="Email Verified" value={formatBoolean(profile.emailVerified)} verified={profile.emailVerified} />
          <LabelValueBox label="Phone Verified" value={formatBoolean(profile.phoneVerified)} verified={profile.phoneVerified} />
          <LabelValueBox label="Password" value="••••••••" />
          <LabelValueBox label="Account Status" value={profile.status || 'Inactive'} verified={profile.status === 'Active'} />
          <LabelValueBox label="Currency" value={getDisplayValue(profile.currency)} />
        </SectionCard>

        <SectionCard
          title="Security & Password"
          icon={<KeyRound size={18} />}
          onEdit={() => setChangePasswordOpen(true)}
          editLabel="Change Password"
        >
          <LabelValueBox label="Password" value="••••••••" icon={<Key size={16} />} />
          <LabelValueBox label="Last Changed" value={getDisplayValue(profile.passwordChangedAt ? new Date(profile.passwordChangedAt).toLocaleDateString() : null, 'Never')} icon={<Calendar size={16} />} />
        </SectionCard>

        <SectionCard
          title="Referral & Client Information"
          icon={<KeyRound size={18} />}
          onEdit={() => handleEditClick("Referral", {
            referralCode: profile.referralCode,
            referralLink: profile.referralLink,
            referredBy: profile.referredBy,
            joinedBy: profile.joinedBy,
            clientId: profile.clientId,
            clientType: profile.clientType,
          })}
        >
          <LabelValueBox label="Referral Code" value={getDisplayValue(profile.referralCode)} />
          <LabelValueBox label="Referral Link" value={getDisplayValue(profile.referralLink)} showCopy />
          <LabelValueBox label="Referred By" value={getDisplayValue(profile.referredBy)} />
          <LabelValueBox label="Joined By" value={getDisplayValue(profile.joinedBy)} />
          <LabelValueBox label="Client ID" value={getDisplayValue(profile.clientId)} showCopy />
          <LabelValueBox label="Client Type" value={getDisplayValue(profile.clientType)} />
        </SectionCard>

        <SectionCard
          title="Organization Details"
          icon={<Building size={18} />}
          onEdit={() => handleEditClick("Organization", {
            organizationName: profile.organizationName,
            incorporationNumber: profile.incorporationNumber,
            taxId: profile.taxId,
            gstNumber: profile.gstNumber,
            panNumber: profile.panNumber,
          })}
        >
          <LabelValueBox label="Organization Name" value={getDisplayValue(profile.organizationName)} />
          <LabelValueBox label="Incorporation Number" value={getDisplayValue(profile.incorporationNumber)} />
          <LabelValueBox label="Tax ID" value={getDisplayValue(profile.taxId)} />
          <LabelValueBox label="GST Number" value={getDisplayValue(profile.gstNumber)} />
          <LabelValueBox label="PAN Number" value={getDisplayValue(profile.panNumber)} showCopy />
        </SectionCard>

        <SectionCard
          title="Address Information"
          icon={<MapPin size={18} />}
          onEdit={() => handleEditClick("Address", {
            address1: profile.address1,
            address2: profile.address2,
            city: profile.city,
            state: profile.state,
            country: profile.country,
            postalCode: profile.postalCode,
            contactPhone: profile.contactPhone,
            contactEmail: profile.contactEmail,
          })}
        >
          <LabelValueBox label="Address Line 1" value={getDisplayValue(profile.address1)} />
          <LabelValueBox label="Address Line 2" value={getDisplayValue(profile.address2)} />
          <LabelValueBox label="City" value={getDisplayValue(profile.city)} />
          <LabelValueBox label="State" value={getDisplayValue(profile.state)} />
          <LabelValueBox label="Country" value={getDisplayValue(profile.country)} />
          <LabelValueBox label="Postal Code" value={getDisplayValue(profile.postalCode)} />
          <LabelValueBox label="Contact Phone" value={getDisplayValue(profile.contactPhone)} icon={<Phone size={16} />} />
          <LabelValueBox label="Contact Email" value={getDisplayValue(profile.contactEmail)} icon={<Mail size={16} />} />
        </SectionCard>

        <SectionCard
          title="KYC & Verification"
          icon={<FileText size={18} />}
          onEdit={() => handleEditClick("KYC", {
            kycStatus: profile.kycStatus,
            kycLevel: profile.kycLevel,
            documents: profile.documents,
            verified: profile.verified,
          })}
        >
          <LabelValueBox label="KYC Status" value={getDisplayValue(profile.kycStatus)} verified={profile.kycStatus === 'Verified'} />
          <LabelValueBox label="KYC Level" value={getDisplayValue(profile.kycLevel)} />
          <LabelValueBox label="Documents" value={getDisplayValue(profile.documents)} />
          <LabelValueBox label="Verified" value={formatBoolean(profile.verified)} verified={profile.verified} />
        </SectionCard>

        <EditProfileModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSave={handleSaveEdit}
          data={sectionData}
          section={sectionToEdit}
          saving={saving}
        />
        
        <ChangePasswordModal
          open={changePasswordOpen}
          onClose={() => setChangePasswordOpen(false)}
          onSave={handleChangePassword}
          saving={changingPassword}
        />
      </Box>
    </>
  );
};

export default AdminProfile;
