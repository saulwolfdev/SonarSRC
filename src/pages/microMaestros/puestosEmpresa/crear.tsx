import React, { useCallback, useState } from "react";
import { Box, Typography, Button, Link } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SwitchCreacionMasiva from "./components/SwitchCreacionMasiva";
import MuiFileUploader from "./components/DropzonePuestosEmpresa";
import {
  downloadPlantillaPuestosEmpresa,
  postPuestoEmpresa,
  postPuestosEmpresaMasiva,
} from "../../../services/microMaestros/puestosEmpresaService";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import { useFormik, FormikHelpers } from "formik";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { PuestoEmpresaCargaMasivaResponse } from "../../../types/microMaestros/puestosEmpresaTypes";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import { InputCreateUpdate } from "./components/InputCreateUpdate";
import { useRouterPush } from "@/hooks/useRouterPush";

export const CreatePuestosEmpresa = () => {
  const router = useRouter();
  const routerPush = useRouterPush();

  const [checked, setChecked] = useState(false);
  const [fileObjects, setFileObjects] = useState<File[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const handleFileChange = (newFiles: File[]) => {
    setFileObjects(newFiles);
  };

  const handleSwitchClick = () => {
    setChecked((prevChecked) => !prevChecked);
    setFileObjects([]);
    formik.resetForm();
  };

  const handleDownloadClick = async () => {
    await downloadPlantillaPuestosEmpresa(setAlertMessage, setAlertType);
  };

  // Function for massive creation
  const handleCreateMassive = useCallback(async () => {
    if (fileObjects.length > 0) {
      // Massive creation
      const file = fileObjects[0];
      try {
        const response = await postPuestosEmpresaMasiva(file);
  
        // Redirigir a la página de la grilla de puestos empresa después de la carga masiva exitosa
        routerPush("/microMaestros/puestosEmpresa");
  
      } catch (error: any) {
        if (error.errors) {
          const validationErrors = error.errors
            .map((err: { errorMessage: string }) => err.errorMessage)
            .join(", ");
          setAlertMessage(validationErrors);
          setAlertType(typeAlert.error);
        } else {
          setAlertMessage("No se pudo completar la carga masiva, intente más tarde");
          setAlertType(typeAlert.error);
        }
      }
    } else {
      setAlertMessage("Por favor, selecciona un archivo para la carga masiva.");
      setAlertType(typeAlert.warning);
    }
  }, [fileObjects, router]);

  // Function for individual creation (used by Formik)
  const handleCreateIndividual = async (
    values: { nombre: string; codigoAfip: string },
    formikHelpers: FormikHelpers<{ nombre: string; codigoAfip: string }>
  ) => {
    postPuestoEmpresa({
      nombre: values.nombre,
      codigoAfip: values.codigoAfip,
    })
      .then(() => {
        setAlertMessage("Se guardó con éxito");
        setAlertType(typeAlert.success);
        setTimeout(() => {
          router.back();
        }, 1000);
      })
      .catch((error: any) => {
        if (error.errors) {
          setAlertMessage(error.response.data.errors[0].description);
          setAlertType(typeAlert.error);
        } else {
          setAlertMessage("No se pudo crear un nuevo dato, intente más tarde");
          setAlertType(typeAlert.error);
        }
      })
      .finally(() => {
        formikHelpers.setSubmitting(false);
      });
  };

  const validationSchema = Yup.object({
    nombre: Yup.string()
      .min(3, "Debe tener entre 3 y 80 caracteres.")
      .max(80, "Debe tener entre 3 y 80 caracteres.")
      .matches(
        /^[a-zA-Z0-9Ññ\s]*$/,
        "Solo se permiten letras, números y espacios"
      )
      .required("El nombre es obligatorio"),
    codigoAfip: Yup.string()
      .required("El código AFIP es obligatorio")
      .matches(/^\d+$/, "El código AFIP debe ser numérico")
      .max(10, "El código AFIP debe tener como máximo 10 caracteres"),
  });

  const formik = useFormik<{ nombre: string; codigoAfip: string }>({
    validateOnChange: true,
    validateOnBlur: true,
    initialValues: { nombre: "", codigoAfip: "" },
    validationSchema: !checked ? validationSchema : Yup.object(),
    onSubmit: handleCreateIndividual,
  });

  return (
    <Box sx={{ p: 4, margin: "0 auto", pb: 30 }}>
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
          <Typography variant="h1">Crear puesto empresa</Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SwitchCreacionMasiva
              checked={checked}
              onClick={handleSwitchClick}
            />
          </Box>
        </Box>
      </Box>

      {!checked ? (
        // Individual creation form
        <form onSubmit={formik.handleSubmit}>
          <InputCreateUpdate formik={formik} />
          <ButtonsCreateUpdate 
          disabled={!(formik.isValid && formik.dirty)} 
          
          />
        </form>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            m: 60,
          }}
        >
          <Box sx={{ width: "50%", display: "contents" }}>
            <MuiFileUploader onFileChange={handleFileChange} />
          </Box>
          <Typography
            sx={{
              color: "#5C5C5C",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              m: 8,
            }}
            variant="body1"
          >
            Tamaño máximo de archivo: 50MB. Solo archivos .xlsx, .xlsm, .xlsb.
          </Typography>
          <Link
            component="button"
            onClick={handleDownloadClick}
            sx={{
              color: "#81A8EE",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              mt: 8,
            }}
          >
            <PictureAsPdfIcon sx={{ mr: 1 }} />
            Descargar plantilla
          </Link>
          <Box mt={20} display="flex" gap={10} alignItems="center">
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateMassive}
              disabled={fileObjects.length === 0}
              sx={{ mt: 2 }}
            >
              Guardar
            </Button>          
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CreatePuestosEmpresa;
