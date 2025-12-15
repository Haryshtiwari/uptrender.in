import { Box, Grid, Card, Typography, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { TrendingUp, CheckCircle, Cancel } from "@mui/icons-material";

const TopStatsBar = ({ stats = {} }) => {
  const theme = useTheme();

  const totalPnl = stats?.totalPnl || 0;
  const activeTrades = stats?.pendingCount || 0;
  const closedTrades = stats?.completedCount || 0;

  const statsData = [
    {
      title: "P&L",
      value: `₹${totalPnl.toFixed(2)}`,
      icon: TrendingUp,
      bgcolor: totalPnl >= 0 ? "success" : "error",
    },
    {
      title: "Active",
      value: activeTrades.toString(),
      icon: CheckCircle,
      bgcolor: "primary",
    },
    {
      title: "Closed",
      value: closedTrades.toString(),
      icon: Cancel,
      bgcolor: "secondary",
    },
  ];

  return (
    <Grid container spacing={3} mb={2}>
      {statsData.map((stat, i) => {
        const color = theme.palette[stat.bgcolor]?.main || theme.palette.primary.main;
        const gradientBg = `linear-gradient(135deg, ${color}22, ${color}08)`;

        return (
          <Grid size={{xs:12,md:4,lg:4}} key={i}>
            <Card
              elevation={3}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderRadius: 4,
                background: gradientBg,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 6px 18px ${color}33`,
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: color,
                  color: theme.palette.common.white,
                  width: 42,
                  height: 42,
                  mr: 2,
                  boxShadow: `0 2px 6px ${color}88`,
                }}
              >
                <stat.icon fontSize="small" />
              </Avatar>

              <Box>
                <Typography variant="body2" fontWeight={600} color="text.secondary">
                  {stat.title}
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {stat.value}
                </Typography>
              </Box>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default TopStatsBar;
