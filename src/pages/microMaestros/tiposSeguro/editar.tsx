"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import { TiposSeguroAPI } from "@/types/microMaestros/tiposSeguroTypes";
import { fetchTiposSeguroById, patchTiposSeguro } from "@/services/microMaestros/TiposSeguroService";
import Spinner from "@/components/shared/Spinner";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import { InputsCreateUpdate } from "./components/formCreateUpdate/InputsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";

// Validaciones de formulario con Yup
const validationSchema = yup.object({
  nombre: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .matches(/^[a-zA-ZÑñ\s]+$/, "Solo se permiten letras incluidas la Ñ, sin acentos")
    .required("Campo obligatorio"),
});

export default function UpdateTiposSeguro() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [response, setResponse] = useState<TiposSeguroAPI | null>(null); 

  const formik = useFormik({
    initialValues: {
      id: 0,
      nombre: "",
      estado: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      patchTiposSeguro(values)
        .then(() => {
          setAlertMessage("¡Se guardó con éxito!");
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
            setAlertMessage("No se pudo realizar la edición. Inténtalo más tarde.");
          }
          setAlertType(typeAlert.error);
        });
    },
  });

  useEffect(() => {
    if (id && typeof id === "string") {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) {
        fetchTiposSeguroById(numericId)
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
      }
    }
  }, [id]);

  return loading ? (
    <Spinner />
  ) : (
    <Box sx={{ width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "flex-start", overflow: "hidden" }}>
      <SnackbarAlert message={alertMessage} type={alertType} setAlertMessage={setAlertMessage} setAlertType={setAlertType} />
      <Box display="flex" alignItems="center">
        <ArrowbackButton />
        <Typography variant="h1" sx={{ textAlign: "center", flexGrow: 1 }}>
          Editar Tipo de Seguro
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputsCreateUpdate formik={formik} response={response} />
        <ButtonsCreateUpdate 
        disabled={!(formik.isValid && formik.dirty)} 
        isEdit={true}
        />
      </form>
    </Box>
  );
}
