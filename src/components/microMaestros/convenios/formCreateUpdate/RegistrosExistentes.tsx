import { Box, Typography } from "@mui/material";
import { ConvenioAPI } from "@/types/microMaestros/convenioColectivoTypes";

interface RegistrosExistentesProps {
  conveniosExisting: any[]
}

export default function RegistrosExistentes({conveniosExisting} : RegistrosExistentesProps){

    return (
        <Box
            sx={{
              display: "flex",
              mt: {md: 10},
              ml: { md: 21 },
              mb: { md: 45 },
            }}
          >
             {conveniosExisting?.length > 0 ? (
          <>
            <Typography variant="body2" sx={{ fontStyle: "normal" }}>
              Registros existentes:
            </Typography>
            <ul>
              {conveniosExisting.map((cla : any) => (
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