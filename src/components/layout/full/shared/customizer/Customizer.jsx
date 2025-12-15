import {
  Box,
  Typography,
  IconButton,
  Divider,
  Tooltip,
  Stack,
  Switch,
  FormControlLabel,
  Grid,
  styled,
  ClickAwayListener,
} from '@mui/material';
import { IconX, IconCheck } from '@tabler/icons-react';
import Scrollbar from '../../../../custom-scroll/Scrollbar';
import { useContext } from 'react';
import { CustomizerContext } from '../../../../context/CustomizerContext';

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '70px',
  right: '25px',
  zIndex: 1300,
  width: '320px',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const ColorBox = styled(Box)({
  width: 25,
  height: 25,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
});

const Customizer = ({ open, onClose }) => {
  const {
    activeTheme,
    setActiveTheme,
    activeLayout,
    setActiveLayout,
    isLayout,
    setIsLayout,
  } = useContext(CustomizerContext);

  if (!open) return null;

  const thColors = [
    { id: 1, bgColor: '#5D87FF', disp: 'BLUE_THEME' },
    { id: 2, bgColor: '#0074BA', disp: 'AQUA_THEME' },
    { id: 3, bgColor: '#763EBD', disp: 'PURPLE_THEME' },
    { id: 4, bgColor: '#0A7EA4', disp: 'GREEN_THEME' },
    { id: 5, bgColor: '#01C0C8', disp: 'CYAN_THEME' },
    { id: 6, bgColor: '#FA896B', disp: 'ORANGE_THEME' },
  ];

  return (
    <ClickAwayListener onClickAway={onClose}>
      <StyledBox>
        <Scrollbar sx={{ maxHeight: '80vh' }}>
          <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Theme Settings</Typography>
            <IconButton size="small" onClick={onClose}>
              <IconX size="16" />
            </IconButton>
          </Box>
          <Divider />

          <Box p={2}>
            {/* Theme Colors */}
            <Typography variant="subtitle1" gutterBottom>
              Theme Colors
            </Typography>
            <Grid container spacing={1}>
              {thColors.map((color) => (
                <Grid  key={color.id}>
                  <Tooltip title={color.disp}>
                    <Box
                      sx={{
                        border: activeTheme === color.disp ? '2px solid #000' : '1px solid #ccc',
                        borderRadius: '8px',
                        p: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      onClick={() => setActiveTheme(color.disp)}
                    >
                      <ColorBox sx={{ backgroundColor: color.bgColor }}>
                        {activeTheme === color.disp && <IconCheck size={13} />}
                      </ColorBox>
                    </Box>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>

            <Box pt={3} />

            {/* Layout Toggle */}
            <Typography variant="subtitle1" gutterBottom>
              Layout Type
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={activeLayout === 'horizontal'}
                  onChange={(e) =>
                    setActiveLayout(e.target.checked ? 'horizontal' : 'vertical')
                  }
                />
              }
              label={activeLayout === 'horizontal' ? 'Horizontal' : 'Vertical'}
            />

            <Box pt={2} />

            {/* Container Option */}
            <Typography variant="subtitle1" gutterBottom>
              Container Type
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isLayout === 'full'}
                  onChange={(e) => setIsLayout(e.target.checked ? 'full' : 'boxed')}
                />
              }
              label={isLayout === 'full' ? 'Full' : 'Boxed'}
            />
          </Box>
        </Scrollbar>
      </StyledBox>
    </ClickAwayListener>
  );
};

export default Customizer;
