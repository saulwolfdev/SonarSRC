import { IconButton } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { typeAlert } from "./SnackbarAlert";
import useLoadingStore from "@/zustand/shared/useLoadingStore";

interface ExportButtonProps {
  getSerchParams: any;
  exportFunction: any;
  documentName: string;
  setAlertMessage: (message: string) => void;
  setAlertType: (alert: typeAlert) => void;
}

export default function ExportButton({
  getSerchParams,
  exportFunction,
  documentName,
  setAlertMessage,
  setAlertType,
}: ExportButtonProps) {
  const handleExport = async () => {
    useLoadingStore.getState().setLoadingAxios(true);
    try {
      const params = getSerchParams();
      const {
        pageSize,
        pageNumber,
        totalPages,
        totalCount,
        ...filteredParams
      } = params;
      const fileBlob = await exportFunction(filteredParams);
      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", documentName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      useLoadingStore.getState().setLoadingAxios(false);
    } catch (error: any) {
      if (error.errors) {
        setAlertMessage(error.response.data.errors[0].description);
      } else {
        setAlertMessage("Fallo la descarga. Inténtalo de nuevo más tarde.");
      }
      setAlertType(typeAlert.error);
      useLoadingStore.getState().setLoadingAxios(false);
    }
  };

  return (
    <IconButton
      onClick={handleExport}
      sx={{
        backgroundColor: "#fff",
        borderRadius: 50,
        px: 5,
      }}
    >
      <FileDownloadIcon sx={{ color: "#000" }} />
    </IconButton>
  );
}
