"use client";

import React, { useState } from "react";
import { useFormik, FormikHelpers } from "formik";
import * as yup from "yup";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import { InputsCreateUpdate } from "../../../components/microMaestros/tiposUnidades/formCreateUpdate/InputsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { postTipoUnidad } from "@/services/microMaestros/tiposUnidadesService";


interface FormValues {
  nombre: string;
  tipoRecurso: number;
  estado: boolean;
}

// Validaciones de formulario con Yup
const validationSchema = yup.object({
  nombre: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .matches(/^[a-zA-ZÑñ\s]+$/, "Solo se permiten letras incluidas la Ñ, sin acentos")
    .required("Campo obligatorio."),
  tipoRecurso: yup.string().required("Campo obligatorio."),
});

export default function CrearTipoUnidad() {
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const formik = useFormik<FormValues>({
    initialValues: {
      nombre: "",
      tipoRecurso: 0, 
      estado: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }: FormikHelpers<FormValues>) => {
      const payload = {
        nombre: values.nombre,
        codigoTipoRecurso: values.tipoRecurso, 
        estado: values.estado,
      };

      postTipoUnidad(payload)
        .then(() => {
          setAlertMessage("¡Se guardó con éxito!");
          setAlertType(typeAlert.success);
          setTimeout(() => {
            router.back();
          }, 1000);
        })
        .catch((error) => {
          setAlertMessage(
            error.response?.status === 400
              ? "El dato ya existe en el sistema."
              : "No se pudo crear un nuevo dato, intente más tarde."
          );
          setAlertType(typeAlert.error);
        })
        .finally(() => setSubmitting(false));
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
        paddingBottom: 40,
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
          Crear Tipo de Unidad
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputsCreateUpdate formik={formik} isEditMode={false} />
        <ButtonsCreateUpdate disabled={!formik.isValid || formik.isSubmitting} />
      </form>
    </Box>
  );
}