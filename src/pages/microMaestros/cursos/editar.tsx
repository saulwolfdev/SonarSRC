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

import { CursosCreateUpdateFormik, CursosDetalleResponce, CursosUpdate } from "../../../types/microMaestros/cursosTypes";
import {
  fetchCursosById,
  putCursos,
} from "../../../services/microMaestros/cursosService";

import Spinner from "@/components/shared/Spinner";

import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import { InputsCreateUpdate } from "./components/formCreateUpdate/InputsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";

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

export default function UpdateCursos() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);

  // respuesta
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const [response, setResponse] = useState<CursosDetalleResponce | null>(
    null
  );
console.log(response);

  const formik = useFormik<CursosCreateUpdateFormik>({
    initialValues: {
      nombre: "",
      especialidad: "",
      institucion: "",
      modalidadId: 0,
      areaSolicitante:"",
      horas:0,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (response === null) return;
      const body: CursosUpdate = {
        ...values,
        id: response.id,
      };
      putCursos(body)
        .then((res) => {
          setAlertMessage("Se guardo con éxito");
          setAlertType(typeAlert.success);
          setTimeout(() => {
            router.back();
          }, 1000);
        })
        .catch((error) => {
          if (error.status === 400) {
            setAlertMessage("El dato ya existe en el sistema.");
            setAlertType(typeAlert.error);
          } else {
            setAlertMessage("No se pudo realizar la edición, intente más tarde.");
            setAlertType(typeAlert.error);
          }
        });
    },
  });
  

  useEffect(() => {
    if (id && typeof id === "string") {
      const numericId = parseInt(id, 10);

      if (!isNaN(numericId)) {
        fetchCursosById(numericId)
          .then((response) => {
            formik.setValues({
              nombre: response.nombre,
              especialidad: response.especialidad,
              institucion: response.institucion,
              modalidadId: response.modalidad.id,
              areaSolicitante:response.areaSolicitante,
              horas:response.horas,            });
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
    router.push(path);
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
        Editar curso        </Typography>
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