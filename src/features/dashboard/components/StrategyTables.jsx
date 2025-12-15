"use client";

import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Download, ChevronRight } from "@mui/icons-material";

const topPerformanceData = [
  {
    name: "Alpha Strategy",
    script: "BANKNIFTY",
    legs: "Low Risk, Intraday",
    status: "Active",
    statusColor: "success",
  },
  {
    name: "Beta Swing",
    script: "RELIANCE",
    legs: "Medium Risk, Swing",
    status: "Completed",
    statusColor: "default",
  },
  {
    name: "Gamma Breakout",
    script: "NIFTY",
    legs: "High Risk, Breakout",
    status: "Pending",
    statusColor: "warning",
  },
  {
    name: "Delta Scalper",
    script: "TCS",
    legs: "Low Risk, Scalping",
    status: "Active",
    statusColor: "success",
  },
  {
    name: "Epsilon Long Term",
    script: "ITC",
    legs: "Low Risk, Long Term",
    status: "Completed",
    statusColor: "default",
  },
];

const topSubscribedData = [
  {
    name: "Alpha Strategy",
    script: "BANKNIFTY",
    legs: "Low Risk, Intraday",
    status: "Active",
    statusColor: "success",
  },
  {
    name: "Beta Swing",
    script: "RELIANCE",
    legs: "Medium Risk, Swing",
    status: "Completed",
    statusColor: "default",
  },
  {
    name: "Gamma Breakout",
    script: "NIFTY",
    legs: "High Risk, Breakout",
    status: "Pending",
    statusColor: "warning",
  },
  {
    name: "Delta Trend",
    script: "TCS",
    legs: "Medium Risk, Trend",
    status: "Active",
    statusColor: "success",
  },
  {
    name: "Omega Momentum",
    script: "INFY",
    legs: "Low Risk, Momentum",
    status: "Completed",
    statusColor: "default",
  },
];

export default function StrategyTables() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const renderTable = (title, data) => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <IconButton size="small">
            <Download />
          </IconButton>
        </Box>
        <TableContainer>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>
                  <strong>Strategy Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Script</strong>
                </TableCell>
                {!isMobile && (
                  <TableCell>
                    <strong>Legs</strong>
                  </TableCell>
                )}
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <ChevronRight />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {row.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="primary" fontWeight="medium">
                      {row.script}
                    </Typography>
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {row.legs}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell>
                    <Chip label={row.status} color={row.statusColor} size="small" variant="outlined" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {renderTable("Top Performance Strategy", topPerformanceData)}
      {renderTable("Top Subscribed Strategies", topSubscribedData)}
    </Box>
  );
}
