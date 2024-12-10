import { Box, Typography } from "@mui/material";
import { GremioConsolidadorAPI } from "@/types/microMaestros/gremiosConsolidadoresTypes";

interface RegistrosExistentesProps {
  gremiosExisting: GremioConsolidadorAPI[]
}

export default function RegistrosExistentes({ gremiosExisting }: RegistrosExistentesProps) {

  return (
    <Box
      sx={{
        display: "flex",
        mt: { md: 10 },
        ml: { md: 21 },
        mb: { md: 45 },
      }}
    >
      {gremiosExisting?.length > 0 ? (
        <>
          <Typography variant="body2" sx={{ fontStyle: "normal" }}>
            Registros existentes:
          </Typography>
          <ul>
            {gremiosExisting.map((cla: any) => (
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