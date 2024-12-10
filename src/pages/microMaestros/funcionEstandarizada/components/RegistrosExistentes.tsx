'use client'

import { Box, Typography } from "@mui/material"
import { FuncionesEstandarizadasAPI } from "@/types/microMaestros/funcionEstandarizadaTypes"

interface  RegistrosExistentesProps{
  funcionesExisting: FuncionesEstandarizadasAPI[]
}

export default function RegistrosExistentes({ funcionesExisting }: RegistrosExistentesProps) {
    return(
        <Box
        sx={{
          mt: { md: 10 },
          ml: { md: 21 },
          mb: { md: 45 },
        }}
      >
        {funcionesExisting?.length > 0 ? (
          <>
            <Typography variant="body2" sx={{ fontStyle: "normal" }}>
              Registros existentes:
            </Typography>
            <ul>
              {funcionesExisting.map((cla) => (
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