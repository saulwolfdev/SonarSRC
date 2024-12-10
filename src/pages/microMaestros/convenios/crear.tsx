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
import { useSearchParams } from "next/navigation";
import { useCodigosStore } from "@/zustand/microMaestros/gremios/useCodigosStore";
import { postConvenio } from "@/services/microMaestros/conveniosColectivoService";
import { InputsCreateUpdateConvenio } from "@/components/microMaestros/convenios/formCreateUpdate/InputCreateUpdateConvenio";

const validationSchema = yup.object({
  nombre: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    // .matches(
    //   /^[a-zA-ZÑñ0-9\s]+$/
    //   "Solo se permiten letras incluida la Ñ, sin acentos"
    // )
    .required("Campo obligatorio"),
  horasDiariasDeTrabajo: yup.string().matches(/^(?!00:00$)/, 'Debe estar en formato HH:mm').required("Campo obligatorio"), 
  asociacionesGremialesId: yup
    .array()
    .of(
      yup.number().typeError("Debe ser un número").required("Campo requerido")
    )
    .min(1, "Debe haber al menos un número (id)")
    .required("Campo obligatorio"),
  nombreTitulo: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .required("Campo obligatorio"),
  nombreCategoriaTitulo: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .required("Campo obligatorio"),
  nombreZona: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .required("Campo obligatorio"),
  porcentajeAdicionalZona: yup.number()
    .typeError('Debe ser un número válido') 
    .min(0, 'Debe ser un numero entre 0 y 100') 
    .max(100, 'Debe ser un numero entre 0 y 100')
    .required('Campo  obligatorio'),
  nombreTurno: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .required("Campo obligatorio"),
  porcentajeAdicionalTurno: yup.number()
    .typeError('Debe ser un número válido') 
    .min(0, 'Debe ser un numero entre 0 y 100') 
    .max(100, 'Debe ser un numero entre 0 y 100')
    .required('Campo obligatorio'),
});

export default function CrearConvenioColectivo() {
  const router = useRouter();
  const searchParams = useSearchParams()

  // respuesta
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);  

  const formik = useFormik({
    initialValues: {
      nombre : '',
      horasDiariasDeTrabajo: '00:00',
      asociacionesGremialesId : [],
      nombreTitulo : '',
      nombreCategoriaTitulo : '',
      nombreZona : '',
      porcentajeAdicionalZona : undefined,
      nombreTurno : '',
      porcentajeAdicionalTurno : undefined,
      estado: true
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      postConvenio(values)
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
        <Typography variant="h1" sx={{ textAlign: "center", flexGrow: 1 , mb:{ md:15}}}>
          Crear convenio
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputsCreateUpdateConvenio formik={formik} />
        <ButtonsCreateUpdate  
        disabled={!(formik.isValid && formik.dirty)} 
        
        />
      </form>
    </Box>
  );
}
