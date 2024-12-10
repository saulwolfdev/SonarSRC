import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

interface ModalErrorDescargaProps {
  open: boolean;
  handleClose: () => void;
}

const ModalErrorDescarga: React.FC<ModalErrorDescargaProps> = ({ open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Falló la descarga
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          El límite de registros es de 15,000. Aplica filtros para poder descargar.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleClose} variant="contained">
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalErrorDescarga;
