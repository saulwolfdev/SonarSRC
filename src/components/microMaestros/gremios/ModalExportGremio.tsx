import { typeAlert } from "@/components/shared/SnackbarAlert";
import useLoadingStore from "@/zustand/shared/useLoadingStore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  IconButton,
  Modal,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export interface ModalExportGremioProps {
  open: boolean;
  setOpenExportModal: (bool: boolean) => void;
  type: string;
  getSerchParams: any;
  exportFunctionSimple: any;
  exportFunctionAnidada: any;
  documentNameSimple: string;
  documentNameAnidado: string;
  setAlertMessage: (altert: string) => void;
  setAlertType: (altert: typeAlert) => void;
}

export default function ModalExportGremio({
  open,
  setOpenExportModal,
  type,
  getSerchParams,
  exportFunctionSimple,
  exportFunctionAnidada,
  documentNameSimple,
  documentNameAnidado,
  setAlertMessage,
  setAlertType,
}: ModalExportGremioProps) {
  const [value, setValue] = useState<"soloGremios" | "masiva">("masiva");
  const searchParams = useSearchParams();
  const [isDownloading, setIsDownloading] = useState(false);
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value as "soloGremios" | "masiva");
  };

  const handleExport = async () => {
    setIsDownloading(true);
    useLoadingStore.getState().setLoadingAxios(true)
    try {
      const params = getSerchParams(searchParams);
      const {
        pageSize,
        pageNumber,
        totalPages,
        totalCount,
        ...filteredParams
      } = params;
      let fileBlob: any;
      if (value == "masiva") {
        fileBlob = await exportFunctionAnidada(filteredParams);
      } else {
        fileBlob = await exportFunctionSimple(filteredParams);
      }
      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = url;
      if (value == "masiva") {
        link.setAttribute("download", documentNameAnidado);
      } else {
        link.setAttribute("download", documentNameSimple);
      }
      document.body.appendChild(link);
      link.click();
      link.remove();
      setIsDownloading(false);
      setOpenExportModal(false);
      useLoadingStore.getState().setLoadingAxios(false);

    } catch (error: any) {
      if(error.response.data.errors){
        setAlertMessage(error.response.data.errors[0].description);
      }
        else{
      setAlertMessage("Fallo la descarga. Inténtalo de nuevo más tarde.");
        }
      setAlertType(typeAlert.error);
      setIsDownloading(false);
      setOpenExportModal(false);
      useLoadingStore.getState().setLoadingAxios(false);

    }
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpenExportModal(false)}
      aria-labelledby="modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "193px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "974px",
          bgcolor: "background.paper",
          boxShadow: "4px 4px 10px #D6D6D6",
          border: "1px solid #F5F5F5",
          borderRadius: 4,
          p: 16,
          pb: 32,
          pr: 32,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 30,
            ml: 40,
            mb: 10,
            position: "relative",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }} id="modal-title" variant="h2">
            Descargar
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setOpenExportModal(false)}
            sx={{
              position: "absolute",
              right: 8,
            }}
          >
            <GridCloseIcon />
          </IconButton>
        </Box>
        <Card sx={{ mt: 16, borderRadius: 2, width: "895px", p: 16 }}>
          <CardContent>
            <Typography>Selecciona un nivel de descarga:</Typography>
            <RadioGroup
              defaultValue="masiva"
              value={value}
              onChange={handleRadioChange}
              sx={{ display: "flex", flexDirection: "row", mt: 8, pl: 20 }}
            >
              <FormControlLabel
                value="soloGremios"
                control={<Radio />}
                label={`Solo ${type}`}
              />
              <FormControlLabel
                value="masiva"
                control={<Radio />}
                label="Descarga Masiva"
              />
            </RadioGroup>
          </CardContent>
        </Card>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 24 }}>
          <Button
            variant="outlined"
            onClick={() => setOpenExportModal(false)}
            sx={{ mr: 16 }}
          >
            CANCELAR
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleExport()}
            disabled={isDownloading}
          >
            DESCARGAR
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
