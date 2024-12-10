"use Client";

import { Box, Card, FormControlLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import RegistrosExistentes from "./RegistrosExistentes";
import { useEffect, useState } from "react";
import { MotivoRechazoObjecionAfectacionAPI, MotivoRechazoObjecionAfectacionDetalleResponse } from "@/types/microMaestros/motivosRechazoAfectacionTypes";
import {fetchMotivosRechazoObjecionAfectacion } from "@/services/microMaestros/motivosRechazoAfectacionService";

interface InputsCreateUpdateProps {
  formik: any;
  response?: MotivoRechazoObjecionAfectacionDetalleResponse | null;
}
export function InputsCreateUpdate({
  formik,
  response,
}: InputsCreateUpdateProps) {
  const [motivoExisting, setMotivoExisting] = useState<MotivoRechazoObjecionAfectacionAPI[]>([]);
 // const [isVinculada, setIsVinculada] = useState<boolean>(false) //ss creo que no va

  useEffect(() => {
    if (response) {
      formik.setFieldValue(
        {
          nombre: response.nombre,
          descripcion: response.descripcion,
          rechazo: response.rechazo,
          objecion: response.objecion,
        }
      );
    }
  }, [response]);


  const handleChangeNombre = (event: any) => {
    formik.handleChange(event);
    if (event.target.value.length > 2) {
      fetchMotivosRechazoObjecionAfectacion({ nombre: event.target.value })
        .then((response) => {
          setMotivoExisting(response.data);
        })
        .catch((error) => {});
    } else {
      setMotivoExisting([]);
    }
  };
  const formikChange = (event: any) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };
//rechazo
  const handleRechazo = (event: any) => {
    formik.setFieldValue("rechazo", event.target.value=="true");
  };
  //objecion
  const handleObjecion = (event: any) => {
    formik.setFieldValue("objecion", event.target.value=="true");
  };

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
        }}
      >
        <TextField
          id="nombre"
          name="nombre"
          label="Nombre*"
           className="input-position-1-of-3"
          value={formik.values.nombre}
          onChange={handleChangeNombre}
          onBlur={formik.handleBlur}
          error={formik.touched.nombre && Boolean(formik.errors.nombre)}
          helperText={formik.touched.nombre && formik.errors.nombre}
          size="small"
        />
        <TextField
          id="descripcion"
          name="descripcion"
          label="Descripcion"
          value={formik.values.descripcion}
          onChange={formikChange}
          onBlur={formik.handleBlur}
          error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
          helperText={formik.touched.descripcion && formik.errors.descripcion}
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            width: { md: "60%" },
          }}
          size="small"
        />
        <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              className="input-position-1-of-3"
            >
              <Typography variant="body1">Rechazo</Typography>
              <RadioGroup
                aria-label="rechazo"
                name="rechazo"
                sx={{
                  display: "flex",
                  flexDirection: "inherit",
                  ml: { md: 8 },
                }}
                value={formik.values.rechazo}
                onChange={handleRechazo}
              >
                <FormControlLabel value="true"  control={<Radio />} label="Sí" />
                <FormControlLabel value="false" control={<Radio />} label="No"/>
              </RadioGroup>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              className="input-position-2-or-3-of-3"
            >
              <Typography variant="body1">Objeción</Typography>
              <RadioGroup
                aria-label="objecion"
                name="objecion"
                sx={{
                  display: "flex",
                  flexDirection: "inherit",
                  ml: { md: 8 },
                }}
                value={formik.values.objecion}
                onChange={handleObjecion}
              >
                <FormControlLabel value="true"  control={<Radio />} label="Sí" />
                <FormControlLabel value="false" control={<Radio />} label="No"/>
              </RadioGroup>
            </Box>
        
      </Box>
      <RegistrosExistentes motivoExisting={motivoExisting} />
    </Box>
  );
}
const dummy = () => {
  console.log('...')
}
export default dummy

