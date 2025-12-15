import React from 'react';
import { Box, Typography, Avatar, CircularProgress, Tooltip } from '@mui/material';
import { IconWallet } from '@tabler/icons-react';
import { useWallet } from '../../../../../hooks/useWallet';

const WalletBalanceNav = ({ onClick, compact = false }) => {
  const { balance, currency, loading } = useWallet();

  return (
    <Tooltip title="Wallet Balance">
      <Box
        onClick={onClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          px: 1,
          py: 0.25,
          borderRadius: 1,
          '&:hover': {
            backgroundColor: (theme) => theme.palette.action.hover,
          },
        }}
      >
        <Avatar variant="rounded" sx={{ bgcolor: (theme) => theme.palette.primary.light, width: 36, height: 36 }}>
          <IconWallet size={22} stroke={1.5} color="white" />
        </Avatar>

        {!compact && (loading ? (
          <CircularProgress size={18} />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {currency === 'USD' ? '$' : '₹'}{Number(balance || 0).toFixed(2)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Wallet
            </Typography>
          </Box>
        ))}
      </Box>
    </Tooltip>
  );
};

export default WalletBalanceNav;
