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
import { exportContratistas, fetchContratistaById, fetchContratistasRecursosAfectadosById, exportContratistasRegistrosAsociados } from "@/services/microContratos/contratistasService";
import ResistrosAsociadosExport from "@/components/shared/RegistrosAsociadosExport";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";



export interface ModalEstadoProps {
  open: boolean;
  handleClose: () => void;
  id: number;
  toggleActivation: (isActivated: boolean | undefined, id: number, motivo?: string) => void;
}

const ModalEstado: React.FC<ModalEstadoProps> = ({
  open,
  handleClose,
  id,
  toggleActivation,
}) => {
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [contratistaNombre, setContratistaNombre] = useState('')
  const [cantRegistros, setCantRegistros] = useState<number>()
  const [isActivated, setIsActivated] = useState<boolean>()
  const [motivo, setMotivo] = useState<string>('')

  const buscarContratistaById = async () => {
    const response = await fetchContratistaById(id)
    setContratistaNombre(response.razonSocial) //ss es ok ese?
    setIsActivated(response.estado)
    const cantidadRecursosAfectados = await fetchContratistasRecursosAfectadosById(id)
    setCantRegistros(cantidadRecursosAfectados)
    setIsLoading(false)

  };


  useEffect(() => {
    if (id > 0 && open) {
      buscarContratistaById();
    }
  }, [id, open]);


  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      {isLoading ? <Spinner /> :

        <Box
          sx={{
            position: "absolute",
            top: "20%",
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
          <SnackbarAlert // queda feo visualmente
            message={alertMessage}
            type={alertType}
            setAlertMessage={setAlertMessage}
            setAlertType={setAlertType}
          />
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
              {isActivated ? "Desactivar" : "Activar"} contratista
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

          <Box sx={{
            background: '#FFFFFF',
            border: '1px solid #D6D6D68A',
            opacity: 1
          }}>
            <Typography variant="body1" sx={{ ml: 65, mt: 25, mb: 10 }}>
              ¿Estas seguro que quieres {isActivated ? "desactivar " : "activar "} póliza N° {" "}
              <Box component="span" sx={{ fontWeight: "bold" }}>
                {contratistaNombre}
              </Box>{" "}
              ?
            </Typography>

            {isActivated && cantRegistros && cantRegistros > 0 ? (
              <Typography variant="body1" sx={{ ml: 65 }}>
                Hay{" "}
                <ResistrosAsociadosExport
                  count={cantRegistros}
                  exportFunction={exportContratistasRegistrosAsociados}
                  documentName={`Desactivar contratistas`}
                  setAlertMessage={setAlertMessage}
                  setAlertType={setAlertType}
                  id={id}
                />
                vinculados a esta contratista. Al desactivar no podrás utilizarla
                en nuevos registros. La contratista quedará con fecha de recesión anticipada y los recursos asociados dejarán de estar disponibles.
                Importante: Las integraciones automáticas dejarán de actualizarse dedsde este momento.
              </Typography>) : null}
            {isActivated && (
              <>
                <TextField
                  id="motivo"
                  name="motivo"
                  label="Comentario*"
                  multiline
                  rows={3}
                  inputProps={{ minLength: 10, maxLength: 250 }}
                  value={motivo}
                  onChange={(event) => {
                    setMotivo(event.target.value)
                  }}
                  sx={{
                    ml: 65, mt: 15,
                    width: { md: "90%" },
                  }}
                />
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  sx={{ pr: { md: 30 }, mb: { md: 25 }, width: { md: "100%" } }}
                >
                  <Typography variant="body1" color="textSecondary">
                    {motivo.length}/250
                  </Typography>
                </Box></>
            )}

          </Box>



          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 30 }}>
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
              disabled={motivo.length < 10 || motivo.length > 250}
            >
              {isActivated ? "DESACTIVAR" : "ACTIVAR"}
            </Button>
          </Box>
        </Box>}
    </Modal>
  );
};

export default ModalEstado;
