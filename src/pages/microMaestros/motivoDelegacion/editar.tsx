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

import { MotivoDelegacionCreateUpdateFormik, MotivoDelegacionDetalleResponce, MotivoDelegacionUpdate } from "../../../types/microMaestros/motivoDelegacionTypes";
import {
  fetchMotivoDelegacionById,
  putMotivoDelegacion,
} from "../../../services/microMaestros/motivoDelegacionService";

import Spinner from "@/components/shared/Spinner";

import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import { InputsCreateUpdate } from "./components/formCreateUpdate/InputsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { useRouterPush } from "@/hooks/useRouterPush";

const validationSchema = yup.object({
  nombreMotivo: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .matches(
      /^[0-9a-zA-ZÑñ\s]+$/,
      "Solo se permiten letras incluida la Ñ, sin acentos"
    )
    .required("Campo obligatorio"),
  tiempoLimite: yup
    .number()
    .min(1, "Campo obligatorio.")
    .max(90,
      "El tiempo limite tiene que ser menor o igual a 90")
    .required("Campo obligatorio."),
  observacionObligatoria: yup
    .bool(),
});

export default function UpdateMotivoDelegacion() {
  const router = useRouter();
  const routerPush = useRouterPush();

  const { id } = router.query;

  const [loading, setLoading] = useState(true);

  // respuesta
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const [response, setResponse] = useState<MotivoDelegacionDetalleResponce | null>(
    null
  );

  const formik = useFormik<MotivoDelegacionCreateUpdateFormik>({
    initialValues: {
      nombreMotivo: "",
      tiempoLimite: 0,
      observacionObligatoria: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (response === null) return;
      const body: MotivoDelegacionUpdate = {
        ...values,
        id: response.id,
        observacionObligatoria: values.observacionObligatoria ?? response.observacionObligatoria,
      }
      putMotivoDelegacion(body)
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
        fetchMotivoDelegacionById(numericId)
          .then((response) => {
            formik.setValues({
              nombreMotivo: response.nombreMotivo,
              tiempoLimite: response.tiempoLimite,
              observacionObligatoria: response.observacionObligatoria,
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
          Editar motivo de delegación temporal
        </Typography>
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
