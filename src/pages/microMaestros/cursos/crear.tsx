"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";

import { postCursos } from "../../../services/microMaestros/cursosService";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import { InputsCreateUpdate } from "./components/formCreateUpdate/InputsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { CursosCreate, CursosCreateUpdateFormik } from "@/types/microMaestros/cursosTypes";

const validationSchema = yup.object({
  nombre: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .matches(
      /^[0-9a-zA-ZÑñ\s]+$/,
      "Solo se permiten letras incluida la Ñ, sin acentos"
    )
    .required("Campo obligatorio"),
});


export default function CrearCursos() {
  const router = useRouter();

  // respuesta
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const formik = useFormik<CursosCreateUpdateFormik>({
    initialValues: {
      nombre: "",
      especialidad: "",
      institucion: "",
      modalidadId: 0,
      areaSolicitante:"",
      horas:0,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
  
      postCursos(values)
        .then((res) => {
          setAlertMessage("Se guardo con éxito");
          setAlertType(typeAlert.success);
          setTimeout(() => {
            router.back();
          }, 1000);
        })
        .catch((error) => {
          if (error.status == 400) {
            setAlertMessage("El dato ya existe en el sistema.");
            setAlertType(typeAlert.error);
          } else {
            setAlertMessage(
              "No se pudo crear un nuevo dato, intente más tarde."
            );
            setAlertType(typeAlert.error);
          }
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
        Crear curso        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputsCreateUpdate formik={formik} />
        <ButtonsCreateUpdate
          
        />
      </form>
    </Box>
  );
}