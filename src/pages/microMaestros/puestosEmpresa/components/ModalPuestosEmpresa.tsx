import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  PuestoEmpresaDetalleResponse,
} from "@/types/microMaestros/puestosEmpresaTypes";
import { fetchPuestoEmpresaById } from "../../../../services/microMaestros/puestosEmpresaService";
import Spinner from "@/components/shared/Spinner"; // Asegúrate de importar el Spinner correcto

export interface ModalEstadoProps {
  open: boolean;
  handleClose: () => void;
  id: number;
  toggleActivation: (isActivated: boolean | undefined, id: number) => void;
}

const ModalPuestosEmpresa: React.FC<ModalEstadoProps> = ({
  open,
  handleClose,
  id,
  toggleActivation,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nombre, setNombre] = useState("");
  const [isActivated, setIsActivated] = useState<boolean>(false); // Inicializamos en false

  const buscarPuestoEmpresaId = async () => {
    const response: PuestoEmpresaDetalleResponse = await fetchPuestoEmpresaById(id);
    console.log("Response:", response); // Para depuración
    console.log("Estado:", response.estado); // Verificar el valor de estado
    setNombre(response.nombre);
    setIsActivated(response.estado); // Asegúrate de que es un booleano
    setIsLoading(false);
  };

  useEffect(() => {
    if (id > 0 && open) {
      buscarPuestoEmpresaId();
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
            <Typography
              sx={{ fontWeight: "bold", mb: 16 }}
              id="modal-title"
              variant="h2"
              component="h2"
            >
              {isActivated ? "Desactivar" : "Activar"} puesto empresa
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
            ¿Estás seguro que quieres{" "}
            {isActivated ? "desactivar " : "activar "}
            <Box component="span" sx={{ fontWeight: "bold" }}>
              {nombre}
            </Box>
            ?
          </Typography>

          {/* Si necesitas mostrar información adicional cuando está activado */}
          {isActivated && (
            <Typography variant="body1" sx={{ ml: 65, mt: 12 }}>
              Al desactivar no podrás utilizarla en nuevos registros.
            </Typography>
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

export default ModalPuestosEmpresa;
