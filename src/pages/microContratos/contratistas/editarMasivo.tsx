import {
  Box,
  Typography,
  Link,
  Button,
  LinearProgress,
  IconButton,
} from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { PuestoEmpresaCargaMasivaResponse } from "../../../types/microMaestros/puestosEmpresaTypes";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import DragAndDropContratista from "@/components/microContratos/contratistas/editarMasivo/DragAndDropContratistas";
import FileCharged from "@/components/microContratos/contratistas/editarMasivo/FileCharged";
import { putContratistaMasiva } from "@/services/microContratos/contratistasService";
import { ContratistasCargaMasivaResponse } from "@/types/microContratos/contratistasTypes";
import { useRouterPush } from "@/hooks/useRouterPush";
import { useRouter } from "next/router";


export default function EditarContratistaMasiva() {
  const router = useRouter();
  const routerPush = useRouterPush();

  const [responseErrorEdit, setResponseErrorEdit] =   useState<null | ContratistasCargaMasivaResponse>(null);
  const [fileObjects, setFileObjects] = useState<File[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileExtension, setFileExtension] = useState<string | null>(null);

  const handleFileChange = (newFiles: File[]) => {
    setFileObjects(newFiles);
  };

  const handleEditeMassive = useCallback(async () => {
    if (fileObjects.length > 0) {
      const file = fileObjects[0];
      try {
        const response = await putContratistaMasiva(file);
        if(response.cantidadErrores == 0){
        routerPush("/microContratos/contratistas");
        }else{
          setResponseErrorEdit({
              id:  response.id,
              cantidadCreados:  response.cantidadCreados,
              cantidadErrores:  response.cantidadErrores,
              errores: response.errores ,
          });
        }

      } catch (error: any) {
      
        if (error.errors) {
          const validationErrors = error.errors
            .map((err: any) => err.description)
            .join(", ");
          setAlertMessage(validationErrors);
          setAlertType(typeAlert.error);
        } 
        else {
          setAlertMessage(
            "No se pudo completar la carga masiva, intente más tarde"
          );
          setAlertType(typeAlert.error);
        }
      }
    } else {
      setAlertMessage("Por favor, selecciona un archivo para la carga masiva.");
      setAlertType(typeAlert.warning);
    }
  }, [fileObjects, router]);

  const handleFileChangeInput = (
    filesList: FileList | null
  ) => {
    const selectedFile = filesList ? filesList[0] : null;
    setFile(selectedFile);

    if (selectedFile) {
        if(selectedFile.size / (1024 * 1024) > 50){
            setAlertMessage('El archivo debe pesar menos de 50MB')
            setAlertType(typeAlert.error)
            return ;
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
            <Typography variant="h1">Editar masivo contratistas</Typography>
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
          <DragAndDropContratista
            setFile={setFile}
            setAlertMessage={setAlertMessage}
            setAlertType={setAlertType}
            handleFileChangeInput={handleFileChangeInput}
            isUploading={isUploading}
          />
        )}

        {/* MIENTRAS CARGA  */}
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

        {/* ARCHIVO CARGADO*/}
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

      {/* BOTONES DE GUARDAR */}
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
          onClick={handleEditeMassive}
          disabled={fileObjects.length === 0}
          sx={{ mt: 2, ml: 10 }}
        >
          Guardar
        </Button>
      </Box>
    </Box>

    
  );
}
