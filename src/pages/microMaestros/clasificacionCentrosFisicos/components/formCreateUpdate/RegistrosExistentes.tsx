import { Box, Typography } from "@mui/material";
import { ClasificacionCentroFisicoAPI } from "@/types/microMaestros/clasificacionCentrosFisicosTypes";

interface RegistrosExistentesProps {
  clasificacionesExisting: ClasificacionCentroFisicoAPI[]
}

export default function RegistrosExistentes({clasificacionesExisting} : RegistrosExistentesProps){

    return (
        <Box
            sx={{
              display: "flex",
              mt: {md: 10},
              ml: { md: 21 },
              mb: { md: 45 },
            }}
          >
             {clasificacionesExisting?.length > 0 ? (
          <>
            <Typography variant="body2" sx={{ fontStyle: "normal" }}>
              Registros existentes:
            </Typography>
            <ul>
              {clasificacionesExisting.map((cla : any) => (
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