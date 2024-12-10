"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import Spinner from "@/components/shared/Spinner";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import { InputsCreateUpdate } from "@/components/microMaestros/tiposUnidades/formCreateUpdate/InputsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { fetchTipoUnidadById, patchTipoUnidad } from "@/services/microMaestros/tiposUnidadesService";
import { TipoUnidadAPI } from "@/types/microMaestros/tiposUnidadesTypes";

type TipoUnidadUpdatePayload = {
  codigo: number;
  nombre: string;
};

// Validaciones de formulario con Yup
const validationSchema = yup.object({
  nombre: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .matches(/^[a-zA-ZÑñ\s]+$/, "Solo se permiten letras incluidas la Ñ, sin acentos")
    .required("Campo obligatorio"),
});

export default function EditarTipoUnidad() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [response, setResponse] = useState<TipoUnidadAPI | null>(null);

  const formik = useFormik({
    initialValues: {
      codigo: 0,
      nombre: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload: TipoUnidadUpdatePayload = {
        codigo: values.codigo,
        nombre: values.nombre,
      };

      patchTipoUnidad(payload as any) 
        .then(() => {
          setAlertMessage("¡Se guardó con éxito!");
          setAlertType(typeAlert.success);
          setTimeout(() => {
            router.back();
          }, 1000);
        })
        .catch((error) => {
          console.error(error);
          setAlertMessage(
            error.response?.status === 400
              ? "El dato ya existe en el sistema."
              : "No se pudo realizar la edición. Inténtalo más tarde."
          );
          setAlertType(typeAlert.error);
        });
    },
  });

  useEffect(() => {
    if (id && typeof id === "string") {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) {
        fetchTipoUnidadById(numericId)
          .then((response) => {
            formik.setValues({
              codigo: response.id,
              nombre: response.nombre,
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
          Editar Tipo de Unidad
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputsCreateUpdate formik={formik} response={response} isEditMode={true} />
        <ButtonsCreateUpdate disabled={!(formik.isValid && formik.dirty)} isEdit={true} />
      </form>
    </Box>
  );
}
