"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import Spinner from "@/components/shared/Spinner";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import { InputsCreateUpdate } from "@/components/microMaestros/motivosRechazoAfectacion/formCreateUpdate/InputsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { MotivoRechazoObjecionAfectacionDetalleResponse } from "@/types/microMaestros/motivosRechazoAfectacionTypes";
import {
  fetchMotivoRechazoObjecionAfectacionById,
  putMotivoRechazoObjecionAfectacion,
} from "@/services/microMaestros/motivosRechazoAfectacionService";
import { useRouterPush } from "@/hooks/useRouterPush";

const validationSchema = yup.object().shape({
  nombre: yup
    .string()
    .matches(
      /^[a-zA-ZÑñ\s]+$/,
      "Solo se permiten letras incluida la Ñ, sin acentos"
    )
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .required("Campo obligatorio"),
  descripcion: yup
    .string()
    .matches(
      /^[a-zA-ZÑñ\s]+$/,
      "Solo se permiten letras incluida la Ñ, sin acentos"
    )
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres."),
  rechazo: yup.boolean(),
  objecion: yup.boolean(),
});

export default function UpdateMotivoRechazoObjecionAfectacion() {
  const router = useRouter();
  const routerPush = useRouterPush();

  const { id } = router.query;
  const [loading, setLoading] = useState(true);

  // respuesta
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const [response, setResponse] =
    useState<MotivoRechazoObjecionAfectacionDetalleResponse | null>(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: response?.codigo || 0,
      nombre: response?.nombre,
      descripcion: response?.descripcion,
      rechazo: response?.rechazo,
      objecion: response?.objecion,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!values.rechazo && !values.objecion) {
        setAlertMessage("En los campos Rechazo y Objeción no puede seleccionar la opción NO simultáneamente.");
        setAlertType(typeAlert.error);
      }
      else {
        putMotivoRechazoObjecionAfectacion(values)
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
                "No se pudo realizar la edición, intente más tarde."
              );
            }
            setAlertType(typeAlert.error);
          })
          .finally();
      }
    },
  });

  useEffect(() => {
    if (id && typeof id === "string") {
      const numericId = parseInt(id, 10);

      if (!isNaN(numericId)) {
        fetchMotivoRechazoObjecionAfectacionById(numericId)
          .then((response) => {
            formik.setValues({
              id: response.codigo,
              nombre: response.nombre,
              descripcion: response.descripcion,
              rechazo: response.rechazo,
              objecion: response.objecion,
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

  const handleNavigation = (path: string) => {
    routerPush(path);
  };

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
        py: 20,
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
          Editar motivo de rechazo y/u objeción de afectación
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
