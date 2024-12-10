import { Box, IconButton, Typography } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { typeAlert } from "./SnackbarAlert";

interface ResistrosAsociadosExportProps {
  count: number;
  id: number
  exportFunction: any;
  documentName: string
  setAlertMessage: (message: string) => void
  setAlertType: (alert: typeAlert) => void
}


export default function ResistrosAsociadosExport({id, count, exportFunction, documentName, setAlertMessage, setAlertType }: ResistrosAsociadosExportProps) {
  const handleExport = async () => {
    try {
      const fileBlob = await exportFunction(id);
      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', documentName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error: any) {
      if(error.response.data.errors){
        setAlertMessage(error.response.data.errors[0].description);
      }
        else{
      setAlertMessage("Fallo la descarga. Inténtalo de nuevo más tarde.")
        }
      setAlertType(typeAlert.error)
    }
  };

  return (
    <Box
      component="span"
      sx={{ color: "primary.main", textDecoration: "underline" }}
    >
      <Typography
        variant="body1"
        component="span"
        onClick={handleExport}
      >
        {count} registros {" "}
      </Typography>
    </Box>


  );
};
