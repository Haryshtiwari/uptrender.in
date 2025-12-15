import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../components/common/DashboardCard';
import CustomSelect from '../../../components/forms/theme-elements/CustomSelect';
import Loader from '../../../components/common/Loader';
import {
  MenuItem,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  TableContainer,
  Stack,
} from '@mui/material';

import { strategyService } from '../../../services/strategyService';

// Strategy-focused replacement for ProductPerformances
const ProductPerformances = () => {
  const [month, setMonth] = useState('1');
  const [strategies, setStrategies] = useState([]);

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;

  const handleChange = (event) => setMonth(event.target.value);

  // Fetch top strategies (by performance) from backend
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await strategyService.getStrategies({ limit: 5, sort: '-performance' });
        if (res.success && mounted) {
          setStrategies(res.data || []);
        } else if (mounted) {
          setStrategies([]);
        }
      } catch (err) {
        console.error('Failed to load strategies for dashboard', err);
        if (mounted) setStrategies([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Helper to create a simple sparkline series from a single performance value
  const sparkSeriesFromPerf = (perf) => {
    // create five points around perf for a small sparkline
    const base = Number(perf) || 0;
    return [
      Math.max(0, base - 2),
      Math.max(0, base - 1),
      base,
      Math.max(0, base + 1),
      Math.max(0, base - 0.5),
    ];
  };

  const sparkOptions = (color) => ({
    chart: { type: 'area', sparkline: { enabled: true }, toolbar: { show: false } },
    stroke: { curve: 'smooth', width: 2 },
    fill: { opacity: 0.08, colors: [color] },
    markers: { size: 0 },
    tooltip: { enabled: false },
  });

  // Do not use demo data here. If backend returns no strategies, show a No Data state.

  return (
    <DashboardCard
      title="Strategy Performance"
      action={
        <CustomSelect labelId="month-dd" id="month-dd" size="small" value={month} onChange={handleChange}>
          <MenuItem value={1}>Jan 2025</MenuItem>
          <MenuItem value={2}>Dec 2025</MenuItem>
          <MenuItem value={3}>Nov 2025</MenuItem>
        </CustomSelect>
      }
    >
      <TableContainer>
        <Table aria-label="strategies table" sx={{ whiteSpace: 'nowrap' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 0 }}>
                <Typography variant="subtitle2" fontWeight={600}>Strategy</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>Performance</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>Status</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>Capital</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>Trend</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ pl: 0 }}>
                  <Loader message="Loading strategies..." />
                </TableCell>
              </TableRow>
            ) : strategies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ pl: 0 }}>
                  <Typography color="textSecondary">No strategies available.</Typography>
                </TableCell>
              </TableRow>
            ) : strategies.map((s) => (
              <TableRow key={s.id || s.name}>
                <TableCell sx={{ pl: 0 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: primarylight, width: 48, height: 48 }}>{(s.name || '').charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>{s.name}</Typography>
                      <Typography color="textSecondary" fontSize="12px" variant="subtitle2">{s.segment || '—'}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>{(Number(s.performance) || 0).toFixed(1)}%</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    sx={{ borderRadius: '6px', width: 80 }}
                    size="small"
                    label={s.isActive ? 'Active' : 'Inactive'}
                    color={s.isActive ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">{s.capital ? `₹${Number(s.capital).toLocaleString()}` : '—'}</Typography>
                </TableCell>
                <TableCell>
                  <Chart options={sparkOptions(primary)} series={[{ data: sparkSeriesFromPerf(s.performance) }]} type="area" height="35px" width="100px" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

export default ProductPerformances;
