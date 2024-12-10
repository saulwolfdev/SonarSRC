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
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { postAsociacionGremial } from "@/services/microMaestros/asociacionesGremialesService";
import { useSearchParams } from "next/navigation";
import { InputsCreateUpdate } from "@/components/microMaestros/gremios/asociacionesGremiales/formCreateUpdate/InputCreateUpdate";
import { useCodigosStore } from "@/zustand/microMaestros/gremios/useCodigosStore";

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
    provinciasId: yup
    .array()
    .of(yup.number().required("Cada elemento debe ser un número"))
    .min(1, "Este campo es obligatorio")  
    .required("Este campo es obligatorio"),
    conveniosColectivosId: yup
    .array()
    .of(yup.number().required("Cada elemento debe ser un número"))
});

export default function CrearAsociacionGremial() {
  const router = useRouter();
  const searchParams = useSearchParams()

  // respuesta
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const codigoGremioConsolidado = useCodigosStore((state) => state.codigoGremioConsolidado)


  const formik = useFormik({
    initialValues: {
      nombre: "",
      estado: true,
      codigoGremioConsolidado:  0,
      provinciasId: [],
      conveniosColectivosId: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      values.codigoGremioConsolidado =Number(codigoGremioConsolidado)
      postAsociacionGremial(values)
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
      <Box display="flex" alignItems="center"  sx={{mb:30}}>
        <ArrowbackButton />
        <Typography variant="h1" sx={{ textAlign: "center", flexGrow: 1 }}>
          Crear asociación gremial
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
