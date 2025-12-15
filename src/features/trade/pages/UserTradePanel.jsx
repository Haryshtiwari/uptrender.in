import { Grid, Box, Alert } from "@mui/material";
import TopStatsBar from "../components/TopStatsBar";
import TradeTabsPanel from "../components/TradeTabsPanel";
import OrderSidebar from "../components/OrderSidebar";
import Breadcrumb from "../../../components/layout/full/shared/breadcrumb/Breadcrumb";
import { useTrades } from "../../../hooks/useTrades";
import Loader from "../../../components/common/Loader";

export default function UserTradePanel() {
  const { trades, loading, error, stats, createTrade, updateTrade, deleteTrade, refresh, goToPage, setLimit, pagination } = useTrades();

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <>
        <Breadcrumb title="Trade Panel"/>
        <Box mt={3}>
          <Alert severity="error" onClose={refresh}>
            {error}
          </Alert>
        </Box>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title="Trade Panel"/>
      <Box>
        <TopStatsBar stats={stats} />
        <Grid container spacing={2}>
          <Grid size={{xs:12,md:8,lg:8}}>
            <TradeTabsPanel 
              trades={trades} 
              onUpdate={updateTrade}
              onDelete={deleteTrade}
              onRefresh={({ page, limit } = {}) => {
                // support calling without args
                if (page) return goToPage(page);
                if (limit) return setLimit(limit);
                return refresh();
              }}
              pagination={pagination}
            />
          </Grid>
          <Grid size={{xs:12,md:4,lg:4}}>
            <OrderSidebar onCreate={createTrade} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
