import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

interface ModalExportLimitProps {
  open: boolean;
  handleClose: () => void;
}

const ModalExportLimit: React.FC<ModalExportLimitProps> = ({ open, handleClose }) => (
  <Modal open={open} onClose={handleClose}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        width: 400,
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Falló la descarga
      </Typography>
      <Typography variant="body1" mb={4}>
        El límite de registros es de 15,000. Aplica filtros para poder descargar.
      </Typography>
      <Box display="flex" justifyContent="flex-end">
        <Button onClick={handleClose} variant="contained">
          Cerrar
        </Button>
      </Box>
    </Box>
  </Modal>
);

export default ModalExportLimit;
