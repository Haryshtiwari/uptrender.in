import * as React from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Tooltip, Typography, TextField,
  MenuItem, Pagination, Select, Drawer, Divider, Checkbox,
  useMediaQuery, Switch, Button, useTheme, Avatar,
  InputAdornment
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { TableSortLabel } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FilterListIcon from '@mui/icons-material/FilterList';
import PageContainer from '../../../components/common/PageContainer';
import { Search } from '@mui/icons-material';
import Scrollbar from '../../../components/custom-scroll/Scrollbar';
import AddApiDialog from './AddApiDialog';
import ApiCards from '../../api/components/AdminApiCards';



const rowsData = [
  { id: 1, name: 'Zerodha API', broker: 'Zerodha',brokerId:'232',  autologin: true, status: 'Active', segment: 'Indian' },
  { id: 2, name: 'Binance API', broker: 'Binance',brokerId:'262', autologin: false, status: 'Inactive', segment: 'Crypto' },
  { id: 3, name: 'Upstox API', broker: 'Upstox',brokerId:'272', autologin: true, status: 'Pending', segment: 'Indian' },
  { id: 4, name: 'CoinDCX API', broker: 'CoinDCX',brokerId:'292', autologin: false, status: 'Active', segment: 'Crypto' },

];

const filterOptions = {
  status: ['Active', 'Inactive', 'Pending'],
  segment: ['Indian', 'Forex', 'Crypto'],
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const ApiTableHead = ({ order, orderBy, onRequestSort }) => {
  const headCells = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'API Name' },
    { id: 'broker', label: 'Broker' },
    { id: 'brokerId', label: 'Broker ID' },
    { id: 'autologin', label: 'Autologin' },
    { id: 'status', label: 'Status' },
    { id: 'segment', label: 'Segment' },
    { id: 'actions', label: 'Actions' },
  ];

  const createSortHandler = (property) => (event) => onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id && (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              )}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
const ApiTable = () => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState({ status: [], segment: [] });
  const [rows, setRows] = React.useState(rowsData);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [openApi, setOpenApi] = React.useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const hasFilters = Object.values(filters).some(val => val.length > 0);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  const handleAddApi = (data) => {
  console.log('NEW API PAYLOAD', data);
  // TODO: POST to backend & refresh list
}

  const handleToggle = (id, field) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, [field]: field === 'autologin' ? !row.autologin : row.status === 'Active' ? 'Inactive' : 'Active' }
          : row
      )
    );
  };

  const handleFilterChange = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const handleResetFilters = () => {
    setFilters({ status: [], segment: [] });
    setSearchQuery('');
  };

  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.broker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filters.status.length === 0 || filters.status.includes(row.status);
    const matchesSegment = filters.segment.length === 0 || filters.segment.includes(row.segment);
    return matchesSearch && matchesStatus && matchesSegment;
  });

  const drawer = (
    <Scrollbar
      sx={{
        width: 250,
        height: 500,
        '& .simplebar-scrollbar:before': { backgroundColor: primary },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ bgcolor: 'primary.light' }}>
              <FilterListIcon sx={{ color: 'primary.main' }} />
            </Avatar>
            <Box>
              <Typography variant="h6">Filters</Typography>
              <Typography variant="body2" color="text.secondary">Refine your APIs</Typography>
            </Box>
          </Box>
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(false)}>
              <RestartAltIcon />
            </IconButton>
          )}
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body2" color="text.secondary">
            {Object.values(filters).reduce((acc, val) => acc + val.length, 0)} filter(s) applied
          </Typography>
          <Button
            size="small"
            onClick={handleResetFilters}
            startIcon={<RestartAltIcon />}
            sx={{
              color: hasFilters ? '#fff' : 'text.secondary',
              bgcolor: hasFilters ? 'secondary.main' : 'transparent',
              '&:hover': { bgcolor: 'secondary.dark' },
              fontWeight: hasFilters ? 600 : 400,
              borderRadius: 2,
            }}
          >
            Reset
          </Button>
        </Box>

        <Divider sx={{ my: 1 }} />

        {Object.entries(filterOptions).map(([key, options]) => (
          <Box key={key} mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Typography>
            {options.map((option) => (
              <Box key={option} display="flex" alignItems="center">
                <Checkbox
                  size="small"
                  checked={filters[key].includes(option)}
                  onChange={() => handleFilterChange(key, option)}
                  sx={{ color: 'primary.main' }}
                />
                <Typography variant="body2">{option}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1 }} />
          </Box>
        ))}
      </Box>
    </Scrollbar>
  );

  return (
    <PageContainer title="API Table" description="This is the API Table page">
      <ApiCards/>
      <Box display="flex" overflow="hidden" sx={{mt:2}}>
        {isMobile ? (
          <>
            <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              {drawer}
            </Drawer>
            <Box
              sx={{
                position: 'fixed',
                bottom: 16,
                left: 16,
                zIndex: 1300,
              }}
            >
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{
                  bgcolor: 'background.paper',
                  boxShadow: 3,
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  '&:hover': { bgcolor: 'background.default' },
                }}
              >
                <FilterListIcon sx={{ color: 'primary.main' }} />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box sx={{ width: 250, borderRight: '1px solid #e0e0e0' }}>{drawer}</Box>
        )}

        <Box flex={1} p={2} overflow="auto">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            flexDirection={{ xs: 'column', sm: 'row' }}
            gap={2}
            mb={2}
          >
          
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                API Information
              </Typography>
          
         

            <Box
              display="flex"
              flexDirection={{ xs: 'column-reverse', sm: 'row' }}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="flex-end"
              gap={2}
              width="100%"
            >
              <TextField
                size="small"
                placeholder="Search APIs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: { xs: '100%', sm: '250px' },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'transparent',
                    borderRadius: 4,
                  },
                }}
              />

              <Button
                variant="contained"
                onClick={() => setOpenApi(true)}
                sx={{
                  bgcolor: 'primary.main',
                  color: '#fff',
                  textTransform: 'none',
                  px: 3,
                  width: { xs: '100%', sm: 'auto' },
                  borderRadius: 4,
                }}
              >
                + New API
              </Button>
            </Box>
          </Box>
                <AddApiDialog
  open={openApi}
  onClose={() => setOpenApi(false)}
  onSubmit={handleAddApi}
/>
          <Paper variant="outlined">
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <TableContainer>
                <Table size="medium" sx={{ minWidth: 700 }}>
                  <ApiTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                  <TableBody>
                    {stableSort(filteredRows, getComparator(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <TableRow key={row.id} hover>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.broker}</TableCell>
                          <TableCell>{row.brokerId}</TableCell>
                          <TableCell>
                            <Tooltip title={row.autologin ? 'Click to disable' : 'Click to enable'}>
                              <Switch
                                checked={row.autologin}
                                onChange={() => handleToggle(row.id, 'autologin')}
                                size="small"
                                color="primary"
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip title={row.status === 'Active' ? 'Click to deactivate' : 'Click to activate'}>
                              <Switch
                                checked={row.status === 'Active'}
                                onChange={() => handleToggle(row.id, 'status')}
                                size="small"
                                color="success"
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell>{row.segment}</TableCell>
                          <TableCell>
                            <Tooltip title="Edit"><IconButton color="primary"><IconEdit size={18} /></IconButton></Tooltip>
                            <Tooltip title="Delete"><IconButton color="error"><IconTrash size={18} /></IconButton></Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box
              mt={4}
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems="center"
              gap={2}
              p={2}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2">Rows :</Typography>
                <Select
                  size="small"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                >
                  {[5, 10, 25].map((num) => (
                    <MenuItem key={num} value={num}>{num}</MenuItem>
                  ))}
                </Select>
              </Box>

              <Typography>
                Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredRows.length)} of {filteredRows.length}
              </Typography>

              <Pagination
                count={Math.ceil(filteredRows.length / rowsPerPage)}
                page={page + 1}
                onChange={(e, value) => setPage(value - 1)}
                shape="rounded"
                color="primary"
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default ApiTable;



