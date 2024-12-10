import { Box, Typography } from "@mui/material";
import { AsociacionGremialAPI } from "@/types/microMaestros/asociacionGremialTypes";

interface RegistrosExistentesProps {
  asociacionesExisting: AsociacionGremialAPI[]
}

export default function RegistrosExistentes({asociacionesExisting} : RegistrosExistentesProps){

    return (
        <Box
            sx={{
              display: "flex",
              mt: {md: 10},
              ml: { md: 21 },
              mb: { md: 45 },
            }}
          >
             {asociacionesExisting?.length > 0 ? (
          <>
            <Typography variant="body2" sx={{ fontStyle: "normal" }}>
              Registros existentes:
            </Typography>
            <ul>
              {asociacionesExisting.map((cla : any) => (
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