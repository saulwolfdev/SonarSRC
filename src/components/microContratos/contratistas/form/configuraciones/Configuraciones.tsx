"use client";
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import TooltipPersonaEventual from "./TooltipPersonaEventual";
import TooltipEmpresaConstruccion from "./TooltipEmpresaConstruccion";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface ConfiguracionesProps {
  formik: any;
  withoutIntegration?: boolean;
  isView?: boolean;
}

export default function Configuraciones({
  formik,
  withoutIntegration,
  isView,
}: ConfiguracionesProps) {
  const [empresaConstruccion, setEmpresaConstruccion] = useState<
    boolean | null
  >(null);
  const [personaEventual, setPersonaEventual] = useState<boolean | null>(null);
  const [showTooltipEventual, setShowTooltipEventual] =
    useState<boolean>(false);
  const [showTooltipConstruccion, setShowTooltipConstruccion] =
    useState<boolean>(false);

  useEffect(() => {
    setShowTooltipConstruccion(!!empresaConstruccion);
    if (!empresaConstruccion) {
      formik.setFieldValue("nroIERIC", ""); // si se oculta borro el valor
    }
  }, [empresaConstruccion]);

  useEffect(() => {
    setShowTooltipEventual(!!personaEventual);
  }, [personaEventual]);

  const handleEmpresaConstruccion = (event: any) => {
    const value = event.target.value === "true";
    setEmpresaConstruccion(value);
    formik.setFieldValue("empresaConstruccion", value);
  };
  const handlePersonaEventual = (event: any) => {
    const value = event.target.value === "true";
    setPersonaEventual(value);
    formik.setFieldValue("empresaEventual", value);
  };

  useEffect(() => {
    setShowTooltipConstruccion(formik.values.empresaConstruccion);
    setShowTooltipEventual(formik.values.empresaEventual);
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="row"
      sx={{ width: "100%", ml: { md: 8 } }}
    >
      {formik ? (
        <>
          {isView ? (
            <TextField
              disabled
              label="Persona Eventual"
              value={formik.values.personaEventual ? "Sí" : "No"}
              className="input-position-1-of-3"
              size="small"
            />
          ) : (
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              className="input-position-1-of-3"
            >
              {/* todo, bloquear para sin integracion
        + rol contraista
        */}
              <Typography variant="body1">Persona Eventual</Typography>
              {showTooltipEventual && <TooltipPersonaEventual />}
              <RadioGroup
                aria-label="empresaEventual"
                name="empresaEventual"
                sx={{
                  display: "flex",
                  flexDirection: "inherit",
                  ml: { md: 8 },
                }}
                value={formik.values.empresaEventual}
                onChange={handlePersonaEventual}
              >
                <FormControlLabel value="true" control={<Radio />} label="Sí" />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="No"
                />
              </RadioGroup>
            </Box>
          )}
          {isView ? (
            <TextField
              disabled
              label="Empresa de construccion"
              value={formik.values.empresaConstruccion ? "Sí" : "No"}
              className="input-position-2-or-3-of-3"
              size="small"
            />
          ) : (
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              className="input-position-2-or-3-of-3"
            >
              <Typography variant="body1">Empresa de construccion</Typography>
              {showTooltipConstruccion && <TooltipEmpresaConstruccion />}
              <RadioGroup
                aria-label="empresaConstruccion"
                name="empresaConstruccion"
                sx={{
                  display: "flex",
                  flexDirection: "inherit",
                  ml: { md: 8 },
                }}
                value={formik.values.empresaConstruccion}
                onChange={handleEmpresaConstruccion}
              >
                <FormControlLabel value="true" control={<Radio />} label="Sí" />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="No"
                />
              </RadioGroup>
            </Box>
          )}
          {showTooltipConstruccion && (
            <TextField
              disabled={isView}
              id="nroIERIC"
              name="nroIERIC"
              label="Número IERIC"
              value={formik.values.nroIERIC}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nroIERIC && Boolean(formik.errors.nroIERIC)}
              helperText={formik.touched.nroIERIC && formik.errors.nroIERIC}
              className="input-position-2-or-3-of-3"
              size="small"
            />
          )}{" "}
        </>
      ) : null}
    </Box>
  );
}
