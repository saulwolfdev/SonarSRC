import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  patchPuestoEmpresa,
  getPuestoEmpresa,
} from "../../../services/microMaestros/puestosEmpresaService";
import { useRouter } from "next/router";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import { InputCreateUpdate } from "./components/InputCreateUpdate";
import Spinner from "@/components/shared/Spinner";

export const EditPuestoEmpresa: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const numericId = typeof id === "string" ? parseInt(id) : undefined;

  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialValues, setInitialValues] = useState({
    nombre: "",
    codigoAfip: "",
  });

  const validationSchema = Yup.object({
    nombre: Yup.string()
      .min(3, "Debe tener entre 3 y 80 caracteres.")
      .max(80, "Debe tener entre 3 y 80 caracteres.")
      .matches(/^[a-zA-Z0-9Ññ\s]*$/, "Solo se permiten letras, números y espacios")
      .required("El nombre es obligatorio"),
    codigoAfip: Yup.string()
      .required("El código AFIP es obligatorio")
      .matches(/^\d+$/, "El código AFIP debe ser numérico")
      .max(10, "El código AFIP debe tener como máximo 10 caracteres"),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      if (numericId !== undefined) {
        try {
          console.log("Enviando datos al patch:", { id: numericId, ...values });
          await patchPuestoEmpresa({
            id: numericId,
            nombre: values.nombre,
            codigoAfip: values.codigoAfip,
          });
          setAlertMessage("Se actualizó con éxito");
          setAlertType(typeAlert.success);
          setTimeout(() => {
            router.back();
          }, 1000);
        } catch (error: any) {
          console.log("Error en patch:", error);
          setAlertMessage(error.errors[0].description);
          setAlertType(typeAlert.error);
        }
      }
    },
  });

  useEffect(() => {
    if (numericId !== undefined) {
      console.log("Fetching data for id:", numericId);
      getPuestoEmpresa(numericId)
        .then((data) => {
          console.log("Datos recibidos del GET:", data);
          setInitialValues({
            nombre: data.nombre || "",
            codigoAfip: data.codigoAfip || "",
          });
        })
        .catch((error) => {
          if(error.errors){
            setAlertMessage(error.errors[0].description);
          }
            else{
          setAlertMessage("Error al cargar los datos");}

          setAlertType(typeAlert.error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [numericId]);

  if (loading) {
    return <Spinner />;
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
          <Typography variant="h1">Editar puesto empresa</Typography>
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

export default EditPuestoEmpresa;
