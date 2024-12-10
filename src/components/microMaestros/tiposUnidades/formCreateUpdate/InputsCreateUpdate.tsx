import { fetchTiposRecursos } from "@/services/microMaestros/tiposUnidadesService";
import { TipoRecurso } from "@/types/microMaestros/tiposUnidadesTypes";
import { Box, TextField, Typography, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";

interface InputsCreateUpdateProps {
  formik: any;
  response?: any;
  isEditMode: boolean;
}

export function InputsCreateUpdate({ formik, response, isEditMode }: InputsCreateUpdateProps) {
  const { setValues } = formik;
  const [tiposRecursos, setTiposRecursos] = useState<TipoRecurso[]>([]);

  useEffect(() => {
    if (response) {
      setValues(response);
    }
  }, [response, setValues]);

  useEffect(() => {
    const obtenerTiposRecursos = async () => {
      const recursos = await fetchTiposRecursos();
      setTiposRecursos(recursos);
    };
    obtenerTiposRecursos();
  }, []);

  return (
    <>
      <Box
      sx={{
        border: "1px solid #D6D6D68A",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        mt: 40,
        p: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mt: 30,
          ml: 40,
          fontSize: 20,
          fontWeight: 600,
          lineHeight: 1.5,
          color: "grey",
        }}
      >
        Definición general
      </Typography>

      <Box
        sx={{
          pl: 40,
          pr: 40,
          pt: 20,
          pb: 40,
          borderRadius: 2,
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 18,
        }}
      >
        {/* Campo de Nombre */}
        <TextField
          id="nombre"
          name="nombre"
          label="Nombre*"
          value={formik.values.nombre}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.nombre && Boolean(formik.errors.nombre)}
          helperText={formik.touched.nombre && formik.errors.nombre}
          sx={{
            width: "30%",
          }}
          size="small"
        />

        {/* Campo de Tipo de Recurso: Solo se muestra en modo creación */}
        {!isEditMode && (
          <TextField
          id="tipoRecurso"
          name="tipoRecurso"
          label="Tipo de Recurso*"
          value={formik.values.tipoRecurso}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.tipoRecurso && Boolean(formik.errors.tipoRecurso)}
          helperText={formik.touched.tipoRecurso && formik.errors.tipoRecurso}
          sx={{ width: "30%" }}
          size="small"
          select
        >
          {tiposRecursos.map((recurso) => (
            <MenuItem key={recurso.codigo} value={recurso.codigo}>
              {recurso.nombre}
            </MenuItem>
          ))}
        </TextField>
        )}
      </Box>
    </Box>
    </>
  );
}


const dummy = () => {
  console.log('...')
}
export default dummy