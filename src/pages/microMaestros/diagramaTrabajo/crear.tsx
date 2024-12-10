import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { useRouter } from "next/router";
import { postDiagramaTrabajo } from "./services/DiagramaTrabajoService";
import { InputsDiagramaTrabajo } from "./components/InputsDiagramaTrabajo";

const validationSchema = yup.object({
  diasTrabajo: yup.string()
    .required('El dia trabajo es obligatorio'),
  diasDescanso: yup.string()
    .required('El dia descanso es obligatorio'),
  diaTrabajoMes: yup.string()
    .required('El dia trabajo mes es obligatorio'),
});


export const CrearDiagramaTrabajo = () => {
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const formik = useFormik({
    initialValues: {
      diasTrabajo: "",
      diasDescanso: "",
      diaTrabajoMes: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      postDiagramaTrabajo(values)
        .then(() => {
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

    <Box sx={{ p: 4, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ArrowbackButton />
          <Typography variant="h1">Crear categorías DiagramaTrabajo</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
          </Box>
        </Box>
      </Box>


      <form onSubmit={formik.handleSubmit}>
        <SnackbarAlert
          message={alertMessage}
          type={alertType}
          setAlertMessage={setAlertMessage}
          setAlertType={setAlertType}
        />
        <InputsDiagramaTrabajo formik={formik} />
        <ButtonsCreateUpdate 
        disabled={!formik.isValid || !formik.dirty} 
        
        />
      </form>

      <SnackbarAlert
        message={alertMessage}
        type={alertType}
        setAlertMessage={setAlertMessage}
        setAlertType={setAlertType}
      />

    </Box>
  );
}

export default CrearDiagramaTrabajo;