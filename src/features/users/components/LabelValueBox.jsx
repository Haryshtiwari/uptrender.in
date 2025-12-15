import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import { CheckCircle, Copy } from "lucide-react";

const LabelValueBox = ({ label, value, icon, showCopy, verified }) => (
  <Box display="flex" alignItems="center" gap={1.5} minWidth={120}>
    {icon && <Box color="primary.main">{icon}</Box>}
    <Box>
      <Typography variant="caption" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="body2">{value || "-"}</Typography>
        {verified && (
          <CheckCircle size={16} color="green" style={{ marginTop: 1 }} />
        )}
        {showCopy && (
          <Tooltip title="Copy">
            <IconButton size="small" sx={{ p: 0.5 }}>
              <Copy size={14} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  </Box>
);

export default LabelValueBox;
