"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  Card,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";

import { CentroFisicoDetalleResponce } from "@/types/microMaestros/centrosFisicosTypes";
import {
  fetchCentroFisicoById,
  putCentroFisico,
} from "@/services/microMaestros/centroFisicoService";

import Spinner from "@/components/shared/Spinner";

import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import {InputsCreateUpdate} from "./components/formCreateUpdate/InputsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { useRouterPush } from "@/hooks/useRouterPush";

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
  clasificacionId: yup
    .number()
    .min(1, "Campo obligatorio.") // porque la provincia id 0 no existe
    .required("Campo obligatorio."),
  provinciaId: yup
    .number()
    .min(1, "Campo obligatorio.") // porque la provincia id 0 no existe
    .required("Campo obligatorio."),
});

export default function UpdateCentroFisico() {
  const router = useRouter();
  const routerPush = useRouterPush();

  const { id } = router.query;

  const [loading, setLoading] = useState(true);

  // respuesta
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const [response, setResponse] = useState<CentroFisicoDetalleResponce | null>(
    null
  );

  const formik = useFormik({
    initialValues: {
      id: 0,
      nombre: "",
      clasificacionId: 0,
      provinciaId: 0,
      estado: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      putCentroFisico(values)
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
    },
  });

  useEffect(() => {
    if (id && typeof id === "string") {
      const numericId = parseInt(id, 10);

      if (!isNaN(numericId)) {
        fetchCentroFisicoById(numericId)
          .then((response) => {
            formik.setValues({
              id: response.id,
              nombre: response.nombre,
              clasificacionId: response.clasificacion.id,
              provinciaId: response.provincia.id,
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
        py: 20
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
          Editar centro físico
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