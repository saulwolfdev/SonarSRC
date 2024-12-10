import React, { useState } from "react";
import { Button, LinearProgress, Box, Typography, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CancelIcon from "@mui/icons-material/Cancel";

interface MuiFileUploaderProps {
  onFileChange: (newFiles: File[]) => void;
}

export const MuiFileUploader: React.FC<MuiFileUploaderProps> = ({ onFileChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);

    if (selectedFile) {
      // Simular la carga del archivo
      setIsUploading(true);
      setUploadProgress(0);

      const interval = setInterval(() => {
        setUploadProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(interval);
            setIsUploading(false);
            onFileChange([selectedFile]);
            return oldProgress;
          }
          return Math.min(oldProgress + 30, 100);
        });
      }, 500);
    }
  };

  const handleCancelUpload = () => {
    setFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    onFileChange([]); 
  };

  return (
    <>
      <input
        type="file"
        accept=".xls,.xlsx"
        style={{ display: "none" }}
        id="raised-button-file"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {!isUploading && !file && (
        <label htmlFor="raised-button-file">
          <Button component="span" variant="contained" startIcon={<CloudUploadIcon />}>
            CARGAR
          </Button>
        </label>
      )}

      {file && (
        <Box mt={2} display="flex" alignItems="center">
          <InsertDriveFileIcon style={{ color: "#1E90FF", marginRight: "8px" }} />
          <Typography variant="body1">{file.name}</Typography>
          <IconButton onClick={handleCancelUpload} color="primary">
            <CancelIcon />
          </IconButton>
        </Box>
      )}

      {isUploading && (
        <Box mt={2}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption">{`Cargando: ${uploadProgress}%`}</Typography>
          <Box mt={1}>
            <Button onClick={handleCancelUpload} variant="outlined" color="primary" size="small">
              Cancelar
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default MuiFileUploader;
