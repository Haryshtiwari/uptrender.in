import * as React from 'react';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

// Default unchecked icon styling
const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: 3,
  width: 19,
  height: 19,
  marginLeft: '4px',
  boxShadow:
    theme.palette.mode === 'dark'
      ? `0 0 0 1px ${theme.palette.grey[200]}`
      : `inset 0 0 0 1px ${theme.palette.grey[300]}`,
  backgroundColor: 'transparent',

  '.Mui-focusVisible &': {
    outline: `2px auto ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[200],
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background: theme.palette.grey[100],
  },
}));

// Checked icon styling with a checkmark SVG
const BpCheckedIcon = styled(BpIcon)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  boxShadow: 'none',
  '&:before': {
    display: 'block',
    width: 19,
    height: 19,
    content: '""',
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='white' d='M12 5c-.28 0-.53.11-.71.29L7 9.59 4.71 7.29a1.003 1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
}));

// Functional component
function CustomCheckbox(props) {
  return (
    <Checkbox
      disableRipple
      color={props.color || 'default'}
      checkedIcon={
        <BpCheckedIcon
          sx={{
            backgroundColor: props.bgcolor
              ? `${props.bgcolor}.main`
              : 'primary.main',
          }}
        />
      }
      icon={<BpIcon />}
      {...label}
      {...props}
    />
  );
}

export default CustomCheckbox;
