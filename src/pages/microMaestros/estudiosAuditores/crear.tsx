"use client";
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { InputsEstudiosAuditores } from "./components/InputsEstudiosAuditores";
import { InputsReferente } from "./referentes/components/InputsReferente";
import { InputsSede } from "./sedes/components/InputsSede";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import StepNavigation from "@/components/shared/StepNavigationCustom";
import { postEstudioAuditor } from "@/services/microMaestros/EstudioAuditoresService";
import router from "next/router";


const validationSchemas = [
  yup.object({
    nombreEstudioAuditor:
      yup.string()
        .min(3, 'Debe tener entre 3 y 80 caracteres.')
        .max(80, 'Debe tener entre 3 y 80 caracteres.')
        .matches(/^[a-zA-Z0-9Ññ\s]*$/, 'Ingresa caracteres (incluida la ñ) sin acentos.')
        .required('Campo obligatorio'),
    cuit:
      yup.string()
        .length(11, "ngresa un CUIT valido. Debe tener 11 dígitos. Ej.: 20173671329")
        .required("Campo obligatorio"),
  }),
  yup.object({
    nombreSede:
      yup.string()
        .min(3, 'Debe tener entre 3 y 80 caracteres.')
        .max(80, 'Debe tener entre 3 y 80 caracteres.')
        .matches(/^[a-zA-Z0-9Ññ\s]*$/, 'Ingresa caracteres (incluida la ñ) sin acentos.')
        .required('Campo obligatorio'),
    codigoPostal: yup.number()
      .required("Campo obligatorio"),
    calle:
      yup.string()
        .min(3, 'Debe tener entre 3 y 80 caracteres.')
        .max(80, 'Debe tener entre 3 y 80 caracteres.')
        .matches(/^[a-zA-Z0-9Ññ\s]*$/, 'Ingresa caracteres (incluida la ñ) sin acentos.')
        .required('Campo obligatorio'),
    nroCalle:
      yup.number()
        .min(3, 'Debe tener entre 3 y 80 caracteres.')
        .max(9999999999999, 'Debe tener entre 3 y 80 caracteres.')
        .required('Campo obligatorio'),
    piso:
      yup.string()
        .min(3, 'Debe tener entre 3 y 80 caracteres.')
        .max(80, 'Debe tener entre 3 y 80 caracteres.')
        .matches(/^[a-zA-Z0-9Ññ\s]*$/, 'Ingresa caracteres (incluida la ñ) sin acentos.'),
    departamento:
      yup.string()
        .min(3, 'Debe tener entre 3 y 80 caracteres.')
        .max(80, 'Debe tener entre 3 y 80 caracteres.')
        .matches(/^[a-zA-Z0-9Ññ\s]*$/, 'Ingresa caracteres (incluida la ñ) sin acentos.'),
    telefonoPrincipal:
      yup.string()
        .min(6, 'Ingresa un teléfono valido. Mínimo 6 dígitos. Ej.: +54 11 10345678.')
        .required("Campo obligatorio"),
    telefonoAlternativo:
      yup.string(),
    emailSede:
      yup.string()
        .email("Ingresa un mail valido")
        .required("El email es obligatorio"),
    diayhorario: yup.string(),
  }),
  yup.object({
    nombreReferente:
      yup.string()
        .min(3, 'Debe tener entre 3 y 80 caracteres.')
        .max(80, 'Debe tener entre 3 y 80 caracteres.')
        .matches(/^[a-zA-Z0-9Ññ\s]*$/, 'Ingresa caracteres (incluida la ñ) sin acentos.')
        .required('Campo obligatorio'),
    usuarioEPID:
      yup.number()
        .required("Campo obligatorio"),
    emailReferente:
      yup.string()
        .email("Ingresa un mail valido")
        .min(1, 'Debe tener entre 1 y 64 caracteres.')
        .max(64, 'Debe tener entre 1 y 64 caracteres.')
        .required("Campo obligatorio"),
    rolEspecialidad:
      yup.string()
        .min(3, 'Debe tener entre 3 y 80 caracteres.')
        .max(80, 'Debe tener entre 3 y 80 caracteres.')
        .matches(/^[a-zA-Z0-9Ññ\s]*$/, 'Ingresa caracteres (incluida la ñ) sin acentos.')
        .required("Campo obligatorio"),
  }),
];


export const CrearEstudioAuditor = () => {
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Estudios Auditores", "Sede", "Referente"];

  const formik = useFormik({
    initialValues: {
      nombreEstudioAuditor: "",
      cuit: "",
      nombreSede: "",
      codigoPostalId: 0,
      calle: "",
      nroCalle: 0,
      piso: "",
      departamento: "",
      telefonoPrincipal: "",
      telefonoAlternativo: "",
      emailSede: "",
      diayhorario: "",
      nombreReferente: "",
      usuarioEPID: 0,
      emailReferente: "",
      rolEspecialidad: "",
    },
    validationSchema: validationSchemas[activeStep],
    validateOnMount: true,
    onSubmit: (values) => {
      console.log("Errors:", formik.errors);
      console.log(values)
      postEstudioAuditor(values)
        .then((res) => {
          setAlertMessage("Se guardó con éxito");
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

      <Box display="flex" alignItems="center" sx={{ width: "100%", display: "ruby", mt: 8 }}>
        <ArrowbackButton />
        <Typography variant="h1" sx={{ textAlign: "left", flexGrow: 1, pr: { md: 60 }, mt: { md: 20 } }}>
          Crear Estudio Auditor
        </Typography>

        <StepNavigation steps={steps} activeStep={activeStep} onStepChange={handleStepChange} />
      </Box>

      <Box sx={{ width: "100%", ml: { md: 60 } }}>
        {activeStep > 0 && formik.values.nombreEstudioAuditor && (
          <Typography variant="subtitle1" color="textSecondary">
            Estudio: {formik.values.nombreEstudioAuditor}
          </Typography>
        )}
        {activeStep === 2 && formik.values.nombreSede && (
          <Typography variant="subtitle1" color="textSecondary">
            Sede: {formik.values.nombreSede}
          </Typography>
        )}
      </Box>

      <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: "100%", mt: 4 }}>
        {activeStep === 0 && <InputsEstudiosAuditores formik={formik} />}
        {activeStep === 1 && <InputsSede formik={formik} />}
        {activeStep === 2 && <InputsReferente formik={formik} />}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          mt: { md: 40 },
        }}
      >
        {activeStep < 2 && (
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
          <Button variant="contained" color="primary" onClick={handleNext} disabled={!formik.isValid || !formik.dirty} >
            Siguiente
          </Button>
        ) : (
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: "100%" }}>
            <ButtonsCreateUpdate 
            disabled={!formik.isValid || !formik.dirty} 
            
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

// const dummy = () => {console.log('...')}
// export default dummy
export default CrearEstudioAuditor;