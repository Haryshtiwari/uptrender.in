import React, { useState, useMemo } from 'react';
import Chart from 'react-apexcharts';
import {
  useTheme,
  CardContent,
  Typography,
  Stack,
  Tabs,
  Tab,
  Box,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import BlankCard from '../../../components/shared/BlankCard';
import Scrollbar from '../../../components/custom-scroll/Scrollbar';
import PropTypes from 'prop-types';
const generateCumulativeData = (length, volatility = 2, start = 100) => {
  const data = [start];
  for (let i = 1; i < length; i++) {
    const change = (Math.random() * volatility * 2 - volatility); // random -2% to +2%
    const prev = data[i - 1];
    const next = +(prev * (1 + change / 100)).toFixed(2);
    data.push(next);
  }
  return data;
};

const chartDataByRange = {
  '1W': {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: generateCumulativeData(7),
  },
  '1M': {
    categories: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    data: generateCumulativeData(30),
  },
  '3M': {
    categories: Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`),
    data: generateCumulativeData(12, 3),
  },
  '6M': {
    categories: Array.from({ length: 6 }, (_, i) => `Month ${i + 1}`),
    data: generateCumulativeData(6, 5),
  },
  '1Y': {
    categories: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`),
    data: generateCumulativeData(12, 6),
  },
  '5Y': {
    categories: ['2019', '2020', '2021', '2022', '2023'],
    data: generateCumulativeData(5, 10),
  },
  'Inception': {
    categories: Array.from({ length: 60 }, (_, i) => `T${i + 1}`),
    data: generateCumulativeData(60, 4),
  },
};



const Followers = ({ segmentStats = [], recentStrategies = [], selectedStrategy = null }) => {
  const theme = useTheme();


  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('1W');

  const backendChartData = useMemo(() => {
    if (!segmentStats?.length) return null;
    return {
      categories: segmentStats.map((item) => item.segment || 'Uncategorized'),
      data: segmentStats.map((item) => Number(item?.dataValues?.count ?? item?.count ?? 0)),
    };
  }, [segmentStats]);

  const selectedChartData = backendChartData || chartDataByRange[timeRange];
const yValues = selectedChartData.data;
const yMin = Math.min(...yValues);
const yMax = Math.max(...yValues);
const yAbsMax = Math.max(Math.abs(yMin), Math.abs(yMax));

const options = useMemo(() => {
  const isDarkMode = theme.palette.mode === 'dark';
  const labelColor = isDarkMode ? '#FFFFFF' : '#2E2E2E'; // force white or dark gray

  return {
    chart: {
      type: 'area',
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: ['#00C853'],
    },
    fill: {
      type: 'gradient',
      gradient: {
        type: 'vertical',
        shade: 'light',
        gradientToColors: ['#00C853'],
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    dataLabels: { enabled: false },
    markers: {
      size: 0,
      hover: { size: 5 },
    },
    grid: {
      borderColor: isDarkMode ? '#444' : '#e0e0e0',
      strokeDashArray: 4,
    },
    tooltip: {
      theme: isDarkMode ? 'dark' : 'light',
      y: {
        formatter: (value) =>
          backendChartData
            ? `${value} strategies`
            : `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`,
      },
    },
    xaxis: {
      categories: selectedChartData.categories,
      labels: {
        style: {
          colors: Array(selectedChartData.categories.length).fill(labelColor),
          fontSize: '12px',
        },
      },
    },
    yaxis: backendChartData
      ? {
          min: 0,
          labels: {
            formatter: (val) => `${val}`,
            style: {
              colors: [labelColor],
              fontSize: '12px',
            },
          },
        }
      : {
          min: -yAbsMax,
          max: yAbsMax,
          labels: {
            formatter: (val) => `${val >= 0 ? '+' : ''}${val}%`,
            style: {
              colors: [labelColor],
              fontSize: '12px',
            },
          },
        },
  };
}, [theme.palette.mode, selectedChartData, yAbsMax, backendChartData]);


const series = [
  {
    name: backendChartData ? 'Strategies' : 'Net Value',
    data: selectedChartData.data,
  },
];

const strategyDetails = useMemo(() => ({
  name: selectedStrategy?.name || 'Momentum Surge A',
  createdBy: selectedStrategy?.user?.name || selectedStrategy?.createdBy || 'Unknown',
  createdOn: selectedStrategy?.createdAt
    ? new Date(selectedStrategy.createdAt).toLocaleDateString()
    : 'N/A',
  lastUpdated: selectedStrategy?.updatedAt
    ? new Date(selectedStrategy.updatedAt).toLocaleDateString()
    : 'N/A',
  type: selectedStrategy?.type || (selectedStrategy?.isPublic ? 'Public' : 'Private'),
  segment: selectedStrategy?.segment || selectedStrategy?.category || 'General',
  riskLevel: selectedStrategy?.riskLevel || 'Moderate',
  marketFocus: selectedStrategy?.marketFocus || 'Multi-asset',
  timeframe: selectedStrategy?.timeframe || '15m - 1h',
  description:
    selectedStrategy?.description ||
    'This strategy description will appear once provided by the strategy owner.',
}), [selectedStrategy]);

const performanceMetrics = useMemo(() => {
  if (!recentStrategies?.length) return [];
  const total = recentStrategies.length;
  const active = recentStrategies.filter((item) => item.isActive).length;
  const running = recentStrategies.filter((item) => item.isRunning).length;
  const isPublic = recentStrategies.filter((item) => item.isPublic).length;
  const formatPercent = (value) => (total ? `${((value / total) * 100).toFixed(1)}%` : '0%');

  return [
    ['Total strategies', [`${total}`, formatPercent(total)], ['Active', formatPercent(active)], ['Inactive', formatPercent(total - active)]],
    ['Running strategies', [`${running}`, formatPercent(running)], ['Stopped', formatPercent(total - running)], ['Public', formatPercent(isPublic)]],
  ];
}, [recentStrategies]);

const tradeRows = useMemo(() => {
  if (!recentStrategies?.length) return [];
  return recentStrategies.map((strategy, index) => ({
    id: strategy.id || index,
    name: strategy.name || `Strategy ${index + 1}`,
    owner: strategy.user?.name || strategy.createdBy || 'Unknown',
    status: strategy.isActive ? 'Active' : 'Inactive',
    visibility: strategy.isPublic ? 'Public' : 'Private',
    createdAt: strategy.createdAt
      ? new Date(strategy.createdAt).toLocaleDateString()
      : 'N/A',
  }));
}, [recentStrategies]);


  return (
    <BlankCard sx={{ p: 0, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <CardContent sx={{ px: 2, pt: 2, pb: 1 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ minHeight: '40px' }}
        >
          <Tab label="Chart" />
          <Tab label="Information" />
          <Tab label="Performance" />
          <Tab label="Trade Analysis" />
        </Tabs>

        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" mt={2}>
          <Typography variant="h6" color="textSecondary">
            {activeTab === 0
              ? 'Growth History'
              : activeTab === 1
              ? 'Strategy Info'
              : activeTab === 2
              ? 'Performance'
              : 'Summary'}
          </Typography>

          {activeTab === 0 && (
            <Stack direction="row" spacing={2} alignItems="center">
              {!backendChartData && (
                <FormControl size="small">
                  <Select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                  >
                    <MenuItem value="1W">1 Week</MenuItem>
                    <MenuItem value="1M">1 Month</MenuItem>
                    <MenuItem value="3M">3 Months</MenuItem>
                    <MenuItem value="6M">6 Months</MenuItem>
                    <MenuItem value="1Y">1 Year</MenuItem>
                    <MenuItem value="5Y">5 Years</MenuItem>
                    <MenuItem value="Inception">Inception</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Stack>
          )}
        </Stack>
      </CardContent>

      <Box sx={{ px: 3, pb: 3 }}>
          {activeTab === 0 && (
      <Chart options={options} series={series} type="area" height={350} width="100%" />

        )}

{activeTab === 1 && (
  <Box sx={{ overflowX: 'auto' }}>
    <Scrollbar sx={{ maxHeight: 380 }}>
      <Table size="small" sx={{ minWidth: 500 }}>
        <TableBody>
          {[
            ['Strategy Name', strategyDetails.name],
            ['Created By', strategyDetails.createdBy],
            ['Created On', strategyDetails.createdOn],
            ['Last Updated', strategyDetails.lastUpdated],
            ['Type', strategyDetails.type],
            ['Risk Level', strategyDetails.riskLevel],
            ['Market Focus', strategyDetails.marketFocus],
            ['Timeframe', strategyDetails.timeframe],
            ['Segment', strategyDetails.segment],
            [
              'Description',
              strategyDetails.description,
            ],
          ].map(([label, value], idx) => (
            <TableRow key={idx}>
              <TableCell sx={{ fontWeight: 600, width: 220, verticalAlign: 'top' }}>
                {label}
              </TableCell>
              <TableCell>
                <Typography variant="body2" whiteSpace="pre-line">
                  {value}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Scrollbar>
  </Box>
)}


{activeTab === 2 && (
  <Box sx={{ overflowX: 'auto' }}>
    <Scrollbar sx={{ maxHeight: 380 }}>
      <Table size="small" sx={{ minWidth: 400 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Metric</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Primary</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Secondary</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(performanceMetrics.length ? performanceMetrics : [
            ['Total strategies', ['-', '-'], ['-', '-'], ['-', '-']],
          ]).map(([metric, primary, secondary, tertiary], idx) => (
            <TableRow key={metric + idx}>
              <TableCell>{metric}</TableCell>
              {[primary, secondary, tertiary].map((val, i) => (
                <TableCell key={i}>
                  <Stack spacing={0.5}>
                    {val.map((item, j) => (
                      <Typography
                        key={j}
                        variant="body2"
                        color={item.includes('%') ? (item.includes('-') ? 'error.main' : 'success.main') : 'text.primary'}
                      >
                        {item}
                      </Typography>
                    ))}
                  </Stack>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Scrollbar>
  </Box>
)}

{activeTab === 3 && (
  <Box sx={{ overflowX: 'auto' }}>
    <Scrollbar sx={{ maxHeight: 380 }}>
      <Table size="small" sx={{ minWidth: 600 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Owner</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Visibility</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Created On</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(tradeRows.length ? tradeRows : [
            { id: 0, name: 'No strategies found', owner: '-', status: '-', visibility: '-', createdAt: '-' },
          ]).map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.owner}</TableCell>
              <TableCell>
                <Typography color={row.status === 'Active' ? 'success.main' : 'error.main'}>
                  {row.status}
                </Typography>
              </TableCell>
              <TableCell>{row.visibility}</TableCell>
              <TableCell>{row.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Scrollbar>
  </Box>
)}


      </Box>
    </BlankCard>
  );
};

export default Followers;

Followers.propTypes = {
  segmentStats: PropTypes.arrayOf(
    PropTypes.shape({
      segment: PropTypes.string,
      count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      dataValues: PropTypes.shape({
        count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    })
  ),
  recentStrategies: PropTypes.arrayOf(PropTypes.object),
  selectedStrategy: PropTypes.object,
};
