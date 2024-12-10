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
import { fetchCantidadContratosAsociados, fetchSociedadesById } from "@/services/microMaestros/SociedadesService";
import Spinner from "@/components/shared/Spinner";


import { ModalEstadoProps } from "@/types/microMaestros/sociedadesTypes";

const ModalEstado: React.FC<ModalEstadoProps> = ({
  open,
  handleClose,
  id,
  toggleActivation,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nombreSociedad, setNombreSociedad] = useState('');
  const [cantRegistros, setCantRegistros] = useState<number | undefined>();
  const [isActivated, setIsActivated] = useState<boolean | undefined>();
  const [comentario, setComentario] = useState('');

  const buscarSociedad = async () => {
    try {
      const response = await fetchSociedadesById(id);
      const cantidadContratos = await fetchCantidadContratosAsociados(id);
  
      if (response) {
        setNombreSociedad(response.nombre);
        setCantRegistros(cantidadContratos);
        setIsActivated(response.estado);
      }
  
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener la sociedad:", error);
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    if (id > 0 && open) {
      setComentario('');
      buscarSociedad();
    }
  }, [id, open]);

  const handleSubmit = () => {
    if (isActivated === true && comentario.trim() === '') {
      alert('El campo motivo es obligatorio para desactivar.');
      return;
    }

    toggleActivation(isActivated, id, comentario);
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      {isLoading ? <Spinner /> :
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
              {isActivated === true ? "Desactivar" : "Activar"} sociedades
            </Typography>

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
            ¿Estas seguro que quieres {isActivated === true ? "desactivar" : "activar"}{" "}
            <Box component="span" sx={{ fontWeight: "bold" }}>
              {nombreSociedad}
            </Box>
            ?
          </Typography>

          {isActivated === true ? (
          <Box>
            <Typography variant="body1" sx={{ ml: 65, mt: 12 }}>
              Hay{" "}
              <Box
                component="span"
                sx={{ 
                  color: "primary.main", 
                  textDecoration: "underline", 
                  cursor: "pointer",
                  '&:hover': {
                    color: "primary.dark",
                  }
                }}
                // TODO: Implementar funcionalidad de descarga de reporte tanto en back como en front.
                // onClick={() => alert('Descargar reporte')}
              >
                {cantRegistros} registros
              </Box>{" "}
              vinculados a esta sociedad. Al desactivar no podrás utilizarlo en nuevos registros.
            </Typography>
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
              FormHelperTextProps={{ sx: { textAlign: 'right', margin: 0 } }}
              sx={{ mt: 12 }}
            />
          </Box>
          ) : null}


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
              disabled={isActivated === true && comentario.trim() === ''}
            >
              {isActivated === true ? "DESACTIVAR" : "ACTIVAR"}
            </Button>
          </Box>
        </Box>
      }
    </Modal>
  );
};

export default ModalEstado;
