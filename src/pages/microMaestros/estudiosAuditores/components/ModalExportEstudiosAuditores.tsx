import React, { useState } from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    FormControlLabel,
    Radio,
    RadioGroup,
    CardContent,
} from "@mui/material";
import { typeAlert } from "@/components/shared/SnackbarAlert";
import { exportEstudioAuditor, exportEstudioAuditorMasivo } from "@/services/microMaestros/EstudioAuditoresService";
import { EstudioAuditorFiltradoRequest } from "@/types/microMaestros/estudiosAuditoresTypes";

interface ModalExportEstudiosAuditoresProps {
    open: boolean;
    handleClose: () => void;
    setAlertMessage: (message: string) => void;
    setAlertType: (type: typeAlert) => void;
    query: EstudioAuditorFiltradoRequest;
}

const ModalExportEstudiosAuditores: React.FC<ModalExportEstudiosAuditoresProps> = ({
    open,
    handleClose,
    setAlertMessage,
    setAlertType,
    query,
}) => {
    const [downloadOption, setDownloadOption] = useState<string>("solo");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDownloadOption(event.target.value);
    };

    const handleDownload = () => {
        setIsLoading(true);
        const exportFunction = downloadOption === "solo" ? exportEstudioAuditor : exportEstudioAuditorMasivo;

        exportFunction(query)
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `estudio_auditor_${downloadOption}.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
                setAlertMessage("¡Exportación exitosa!");
                setAlertType(typeAlert.success);
            })
            .catch((error) => {
                if(error.response.data.errors){
                  setAlertMessage(error.response.data.errors[0].description);
                }
                  else{
                setAlertMessage("Error al exportar. Inténtalo de nuevo.");
                  }
                setAlertType(typeAlert.error);
            })
            .finally(() => {
                setIsLoading(false);
                handleClose();
            });
    };

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
            <Box
                sx={{
                    position: "absolute",
                    top: "193px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "974px",
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    border: "1px solid #D6D6D68A",
                    p: 16,
                    pl: 32,
                    pr: 32,
                }}
            >

                <Typography
                    sx={{ fontWeight: "bold", mb: 16 }}
                    id="modal-title"
                    variant="h6"
                    component="h2"
                >
                    Descargar
                </Typography>

                <Box sx={{ mt: 16, borderRadius: 2, width: "895px", p: 16 }}>
                    <CardContent>
                        <Typography>Seleccionar nivel de descarga:</Typography>
                        <RadioGroup
                            value={downloadOption}
                            onChange={handleRadioChange}
                            sx={{ display: "flex", flexDirection: "row", mt: 8, pl: 20 }}
                        >
                            <FormControlLabel
                                value="solo"
                                control={<Radio />}
                                label="Solo estudios auditores"
                            />
                            <FormControlLabel
                                value="masiva"
                                control={<Radio />}
                                label="Descarga Masiva"
                            />
                        </RadioGroup>
                    </CardContent>
                </Box>


                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 24 }}>
                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        sx={{ mr: 16 }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDownload}
                        disabled={isLoading}
                    >
                        {isLoading ? "Descargando..." : "Descargar"}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalExportEstudiosAuditores;
