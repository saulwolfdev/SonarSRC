"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import {
  fetchClasificacionCentroFisicoById,
  putClasificacionCentroFisico,
} from "@/services/microMaestros/clasificacionCentroFisicoService";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";

import { ClasificacionCentroFisicoDetalleResponce } from "@/types/microMaestros/clasificacionCentrosFisicosTypes";

import { InputsCreateUpdate } from "./components/formCreateUpdate/InputCreateUpdate";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";

const validationSchema = yup.object({
  nombre: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .matches(
      /^[a-zA-ZÑñ\s]+$/,
      "Solo se permiten letras incluida la Ñ, sin acentos"
    )
    .required("Campo obligatorio"),
});

export default function EditarClasificaionCentroFisico() {
  const router = useRouter();
  const { id } = router.query;

  // respuesta
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const [response, setResponse] =
    useState<ClasificacionCentroFisicoDetalleResponce | null>(null);
  const [loading, setLoading] = useState(true);

  const formik = useFormik({
    initialValues: {
      id: 0,
      nombre: "",
      estado: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      putClasificacionCentroFisico(values)
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

  useEffect(() => {
    if (id && typeof id === 'string') {
      // Convierte el id a número
      const numericId = parseInt(id, 10);

      if (!isNaN(numericId)) {
    fetchClasificacionCentroFisicoById(numericId)
      .then((response) => {
        formik.setValues({
          id: response.id,
          nombre: response.nombre,
          estado: response.estado,
        });
        setResponse(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });

    }} 

  }, [id]);


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
          Editar clasificación de centro físico
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputsCreateUpdate formik={formik} />
        <ButtonsCreateUpdate 
        disabled={!(formik.isValid && formik.dirty)}
        isEdit={true}
        />
      </form>
    </Box>
  );
}
