"use Client";

import { Box, Card, FormControlLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import RegistrosExistentes from "./RegistrosExistentes";
import { useEffect, useState } from "react";
import { CausaDesafectacionAPI, CausaDesafectacionDetalleResponce } from "@/types/microMaestros/causaDesafectacionTypes";
import {fetchCausasDesafectaciones } from "@/services/microMaestros/causaDesafectacionService";

interface InputsCreateUpdateProps {
  formik: any;
  response?: CausaDesafectacionDetalleResponce | null;
  isVinculada?: boolean
}
export function InputsCreateUpdate({
  formik,
  response, isVinculada= false
}: InputsCreateUpdateProps) {
  const [causasExisting, setCausaExisting] = useState<CausaDesafectacionAPI[]>([]);
 

  useEffect(() => {
    if (response) {
      formik.setFieldValue(
        {
          nombre: response.nombre,
          descripcion: response.descripcion,
          desafectaTodosLosContratos: response.desafectaTodosLosContratos,
          reemplazoPersonal: response.reemplazoPersonal,
        }
      );
    }
  }, [response]);


  const handleChangeNombre = (event: any) => {
    formik.handleChange(event);
    if (event.target.value.length > 2) {
      fetchCausasDesafectaciones({ nombre: event.target.value })
        .then((response) => {
          setCausaExisting(response.data);
        })
        .catch((error) => {});
    } else {
      setCausaExisting([]);
    }
  };
  const formikChange = (event: any) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const handleDesafectaTodosLosContratos = (event: any) => {
    formik.setFieldValue("desafectaTodosLosContratos", event.target.value === 'true');
  };
  const handlereemplazoPersonal = (event: any) => {
    formik.setFieldValue("reemplazoPersonal", event.target.value  === 'true');
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
           disabled={isVinculada}
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
              <Typography variant="body1">Desafecta a todos los contratos</Typography>
              <RadioGroup
                aria-label="desafectaTodosLosContratos"
                name="desafectaTodosLosContratos"
                sx={{
                  display: "flex",
                  flexDirection: "inherit",
                  ml: { md: 8 },
                }}
                value={formik.values.desafectaTodosLosContratos}
                onChange={handleDesafectaTodosLosContratos}
              >
                <FormControlLabel value={true}  control={<Radio />} label="Sí" />
                <FormControlLabel value={false} control={<Radio />} label="No"/>
              </RadioGroup>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              className="input-position-2-or-3-of-3"
            >
              <Typography variant="body1">Remplazo personal</Typography>
              <RadioGroup
                aria-label="reemplazoPersonal"
                name="reemplazoPersonal"
                sx={{
                  display: "flex",
                  flexDirection: "inherit",
                  ml: { md: 8 },
                }}
                value={formik.values.reemplazoPersonal}
                onChange={handlereemplazoPersonal}
              >
                <FormControlLabel value={true}  control={<Radio />} label="Sí" />
                <FormControlLabel value={false} control={<Radio />} label="No"/>
              </RadioGroup>
            </Box>
        
      </Box>
      <RegistrosExistentes causasExisting={causasExisting} />
    </Box>
  );
}
const dummy = () => {
  console.log('...')
}
export default dummy