import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Stack, Box } from '@mui/material';
import { CustomizerContext } from '../context/CustomizerContext';


const DashboardCard = ({
  title,
  subtitle,
  children,
  action,
  footer,
  cardheading,
  headtitle,
  headsubtitle,
  middlecontent,
  icon,
  variant,
  sx,
}) => {
  const { isCardShadow } = useContext(CustomizerContext);


  const theme = useTheme();
  const borderColor = theme.palette.grey[100];

  const isBento = variant === 'bento';

  const baseSx = {
    padding: 0,
    border: !isCardShadow && !isBento ? `1px solid ${borderColor}` : 'none',
    borderRadius: isBento ? 2 : undefined,
    boxShadow: isCardShadow && isBento ? 8 : isCardShadow ? 6 : 0,
    transition: isBento ? 'transform .24s ease, box-shadow .24s ease' : undefined,
    '&:hover': isBento
      ? {
          transform: 'translateY(-6px)',
          boxShadow: (theme) => `0 10px 30px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.45)' : 'rgba(16, 24, 40, 0.08)'}`,
        }
      : undefined,
    ...sx,
  };

  return (
    <Card sx={baseSx} elevation={isCardShadow && !isBento ? 9 : 0} variant={!isCardShadow && !isBento ? 'outlined' : undefined}>
      {cardheading ? (
        <CardContent>
          <Typography variant="h5">{headtitle}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {headsubtitle}
          </Typography>
        </CardContent>
      ) : (
        <CardContent sx={{ p: isBento ? 2 : '30px' }}>
          {title ? (
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems={'center'}
              mb={3}
            >
           <Box display="flex" alignItems="center" gap={1.5}>
  {icon && <Box>{icon}</Box>}
  <Box>
    {title && <Typography variant="h5">{title}</Typography>}
    {subtitle && (
      <Typography variant="subtitle2" color="textSecondary">
        {subtitle}
      </Typography>
    )}
  </Box>
</Box>

              {action}
            </Stack>
          ) : null}

          {children}
        </CardContent>
      )}

      {middlecontent}
      {footer}
    </Card>
  );
};

export default DashboardCard;
