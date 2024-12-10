import { IconButton } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { exportContratistas } from "@/services/microContratos/contratistasService";
import { ContratistasFiltradosRequest } from "@/types/microContratos/contratistasTypes";

interface ExportButtonProps {
  getSerchParams: () => ContratistasFiltradosRequest
}

export default function ExportButton({ getSerchParams }: ExportButtonProps) {
  const handleExport = async () => {
    try {
      const params = getSerchParams()
      const fileBlob = await exportContratistas(params);
      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Contratistas.xlsx');
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
        marginRight: 10,
        width: 30,
        height: 30,
      }}
    >
      <FileDownloadIcon sx={{ color: "#000" }} />
    </IconButton>
  );
};
