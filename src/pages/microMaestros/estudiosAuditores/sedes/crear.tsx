"use client";
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import StepNavigation from "@/components/shared/StepNavigationCustom";
import router from "next/router";
import { InputsSede } from "./components/InputsSede";
import { InputsReferente } from "../referentes/components/InputsReferente";
import { postSede } from "@/services/microMaestros/SedesServices";
import { SedeCreateRequest } from "@/types/microMaestros/SedesTypes";

const validationSchemas = [
  yup.object({
    nombreSede: yup.string().required("El nombre de la sede es obligatorio"),
    codigoPostalId: yup.number().required("El código postal es obligatorio"),
    calle: yup.string().required("La calle es obligatoria"),
    nroCalle: yup.number().required("El número es obligatorio"),
    piso: yup.string(),
    departamento: yup.string(),
    telefonoPrincipal: yup.string().required("El teléfono es obligatorio"),
    telefonoAlternativo: yup.string(),
    emailSede: yup
      .string()
      .email("Debe ser un email válido")
      .required("El email es obligatorio"),
    diayhorario: yup.string(),
  }),
  yup.object({
    nombreReferente: yup
      .string()
      .required("El nombre del referente es obligatorio"),
    usuarioEPID: yup.number().required("El usuario EPID es obligatorio"),
    emailReferente: yup
      .string()
      .email("Debe ser un email válido")
      .required("El email es obligatorio"),
    rolEspecialidad: yup
      .string()
      .required("El rol/especialidad es obligatorio"),
  }),
];

export const CrearSede = () => {
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Sede", "Referente"];

  const formik = useFormik<SedeCreateRequest>({
    initialValues: {
      estudioAuditorId: 0,
      nombreSede: "",
      codigoPostalId: 0,
      calle: "",
      nroCalle: 0,
      piso: "",
      departamento: "",
      telefonoPrincipal: "",
      telefonoAlternativo: "",
      emailSede: "",
      diaYHorario: "",
      nombreReferente: "",
      usuarioEPID: 0,
      emailReferente: "",
      rolEspecialidad: "",
    },
    validationSchema: validationSchemas[activeStep],
    validateOnMount: true,
    onSubmit: (values) => {
      console.log("Errors:", formik.errors);
      console.log(values);
      postSede(values)
        .then((res) => {
          setAlertMessage("Se guardó con éxito");
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
        });
    },
  });

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

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
        <Typography variant="h1" sx={{ textAlign: "left", flexGrow: 1 }}>
          Crear Sede
        </Typography>

        <StepNavigation
          steps={steps}
          activeStep={activeStep}
          onStepChange={handleStepChange}
        />
      </Box>

      <Box sx={{ width: "100%", mt: 2 }}>
        {activeStep > 0 && formik.values.nombreSede && (
          <Typography variant="subtitle1" color="textSecondary">
            Estudio: {formik.values.nombreSede}
          </Typography>
        )}
      </Box>

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ width: "100%", mt: 4 }}
      >
        {activeStep === 0 && <InputsSede formik={formik} />}
        {activeStep === 1 && <InputsReferente formik={formik} />}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          mt: { md: 40 },
        }}
      >
        {activeStep < 1 && (
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            sx={{ mr: { md: 8 } }}
          >
            Atrás
          </Button>
        )}

        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={!formik.isValid || !formik.dirty}
          >
            Siguiente
          </Button>
        ) : (
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ width: "100%" }}
          >
            <ButtonsCreateUpdate disabled={!formik.isValid || !formik.dirty} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CrearSede;

// const dummy = () => {
//   console.log('...')
// }
// export default dummy
