import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { AreasDetalleResponse, NameGridData } from "@/types/microMaestros/areasTypes";
import { fetchAreasById } from "@/services/microMaestros/areasService";
import Spinner from "@/components/shared/Spinner";
import { log } from "console";

export interface ModalEstadoProps {
  open: boolean;
  handleClose: () => void;
  id: number;
  toggleActivation: (isActivated: boolean | undefined, id:number) => void;
}

const ModalAreas: React.FC<ModalEstadoProps> = ({
  open,
  handleClose,
  id,
  toggleActivation,
}) => {

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [nameNombre, setNameNombre] = useState('')
  const [cantRegistros, setCantRegistros] = useState<number>()
  const [isActivated, setIsActivated] = useState<boolean>()
  
  useEffect(() => {
    if (id > 0) {
      fetchAreasById(id).then((response) => {
        setNameNombre(response.nombre);
        setCantRegistros(response.cantidadRegistros);
        setIsActivated(response.estado);
        setIsLoading(false);
      });
    }
  }, [id]);

   return (
  
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      {isLoading ?  <Spinner/>:
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
             {isActivated ? "Desactivar" : "Activar"} áreas
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
          ¿Estas seguro que quieres {isActivated ? "desactivar " : "activar "}
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {nameNombre}
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
            </Box>
            {" "}vinculados a esta área. Al desactivar no podrás utilizarlo
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
      }
    </Modal> 
    
  );
};

export default ModalAreas;