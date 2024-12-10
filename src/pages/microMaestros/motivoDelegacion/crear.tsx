"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";

import { postMotivoDelegacion } from "../../../services/microMaestros/motivoDelegacionService";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import { InputsCreateUpdate } from "./components/formCreateUpdate/InputsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { MotivoDelegacionCreate, MotivoDelegacionCreateUpdateFormik } from "@/types/microMaestros/motivoDelegacionTypes";

const validationSchema = yup.object({
  nombreMotivo: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .matches(
      /^[0-9a-zA-ZÑñ\s]+$/,
      "Solo se permiten letras incluida la Ñ, sin acentos"
    )
    .required("Campo obligatorio"),
  tiempoLimite: yup
    .number()
    .min(1, "Campo obligatorio.")
    .max(90,
      "El tiempo limite tiene que ser menor o igual a 90")
    .required("Campo obligatorio."),
  observacionObligatoria: yup
    .bool(),
});


export default function CrearMotivoDelegacion() {
  const router = useRouter();

  // respuesta
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const formik = useFormik<MotivoDelegacionCreateUpdateFormik>({
    initialValues: {
      nombreMotivo: "",
      tiempoLimite: 0,
      observacionObligatoria: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
  
      postMotivoDelegacion(values)
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
      <Box display="flex" alignItems="center">
        <ArrowbackButton />
        <Typography variant="h1" sx={{ textAlign: "center", flexGrow: 1 }}>
          Crear motivo de delegación temporal
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
