import React, { useCallback, useState } from "react";
import { Box, Typography, Button, LinearProgress } from "@mui/material";
import {
  downloadPlantilla,
  postFuncionEstandarizada,
  postFuncionEstandarizadaMasiva,
} from "@/services/microMaestros/funcionEstandarizadaService";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import { useFormik, FormikHelpers } from "formik";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { InputCreateUpdateFuncionEstandarizada } from "./components/InputCreateUpdateFuncionEstandarizada";
import ButtonsCrearFuncionEstandarizada from "./components/ButtonsCrearFuncionEstandarizada";
import DragAndDropFuncionEstandarizada from "./components/DropzoneFuncionEstandarizada";
import FileCharged from "./components/FileCharged";
import { FuncionEstandarizadaCargaMasivaResponse } from "@/types/microMaestros/funcionEstandarizadaTypes";
import SwitchCreacionMasiva from "./components/SwitchCreacionMasiva";
import { useRouterPushQuery } from "@/hooks/useRouterPush";

export const CreateFuncionEstandarizada = () => {
  const router = useRouter();
  const routerPushQuery = useRouterPushQuery();

  const [responseErrorEdit, setResponseErrorEdit] = useState<null | FuncionEstandarizadaCargaMasivaResponse>(null);
  const [checked, setChecked] = useState(false);
  const [fileObjects, setFileObjects] = useState<File[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileExtension, setFileExtension] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleFileChange = (newFiles: File[]) => {
    setFileObjects(newFiles);
  };

  const handleFileChangeInput = (
    filesList: FileList | null
  ) => {
    const selectedFile = filesList ? filesList[0] : null;
    setFile(selectedFile);

    if (selectedFile) {
      if (selectedFile.size / (1024 * 1024) > 50) {
        setAlertMessage('El archivo debe pesar menos de 50MB')
        setAlertType(typeAlert.error)
        return;
      }
      // Simular la carga del archivo
      setIsUploading(true);
      setUploadProgress(0);

      const interval = setInterval(() => {
        setUploadProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(interval);
            setIsUploading(false);
            handleFileChange([selectedFile]);
            return oldProgress;
          }
          return Math.min(oldProgress + 30, 100);
        });
      }, 500);

      const sizeInBytes = selectedFile.size;
      setFileSize(formatFileSize(sizeInBytes));
      const name = selectedFile.name;
      const extension = name.slice(((name.lastIndexOf(".") - 1) >>> 0) + 2); // obtener extensión
      const baseName = name.slice(0, name.lastIndexOf(".")); // obtener el nombre del archivo sin la extensión

      setFileName(baseName);
      setFileExtension(extension);
    } else {
      setFileSize(null);
      setFileName(null);
      setFileExtension(null);
    }
  };

  const formatFileSize = (size: number): string => {
    const kb = size / 1024;
    const mb = kb / 1024;
    const gb = mb / 1024;

    if (gb >= 1) {
      return `${gb.toFixed(2)} GB`;
    } else if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    } else {
      return `${kb.toFixed(2)} KB`;
    }
  };

  const handleCancelUpload = () => {
    setFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    handleFileChange([]);
    setResponseErrorEdit(null)
  };

  const handleSwitchClick = () => {
    setChecked((prevChecked) => !prevChecked);
    setFileObjects([]);
    formik.resetForm();
  };

  // Function for massive creation
  const handleCreateMassive = useCallback(async () => {
    setIsCreating(true); // Asegúrate de establecer isCreating en true al iniciar
  
    if (fileObjects.length > 0) {
      const file = fileObjects[0];
      try {
        const response = await postFuncionEstandarizadaMasiva(file);
  
        // Extraer y manejar los datos de la respuesta
        const { cargaMasivaId, cantFuncionesCreadas, cantErrores, funcionesCreadas, errores } = response;
  
        // Redirigir después de la creación exitosa
        routerPushQuery({
          pathname: "/microMaestros/funcionEstandarizada/cargaMasivaResult",
          query: {
            cargaMasivaId,
            cantFuncionesCreadas,
            cantErrores,
            funcionesCreadas: JSON.stringify(funcionesCreadas),
            errores: JSON.stringify(errores),
          },
        });
      } catch (error: any) {
        // Manejar errores
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
      } finally {
        setIsCreating(false); 
      }
    } else {
      setAlertMessage("Por favor, selecciona un archivo para la carga masiva.");
      setAlertType(typeAlert.warning);
      setIsCreating(false); 
    }
  }, [fileObjects, router]);
  

  // Function for individual creation (used by Formik)
  const handleCreateIndividual = async (
    values: { nombre: string },
    formikHelpers: FormikHelpers<{ nombre: string }>
  ) => {
    try {
      await postFuncionEstandarizada({ nombre: values.nombre });
      setAlertMessage("Se guardó con éxito");
      setAlertType(typeAlert.success);
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error: any) {
      const errorResponse = error?.response?.data;
      let errorMessage = "No se pudo crear un nuevo dato, intente más tarde";

      if (errorResponse && errorResponse.errors && Array.isArray(errorResponse.errors)) {
        errorMessage = errorResponse.errors[0]?.description || errorMessage;
      }

      setAlertMessage(errorMessage);
      setAlertType(typeAlert.error);
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };


  const validationSchema = Yup.object({
    nombre: Yup.string()
      .min(3, "Debe tener entre 3 y 80 caracteres.")
      .max(80, "Debe tener entre 3 y 80 caracteres.")
      .matches(/^[a-zA-Z0-9Ññ\s]*$/, "Solo se permiten letras, números y espacios")
      .required("El nombre es obligatorio"),
  });

  const formik = useFormik<{ nombre: string }>({
    validateOnChange: true,
    validateOnBlur: true,
    initialValues: { nombre: "" },
    validationSchema: !checked ? validationSchema : Yup.object(),
    onSubmit: handleCreateIndividual,
  });

  return (
    <Box>
      {/* TITULO */}
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
            <Typography variant="h1">Crear función estandarizada</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <SwitchCreacionMasiva checked={checked} onClick={handleSwitchClick} />
            </Box>
          </Box>
        </Box>
      </Box>

      <SnackbarAlert
        message={alertMessage}
        type={alertType}
        setAlertMessage={setAlertMessage}
        setAlertType={setAlertType}
      />

      {/* BOX DEL MARGEN VISUAL */}
      {!checked ? (
        // Formulario de creación individual
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault(); 
            }
          }}
        >
          <InputCreateUpdateFuncionEstandarizada formik={formik} />
          <ButtonsCrearFuncionEstandarizada disabled={!(formik.isValid && formik.dirty)} />
          </form>
      ) : (
        <Box
          sx={{
            border: "2px #D6D6D68A",
            bordeRadius: "15px",
            opacity: 1,
            mx: 22,
            mb: 40,
            mt: 30,
          }}
        >
          {/* BOTON DE CARGAR */}
          {!isUploading && !file && (
            <DragAndDropFuncionEstandarizada
              setFile={setFile}
              setAlertMessage={setAlertMessage}
              setAlertType={setAlertType}
              handleFileChangeInput={handleFileChangeInput}
              isUploading={isUploading}
            />
          )}

          {/* MIENTRAS CARGA */}
          {isUploading && (
            <Box mt={2} sx={{ width: "40%" }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="caption">{`Cargando: ${uploadProgress}%`}</Typography>
              <Box mt={1}>
                <Button
                  onClick={handleCancelUpload}
                  variant="outlined"
                  color="primary"
                  size="small"
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          )}

          {/* ARCHIVO CARGADO */}
          {file && !isUploading && (
            <FileCharged
              fileName={fileName}
              fileExtension={fileExtension}
              fileSize={fileSize}
              handleCancelUpload={handleCancelUpload}
              response={responseErrorEdit}
            />
          )}
        </Box>
      )}

      {/* BOTONES DE GUARDAR */}
      {checked && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: { md: 40 },
            mb: 15,
          }}
        >
          <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateMassive}
            disabled={fileObjects.length === 0 || isCreating == true}
            sx={{ mt: 2, ml: 10 }}
          >
            Crear
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default CreateFuncionEstandarizada;
