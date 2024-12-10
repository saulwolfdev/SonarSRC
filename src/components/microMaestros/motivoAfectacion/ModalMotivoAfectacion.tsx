import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Spinner from "@/components/shared/Spinner";
import { fetchMotivoAfectacion } from "@/services/microMaestros/motivoAfectacionService";
import { MotivoAfectacionFiltradoRequest } from "@/types/microMaestros/motivoAfectacionTypes";

export interface ModalEstadoProps {
  open: boolean;
  handleClose: () => void;
  id: number;
  toggleActivation: (isActivated: boolean | undefined, id: number, motivo: string) => void;
}

const ModalMotivoAfectacion: React.FC<ModalEstadoProps> = ({
  open,
  handleClose,
  id,
  toggleActivation,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nameNombre, setNameNombre] = useState('');
  const [cantRegistros, setCantRegistros] = useState<number>();
  const [isActivated, setIsActivated] = useState<boolean>();
  const [motivo, setComentario] = useState<string>('');
  const [error, setError] = useState<string>('');

  const maxChars = 250;
  const minChars = 20;

  const buscarFuncEstId = async () => {
    const filtrosAplicados: MotivoAfectacionFiltradoRequest = {
      id: id || undefined,
    };
    const response = await fetchMotivoAfectacion(filtrosAplicados);
    setNameNombre(response.data[0].motivoDeAfectacion?.toString() || '');
    setCantRegistros(response.data.length);
    setIsActivated(response.data[0].estado);
    setIsLoading(false);
  };

  useEffect(() => {
    if (id > 0) {
      buscarFuncEstId();
    }
  }, [id]);

  const validateComentario = (value: string) => {
    // Verificar si cumple las reglas
    const sameCharRepeated = /(.)\1{2,}/; // Tres caracteres consecutivos iguales
    const sameWordRepeated = /\b(\w+)\b(?:.*?\b\1\b)+/i; // Misma palabra repetida
    const spacesRepeated = / {2,}/; // Espacios consecutivos

    if (value.length < minChars) return `Debe tener al menos ${minChars} caracteres.`;
    if (value.length > maxChars) return `No puede exceder ${maxChars} caracteres.`;
    if (sameCharRepeated.test(value)) return "No se permite el mismo carácter repetido.";
    if (spacesRepeated.test(value)) return "No se permiten espacios repetidos.";
    if (sameWordRepeated.test(value)) return "No se permiten palabras repetidas.";
    if (!/^[\w\sáéíóúÁÉÍÓÚñÑ.,!?]+$/.test(value)) return "Solo se permiten caracteres alfanuméricos.";

    return ""; // Sin errores
  };

  const handleComentarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const validationError = validateComentario(value);
    setComentario(value);
    setError(validationError);
  };

  const handleConfirm = () => {
    if (!motivo || error) {
      setError("Por favor, ingrese un comentario válido.");
      return;
    }
    toggleActivation(isActivated, id, motivo);
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      {isLoading ? (
        <Spinner />
      ) : (
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
            <Typography id="modal-title" variant="h1">
              {isActivated ? "Desactivar" : "Activar"} Motivos de afectación
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
            ¿Estas seguro que quieres {isActivated ? "desactivar " : "activar "}
            <Box component="span" sx={{ fontWeight: "bold" }}>
              {nameNombre}
            </Box>
            ?
          </Typography>
          {isActivated && cantRegistros && cantRegistros > 0 && (
            <Typography variant="body1" sx={{ ml: 65, mt: 12 }}>
              Hay{" "}
              <Box
                component="span"
                sx={{ color: "primary.main", textDecoration: "underline" }}
              >
                {cantRegistros} registros
              </Box>{" "}
              vinculados a esta clasificación. Al desactivar no podrás utilizarlo
              en nuevos registros.
            </Typography>
          )}

          {isActivated && (
            <>
              <TextField
                label="Comentario (obligatorio)"
                variant="outlined"
                fullWidth
                value={motivo}
                onChange={handleComentarioChange}
                inputProps={{ maxLength: maxChars }}
                multiline
                rows={4}
                sx={{ mt: 24, mb: 8 }}
                error={!!error}
                helperText={error}
              />
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ textAlign: "right", mb: 16 }}
              >
                {motivo.length}/{maxChars}
              </Typography>
            </>
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
              onClick={handleConfirm}
              disabled={!!error || !motivo}
            >
              {isActivated ? "DESACTIVAR" : "ACTIVAR"}
            </Button>
          </Box>
        </Box>
      )}
    </Modal>
  );
};

export default ModalMotivoAfectacion;
