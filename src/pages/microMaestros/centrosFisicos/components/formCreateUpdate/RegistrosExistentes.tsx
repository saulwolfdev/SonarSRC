'use client'

import { Box, Typography } from "@mui/material"
import { CentroFisicoAPI } from "@/types/microMaestros/centrosFisicosTypes"

interface  RegistrosExistentesProps{
  centrosExisting: CentroFisicoAPI[]
}

export default function RegistrosExistentes({ centrosExisting }: RegistrosExistentesProps) {
    return(
        <Box
        sx={{
          mt: { md: 10 },
          ml: { md: 21 },
          mb: { md: 45 },
        }}
      >
        {centrosExisting?.length > 0 ? (
          <>
            <Typography variant="body2" sx={{ fontStyle: "normal" }}>
              Registros existentes:
            </Typography>
            <ul>
              {centrosExisting.map((cla) => (
                <li key={cla.id}>
                  <Typography variant="body2">{cla.nombre}</Typography>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Box>
    )
}