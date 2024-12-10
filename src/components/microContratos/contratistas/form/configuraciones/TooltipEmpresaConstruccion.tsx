import React from 'react';
import { Tooltip, IconButton, Link, Typography } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { URLEmpresaConstruccion } from '@/types/microContratos/contratistasTypes';

export default function TooltipEmpresaConstruccion() {

    const tooltipPersona = (
        <Typography variant="body1">
            Consultá el número IERIC:{" "}
            <Link
                href={URLEmpresaConstruccion}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
            >
                Listado de empresas eventuales
            </Link>
        </Typography>
    )

    return (
        <Tooltip placement="top" title={tooltipPersona} arrow>
            <IconButton sx={{ ml: 8, mr: 8 }}>
                <QuestionMarkIcon sx={{ fontSize: '16px' }} />
            </IconButton>
        </Tooltip>
    );
}