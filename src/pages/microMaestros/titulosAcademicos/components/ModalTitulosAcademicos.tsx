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
import { TitulosAcademicosFiltradoRequest } from "@/types/microMaestros/TitulosAcademicosTypes";
import { fetchTitulosAcademicos } from "../../../../services/microMaestros/TitulosAcademicosService";

export interface ModalEstadoProps {
  open: boolean;
  handleClose: () => void;
  id: number;
  toggleActivation: (isActivated: boolean | undefined, id: number, motivo: string) => void;
}

const ModalTitulosAcademicos: React.FC<ModalEstadoProps> = ({
  open,
  handleClose,
  id,
  toggleActivation,
}) => {

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [nameNombre, setNameNombre] = useState('')
  const [cantRegistros, setCantRegistros] = useState<number>()
  const [isActivated, setIsActivated] = useState<boolean>()
  const [motivo, setComentario] = useState<string>(""); // Nuevo estado para el motivo

  const maxChars = 250;

  const buscarFuncEstId = async () => {
    const filtrosAplicados: TitulosAcademicosFiltradoRequest = {
      id: id || undefined
    };
    const response = await fetchTitulosAcademicos(filtrosAplicados)
    console.log(response)
    setNameNombre(response.data[0].nombre?.toString() ? response.data[0].nombre?.toString() : "")
    setCantRegistros(response.data.length)
    setIsActivated(response.data[0].estado)
    setIsLoading(false)

  };

  useEffect(() => {
    if (id > 0) {
      buscarFuncEstId();
    }
  }, [id]);

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
              {isActivated ? "Desactivar" : "Activar"} Categorias monotributo
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
          {isActivated && cantRegistros && cantRegistros > 0 ? (
            <Typography variant="body1" sx={{ ml: 65, mt: 12 }}>
              Hay
              <Box
                component="span"
                sx={{ color: "primary.main", textDecoration: "underline" }}
              >
                {cantRegistros} registros
              </Box>
              vinculados a esta clasificación. Al desactivar no podrás utilizarlo
              en nuevos registros.
            </Typography>
          ) : null}

          {isActivated && (
            <>
              {/* TextField para comentario */}
              <TextField
                label="Comentario (opcional)"
                variant="outlined"
                fullWidth
                value={motivo}
                onChange={(e) => setComentario(e.target.value)}
                inputProps={{ maxLength: maxChars }}
                multiline
                rows={4}
                sx={{ mt: 24, mb: 8 }} // Espaciado superior e inferior
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
              onClick={() => toggleActivation(isActivated, id, motivo)}
            >
              {isActivated ? "DESACTIVAR" : "ACTIVAR"}
            </Button>

          </Box>
        </Box>
      }
    </Modal>

  );
};

export default ModalTitulosAcademicos;
