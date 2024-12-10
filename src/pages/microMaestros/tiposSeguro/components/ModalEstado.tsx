import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Spinner from "@/components/shared/Spinner";
import { fetchTiposSeguroById } from "@/services/microMaestros/TiposSeguroService";

export interface ModalEstadoTiposSeguroProps {
  open: boolean;
  handleClose: () => void;
  id: number;
  toggleActivation: (isActivated: boolean | undefined, id: number) => void;
}

const ModalEstadoTiposSeguro: React.FC<ModalEstadoTiposSeguroProps> = ({
  open,
  handleClose,
  id,
  toggleActivation,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tipoSeguroNombre, setTipoSeguroNombre] = useState('');
  const [isActivated, setIsActivated] = useState<boolean>();

  const fetchTipoSeguro = async () => {
    const response = await fetchTiposSeguroById(id);
    setTipoSeguroNombre(response.nombre);
    setIsActivated(response.estado);
    setIsLoading(false);
  };

  useEffect(() => {
    if (id > 0 && open) {
      fetchTipoSeguro();
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
              {isActivated ? "Desactivar" : "Activar"} Tipo de Seguro
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ position: "absolute", right: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="body1" sx={{ ml: 65, mt: 45 }}>
            ¿Estás seguro de que quieres {isActivated ? "desactivar " : "activar "}{" "}
            <Box component="span" sx={{ fontWeight: "bold" }}>
              {tipoSeguroNombre}
            </Box>
            ?
          </Typography>
          {/* {isActivated && cantRegistros && cantRegistros > 0 ? ( */}
          {isActivated ? (
          <Typography variant="body1" sx={{ ml: 65, mt: 12 }}>
            Hay{" "}
            <Box
              component="span"
              sx={{ color: "primary.main", textDecoration: "underline" }}
            >
              52 registros
            </Box>{" "}
            vinculados a este centro físico. Al desactivar no podrás utilizarlo
            en nuevos registros.
          </Typography>
        ): null}
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
            onClick={() => toggleActivation(isActivated, id)}
          >
            {isActivated ? "DESACTIVAR" : "ACTIVAR"}
          </Button>
        </Box>
        </Box>
      )}
    </Modal>
  );
};

export default ModalEstadoTiposSeguro;
