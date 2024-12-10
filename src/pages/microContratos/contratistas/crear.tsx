"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";

import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { InputsContratista } from "@/components/microContratos/contratistas/form/InputsCreateUpdate";
import { postContratista } from "../../../services/microContratos/contratistasService";

const validationSchema = yup.object({
  razonSocial: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .required("Campo obligatorio."),
  numeroIdentificacion: yup
    .number()
    .required("Campo obligatorio."),
  calle: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .required("Campo obligatorio."),
  nroCalle: yup
    .number()
    .min(1, "Debe tener entre 1 y 10 caracteres.")
    .max(9999999999, "Debe tener entre 1 y 10 caracteres.") //numbers tienen como max el el maxnumber
    .required("Campo obligatorio."),
  piso: yup
    .number()
    .max(9999999999, "Debe tener entre 1 y 10 caracteres.")
    .notRequired(),
  departamento: yup
    .string()
    .max(10, "Debe tener entre 1 y 10 caracteres.")
    .notRequired(),
  telefono: yup
    .number()
    .min(6, "Campo obligatorio.")
    .required("Campo obligatorio."),
  nombreContactoComercial: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .required("Campo obligatorio."),
  emailContactoComercial: yup
    .string()
    .min(10, "Debe tener entre 10 y 80 caracteres.")
    .max(80, "Debe tener entre 10 y 80 caracteres.")
    .required("Campo obligatorio."),
});

export default function CrearCentroFisico() {
  const router = useRouter();

  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const formik = useFormik({
    initialValues: {
      // nombre: "",
      razonSocial: "",
      // tipoIdentificacion: "",
      numeroIdentificacion: null,
      telefono: null,
      codigoPostalId: 0,
      codigoPostal: null,
      localidadId: null,
      localidadNombre: "",
      provinciaId: null,
      provinciaNombre: "",
      paisId: 9,
      paisNombre: "Argentina",
      calle: "",
      nroCalle: null,
      piso: null,
      departamento: null,
      nombreContactoComercial: "",
      emailContactoComercial: "",
      empresaEventual: false,
      empresaPromovida: true,
      empresaConstruccion: false,
      nroIERIC: "",
      codigoSAP: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      postContratista(values)
        .then((res) => {
          setAlertMessage("Se guardo con éxito");
          setAlertType(typeAlert.success);
          setTimeout(() => {
            router.back();
          }, 1000);
        })
        .catch((error) => {
          if (error.errors) {
            setAlertMessage(error.response.data.errors[0].description);
          } else {
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
      <Box display="flex" alignItems="center" sx={{ mb: 30 }}>
        <ArrowbackButton />
        <Typography variant="h1" sx={{ textAlign: "center", flexGrow: 1 }}>
          Crear contratista
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputsContratista formik={formik} />
        <ButtonsCreateUpdate 
        disabled={!(formik.isValid && formik.dirty)}
         
        />
      </form>
    </Box>
  );
}

