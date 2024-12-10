"use client"

import React, { useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import { Box, IconButton, Typography } from "@mui/material"
import { useRouter } from "next/router"
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert"
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate"
import { InputsCreateUpdate } from "./components/formCreateUpdate/InputsCreateUpdate"
import ArrowbackButton from "@/components/shared/ArrowbackButton"
import { postContrato } from "@/services/microContratos/ContratosService"

const validationSchema = yup.object({
  contratistaId: yup.number().min(1, "Campo obligatorio.").required("Campo obligatorio."),
  rolEmpresaId: yup.number().min(1, "Campo obligatorio.").required("Campo obligatorio."),
  tipoId: yup.number().min(1, "Campo obligatorio.").required("Campo obligatorio."),
  numero: yup
    .number()
    .min(100, "Debe tener entre 3 y 10 caracteres")
    .max(9999999999, "Debe tener entre 3 y 10 caracteres")
    .required("Campo obligatorio."),
  asociacionGremialId: yup.number().notRequired(),
  descripcion: yup
    .string()
    .max(250, "El campo debe tener maximo 250 caracteres")
    .matches(/^[a-zA-ZÑñ0-9\s]+$/, "Solo se permiten letras incluida la Ñ, sin acentos"),
  sociedadId: yup.number().min(1, "Campo obligatorio.").required("Campo obligatorio."),
  referenteDeComprasId: yup.number(),
  usuariosSolicitantes: yup
    .array()
    .of(yup.number().required("Campo obligatorio."))
    .min(1, "Campo obligatorio.")
    .required("Campo obligatorio."),
  usuariosANotificar: yup
    .string()
    .matches(
      /^([\w.%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})(,([\w.%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}))*$/,
      "Ingresa mails válidos (separados por coma, sin espacios)"
    )
    .notRequired(),
  inicio: yup.date().required("Campo obligatorio."),
  finalizacion: yup.date().required("Campo obligatorio."),
  estado: yup.boolean().required("Campo obligatorio."),
})

export default function CrearCentroFisico() {
  const router = useRouter()

  // respuesta
  const [alertMessage, setAlertMessage] = useState<string>("")
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined)

  const formik = useFormik({
    initialValues: {
      numero: "",
      origenId: null,
      descripcion: "",
      contratistaId: 0,
      rolEmpresaId: 0,
      tipoId: 0,
      asociacionGremialId: null,
      sociedadId: 0,
      referenteDeComprasId: 0,
      usuariosSolicitantes: [],
      usuariosANotificar: "",
      inicio: undefined,
      finalizacion: undefined,
      estado: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      //const valSubmit = { ...values, numero:numero.toString() };
      postContrato(values)
        .then((res) => {
          setAlertMessage("Se guardo con éxito")
          setAlertType(typeAlert.success)
          setTimeout(() => {
            router.back()
          }, 1000)
        })
        .catch((error) => {
          if(error.response.data.errors){
            setAlertMessage(error.response.data.errors[0].description);
          }
            else{
            setAlertMessage("No se pudo crear un nuevo dato, intente más tarde.")
          }
          setAlertType(typeAlert.error)
        })
        .finally()
    },
  })

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
          Crear contrato
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputsCreateUpdate formik={formik} />
        <ButtonsCreateUpdate 
        disabled={!(formik.isValid && formik.dirty)}
        
        />
      </form>
    </Box>
  )
}
