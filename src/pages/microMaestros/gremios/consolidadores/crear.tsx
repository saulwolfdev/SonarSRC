"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import { InputsCreateUpdate } from "@/components/microMaestros/gremios/consolidadores/formCreateUpdate/InputCreateUpdate";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { postGremioConsolidador } from "@/services/microMaestros/consolidadorService";
import { useSearchParams } from "next/navigation";

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
});

export default function CrearGremioConsolidado() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // respuesta
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const formik = useFormik({
    initialValues: {
      nombre: "",
      estado: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      postGremioConsolidador(values)
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
      <Box display="flex" alignItems="center" sx={{mb:30}}>
        <ArrowbackButton />
        <Typography variant="h1" sx={{ textAlign: "center", flexGrow: 1 }}>
          Crear gremio consolidador
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputsCreateUpdate formik={formik} />
        <ButtonsCreateUpdate 
        disabled={!(formik.isValid && formik.dirty)} 
        
        />
      </form>
    </Box>
  );
}
