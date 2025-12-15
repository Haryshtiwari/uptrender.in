import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Pagination,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import Loader from '../../../components/common/Loader';
import { strategyService } from '../../../services/strategyService';
import { useNavigate } from 'react-router-dom';

export default function StrategyView() {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const itemsPerPage = 6;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await strategyService.getStrategies({ limit: 100, sort: '-createdAt' });
        if (res.success && mounted) setStrategies(res.data || []);
      } catch (err) {
        console.error('Failed to load strategies', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const totalPages = Math.max(1, Math.ceil(strategies.length / itemsPerPage));
  const paginated = strategies.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage);

  const showSnack = (message) => setSnack({ open: true, message });

  const handleView = async (id) => {
    // show local data immediately if available, then refresh from API
    const local = strategies.find((s) => s.id === id || s._id === id);
    if (local) {
      setSelectedStrategy(local);
      setDetailsOpen(true);
    }
    try {
      const res = await strategyService.getStrategyById(id);
      if (res.success) {
        setSelectedStrategy(res.data);
        setDetailsOpen(true);
      } else if (!local) {
        showSnack('Failed to load strategy');
      }
    } catch (err) {
      console.error(err);
      if (!local) showSnack('Error loading strategy');
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Are you sure you want to delete this strategy?');
    if (!ok) return;
    try {
      const res = await strategyService.deleteStrategy(id);
      if (res.success) {
        setStrategies((prev) => prev.filter((p) => p.id !== id && p._id !== id));
        showSnack('Strategy deleted');
      } else {
        showSnack(res.message || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      showSnack('Error deleting strategy');
    }
  };

  const handleToggleRunning = async (s) => {
    try {
      let res;
      if (s.isRunning) {
        res = await strategyService.stopStrategy(s.id || s._id);
      } else {
        res = await strategyService.startStrategy(s.id || s._id);
      }
      if (res.success) {
        setStrategies((prev) => prev.map((it) => ((it.id || it._id) === (s.id || s._id) ? { ...it, isRunning: !s.isRunning } : it)));
        showSnack(s.isRunning ? 'Strategy stopped' : 'Strategy started');
      } else showSnack(res.message || 'Failed to change running state');
    } catch (err) {
      console.error(err);
      showSnack('Error toggling running state');
    }
  };

  const handleTogglePublic = async (s) => {
    try {
      let res;
      if (s.isPublic) {
        res = await strategyService.deactivateStrategy(s.id || s._id);
      } else {
        res = await strategyService.activateStrategy(s.id || s._id);
      }
      if (res.success) {
        setStrategies((prev) => prev.map((it) => ((it.id || it._id) === (s.id || s._id) ? { ...it, isPublic: !s.isPublic } : it)));
        showSnack(s.isPublic ? 'Strategy set to Private' : 'Strategy published');
      } else showSnack(res.message || 'Failed to change visibility');
    } catch (err) {
      console.error(err);
      showSnack('Error toggling visibility');
    }
  };

  // Use the user create route so router resolves the CreateStrategy page correctly
  const handleCreate = () => {
    navigate('/user/create');
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Strategies</Typography>
        <Button variant="contained" size="small" onClick={handleCreate}>New Strategy</Button>
      </Box>

      {loading ? (
        <Loader message="Loading strategies..." />
      ) : paginated.length === 0 ? (
        <Typography color="text.secondary">No strategies found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {paginated.map((s) => (
            <Grid item xs={12} sm={6} md={4} key={s.id || s.name}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#f3f4f6' }}>{(s.name || '').charAt(0)}</Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>{s.name}</Typography>
                      <Typography variant='caption' color='text.secondary'>{s.segment || '—'}</Typography>
                    </Box>
                    <Chip label={s.isActive ? 'Active' : 'Inactive'} size='small' color={s.isActive ? 'success' : 'default'} />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
                    <Box>
                      <Typography variant='h6' sx={{ fontWeight: 700 }}>{s.performance ?? 0}%</Typography>
                      <Typography variant='caption' color='text.secondary'>Performance</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      {s.performance >= 0 ? <TrendingUp sx={{ color: 'success.main' }} /> : <TrendingDown sx={{ color: 'error.main' }} />}
                      <Typography variant='body2'>₹{Number(s.capital || 0).toLocaleString()}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'flex-end' }}>
                    <IconButton size='small' title='View' onClick={() => handleView(s.id || s._id)}>
                      <VisibilityIcon fontSize='small' />
                    </IconButton>
                    <IconButton size='small' title={s.isRunning ? 'Pause' : 'Start'} onClick={() => handleToggleRunning(s)}>
                      {s.isRunning ? <PauseIcon fontSize='small' /> : <PlayArrowIcon fontSize='small' />}
                    </IconButton>
                    <IconButton size='small' title={s.isPublic ? 'Make Private' : 'Make Public'} onClick={() => handleTogglePublic(s)}>
                      {s.isPublic ? <PublicIcon fontSize='small' /> : <LockIcon fontSize='small' />}
                    </IconButton>
                    <IconButton size='small' title='Delete' onClick={() => handleDelete(s.id || s._id)}>
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination count={totalPages} page={page + 1} onChange={(e, v) => setPage(v - 1)} />
      </Box>

      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Strategy details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedStrategy ? (
              <Box>
                <Typography variant='h6'>{selectedStrategy.name}</Typography>
                <Typography variant='body2' color='text.secondary'>{selectedStrategy.description}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant='body2'>Performance: {selectedStrategy.performance ?? 0}%</Typography>
                  <Typography variant='body2'>Capital: ₹{Number(selectedStrategy.capital || 0).toLocaleString()}</Typography>
                </Box>
              </Box>
            ) : 'Loading...'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack((s) => ({ ...s, open: false }))} message={snack.message} />
    </Box>
  );
}
