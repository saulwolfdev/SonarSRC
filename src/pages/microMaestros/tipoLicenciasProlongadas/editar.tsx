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

import { TipoLicenciasProlongadasCreateUpdateFormik, TipoLicenciasProlongadasDetalleResponce, TipoLicenciasProlongadasUpdate } from "../../../types/microMaestros/tipoLicenciasProlongadasTypes";
import {
  fetchTipoLicenciasProlongadasById,
  putTipoLicenciasProlongadas,
} from "../../../services/microMaestros/tipoLicenciasProlongadasService";

import Spinner from "@/components/shared/Spinner";

import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import { InputsCreateUpdate } from "./components/formCreateUpdate/InputsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { useRouterPush } from "@/hooks/useRouterPush";

const validationSchema = yup.object({
  nombre: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .matches(
      /^[0-9a-zA-ZÑñ\s]+$/,
      "Solo se permiten letras incluida la Ñ, sin acentos"
    )
    .required("Campo obligatorio"),
});

export default function UpdateTipoLicenciasProlongadas() {
  const router = useRouter();
  const routerPush = useRouterPush();

  const { id } = router.query;

  const [loading, setLoading] = useState(true);

  // respuesta
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const [response, setResponse] = useState<TipoLicenciasProlongadasDetalleResponce | null>(
    null
  );

  const formik = useFormik<TipoLicenciasProlongadasCreateUpdateFormik>({
    initialValues: {
      nombre: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (response === null) return;
      const body: TipoLicenciasProlongadasUpdate = {
        ...values,
        id: response.id,
      };
      putTipoLicenciasProlongadas(body)
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
            setAlertMessage("No se pudo realizar la edición, intente más tarde.");
          }
          setAlertType(typeAlert.error);
        });
    },
  });
  

  useEffect(() => {
    if (id && typeof id === "string") {
      const numericId = parseInt(id, 10);

      if (!isNaN(numericId)) {
        fetchTipoLicenciasProlongadasById(numericId)
          .then((response) => {
            formik.setValues({
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
        Editar tipo de licencia prolongada        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputsCreateUpdate formik={formik} response={response} />
        <ButtonsCreateUpdate
        isEdit={true}
        />
      </form>
    </Box>
  );
}
