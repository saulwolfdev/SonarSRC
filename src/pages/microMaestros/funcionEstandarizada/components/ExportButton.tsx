import { IconButton } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { exportFuncionstandarizadaFisico } from "@/services/microMaestros/funcionEstandarizadaService";

const ExportButton = () => {
  const handleExport = async () => {
    try {
      const fileData = await exportFuncionstandarizadaFisico();
      const url = window.URL.createObjectURL(new Blob([fileData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'FuncionesEstandarizadas.xlsx'); // Nombre del archivo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al exportar el archivo", error);
    }
  };

  return (
    <IconButton
      onClick={handleExport}
      sx={{
        backgroundColor: "#fff",
        borderRadius: 50,
        marginTop: 20,
        marginRight: 10,
        width: 30,
        height: 30,
      }}
    >
      <FileDownloadIcon sx={{ color: "#000" }} />
    </IconButton>
  );
};

export default ExportButton;
