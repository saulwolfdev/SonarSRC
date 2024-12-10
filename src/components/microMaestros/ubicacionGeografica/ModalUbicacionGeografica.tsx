import React, { useEffect, useState } from "react";
import { Box, Button, Modal, Typography, RadioGroup, FormControlLabel, Radio, IconButton } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { UbicacionEditar } from "@/types/microMaestros/ubicacionGeograficaTypes";

export interface LocationModalProps {
  open: boolean;
  handleClose: () => void;
  toggleActivation: (level: string) => Promise<void>;
  ubicacionSeleccionada?: UbicacionEditar;
}

const ModalUbicacionGeografica: React.FC<LocationModalProps> = ({
  open,
  handleClose,
  toggleActivation,
  ubicacionSeleccionada,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<"pais" | "provincia" | "localidad">("pais");
  const [isActivated, setIsActivated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedLevel(
      ubicacionSeleccionada?.localidadId
        ? "localidad"
        : ubicacionSeleccionada?.provinciaId
          ? "provincia"
          : "pais"
    );

    setIsActivated(
      ubicacionSeleccionada?.localidadEstado ??
      ubicacionSeleccionada?.provinciaEstado ??
      ubicacionSeleccionada?.paisEstado ??
      null
    );
  }, [ubicacionSeleccionada]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLevel(event.target.value as "pais" | "provincia" | "localidad");
  };

  const handleToggleActivation = async () => {
    setLoading(true);
    try {
      await toggleActivation(selectedLevel);
      // Si se ha cambiado el estado de activación correctamente, actualiza isActivated
      setIsActivated(!isActivated);
    } catch (error) {
      console.error("Error toggling activation:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLocationDescription = () => {
    switch (selectedLevel) {
      case "provincia":
        return `${ubicacionSeleccionada?.pais} / ${ubicacionSeleccionada?.provincia} / localidades asociadas`;
      case "localidad":
        return `${ubicacionSeleccionada?.pais} / ${ubicacionSeleccionada?.provincia} / ${ubicacionSeleccionada?.localidad}`;
      default:
        return `${ubicacionSeleccionada?.pais} / +${ubicacionSeleccionada?.cantidadProvincias ?? 0} provincias / localidades asociadas`;
    }
  };

  if (ubicacionSeleccionada) {
    return (
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "974px",
            bgcolor: "background.paper",
            boxShadow: "4px 4px 10px #D6D6D6",
            border: "1px solid #F5F5F5",
            borderRadius: 4,
            p: 16,
            pr: 32,
            pb: 32,
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
              variant="h1"
              component="h2"
            >
              {isActivated ? "Desactivar" : "Activar"} Ubicación
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              position: "relative",
              left: 60,
              background: "#FFFFFF",
              border: "1px solid #D6D6D68A",
              borderRadius: "15px",
              width: "94%",
              opacity: 1,
              p: 16,
            }}
          >
            <Typography variant="body1" sx={{ mb: 16 }}>
              Selecciona un nivel:
            </Typography>
            <RadioGroup
              value={selectedLevel}
              onChange={handleRadioChange}
              sx={{ display: "flex", flexDirection: "row", mb: 16, ml: 20, gap: 20 }}
            >
              <FormControlLabel value="pais" control={<Radio />} label="País" />
              <FormControlLabel
                value="provincia"
                control={<Radio />}
                label="Provincia"
                disabled={!ubicacionSeleccionada.provinciaId}
              />
              <FormControlLabel
                value="localidad"
                control={<Radio />}
                label="Localidad"
                disabled={!ubicacionSeleccionada.localidadId}
              />
            </RadioGroup>

            <Typography sx={{ display: "flex", gap: 6, mb: 16 }}>
              <Typography>Estas activando:</Typography>
              <Typography sx={{ fontWeight: "bold" }}>
                {getLocationDescription()}
              </Typography>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", textAlign: "center", mb: 16, mt: 10, ml: 40 }}>
            <InfoOutlinedIcon color="disabled" sx={{ mr: 10, fontSize: "19px" }} />
            <Typography sx={{ color: "#5C5C5C", fontSize: "14px" }}>
              Al modificar un nivel superior, los niveles inferiores se verán afectados automáticamente.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 24 }}>
            <Button variant="outlined" disabled={loading} onClick={handleClose} sx={{ mr: 16 }}>
              CANCELAR
            </Button>
            <Button
              className="MuiButton-primary"
              variant="contained"
              color={isActivated ? "error" : "primary"}
              onClick={handleToggleActivation}
              disabled={loading}
            >
              {isActivated ? "DESACTIVAR" : "ACTIVAR"}
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  }

  return null;
};

export default ModalUbicacionGeografica;
