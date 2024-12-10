"use Client";

import { Box, Card, FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup, TextField, Typography, MenuItem, Select, InputLabel } from "@mui/material";
import AutocompleteUpdateCreate from "@/components/shared/AutocompleteCreateUpdate";
import { useEffect, useState } from "react";
import {
  CursosAPI,
  CursosDetalleResponce,
  IdOption,
  CursosCreateUpdateFormik,
} from "../../../../../types/microMaestros/cursosTypes";
import {
  fetchCursos,
  fetchModalidades,  // Importing the fetchModalidades function
} from "../../../../../services/microMaestros/cursosService";
import { FormikProps } from "formik";

interface InputsCreateUpdateProps {
  formik: FormikProps<CursosCreateUpdateFormik>;
  response?: CursosDetalleResponce | null;
}

export function InputsCreateUpdate({
  formik,
  response,
}: InputsCreateUpdateProps) {
  const [centrosExisting, setCentrosExisting] = useState<CursosAPI[]>([]);
  // const [modalidades, setModalidades] = useState<ModalidadAPI[]>([]);
  const [modalidades, setModalidades] =
    useState<IdOption | null>(null);

    
    useEffect(() => {
      if (response) {
        formik.setFieldValue("nombre", response.nombre);
        formik.setFieldValue("institucion", response.institucion);   
        setModalidades({
          id: response.modalidad.id,
          label: response.modalidad.nombre,
        });
      }
    }, [response]);

  const handleChangeModalidades = (event: any, newValue: any) => {
    setModalidades(newValue);
  };

  const formikChange = (event: any) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  console.log(formik.values)

  return (
    <Box className="box-form-create-update">
      <Typography
        variant="body1"
        sx={{
          fontWeight: "bold",
          color: "grey",
          mt: { md: 15 },
          ml: { md: 21 },
        }}
      >
        Definición general
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
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
        <TextField
          id="especialidad"
          name="especialidad"
          label="Especialidad"
          value={formik.values.especialidad}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.especialidad && Boolean(formik.errors.especialidad)}
          helperText={formik.touched.especialidad && formik.errors.especialidad}
          sx={{
            width: "30%",
          }}
          size="small"
        />
        <TextField
          id="institucion"
          name="institucion"
          label="Institución"
          value={formik.values.institucion}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.institucion && Boolean(formik.errors.institucion)}
          helperText={formik.touched.institucion && formik.errors.institucion}
          sx={{
            width: "30%",
          }}
          size="small"
        />

        {/* Modalidad Select */}
        <AutocompleteUpdateCreate
          idText="modalidadId"
          name="modalidadId"
          label="Modalidad"
          value={modalidades}
          fetchOptions={fetchModalidades}
          onChange={handleChangeModalidades}
          formikChange={formikChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.modalidadId && Boolean(formik.errors.modalidadId)
          }
          helperText={formik.touched.modalidadId && formik.errors.modalidadId}
          sx={{
            mt: { md: 15 },
            mr: { md: 21 },
            width: { md: "30%" },
          }}
        />
        
        <TextField
          id="areaSolicitante"
          name="areaSolicitante"
          label="Área solicitante*"
          value={formik.values.areaSolicitante}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.areaSolicitante && Boolean(formik.errors.areaSolicitante)}
          helperText={formik.touched.areaSolicitante && formik.errors.areaSolicitante}
          sx={{
            mt: { md: 15 },
            mr: { md: 21 },
            width: { md: "30%" },
          }}
          size="small"
        />
        <TextField
          id="horas"
          name="horas"
          label="Horas"
          value={formik.values.horas}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.horas && Boolean(formik.errors.horas)}
          helperText={formik.touched.horas && formik.errors.horas}
          sx={{
            mt: { md: 15 },
            width: { md: "30%" },
          }}
          size="small"
        />
      </Box>
    </Box>
  );
}

const dummy = () => {
  console.log('...')
}
export default dummy
