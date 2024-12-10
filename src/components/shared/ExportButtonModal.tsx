import { IconButton } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface ExportButtonProps {
  setOpenExportModal : (bool: boolean) => void
}


export default function ExportButtonModal({ setOpenExportModal }: ExportButtonProps){
 
  return (
    <IconButton
      onClick={() => setOpenExportModal(true)}
      sx={{
        backgroundColor: "#fff",
        borderRadius: 50,
        px: 5,
      }}
    >
      <FileDownloadIcon sx={{ color: "#000" }} />
    </IconButton>
  );
};
