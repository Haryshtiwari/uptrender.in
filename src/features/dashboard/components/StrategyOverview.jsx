import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
 
  CardContent,
  Typography,
  Chip,
  Box,
  Tooltip,
  Switch,
  Avatar,

} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import iconInactive from "../../../assets/images/svgs/icons8-strategy-30.png";
import DashboardCard from '../../../components/common/DashboardCard';
const getSwitchColor = (status, theme) => {
  switch (status.toLowerCase()) {
    case "active": return theme.palette.success.main;
    case "inactive": return theme.palette.error.main;
    default: return theme.palette.grey[500];
  }
};

const StrategyOverview = ({ strategy, onToggleStatus, disabled = false }) => {
  const theme = useTheme();

  const computedFields = useMemo(() => {
    const createdOn = strategy.createdOn || strategy.createdAt || strategy.updatedAt || null;
    const createdDate = createdOn ? new Date(createdOn) : null;
    const isActive = typeof strategy.status === 'string'
      ? strategy.status.toLowerCase() === 'active'
      : Boolean(strategy.isActive);

    return {
      author: strategy.createdBy || strategy.madeBy || strategy.user?.name || 'Unknown',
      createdOnLabel: createdDate ? createdDate.toLocaleDateString() : 'N/A',
      type: strategy.type || (strategy.isPublic ? 'Public' : 'Private'),
      category: strategy.category || strategy.segment || strategy.symbol || 'N/A',
      statusLabel: strategy.status || (isActive ? 'Active' : 'Inactive'),
      isActive,
    };
  }, [strategy]);

  return (
    <DashboardCard sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }} >
      <CardContent>

        {/* First Row: Name & Switch */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar src={iconInactive} sx={{ width: 32, height: 32 }} />
            <Typography variant="h6" fontWeight={600}>{strategy.name || 'Untitled Strategy'}</Typography>
          </Box>

          <Tooltip title={computedFields.isActive ? "Click to deactivate" : "Click to activate"}>
            <Switch
              checked={computedFields.isActive}
              onChange={() => onToggleStatus(strategy.id)}
              disabled={disabled}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: getSwitchColor(computedFields.statusLabel, theme),
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: getSwitchColor(computedFields.statusLabel, theme),
                },
              }}
            />
          </Tooltip>
        </Box>

        {/* Info Chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 ,mt:1}}>
          <Chip label={`By: ${computedFields.author}`} size="small" color="primary" sx={{p:1}} />
          <Chip label={`On: ${computedFields.createdOnLabel}`} size="small" color="info" sx={{p:1}} />
          <Chip label={`Type: ${computedFields.type}`} size="small" color="secondary" sx={{p:1}} />
          <Chip label={`Category: ${computedFields.category}`} size="small" color="default" sx={{p:1}} />
        </Box>

        {/* Status Label */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          <Chip
            label={computedFields.statusLabel}
            color={computedFields.isActive ? "success" : "error"}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>

      </CardContent>
    </DashboardCard>
  );
};

StrategyOverview.propTypes = {
  strategy: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    createdBy: PropTypes.string,
    createdOn: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    type: PropTypes.string,
    category: PropTypes.string,
    segment: PropTypes.string,
    status: PropTypes.string,
    isActive: PropTypes.bool,
  }).isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default StrategyOverview;
