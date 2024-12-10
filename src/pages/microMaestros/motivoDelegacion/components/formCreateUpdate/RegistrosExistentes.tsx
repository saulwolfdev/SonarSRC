'use client'

import { Box, Typography } from "@mui/material"
import { MotivoDelegacionAPI } from "../../../../../types/microMaestros/motivoDelegacionTypes"

interface  RegistrosExistentesProps{
  centrosExisting: MotivoDelegacionAPI[]
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
                  <Typography variant="body2">{cla.nombreMotivo}</Typography>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Box>
    )
}