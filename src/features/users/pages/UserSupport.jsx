import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  Avatar,
  Tooltip,
  IconButton,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';
import Breadcrumb from '../../../components/layout/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../components/common/PageContainer';
import supportService from '../../../services/supportService';
import { useToast } from '../../../hooks/useToast';

const BCrumb = [
  { to: '/user', title: 'User' },
  { title: 'Support' },
];

const UserSupport = () => {
  const theme = useTheme();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium',
    category: 'general',
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const result = await supportService.getTickets();
      if (result.success) {
        setTickets(result.data || []);
        setError('');
      } else {
        setError(result.error || 'Failed to fetch tickets');
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTickets();
    setRefreshing(false);
    showToast('Tickets refreshed', 'success');
  };

  const handleCreateTicket = async () => {
    try {
      if (!formData.subject.trim() || !formData.message.trim()) {
        showToast('Please fill in all required fields', 'error');
        return;
      }

      // Client-side validation
      if (formData.subject.trim().length < 5) {
        showToast('Subject must be at least 5 characters', 'error');
        return;
      }

      if (formData.message.trim().length < 10) {
        showToast('Message must be at least 10 characters', 'error');
        return;
      }

      // Map category values to backend expected format (matches database enum)
      const categoryMap = {
        'general': 'General',
        'technical': 'Technical',
        'billing': 'Billing',
        'account': 'General',
        'trading': 'Technical',
        'api': 'Technical',
        'feature': 'Feature Request'
      };

      // Map form fields to backend API fields
      const ticketData = {
        subject: formData.subject,
        description: formData.message, // Backend expects 'description'
        priority: formData.priority, // lowercase: low, medium, high, urgent
        category: categoryMap[formData.category] || 'General',
      };

      const result = await supportService.createTicket(ticketData);
      if (result.success) {
        showToast(result.message || 'Ticket created successfully', 'success');
        setCreateDialogOpen(false);
        setFormData({
          subject: '',
          message: '',
          priority: 'medium',
          category: 'general',
        });
        fetchTickets();
      } else {
        // Handle validation errors from backend
        if (result.details && result.details.length > 0) {
          const errorMsg = result.details.map(d => d.message).join(', ');
          showToast(errorMsg, 'error');
        } else {
          showToast(result.error || 'Failed to create ticket', 'error');
        }
      }
    } catch (err) {
      console.error('Error creating ticket:', err);
      showToast('Failed to create ticket', 'error');
    }
  };

  const handleViewTicket = async (ticket) => {
    try {
      // Fetch full ticket details with messages
      const result = await supportService.getTicketById(ticket.id);
      if (result.success) {
        setSelectedTicket(result.data);
      } else {
        setSelectedTicket(ticket);
      }
    } catch (err) {
      setSelectedTicket(ticket);
    }
    setReplyMessage('');
    setViewDialogOpen(true);
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      showToast('Please enter a message', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const result = await supportService.replyToTicket(selectedTicket.id, replyMessage);
      if (result.success) {
        showToast('Reply sent successfully', 'success');
        setReplyMessage('');
        // Refresh ticket details
        const ticketResult = await supportService.getTicketById(selectedTicket.id);
        if (ticketResult.success) {
          setSelectedTicket(ticketResult.data);
        }
        fetchTickets();
      } else {
        showToast(result.error || 'Failed to send reply', 'error');
      }
    } catch (err) {
      console.error('Error sending reply:', err);
      showToast('Failed to send reply', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseTicket = async () => {
    setSubmitting(true);
    try {
      const result = await supportService.closeTicket(selectedTicket.id);
      if (result.success) {
        showToast('Ticket closed successfully', 'success');
        setViewDialogOpen(false);
        fetchTickets();
      } else {
        showToast(result.error || 'Failed to close ticket', 'error');
      }
    } catch (err) {
      console.error('Error closing ticket:', err);
      showToast('Failed to close ticket', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'primary';
      case 'in-progress':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      case 'urgent':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <PageContainer title="Support" description="Manage your support tickets">
        <Breadcrumb title="Support" items={BCrumb} />
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Support" description="Manage your support tickets">
      <Breadcrumb title="Support" items={BCrumb} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Header Section */}
      <Card sx={{ 
        mb: 3, 
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2
      }}>
        <CardContent sx={{ p: 3 }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Support Center
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Create and manage your support tickets
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{ borderRadius: 2 }}
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
                sx={{ borderRadius: 2 }}
              >
                New Ticket
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Statistics Cards - new design */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 3 }}>
        {[
          {
            title: 'Total Tickets',
            count: tickets.length,
            icon: <AssignmentIcon fontSize="small" />,
            color: 'primary',
          },
          {
            title: 'Open Tickets',
            count: tickets.filter(t => t.status === 'open').length,
            icon: <WarningIcon fontSize="small" />,
            color: 'error',
          },
          {
            title: 'In Progress',
            count: tickets.filter(t => t.status === 'in-progress').length,
            icon: <ScheduleIcon fontSize="small" />,
            color: 'warning',
          },
          {
            title: 'Resolved',
            count: tickets.filter(t => t.status === 'resolved').length,
            icon: <CheckCircleIcon fontSize="small" />,
            color: 'success',
          },
        ].map((card, idx) => {
          const iconColor = theme.palette[card.color]?.main || theme.palette.primary.main;
          const gradientBg = `linear-gradient(135deg, ${iconColor}33, ${iconColor}22)`;
          return (
            <Grid item xs={12} sm={6} md={6} lg={3} key={idx}>
              <Card
                elevation={3}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: 4,
                  background: gradientBg,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 8px 20px ${iconColor}44`,
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: iconColor,
                    color: theme.palette.common.white,
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    mr: { xs: 1.5, sm: 2 },
                    boxShadow: `0 2px 6px ${iconColor}88`,
                  }}
                >
                  {card.icon}
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    {card.title}
                  </Typography>
                  <Typography color="text.primary" fontWeight={700} sx={{ fontSize: { xs: 20, sm: 24 } }}>
                    {card.count}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Tickets Table */}
      <Card sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            My Support Tickets
          </Typography>
          
          {tickets.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                bgcolor: 'primary.light', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <EmailIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No support tickets found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Create your first ticket to get started.
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
                sx={{ borderRadius: 2 }}
              >
                Create Ticket
              </Button>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'background.default' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Ticket ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id} hover sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          #{ticket.ticketNumber || ticket.id}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 250 }}>
                        <Typography variant="body2" fontWeight="medium" noWrap>
                          {ticket.subject}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" noWrap sx={{ display: 'block' }}>
                          {(ticket.description || ticket.message)?.substring(0, 40)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.category || 'General'}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 1 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.priority || 'Medium'}
                          size="small"
                          color={getPriorityColor(ticket.priority)}
                          sx={{ borderRadius: 1 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.status || 'Open'}
                          size="small"
                          color={getStatusColor(ticket.status)}
                          sx={{ borderRadius: 1 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="textSecondary">
                          {ticket.createdAt 
                            ? formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })
                            : 'Unknown'
                          }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton
                            onClick={() => handleViewTicket(ticket)}
                            size="small"
                            color="primary"
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Create Ticket Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: 2, 
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AddIcon sx={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600}>Create New Support Ticket</Typography>
              <Typography variant="caption" color="text.secondary">
                Fill in the details below to submit your ticket
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject *"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category"
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="general">General Inquiry</MenuItem>
                    <MenuItem value="technical">Technical Issue</MenuItem>
                    <MenuItem value="billing">Billing & Payments</MenuItem>
                    <MenuItem value="account">Account Issues</MenuItem>
                    <MenuItem value="trading">Trading Support</MenuItem>
                    <MenuItem value="api">API Support</MenuItem>
                    <MenuItem value="feature">Feature Request</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    label="Priority"
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Message *"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your issue in detail..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setCreateDialogOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateTicket}
            startIcon={<SendIcon />}
            sx={{ borderRadius: 2 }}
          >
            Create Ticket
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Ticket Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: 2, 
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <EmailIcon sx={{ color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Ticket #{selectedTicket?.ticketNumber || selectedTicket?.id}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 400 }}>
                  {selectedTicket?.subject}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={selectedTicket?.status || 'Open'}
              size="small"
              color={getStatusColor(selectedTicket?.status)}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                {/* Info Row */}
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="textSecondary" display="block">Category</Typography>
                    <Typography variant="body2" fontWeight={500}>{selectedTicket.category || 'General'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="textSecondary" display="block">Priority</Typography>
                    <Chip label={selectedTicket.priority || 'Medium'} size="small" color={getPriorityColor(selectedTicket.priority)} sx={{ borderRadius: 1 }} />
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="textSecondary" display="block">Created</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedTicket.createdAt ? formatDistanceToNow(new Date(selectedTicket.createdAt), { addSuffix: true }) : 'Unknown'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="textSecondary" display="block">Last Updated</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedTicket.updatedAt ? formatDistanceToNow(new Date(selectedTicket.updatedAt), { addSuffix: true }) : 'Unknown'}
                    </Typography>
                  </Box>
                </Grid>

                {/* Original Description */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>Original Message</Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {selectedTicket.description || selectedTicket.message}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Message Thread */}
                {selectedTicket.messages && selectedTicket.messages.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>Conversation</Typography>
                    <Box sx={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {selectedTicket.messages.map((msg, index) => (
                        <Paper 
                          key={msg.id || index} 
                          sx={{ 
                            p: 2, 
                            bgcolor: msg.author?.role === 'admin' ? 'primary.dark' : 'background.default',
                            border: '1px solid',
                            borderColor: msg.author?.role === 'admin' ? 'primary.main' : 'divider',
                            ml: msg.author?.role === 'admin' ? 4 : 0,
                            mr: msg.author?.role === 'admin' ? 0 : 4,
                            borderRadius: 2
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" fontWeight={600} color={msg.author?.role === 'admin' ? 'primary.light' : 'text.primary'}>
                              {msg.author?.role === 'admin' ? '🛡️ Support Team' : '👤 You'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(msg.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.message}</Typography>
                        </Paper>
                      ))}
                    </Box>
                  </Grid>
                )}

                {/* Reply Box - only if ticket is not closed */}
                {selectedTicket.status?.toLowerCase() !== 'closed' && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>Add Reply</Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Type your message..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          {selectedTicket?.status?.toLowerCase() !== 'closed' && (
            <Button 
              onClick={handleCloseTicket}
              color="error"
              variant="outlined"
              disabled={submitting}
              sx={{ borderRadius: 2, mr: 'auto' }}
            >
              Close Ticket
            </Button>
          )}
          <Button 
            onClick={() => setViewDialogOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          {selectedTicket?.status?.toLowerCase() !== 'closed' && (
            <Button
              variant="contained"
              onClick={handleSendReply}
              startIcon={<SendIcon />}
              disabled={submitting || !replyMessage.trim()}
              sx={{ borderRadius: 2 }}
            >
              {submitting ? 'Sending...' : 'Send Reply'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setCreateDialogOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' }
        }}
      >
        <AddIcon />
      </Fab>
    </PageContainer>
  );
};

export default UserSupport;