import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "Public", value: 66.7, count: 70 },
  { name: "Private", value: 33.3, count: 40 },
];

const COLORS = ["#6366f1", "#06b6d4"];

const StrategyChart = () => {
  const [timeRange, setTimeRange] = React.useState("1 Month");

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${percent.toFixed(1)}%`}
      </text>
    );
  };

  return (
    <Card sx={{ height: "fit-content" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Strategy Visibility
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Public vs Private
            </Typography>
          </Box>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Range</InputLabel>
            <Select
              value={timeRange}
              label="Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="1 Month">1 Month</MenuItem>
              <MenuItem value="3 Months">3 Months</MenuItem>
              <MenuItem value="6 Months">6 Months</MenuItem>
              <MenuItem value="1 Year">1 Year</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                innerRadius={40}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color }}>
                    {value} ({entry.payload.count})
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StrategyChart;
