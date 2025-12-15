"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import {
  Search,
  FilterList,
  Visibility,
  Edit,
  Reply,
  Close,
  CheckCircle,
  Schedule,
  Warning,
  Person,
  Email,
  Phone,
  Business,
  Assignment,
  Support,
} from "@mui/icons-material"
import Breadcrumb from "../../../components/layout/full/shared/breadcrumb/Breadcrumb"
import TicketStatsCards from "../components/TicketStatsCards"
import adminSupportService from '../../../services/adminSupportService';
import { useToast } from '../../../hooks/useToast';




const AdminContactSupport = () => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDialog, setOpenDialog] = useState(false)
  const [replyMessage, setReplyMessage] = useState("")
  const [supportTickets, setSupportTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminSupportService.getAllTickets();
      if (result.success) {
        const tickets = result.data?.data?.tickets || result.data?.tickets || result.data || [];
        // Transform backend data to match frontend format
        const transformedTickets = tickets.map(ticket => ({
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          subject: ticket.subject,
          customer: ticket.user?.username || ticket.user?.name || 'Unknown',
          email: ticket.user?.email || '',
          phone: ticket.user?.phone || 'N/A',
          company: 'N/A',
          status: ticket.status?.toLowerCase() || 'open',
          priority: ticket.priority?.toLowerCase() || 'medium',
          category: ticket.category || 'General',
          assignedTo: ticket.assignedUser?.username || 'Unassigned',
          createdAt: ticket.createdAt,
          lastUpdated: ticket.updatedAt,
          description: ticket.description,
          messages: ticket.messages || [],
          userId: ticket.userId
        }));
        setSupportTickets(transformedTickets);
      } else {
        showToast(result.message || 'Failed to fetch tickets', 'error');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      showToast('Error loading support tickets', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Fetch tickets on mount
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleUpdateStatus = async (ticketId, newStatus) => {
    setSubmitting(true);
    try {
      const result = await adminSupportService.updateTicket(ticketId, { status: newStatus });
      if (result.success) {
        showToast('Ticket status updated successfully', 'success');
        fetchTickets();
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus.toLowerCase() });
        }
      } else {
        showToast(result.message || 'Failed to update status', 'error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Error updating ticket status', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusChip = (status) => {
  const statusConfig = {
    open: { color: "error", icon: <Warning fontSize="small" /> },
    "in-progress": { color: "warning", icon: <Schedule fontSize="small" /> },
    resolved: { color: "success", icon: <CheckCircle fontSize="small" /> },
    closed: { color: "default", icon: <Close fontSize="small" /> },
  };

  const config = statusConfig[status];
  return (
    <Chip
      label={status.replace("-", " ").toUpperCase()}
      color={config.color}
      icon={config.icon}
      size="small"
    />
  );
};

 const getPriorityChip = (priority) => {
  const priorityColors = {
    urgent: "error",
    high: "warning",
    medium: "info",
    low: "success",
  };

  return (
    <Chip
      label={priority.toUpperCase()}
      color={priorityColors[priority]}
      size="small"
      variant="outlined"
    />
  );
};

  const filteredTickets = supportTickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = {
    total: supportTickets.length,
    open: supportTickets.filter((t) => t.status === "open").length,
    inProgress: supportTickets.filter((t) => t.status === "in-progress").length,
    resolved: supportTickets.filter((t) => t.status === "resolved").length,
  }

 const handleViewTicket = (ticket) => {
  setSelectedTicket(ticket);
  setOpenDialog(true);
};

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      showToast('Please enter a message', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const result = await adminSupportService.replyToTicket(selectedTicket.id, replyMessage);
      if (result.success) {
        showToast('Reply sent successfully', 'success');
        setReplyMessage("");
        // Refresh the ticket to show new message
        const ticketResult = await adminSupportService.getTicketById(selectedTicket.id);
        if (ticketResult.success) {
          const ticket = ticketResult.data?.data || ticketResult.data;
          setSelectedTicket({
            ...selectedTicket,
            messages: ticket.messages || [],
            status: ticket.status?.toLowerCase() || selectedTicket.status
          });
        }
        fetchTickets();
      } else {
        showToast(result.message || 'Failed to send reply', 'error');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      showToast('Error sending reply', 'error');
    } finally {
      setSubmitting(false);
    }
  }

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
     <Breadcrumb title=" Contact Support " />

        {/* Stats Cards */}
<TicketStatsCards stats={stats} />


        {/* Main Content */}
        <Card>
          <CardHeader
            title="Support Tickets"
            subheader="View and manage all customer support requests"
          />
          <CardContent>
            {/* Filters */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select value={priorityFilter} label="Priority" onChange={(e) => setPriorityFilter(e.target.value)}>
                    <MenuItem value="all">All Priority</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
               {(searchTerm || statusFilter !== "all" || priorityFilter !== "all") && (
                <Grid item xs={12} md={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    color="secondary"
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("all")
                      setPriorityFilter("all")
                    }}
                    sx={{
                      "&:hover": {
                        bgcolor: "secondary.light",
                        color: "secondary.contrastText",
                      },
                    }}
                  >
                    Reset Filters
                  </Button>
                </Grid>
              )}
            </Grid>
            

            {/* Tickets Table */}
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" py={8}>
                <CircularProgress />
              </Box>
            ) : supportTickets.length === 0 ? (
              <Alert severity="info" sx={{ m: 3 }}>
                No support tickets found. Create your first ticket to get help!
              </Alert>
            ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ticket ID</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {ticket.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{ticket.subject}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {ticket.customer}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {ticket.company}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{getStatusChip(ticket.status)}</TableCell>
                      <TableCell>{getPriorityChip(ticket.priority)}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{ticket.assignedTo}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{new Date(ticket.createdAt).toLocaleDateString()}</Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleViewTicket(ticket)}>
                          <Visibility />
                        </IconButton>
                        {/* <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small">
                          <Reply />
                        </IconButton> */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Ticket Detail Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h6">Ticket #{selectedTicket?.ticketNumber || selectedTicket?.id}</Typography>
                <Typography variant="body2" color="text.secondary">{selectedTicket?.subject}</Typography>
              </Box>
              <IconButton onClick={() => setOpenDialog(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedTicket && (
              <Grid container spacing={3}>
                {/* Ticket Info Row */}
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={selectedTicket.status}
                        onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                        disabled={submitting}
                      >
                        <MenuItem value="open">Open</MenuItem>
                        <MenuItem value="in-progress">In Progress</MenuItem>
                        <MenuItem value="resolved">Resolved</MenuItem>
                        <MenuItem value="closed">Closed</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">Priority</Typography>
                  <Box sx={{ mt: 0.5 }}>{getPriorityChip(selectedTicket.priority)}</Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">Category</Typography>
                  <Typography variant="body2" fontWeight={500}>{selectedTicket.category}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">Created</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {new Date(selectedTicket.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>

                {/* Customer Info */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: "background.default", border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" gutterBottom>Customer Information</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Person sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2">{selectedTicket.customer}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Email sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2">{selectedTicket.email}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Phone sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2">{selectedTicket.phone}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Original Description */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Original Message</Typography>
                  <Paper sx={{ p: 2, bgcolor: "background.default", border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{selectedTicket.description}</Typography>
                  </Paper>
                </Grid>

                {/* Message Thread */}
                {selectedTicket.messages && selectedTicket.messages.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Conversation History</Typography>
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
                            mr: msg.author?.role === 'admin' ? 0 : 4
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" fontWeight={600}>
                              {msg.author?.role === 'admin' ? '🛡️ Admin' : '👤 User'}: {msg.author?.username || 'Unknown'}
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

                {/* Reply Box */}
                {selectedTicket.status !== 'closed' && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Send Reply</Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Type your response to the customer..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    />
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
            {selectedTicket?.status !== 'closed' && (
              <Button variant="contained" onClick={handleSendReply} startIcon={<Reply />} disabled={submitting || !replyMessage.trim()}>
                {submitting ? 'Sending...' : 'Send Reply'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default AdminContactSupport
