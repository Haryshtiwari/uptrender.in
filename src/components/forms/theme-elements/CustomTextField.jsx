// CustomTextField.jsx
import React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-input::placeholder': {
    color: theme.palette.text.secondary,
    opacity: 0.8,
  },
  '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[200],
  },
}));

export default CustomTextField;
