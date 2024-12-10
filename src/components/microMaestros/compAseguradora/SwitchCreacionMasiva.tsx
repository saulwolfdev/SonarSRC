import React from 'react';
import { Switch, Typography, Box } from '@mui/material';

interface SwitchCreacionMasivaProps {
  checked: boolean;
  onClick: () => void; 
}

const SwitchCreacionMasiva: React.FC<SwitchCreacionMasivaProps> = ({ checked, onClick }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Switch
        checked={checked}
        onClick={onClick}
        inputProps={{ 'aria-label': 'controlled' }}
      />
      <Typography sx={{ ml: 2 }}>Creación masiva</Typography>
    </Box>
  );
};

export default SwitchCreacionMasiva;
