import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Close as CloseIcon, Category, Search, TrendingUp } from '@mui/icons-material';

const TemplateSelectionDialog = ({ open, onClose, onSelectTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 1,
      name: 'Moving Average Crossover',
      category: 'Trend Following',
      description: 'Simple strategy based on MA crossover signals',
      winRate: 65,
      popularity: 'High',
      preset: {
        name: 'MA Crossover Strategy',
        segment: 'Equity',
        legs: 2,
        description: 'A trend-following strategy using 20 and 50 period moving averages',
      },
    },
    {
      id: 2,
      name: 'RSI Overbought/Oversold',
      category: 'Mean Reversion',
      description: 'Trade reversals using RSI indicator',
      winRate: 72,
      popularity: 'High',
      preset: {
        name: 'RSI Reversal Strategy',
        segment: 'Equity',
        legs: 1,
        description: 'Mean reversion strategy using RSI with 30/70 levels',
      },
    },
    {
      id: 3,
      name: 'Breakout Trading',
      category: 'Breakout',
      description: 'Capture momentum after price breakouts',
      winRate: 58,
      popularity: 'Medium',
      preset: {
        name: 'Breakout Strategy',
        segment: 'Futures',
        legs: 2,
        description: 'Trade breakouts from consolidation zones with volume confirmation',
      },
    },
    {
      id: 4,
      name: 'Iron Condor',
      category: 'Options',
      description: 'Range-bound options strategy',
      winRate: 78,
      popularity: 'Medium',
      preset: {
        name: 'Iron Condor Strategy',
        segment: 'Options',
        legs: 4,
        description: 'Sell OTM call and put spreads for premium collection',
      },
    },
    {
      id: 5,
      name: 'Straddle Strategy',
      category: 'Options',
      description: 'Profit from high volatility',
      winRate: 55,
      popularity: 'Low',
      preset: {
        name: 'Long Straddle',
        segment: 'Options',
        legs: 2,
        description: 'Buy ATM call and put to profit from large moves',
      },
    },
    {
      id: 6,
      name: 'MACD Divergence',
      category: 'Trend Following',
      description: 'Trade divergences between price and MACD',
      winRate: 68,
      popularity: 'Medium',
      preset: {
        name: 'MACD Divergence Strategy',
        segment: 'Equity',
        legs: 1,
        description: 'Identify trend reversals using MACD histogram divergence',
      },
    },
  ];

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate.preset);
      onClose();
    }
  };

  const getPopularityColor = (popularity) => {
    switch (popularity) {
      case 'High':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <Category color="primary" />
            <Typography variant="h6">Strategy Templates</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          fullWidth
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <Grid container spacing={2}>
          {filteredTemplates.map((template) => (
            <Grid item xs={12} sm={6} key={template.id}>
              <Card
                variant={selectedTemplate?.id === template.id ? 'elevation' : 'outlined'}
                sx={{
                  cursor: 'pointer',
                  border: selectedTemplate?.id === template.id ? 2 : 1,
                  borderColor:
                    selectedTemplate?.id === template.id ? 'primary.main' : 'divider',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 3,
                  },
                }}
                onClick={() => setSelectedTemplate(template)}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                    <Typography variant="h6" component="div">
                      {template.name}
                    </Typography>
                    <Chip
                      label={template.popularity}
                      size="small"
                      color={getPopularityColor(template.popularity)}
                    />
                  </Box>

                  <Chip
                    label={template.category}
                    size="small"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    {template.description}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={0.5}>
                    <TrendingUp fontSize="small" color="success" />
                    <Typography variant="body2" color="success.main" fontWeight={600}>
                      {template.winRate}% Win Rate
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    fullWidth
                    variant={selectedTemplate?.id === template.id ? 'contained' : 'outlined'}
                  >
                    {selectedTemplate?.id === template.id ? 'Selected' : 'Select Template'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredTemplates.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">No templates found matching your search</Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSelectTemplate}
          variant="contained"
          color="primary"
          disabled={!selectedTemplate}
        >
          Use Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateSelectionDialog;
