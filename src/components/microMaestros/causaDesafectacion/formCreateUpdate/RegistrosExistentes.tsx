'use client'

import { CausaDesafectacionAPI } from "@/types/microMaestros/causaDesafectacionTypes"
import { Box, Typography } from "@mui/material"

interface  RegistrosExistentesProps{
  causasExisting: CausaDesafectacionAPI[]
}

export default function RegistrosExistentes({ causasExisting }: RegistrosExistentesProps) {
    return(
        <Box
        sx={{
          mt: { md: 10 },
          ml: { md: 21 },
          mb: { md: 45 },
        }}
      >
        {causasExisting?.length > 0 ? (
          <>
            <Typography variant="body2" sx={{ fontStyle: "normal" }}>
              Registros existentes:
            </Typography>
            <ul>
              {causasExisting.map((cla) => (
                <li key={cla.codigo}>
                  <Typography variant="body2">{cla.nombre}</Typography>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Box>
    )
}