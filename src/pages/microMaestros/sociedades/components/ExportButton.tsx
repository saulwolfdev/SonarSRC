import { IconButton } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { exportSociedades } from "@/services/microMaestros/SociedadesService";
import { ExportButtonProps } from "@/types/microMaestros/sociedadesTypes";


const ExportButton: React.FC<ExportButtonProps> = ({ nombre, origen, codigoSap, estado }) => {
  const handleExport = async () => {
    try {
      const fileBlob = await exportSociedades(nombre, origen, codigoSap, estado);
      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Sociedades.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al exportar el archivo', error);
    }
  };

  return (
    <IconButton
      onClick={handleExport}
      sx={{
        backgroundColor: "#fff",
        borderRadius: 50,
        marginTop: 20,
        marginRight: -11,
        width: 30,
        height: 30,
      }}
    >
      <FileDownloadIcon sx={{ color: "#000" }} />
    </IconButton>
  );
};

export default ExportButton;
