import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const Spinner: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Spinner;
