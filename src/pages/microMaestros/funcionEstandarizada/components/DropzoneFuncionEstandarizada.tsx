import { useState } from "react";
import { Box, Button, Link, Typography } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
 import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { typeAlert } from "@/components/shared/SnackbarAlert";
import { downloadPlantilla } from "@/services/microMaestros/funcionEstandarizadaService";

interface DragAndDropFuncionEstandarizadaProps {
  setFile: any;
  setAlertMessage: any;
  setAlertType: any;
  handleFileChangeInput: any;
  isUploading: any;
}
export default function DragAndDropFuncionEstandarizada({
  setFile,
  setAlertMessage,
  setAlertType,
  handleFileChangeInput,
  isUploading,
}: DragAndDropFuncionEstandarizadaProps) {
  const [dragActive, setDragActive] = useState(false);
  const allowedExtensions = ".xls,.xlsx,.xlsm,.xlsb";

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0]; 
    const fileExtension = file.name.substring(file.name.lastIndexOf('.'));
    const allowedExtensionsArray = allowedExtensions.split(',')
    
    if (!allowedExtensionsArray.includes(fileExtension.toLowerCase())) {
      setAlertMessage('El archivo debe ser .xls,.xlsx,.xlsm,.xlsb ')
    setAlertType(typeAlert.error)
      return; 
    }

    handleFileChangeInput(e.dataTransfer.files);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      e.dataTransfer.clearData(); // Limpiar los archivos después del drop
    }
  };

  const handleDownloadClick = async () => {
    await downloadPlantilla(setAlertMessage, setAlertType);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 15,
        paddingBottom: 15,
        my: 70,
        border: dragActive ? "2px dashed #1E90FF" : "",
        borderRadius: 4,
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
     <CloudUploadOutlinedIcon sx={{ color: '#81A8EE' , width: '62px', height: '40px'}} />
      <input
        type="file"
        accept=".xls,.xlsx,.xlsm,.xlsb"
        style={{ display: "none" }}
        id="raised-button-file"
        onChange={(event) => {handleFileChangeInput(event.target.files)}}
        disabled={isUploading}
      />
      <Typography variant="body1">
        Haz{" "}
        <label
          htmlFor="raised-button-file"
          style={{ cursor: "pointer", color: "#1E90FF" }}
        >
          click
        </label>{" "}
        para cargar o arrastre y suelte.
      </Typography>

      <Typography
        sx={{
          color: "#5C5C5C",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          mb: 2,
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
          mt: 2,
        }}
      >
        <PictureAsPdfIcon sx={{ mr: 1 }} />
        Descargar plantilla
      </Link>
    </Box>
  );
}
