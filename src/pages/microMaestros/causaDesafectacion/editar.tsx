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

import Spinner from "@/components/shared/Spinner";

import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import {InputsCreateUpdate} from "@/components/microMaestros/causaDesafectacion/formCreateUpdate/InputsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { CausaDesafectacionDetalleResponce } from "@/types/microMaestros/causaDesafectacionTypes";
import { fetchCausaDesafectacionById, fetchCausaDesafectacionRecursosAfectadosById, putCausaDesafectacion } from "@/services/microMaestros/causaDesafectacionService";
import { useRouterPush } from "@/hooks/useRouterPush";

const validationSchema = yup.object().shape({
  nombre: yup.string()
    .matches(/^[a-zA-ZÑñ]+( [a-zA-ZÑñ]+)*$/, "Solo se permiten letras incluida la Ñ, sin acentos")
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .required("Campo obligatorio"),  
  descripcion: yup.string()
    .matches(/^[a-zA-ZÑñ]+( [a-zA-ZÑñ]+)*$/, "Solo se permiten letras incluida la Ñ, sin acentos")
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.").required("Campo obligatorio"),

  desafectaTodosContratos: yup.boolean()
    .oneOf([true, false], "Campo obligatorio")
    .default(false), 

  reemplazoPersonal: yup.boolean()
    .oneOf([true, false], "Campo obligatorio")
    .default(false),  
});


export default function UpdateCentroFisico() {
  const router = useRouter();
  const routerPush = useRouterPush();

  const { id } = router.query;

  const [loading, setLoading] = useState(true);

  // respuesta
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const [response, setResponse] = useState<CausaDesafectacionDetalleResponce | null>(
    null
  );
  const [isVinculada, setIsVinculada] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      id: 0,
      nombre: "",
      descripcion: '',
      desafectaTodosLosContratos: false,
      reemplazoPersonal: false,
      estado: false
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      putCausaDesafectacion(values)
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
        fetchCausaDesafectacionById(numericId)
          .then((response) => {
            formik.setValues({
              id: response.codigo,
              nombre: response.nombre, 
              descripcion: response.descripcion, 
              desafectaTodosLosContratos: response.desafectaTodosLosContratos, 
              reemplazoPersonal: response.reemplazoPersonal, 
              estado: response.estado
            });
            setResponse(response);
           
          })
          .catch((error) => {
            return
          });
          fetchCausaDesafectacionRecursosAfectadosById(numericId)
          .then((response) => {
              setIsVinculada(response >0)
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
          Editar causa desafectación
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputsCreateUpdate formik={formik} response={response} isVinculada={isVinculada} />
        <ButtonsCreateUpdate
          disabled={!(formik.isValid && formik.dirty)}
          isEdit={true}
        />
      </form>
    </Box>
  );
}
