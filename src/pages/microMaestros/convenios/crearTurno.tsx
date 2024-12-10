"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { InputsCreateUpdateTitulo } from "@/components/microMaestros/convenios/formCreateUpdate/InputCreateUpdateTitulo";
import { useCodigosStore } from "@/zustand/microMaestros/gremios/useCodigosStore";
import { postZona } from "@/services/microMaestros/zonasService";
import { InputsCreateUpdateTurno } from "@/components/microMaestros/convenios/formCreateUpdate/InputCreateUpdateTurno";
import { postTurno } from "@/services/microMaestros/turnosService";
import { useRouterPush } from "@/hooks/useRouterPush";

const validationSchema = yup.object({
  nombre: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .matches(
      /^[a-zA-ZÑñ0-9\s]+$/ ,
      "Solo se permiten letras incluida la Ñ, sin acentos"
    )
    .required("Campo obligatorio"),
    porcentajeAdicional: yup
    .string()
    .matches(/^\d+([,.]\d+)?$/, 'Si es decimal separar por . Ejemplo: 00.00')  
    .test(
      'rango',
      'El número debe estar entre 0 y 100',
      value => {
        if (value === undefined) return true;
        const parsedValue = parseFloat(value.replace(',', '.'));
        
        return parsedValue >= 0 && parsedValue <= 100;
      }
    )
    .required('Campo  obligatorio'),
});

export default function CrearClasificaionCentroFisico() {
  const router = useRouter();
  const routerPush = useRouterPush();


  // respuesta
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const {  codigoConvenioColectivo, nombreConvenioColectivo } = useCodigosStore();

  const formik = useFormik({
    initialValues: {
      nombre: "",
      estado: true,
      codigoConvenioColectivo : Number(codigoConvenioColectivo),
      porcentajeAdicional: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const porcentajeAdicionalChange = parseFloat(values.porcentajeAdicional.replace(',', '.'))
      postTurno({
        nombre: values.nombre,
        estado: values.estado,
        codigoConvenioColectivo: values.codigoConvenioColectivo,
        porcentajeAdicional: Number(porcentajeAdicionalChange),
      })
        .then((res) => {
          setAlertMessage("Se guardo con éxito");
          setAlertType(typeAlert.success);
          setTimeout(() => {
            router.back();
          }, 1000);
        })
        .catch((error) => {
          if(error.response.data.errors){
            setAlertMessage(error.response.data.errors[0].description);
          }
            else{
            setAlertMessage(
              "No se pudo crear un nuevo dato, intente más tarde."
            );
          }
          setAlertType(typeAlert.error);
        })
        .finally();
    },
  });

  useEffect(() =>{
    if(!codigoConvenioColectivo){
      routerPush('/microMaestros/convenios')

    }
  }, [codigoConvenioColectivo])
  return (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        overflow: "hidden",
      }}
    >
      <SnackbarAlert
        message={alertMessage}
        type={alertType}
        setAlertMessage={setAlertMessage}
        setAlertType={setAlertType}
      />
      <Box display="flex" alignItems="center"  sx={{mb:30}}>
        <ArrowbackButton />
        <Typography variant="h1" sx={{ textAlign: "center", flexGrow: 1 }}>
          Crear turno
        </Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <Typography variant="body1" sx={{ ml:45, mt:10,mb:10, fontWeight: 'bold', textAlign: "center", flexGrow: 1, color: "#707070" }}>
          Convenio:  {nombreConvenioColectivo}
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputsCreateUpdateTurno formik={formik} />
        <ButtonsCreateUpdate disabled={!(formik.isValid && formik.dirty)} />
      </form>
    </Box>
  );
}
