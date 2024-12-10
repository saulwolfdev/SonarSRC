"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { postPolizaSeguro } from "@/services/microContratos/polizaSeguroService";
import moment from "moment";
import {InputsCreateUpdate} from "./components/InputsCreateUpdate";

const validationSchema = yup.object({
  numero: yup
    .string()
    .max(1, "El campo debe tener entre 1 y 30 caracteres")
    .max(30, "El campo debe tener entre 1 y 30 caracteres")
    .required("Campo obligatorio."),
  vigencia: yup
    .date()
    // tengo que hacer esto proque YUP solo conoce de fechas en formato MM/DD/YYYY
    // .transform(function (value, originalValue) { 
    //     if (originalValue) {
    //       const parsedDate = moment(originalValue, "DD/MM/YYYY", true);
    //       return parsedDate.isValid() ? parsedDate.toDate() : new Date("");
    //     }
    //     return value;
    //   })
    .min(moment().startOf('day').toDate(), "La fecha no puede ser anterior a la fecha actual.")
    .required("Campo obligatorio."),
  tipoSeguroId: yup
    .number()
    .min(1, "Campo obligatorio.")
    .required("Campo obligatorio."),
  companiaAseguradoraId: yup
    .number()
    .min(1, "Campo obligatorio.")
    .required("Campo obligatorio."),
  contratistaId: yup
    .number()
    .min(1, "Campo obligatorio.")
    .required("Campo obligatorio."),
});


export default function CrearPolizaSeguro() {
  const router = useRouter();

  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const formik = useFormik({
    initialValues: {
        companiaAseguradoraId: 0,
        numero: '',
        vigencia: undefined,
        tipoSeguroId: 0,
        contratistaId: 1 // TODO harcodeado proque es el id del usuraio
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      postPolizaSeguro(values)
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
        <Typography variant="h1" sx={{ textAlign: "center", flexGrow: 1 }}>
          Crear póliza de seguro
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputsCreateUpdate formik={formik} />
        <ButtonsCreateUpdate 
        disabled={!(formik.isValid && formik.dirty)}
        
        />
      </form>
    </Box>
  );
}
