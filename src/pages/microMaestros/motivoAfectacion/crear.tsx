import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { useRouter } from "next/router";
import { postMotivoAfectacion } from "../../../services/microMaestros/motivoAfectacionService";
import { InputsMotivoAfectacion } from "../../../components/microMaestros/motivoAfectacion/InputsMotivoAfectacion";

const validationSchema = yup.object({
  motivoAfectacion: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .matches(
      /^[0-9a-zA-ZÑñ\s]+$/,
      "Solo se permiten letras incluida la Ñ, sin acentos"
    )
    .required("Campo obligatorio"),
  //predictivo
  relacionServicio: yup.array().required("Campo obligatorio."),
});

export const CrearMotivoAfectacion = () => {
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const formik = useFormik({
    initialValues: {
      motivoDeAfectacion: "",
      relacionServicio: [],
      fechaIncorporacion: false,
      bajaPorCesion: false,
      afectacionTemporal: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      const transformedValues = {
        ...values,
        relacionServicio: Array.isArray(values.relacionServicio)
          ? values.relacionServicio
          : [values.relacionServicio],
      };

      console.log(transformedValues);
      postMotivoAfectacion(transformedValues)
        .then(() => {
          setAlertMessage("Se guardo con éxito");
          setAlertType(typeAlert.success);
          setTimeout(() => {
            router.back();
          }, 1000);
        })
        .catch((error) => {
          if (error.response.data.errors) {
            setAlertMessage(error.response.data.errors[0].description);
          } else {
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
      <Box
        display="flex"
        alignItems="center"
        sx={{ width: "100%", display: "ruby", mt: 8 }}
      >
        <ArrowbackButton />
        <Typography
          variant="h1"
          sx={{
            textAlign: "left",
            flexGrow: 1,
            pr: { md: 60 },
            mt: { md: 20 },
          }}
        >
          Crear motivo de afectación
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputsMotivoAfectacion formik={formik} />
        <ButtonsCreateUpdate disabled={!(formik.isValid && formik.dirty)} />
      </form>
    </Box>
  );
};

export default CrearMotivoAfectacion;
