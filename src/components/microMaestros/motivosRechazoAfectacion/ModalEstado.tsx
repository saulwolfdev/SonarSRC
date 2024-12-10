import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Spinner from "@/components/shared/Spinner";
import {
  exportMotivoRechazoObjecionAfectacion,
  fetchMotivoRechazoObjecionAfectacionById,
} from "@/services/microMaestros/motivosRechazoAfectacionService";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";

export interface ModalEstadoProps {
  open: boolean;
  handleClose: () => void;
  id: number;
  toggleActivation: (
    isActivated: boolean | undefined,
    id: number,
    motivo: string | undefined
  ) => void;
}

const ModalEstado: React.FC<ModalEstadoProps> = ({
  open,
  handleClose,
  id,
  toggleActivation,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [
    motivoRechazoObjecionAfectacionNombre,
    setMotivoRechazoObjecionAfectacionNombre,
  ] = useState("");
  const [motivo, setMotivo] = useState("");
  const [isActivated, setIsActivated] = useState<boolean>();

  const buscarMotivoRechazoObjecionAfectacionById = async () => {
    const response = await fetchMotivoRechazoObjecionAfectacionById(id);
    setMotivoRechazoObjecionAfectacionNombre(response.nombre);
    setIsActivated(response.estado);
    setIsLoading(false);
  };

  useEffect(() => {
    if (id > 0 && open) {
      buscarMotivoRechazoObjecionAfectacionById();
    }
  }, [id, open]);

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      {isLoading ? (
        <Spinner />
      ) : (
        <Box
          sx={{
            position: "absolute",
            top: "20%",
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 30,
              position: "relative",
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", mb: 16 }}
              id="modal-title"
              variant="h2"
              component="h2"
            >
              {isActivated ? "Desactivar" : "Activar"} motivo de rechazo y/u
              objeción de afectación
            </Typography>

            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              background: "#FFFFFF",
              border: "1px solid #D6D6D68A",
              opacity: 1,
            }}
          >
            <Typography variant="body1" sx={{ ml: 65, mt: 25, mb: 10 }}>
              ¿Estas seguro que quieres{" "}
              {isActivated ? "desactivar " : "activar "}
              <Box component="span" sx={{ fontWeight: "bold" }}>
                {motivoRechazoObjecionAfectacionNombre}
              </Box>{" "}
              ?
            </Typography>
            {isActivated && (
              <>
                <TextField
                  id="motivo"
                  name="motivo"
                  label="Comentario"
                  variant="outlined"
                  multiline
                  rows={3}
                  inputProps={{ maxLength: 250 }}
                  value={motivo}
                  onChange={(event) => {
                    setMotivo(event.target.value);
                  }}
                  sx={{
                    ml: 65,
                    mt: 15,
                    width: { md: "90%" },
                  }}
                />
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  sx={{ pr: { md: 30 }, mb: { md: 25 }, width: { md: "100%" } }}
                >
                  <Typography variant="body1" color="textSecondary">
                    {motivo.length}/250
                  </Typography>
                </Box>
              </>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 30 }}>
            <Button
              className="MuiButton-secondary"
              variant="contained"
              onClick={handleClose}
              sx={{ mr: 16 }}
            >
              CANCELAR
            </Button>
            <Button
              className="MuiButton-primary"
              variant="contained"
              onClick={() => toggleActivation(isActivated, id, motivo)}
              disabled={motivo.length > 250}
            >
              {isActivated ? "DESACTIVAR" : "ACTIVAR"}
            </Button>
          </Box>
        </Box>
      )}
    </Modal>
  );
};

export default ModalEstado;
