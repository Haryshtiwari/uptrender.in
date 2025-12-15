import React from 'react';
import { Box, Avatar, Typography, Card, CardContent, Divider, Stack } from '@mui/material';
import { Grid } from '@mui/material';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';

import welcomeImg from '../../../assets/images/backgrounds/welcome-bg2.png';
import userImg from '../../../assets/images/profile/user-1.jpg';

const WelcomeCard = ({ data = {} }) => {
  const { user, stats } = data;
  const todaysSales = stats?.todayPnl || 0;
  const performance = stats?.winRate || 0;
  const isPositiveSales = todaysSales >= 0;
  const isPositivePerf = performance >= 50;
  return (
    <Card
      elevation={0}
      sx={{ backgroundColor: (theme) => theme.palette.primary.light, py: 0, position: 'relative' }}
    >
      <CardContent sx={{ py: 4, px: 2 }}>
        <Grid container justifyContent="space-between">
          <Grid size={{ sm: 6 }} display="flex" alignItems="center">
            <Box>
              <Box
                gap="16px"
                mb={5}
                sx={{
                  display: {
                    xs: 'block',
                    sm: 'flex',
                  },
                  alignItems: 'center',
                }}
              >
                <Avatar src={userImg} alt="img" sx={{ width: 40, height: 40 }} />
                <Typography variant="h5" whiteSpace="nowrap">
                  Welcome back {data?.user?.fullName || 'Trader'}!
                </Typography>
              </Box>

              <Stack
                mt={7}
                spacing={2}
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
              >
                <Box>
                  <Typography variant="h2" whiteSpace="nowrap">
                    ${Math.abs(todaysSales).toFixed(2)}{' '}
                    <span>
                      {isPositiveSales ? (
                        <IconArrowUpRight width={18} color="#39B69A" />
                      ) : (
                        <IconArrowDownRight width={18} color="#FA896B" />
                      )}
                    </span>
                  </Typography>
                  <Typography variant="subtitle1" whiteSpace="nowrap">
                    Today's P&L
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h2" whiteSpace="nowrap">
                    {performance.toFixed(1)}%
                    <span>
                      {isPositivePerf ? (
                        <IconArrowUpRight width={18} color="#39B69A" />
                      ) : (
                        <IconArrowDownRight width={18} color="#FA896B" />
                      )}
                    </span>
                  </Typography>
                  <Typography variant="subtitle1" whiteSpace="nowrap">
                    Win Rate
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
          <Grid size={{ sm: 6 }}>
            <Box
              sx={{
                width: '340px',
                height: '246px',
                position: 'absolute',
                right: '-26px',
                bottom: '-70px',
                marginTop: '20px',
              }}
            >
              <img src={welcomeImg} alt={welcomeImg} width={'340px'} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
