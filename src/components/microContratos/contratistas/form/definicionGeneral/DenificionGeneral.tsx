"use client";
import { Box, TextField } from "@mui/material";

interface DefinicionGenealProps {
  formik: any;
  withoutIntegration?: boolean;
}
export default function DefinicionGeneal({
  withoutIntegration,
  formik,
}: DefinicionGenealProps) {
  /* todo bloquear :
  
  + manual rol compras
  */

  return (
    <Box
      display="flex"
      flexDirection="row"
      sx={{ width: "100%", ml: { md: 8 } }}
    >
      {formik ? (
        <>
          <TextField
            id="razonSocial"
            name="razonSocial"
            label="Razón Social*"
            disabled={!withoutIntegration}
            value={formik.values.razonSocial}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.razonSocial && Boolean(formik.errors.razonSocial)
            }
            helperText={formik.touched.razonSocial && formik.errors.razonSocial}
            className="input-position-1-of-3"
            size="small"
          />
          <TextField
            id="numeroIdentificacion"
            name="numeroIdentificacion"
            label="N° de identificación - Cuit*"
            disabled={!withoutIntegration}
            value={formik.values.numeroIdentificacion}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.numeroIdentificacion &&
              Boolean(formik.errors.numeroIdentificacion)
            }
            helperText={
              formik.touched.numeroIdentificacion &&
              formik.errors.numeroIdentificacion
            }
            className="input-position-2-or-3-of-3"
            size="small"
          />
        </>
      ) : null}
    </Box>
  );
}
