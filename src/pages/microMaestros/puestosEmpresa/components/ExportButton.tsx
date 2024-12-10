import { Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { exportPuestosEmpresa } from "../../../../services/microMaestros/puestosEmpresaService";

interface ExportButtonProps {
  getSearchParams: () => any;
  setAlertMessage: (message: string) => void;
  setAlertType: (type: any) => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  getSearchParams,
  setAlertMessage,
  setAlertType,
}) => {
  const handleExport = async () => {
    try {
      const query = getSearchParams();
      const fileData = await exportPuestosEmpresa(query);
      const url = window.URL.createObjectURL(new Blob([fileData]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "PuestosEmpresa.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al exportar el archivo", error);
      setAlertMessage("Error al exportar el archivo");
      setAlertType("error");
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant="contained"
      startIcon={<FileDownloadIcon />}
    >
      Exportar
    </Button>
  );
};

export default ExportButton;
