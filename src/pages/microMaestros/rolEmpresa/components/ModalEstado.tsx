import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Spinner from "@/components/shared/Spinner";
import { useState, useEffect } from "react";
import { fetchRolEmpresaById } from "@/services/microMaestros/RolEmpresaService";

interface ModalEstadoProps {
  open: boolean;
  handleClose: () => void;
  id: number;
  toggleActivation: (isActivated: boolean | undefined, id: number) => void;
}

const ModalEstado: React.FC<ModalEstadoProps> = ({
  open,
  handleClose,
  id,
  toggleActivation,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState<boolean | undefined>();

  useEffect(() => {
    if (id && open) {
      fetchRolEmpresaById(id)
        .then((response) => {
          setNombre(response.nombre);
          setEstado(response.estado);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
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
          <Box sx={{display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 30,
              ml: 40,
              position: "relative",
               }}>
            <Typography
              sx={{ fontWeight: "bold", mb: 16 }}
              id="modal-title"
              variant="h1"
              component="h2"
            >
              {estado ? "Desactivar" : "Activar"} Rol Empresa
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body1" sx={{ ml: 65, mt: 45 }}>
            ¿Estás seguro de que quieres {estado ? "desactivar" : "activar"} el rol{" "}
            <strong>{nombre}</strong>?
          </Typography>
          {/* {isActivated && cantRegistros && cantRegistros > 0 ? ( */}
          {estado ? (
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
            onClick={() => toggleActivation(estado, id)}
          >
              {estado ? "DESACTIVAR" : "ACTIVAR"}
          </Button>
          </Box>
        </Box>
      )}
    </Modal>
  );
};

export default ModalEstado;
