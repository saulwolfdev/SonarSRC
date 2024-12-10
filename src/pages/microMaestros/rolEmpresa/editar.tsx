"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import { RolEmpresaAPI } from "@/types/microMaestros/rolEmpresaTypes";
import { fetchRolEmpresaById, patchRolEmpresa } from "@/services/microMaestros/RolEmpresaService";
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
  descripcion: yup
    .string()
    .max(250, "El campo debe tener máximo 250 caracteres")
    .matches(/^[a-zA-ZÑñ0-9\s]+$/, "Solo se permiten letras y números")
    .notRequired(),
});

export default function UpdateRolEmpresa() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [response, setResponse] = useState<RolEmpresaAPI | null>(null);

  const formik = useFormik({
    initialValues: {
      id: 0,
      nombre: "",
      descripcion: "",
      estado: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      patchRolEmpresa(values)
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

  // Cargar los datos del rol de empresa
  useEffect(() => {
    if (id && typeof id === "string") {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) {
        fetchRolEmpresaById(numericId)
          .then((response) => {
            formik.setValues({
              id: response.id,
              nombre: response.nombre,
              descripcion: response.descripcion,
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
    <Box sx={{ width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "flex-start", overflow: "hidden", paddingBottom:40 }}>
      <SnackbarAlert message={alertMessage} type={alertType} setAlertMessage={setAlertMessage} setAlertType={setAlertType} />
      <Box display="flex" alignItems="center">
        <ArrowbackButton />
        <Typography variant="h1" sx={{ textAlign: "center", flexGrow: 1 }}>
          Editar Rol Empresa
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
