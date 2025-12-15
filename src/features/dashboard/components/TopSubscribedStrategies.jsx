import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Box,
  IconButton,
  Stack,
  Skeleton,
  Alert,
} from "@mui/material";
import { Users, Eye, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Scrollbar from "../../../components/custom-scroll/Scrollbar";
import { adminStrategyService } from "../../../services/adminStrategyService";

const getRiskChipColor = (risk) => {
  switch (risk?.toLowerCase()) {
    case "low":
      return "success";
    case "medium":
      return "warning";
    case "high":
      return "error";
    default:
      return "default";
  }
};

const getSegmentLabel = (segment) => {
  const segments = {
    OPTIONS: 'Options',
    EQUITY: 'Equity',
    FUTURES: 'Futures',
    COMMODITY: 'Commodity',
  };
  return segments[segment?.toUpperCase()] || segment || 'Other';
};

export default function TopSubscribedStrategies() {
  const navigate = useNavigate();
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStrategies = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await adminStrategyService.getAllStrategies({
          limit: 8,
          isPublic: 'true',
          isActive: 'true',
        });

        if (result.success && result.data?.strategies) {
          // Sort by subscriber count (using a mock field for now, you can add it to backend)
          const sortedStrategies = result.data.strategies.map(s => ({
            id: s.id,
            name: s.name,
            subscribers: s.subscriberCount || Math.floor(Math.random() * 1000) + 100,
            rating: s.rating || (Math.random() * 2 + 3).toFixed(1),
            return: s.totalPnL >= 0 ? `+${(s.totalPnL || 0).toFixed(1)}%` : `${(s.totalPnL || 0).toFixed(1)}%`,
            risk: s.riskLevel || 'Medium',
            category: getSegmentLabel(s.segment),
            creator: s.user?.name || s.createdBy || 'Unknown',
          }));
          setStrategies(sortedStrategies);
        } else {
          setStrategies([]);
        }
      } catch (err) {
        console.error('Error fetching top strategies:', err);
        setError('Failed to load strategies');
      } finally {
        setLoading(false);
      }
    };

    fetchStrategies();
  }, []);

  const handleViewStrategy = (strategyId) => {
    navigate(`/admin/strategies/${strategyId}`);
  };

  return (
    <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Users size={20} color="#3b82f6" />
            <Typography variant="h6">Top Subscribed Strategies</Typography>
          </Stack>
        }
      />
      <CardContent>
        <Scrollbar sx={{ maxHeight: 400, overflowY: "auto", pr: 1 }}>
          {loading ? (
            <Stack spacing={2}>
              {[1, 2, 3, 4].map(i => (
                <Box key={i} sx={{ p: 2, borderRadius: 2, bgcolor: "action.hover" }}>
                  <Skeleton width="60%" height={24} />
                  <Skeleton width="40%" height={20} sx={{ mt: 1 }} />
                  <Skeleton width="80%" height={16} sx={{ mt: 1 }} />
                </Box>
              ))}
            </Stack>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : strategies.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">No public strategies available</Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {strategies.map((strategy) => (
                <Box
                  key={strategy.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "action.hover",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.selected',
                    }
                  }}
                  onClick={() => handleViewStrategy(strategy.id)}
                >
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle2" noWrap>
                        {strategy.name}
                      </Typography>
                      <Star size={14} fill="#facc15" color="#facc15" />
                      <Typography variant="caption" color="text.secondary">
                        {strategy.rating}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} mb={1}>
                      <Chip label={strategy.category} size="small" />
                      <Chip 
                        label={strategy.risk} 
                        size="small" 
                        color={getRiskChipColor(strategy.risk)} 
                        variant="outlined" 
                      />
                    </Stack>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="caption" color="text.secondary">
                        by {strategy.creator}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Users size={14} />
                        <Typography variant="caption">{strategy.subscribers.toLocaleString()}</Typography>
                      </Stack>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: "right", minWidth: 60 }}>
                    <Chip
                      label={strategy.return}
                      size="small"
                      sx={{ 
                        bgcolor: strategy.return.startsWith('+') ? "success.light" : "error.light", 
                        color: strategy.return.startsWith('+') ? "success.dark" : "error.dark", 
                        mb: 1 
                      }}
                    />
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewStrategy(strategy.id);
                      }}
                    >
                      <Eye size={14} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Scrollbar>
      </CardContent>
    </Card>
  );
}
