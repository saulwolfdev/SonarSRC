import { Box, Typography } from "@mui/material";
import { MotivoRechazoObjecionAfectacionAPI} from "@/types/microMaestros/motivosRechazoAfectacionTypes";

interface RegistrosExistentesProps {
  motivoExisting: MotivoRechazoObjecionAfectacionAPI[]
}

export default function RegistrosExistentes({motivoExisting} : RegistrosExistentesProps){

    return (
        <Box
            sx={{
              display: "flex",
              mt: {md: 10},
              ml: { md: 21 },
              mb: { md: 45 },
            }}
          >
             {motivoExisting?.length > 0 ? (
          <>
            <Typography variant="body2" sx={{ fontStyle: "normal" }}>
              Registros existentes:
            </Typography>
            <ul>
              {motivoExisting.map((cla : any) => (
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