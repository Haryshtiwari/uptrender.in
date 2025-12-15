import React from 'react';
import { Box, TextField } from '@mui/material';

const CodeEditor = ({ value, onChange, language = 'python', height = '400px', ...props }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <Box
      sx={{
        width: '100%',
        boxSizing: 'border-box',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <TextField
        multiline
        fullWidth
        sx={{ width: '100%', boxSizing: 'border-box' }}
        value={value}
        onChange={handleChange}
        variant="outlined"
        InputProps={{
          sx: {
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: '14px',
            minHeight: height,
            alignItems: 'flex-start',
            '& .MuiInputBase-input': {
              minHeight: height,
              width: '100%',
              resize: 'none',
              overflow: 'auto !important',
            },
          },
        }}
        placeholder={`# Write your ${language} strategy code here...`}
        {...props}
      />
    </Box>
  );
};

export default CodeEditor;