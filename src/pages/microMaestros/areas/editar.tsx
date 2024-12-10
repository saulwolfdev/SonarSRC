import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { patchAreas, getAreas, fetchAreasById } from "@/services/microMaestros/areasService"; // Asegúrate de importar correctamente
import { useRouter } from "next/router";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import CancelButton from "@/components/shared/CancelButton";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import { AreasResponse } from "@/types/microMaestros/areasTypes";
import {InputCreateUpdate} from "./components/InputCreateUpdate";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import Spinner from "@/components/shared/Spinner";


export const EditAreas: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const numericId = typeof id === "string" ? parseInt(id) : undefined;

  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (numericId !== undefined) {
      // Llamada al servicio para obtener la area
      fetchAreasById(numericId)
        .then((data: AreasResponse) => {
          formik.setValues({ nombre: data.nombre }); // Actualizamos el nombre en el formik
        })
        .catch((error) => {
          setAlertMessage("Error al cargar los datos");
          setAlertType(typeAlert.error);
        })
        .finally(() => {
          setLoading(false); // Ya cargó la data, quitamos el estado de loading
        });
    }
  }, [numericId]);

  const validationSchema = Yup.object({
    nombre: Yup.string()
      .min(3, "Debe tener entre 3 y 80 caracteres.")
      .max(80, "Debe tener entre 3 y 80 caracteres.")
      .matches(
        /^[a-zA-Z0-9Ññ\s]*$/,
        "Solo se permiten letras, números y espacios"
      )
      .required("El nombre es obligatorio"),
  });

  const formik = useFormik({
    validateOnChange: true,
    validateOnBlur: true,
    initialValues: {
      nombre: "", // El valor se actualizará cuando se reciba la respuesta del endpoint
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (numericId !== undefined) {
        try {
          console.log("Sending data:", {
            id: numericId,
            nombre: values.nombre,
          });
          await patchAreas({ id: numericId, nombre: values.nombre });
          setAlertMessage("Se actualizó con éxito");
          setAlertType(typeAlert.success);
          setTimeout(() => {
            router.back();
          }, 1000);
        } catch (error: any) {
          if(error.errors){
            setAlertMessage(error.errors[0].description);
            setAlertType(typeAlert.error);
          }
        }
      }
    },
  });

  if (loading) {
    return <Spinner />
  }

  return (
    <Box sx={{ p: 4, margin: "0 auto" }}>
      <SnackbarAlert
        message={alertMessage}
        type={alertType}
        setAlertMessage={setAlertMessage}
        setAlertType={setAlertType}
      />
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
          <Typography variant="h1">Editar area</Typography>
        </Box>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <InputCreateUpdate formik={formik} />
        <ButtonsCreateUpdate 
        disabled={!(formik.isValid && formik.dirty)} 
        isEdit={true}
        />
      </form>
    </Box>
  );
};

export default EditAreas;
