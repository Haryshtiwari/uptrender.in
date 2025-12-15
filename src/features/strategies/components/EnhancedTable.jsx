import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  Select,
  MenuItem,
} from '@mui/material';
import { Search } from '@mui/icons-material';

const headCellsPosition = [
  { id: 'sno', label: 'S.No' },
  { id: 'symbol', label: 'Symbol' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'price', label: 'Price' },
  { id: 'type', label: 'Type' },
  { id: 'pnl', label: 'PNL' },
  { id: 'currentPrice', label: 'Current Price' },
];

const headCellsOpenOrders = [
  { id: 'sno', label: 'S.No' },
  { id: 'symbol', label: 'Symbol' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'price', label: 'Price' },
  { id: 'type', label: 'Type' },
  { id: 'currentPrice', label: 'Current Price' },
];

const defaultPositionRows = [
  { id: 1, sno: 1, symbol: 'AAPL', quantity: 50, price: 150, type: 'Buy', pnl: '+500', currentPrice: 160 },
  { id: 2, sno: 2, symbol: 'GOOGL', quantity: 20, price: 2800, type: 'Sell', pnl: '-200', currentPrice: 2780 },
];

const defaultOpenOrdersRows = [
  { id: 1, sno: 1, symbol: 'TSLA', quantity: 10, price: 700, type: 'Buy', currentPrice: 710 },
  { id: 2, sno: 2, symbol: 'MSFT', quantity: 15, price: 300, type: 'Sell', currentPrice: 295 },
];

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
  const stabilized = array.map((el, index) => [el, index]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

const EnhancedTableToolbar = ({ title, searchText, onSearchChange }) => (
  <Toolbar
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-between',
      alignItems: 'center',
      px: 2,
      py: 1,
      gap: 1,
 
    }}
  >
    {title && (
      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>
    )}
    
    <TextField
      size="small"
      placeholder="Search..."
      value={searchText}
      onChange={(e) => onSearchChange(e.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Search sx={{ fontSize: 20, color: 'text.secondary' }} />
          </InputAdornment>
        ),
      }}
      sx={{
        width: { xs: '100%', sm: '250px' },
        ml: { sm: 'auto' },
       
      }}
    />
  </Toolbar>
);

export default function EnhancedTableTabs({ positions = [], openOrders = [] }) {
  const [tab, setTab] = React.useState(0);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('symbol');
  const [searchText, setSearchText] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const positionRows = positions.length ? positions : defaultPositionRows;
  const openOrdersRows = openOrders.length ? openOrders : defaultOpenOrdersRows;

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
    setSearchText('');
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const currentRows = tab === 0 ? positionRows : openOrdersRows;
  const currentHeadCells = tab === 0 ? headCellsPosition : headCellsOpenOrders;

  const filteredRows = currentRows.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const sortedRows = stableSort(filteredRows, getComparator(order, orderBy));

  return (
    <Paper sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Tabs value={tab} onChange={handleChangeTab} variant="scrollable" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Tab label="Position" />
          <Tab label="Open Orders" />
        </Tabs>

        <EnhancedTableToolbar
       
          searchText={searchText}
          onSearchChange={setSearchText}
        />

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {currentHeadCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    sortDirection={orderBy === headCell.id ? order : false}
                    
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={(event) => handleRequestSort(event, headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={row.id} hover>
                  {currentHeadCells.map((cell) => (
                    <TableCell key={cell.id}>
                      <Typography fontSize="0.95rem">{row[cell.id]}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        mt={2}
        px={2}
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={1} mt={2} mb={1}>
          <Typography variant="body2">Rows :</Typography>
          <Select
            size="small"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          >
            {[5, 10, 25, 50].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredRows.length)} of {filteredRows.length}
        </Typography>

        <Pagination
          count={Math.ceil(filteredRows.length / rowsPerPage)}
          page={page + 1}
          onChange={(e, value) => setPage(value - 1)}
          shape="rounded"
          variant="outlined"
          color="primary"
          sx={{
            '& .MuiPaginationItem-root': {
              border: '1px solid',
              borderColor: 'divider',
            },
            '& .Mui-selected': {
              backgroundColor: 'primary.main',
              color: '#fff',
              borderColor: 'primary.main',
            },
            mb:1
          }}
        />
      </Box>
    </Paper>
  );
}

EnhancedTableTabs.propTypes = {
  positions: PropTypes.arrayOf(PropTypes.object),
  openOrders: PropTypes.arrayOf(PropTypes.object),
};