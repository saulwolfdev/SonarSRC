import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { useRouter } from "next/router";
import { postCategoriasMonotributo } from "./services/CategoriasMonotributoService";
import { InputsCategoriasMonotributo } from "./components/InputsCategoriasMonotributo";

const validationSchema = yup.object({
  nombre: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .matches(
      /^[a-zA-Z0-9Ññ\s]*$/,
      "Solo se permiten letras, números y espacios"
    )
    .required("El nombre es obligatorio"),
});

export const CrearMonotributo = () => {
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const formik = useFormik({
    initialValues: {
      nombre: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      postCategoriasMonotributo(values)
        .then(() => {
          setAlertMessage("Se guardo con éxito");
          setAlertType(typeAlert.success);
          setTimeout(() => {
            router.back();
          }, 1000);
        })
        .catch((error) => {
          if (error.errors) {
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
    <Box sx={{ p: 4, margin: "0 auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 6,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ArrowbackButton />
          <Typography variant="h1">Crear categorías monotributo</Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}></Box>
        </Box>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <SnackbarAlert
          message={alertMessage}
          type={alertType}
          setAlertMessage={setAlertMessage}
          setAlertType={setAlertType}
        />
        <InputsCategoriasMonotributo formik={formik} />
        <ButtonsCreateUpdate disabled={!formik.isValid || !formik.dirty} />
      </form>

      <SnackbarAlert
        message={alertMessage}
        type={alertType}
        setAlertMessage={setAlertMessage}
        setAlertType={setAlertType}
      />
    </Box>
  );
};

export default CrearMonotributo;