import React, { useState } from 'react';
import {
  Box,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Paper,
} from '@mui/material';
import {
  Today,
  DateRange,
  CalendarMonth,
  CalendarToday,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const DateRangePicker = ({ onDateRangeChange }) => {
  const [preset, setPreset] = useState('today');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isCustom, setIsCustom] = useState(false);

  const handlePresetChange = (event, newPreset) => {
    if (!newPreset) return;

    setPreset(newPreset);
    setIsCustom(false);

    const now = new Date();
    let start, end;

    switch (newPreset) {
      case 'today':
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'week':
        start = new Date(now.setDate(now.getDate() - 7));
        end = new Date();
        break;
      case 'month':
        start = new Date(now.setMonth(now.getMonth() - 1));
        end = new Date();
        break;
      case 'year':
        start = new Date(now.setFullYear(now.getFullYear() - 1));
        end = new Date();
        break;
      case 'custom':
        setIsCustom(true);
        return;
      default:
        return;
    }

    setStartDate(start);
    setEndDate(end);
    onDateRangeChange({ startDate: start, endDate: end });
  };

  const handleCustomDateChange = () => {
    if (startDate && endDate) {
      onDateRangeChange({ startDate, endDate });
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Date Range
      </Typography>
      <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
        <ToggleButtonGroup
          value={preset}
          exclusive
          onChange={handlePresetChange}
          size="small"
        >
          <ToggleButton value="today">
            <Today sx={{ mr: 0.5 }} fontSize="small" />
            Today
          </ToggleButton>
          <ToggleButton value="week">
            <DateRange sx={{ mr: 0.5 }} fontSize="small" />
            Week
          </ToggleButton>
          <ToggleButton value="month">
            <CalendarMonth sx={{ mr: 0.5 }} fontSize="small" />
            Month
          </ToggleButton>
          <ToggleButton value="year">
            <CalendarToday sx={{ mr: 0.5 }} fontSize="small" />
            Year
          </ToggleButton>
          <ToggleButton value="custom">Custom</ToggleButton>
        </ToggleButtonGroup>

        {isCustom && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box display="flex" gap={1} alignItems="center">
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                slotProps={{ textField: { size: 'small' } }}
                maxDate={new Date()}
              />
              <Typography>to</Typography>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                slotProps={{ textField: { size: 'small' } }}
                maxDate={new Date()}
                minDate={startDate}
              />
              <Button variant="contained" size="small" onClick={handleCustomDateChange}>
                Apply
              </Button>
            </Box>
          </LocalizationProvider>
        )}
      </Box>
    </Paper>
  );
};

export default DateRangePicker;
