import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Spinner from "@/components/shared/Spinner";
import { fetchTipoUnidadById } from "@/services/microMaestros/tiposUnidadesService";

interface ModalEstadoProps {
  open: boolean;
  handleClose: () => void;
  id: number;
  toggleActivation: (isActivated: boolean | undefined, id: number, comentario?: string) => void;
}

const ModalEstado: React.FC<ModalEstadoProps> = ({ open, handleClose, id, toggleActivation }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nombreTipoUnidad, setNombreTipoUnidad] = useState("");
  const [isActivated, setIsActivated] = useState<boolean | undefined>();
  const [comentario, setComentario] = useState("");
  const [cantRegistros, setCantRegistros] = useState<number | null>(null);

  const buscarTipoUnidad = async () => {
    try {
      const response = await fetchTipoUnidadById(id);

      if (response) {
        setNombreTipoUnidad(response.nombre);
        setIsActivated(response.estado);
        // setCantRegistros(response.cantRegistros || null); 
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener el tipo de unidad:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id > 0 && open) {
      buscarTipoUnidad();
    }
  }, [id, open]);

  const handleSubmit = () => {
    if (isActivated === true && comentario.trim() === "") {
      alert("El campo motivo es obligatorio para desactivar.");
      return;
    }

    toggleActivation(isActivated, id, comentario.trim() || undefined);
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      {isLoading ? (
        <Spinner />
      ) : (
        <Box
          sx={{
            position: "absolute",
            top: "350px",
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
              position: "relative",
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", mb: 16 }}
              id="modal-title"
              variant="h2"
              component="h2"
            >
              {isActivated === true ? "Desactivar" : "Activar"} Tipo de Unidad
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

          <Typography variant="body1" sx={{ ml: 65, mt: 45 }}>
            ¿Estás seguro que quieres {isActivated ? "desactivar" : "activar"}{" "}
            <Box component="span" sx={{ fontWeight: "bold" }}>
              {nombreTipoUnidad}
            </Box>
            ?
          </Typography>

          {isActivated ? (
            <Typography variant="body1" sx={{ ml: 65, mt: 12 }}>
              Hay{" "}
              <Box
                component="span"
                sx={{ color: "primary.main", textDecoration: "underline" }}
              >
                {cantRegistros}52 registros
              </Box>{" "}
              vinculados a este tipo de unidad. Al desactivar, no podrás utilizarlo en nuevos registros.
            </Typography>
          ) : null}

          {isActivated && (
            <Box>
              <TextField
                label="Comentario *"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                inputProps={{ maxLength: 250 }}
                helperText={`${comentario.length}/250`}
                FormHelperTextProps={{ sx: { textAlign: "right", margin: 0 } }}
                sx={{ mt: 12 }}
              />
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 60 }}>
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
              onClick={handleSubmit}
              disabled={isActivated === true && comentario.trim() === ""}
            >
              {isActivated === true ? "DESACTIVAR" : "ACTIVAR"}
            </Button>
          </Box>
        </Box>
      )}
    </Modal>
  );
};

export default ModalEstado;
