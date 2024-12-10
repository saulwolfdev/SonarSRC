"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import router from "next/router";
import {InputsReferente} from "./components/InputsReferente";
import { ReferenteCreateRequest } from "@/types/microMaestros/ReferentesTypes";
import { postReferente } from "@/services/microMaestros/ReferentesServices";

const validationSchema = yup.object({
  nombre: yup.string().required("El nombre del referente es obligatorio"),
  usuarioEPID: yup.number().required("El usuario EPID es obligatorio"),
  email: yup.string().email("Debe ser un email válido").required("El email es obligatorio"),
  rolEspecialidad: yup.string().required("El rol/especialidad es obligatorio"),
});

export const CrearReferentes = () => {
  const [sedeId, setSedeId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  useEffect(() => {
    if (router.isReady) {
      setSedeId(Number(router.query.sedeId) || 0);
    }
  }, [router.isReady]);

  const formik = useFormik<ReferenteCreateRequest>({
    initialValues: {
      sedeId: Number(sedeId) || 0,
      nombre: "",
      usuarioEPID: 0,
      email: "",
      rolEspecialidad: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Errors:", formik.errors);
      console.log(values);
      postReferente(values)
        .then((res:any) => {
          setAlertMessage("Se guardó con éxito");
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
            setAlertMessage("No se pudo crear un nuevo dato, intente más tarde.");
          }
          setAlertType(typeAlert.error);
        });
    },
  });

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

      <Box display="flex" alignItems="center" sx={{ width: "100%", display: "ruby", mt: 8 }}>
        <ArrowbackButton />
        <Typography variant="h1" sx={{ textAlign: "left", flexGrow: 1 }}>
          Crear Referente
        </Typography>

      </Box>

      <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: "100%", mt: 4 }}>
        <InputsReferente formik={formik} />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          mt: { md: 40 },
        }}
      >
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: "100%" }}>
          <ButtonsCreateUpdate 
          disabled={!formik.isValid || !formik.dirty} 
          
          />
        </Box>
      </Box>
    </Box>
  );
}

// export default CrearReferentes;
//Arreglé todos los problemas con el build salvo este... a chequear 
const dummy = () => {
  console.log('...')
}
export default dummy