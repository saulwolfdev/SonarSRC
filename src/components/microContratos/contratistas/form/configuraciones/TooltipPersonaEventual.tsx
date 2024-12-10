import React from 'react';
import { Tooltip, IconButton, Link, Typography } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { URLPersonaEventual } from '@/types/microContratos/contratistasTypes';

const TooltipPersonaEventual: React.FC = () => {

  const tooltipPersona = (
    <Typography variant="body1">
      Consultá si es eventual:{" "}
      <Link
        href={URLPersonaEventual}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
      >
        Listado de empresas eventuales
      </Link>
    </Typography>
  )
  return (
    <>
      <Tooltip placement="top" title={tooltipPersona} arrow>
        <IconButton>
          <QuestionMarkIcon sx={{ fontSize: '16px' }} />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default TooltipPersonaEventual;
