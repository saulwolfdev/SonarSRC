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
import { fetchCursosById } from "../../../../services/microMaestros/cursosService";
import Spinner from "@/components/shared/Spinner";

export interface ModalEstadoProps {
  open: boolean;
  handleClose: () => void;
  id: number;
  toggleActivation: (isActivated: boolean | undefined, id: number, motivo: string | undefined) => void;
}

const ModalEstado: React.FC<ModalEstadoProps> = ({
  open,
  handleClose,
  id,
  toggleActivation,
}) => {

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [clasificacionNombre, setclasificacionNombre] = useState('')
  const [cantRegistros, setCantRegistros] = useState<number>()
  const [isActivated, setIsActivated] = useState<boolean>()

  const [motivo, setMotivo] = useState('')

  const buscarClasificacionId = async () => {
    const response = await fetchCursosById(id)
    setclasificacionNombre(response.nombre)
    setCantRegistros(response.cantidadRecursosAfectados)
    setIsActivated(response.estado)
    setIsLoading(false)

  };

  useEffect(() => {
    if (id > 0 && open) {
      buscarClasificacionId();
    }
  });

  const handleCancel = () => {
    setMotivo('');
    handleClose();
  };

  const handleAccept = () => {
    toggleActivation(isActivated, id, motivo);
    setMotivo('');
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      {isLoading ? <Spinner /> :

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
              {isActivated ? "Desactivar" : "Activar"} Tipo de licencias prolongadas
            </Typography>



            {/* ACOMODAR */}

            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8
              }}
            >
              <CloseIcon />
            </IconButton>

          </Box>

          <Typography variant="body1" sx={{ ml: 65, mt: 45 }}>
            ¿Estas seguro que quieres {isActivated ? "desactivar " : "activar "}{" "}
            <Box component="span" sx={{ fontWeight: "bold" }}>
              {clasificacionNombre}
            </Box>
            ?
          </Typography>
          {isActivated && cantRegistros && cantRegistros > 0 ? (
            <Typography variant="body1" sx={{ ml: 65, mt: 12 }}>
              Hay
              <Box
                component="span"
                sx={{ color: "primary.main", textDecoration: "underline" }}
              >
                {cantRegistros} registros
              </Box>{" "}
              vinculados a este centro físico. Al desactivar no podrás utilizarlo
              en nuevos registros.
            </Typography>
          ) : null}

          {/* SOLO SI HAY QUE DESCTIVARLO */}
          {isActivated && (
            <Box display="flex" flexDirection="column" alignItems="center">
              <TextField
                label="Comentarios"
                value={motivo}
                onChange={(e) => {
                  if (e.target.value.length <= 250) setMotivo(e.target.value);
                }}
                multiline
                rows={4}
                variant="outlined"
                sx={{ width: '90%', mt: '10px' }}
                inputProps={{ maxLength: 250 }} // Limita a 250 caracteres
              />
              <Typography variant="caption" sx={{ mt: 1, width: '90%', textAlign: 'right' }}>
                {`${motivo.length}/250`}
              </Typography>
            </Box>
          )}




          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 60 }}>
            <Button
              className="MuiButton-secondary"
              variant="contained"
              onClick={handleCancel}
              sx={{ mr: 16 }}
            >
              CANCELAR
            </Button>
            <Button
              className="MuiButton-primary"
              variant="contained"
              onClick={handleAccept}
            >
              {isActivated ? "DESACTIVAR" : "ACTIVAR"}
            </Button>
          </Box>
        </Box>}
    </Modal>
  );
};

export default ModalEstado;
