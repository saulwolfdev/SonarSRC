"use client";
import AutocompleteUpdateCreate from "@/components/shared/AutocompleteCreateUpdate";
import AutocompleteMultipleUpdateCreate from "@/components/shared/AutocompleteMultipleCreateUpdate";
import LocalizationProviderCustom from "@/components/shared/LocalizationProviderCustom";
import { typeAlert } from "@/components/shared/SnackbarAlert";
import {
  fetchBloqueoContratistas,
  fetchEstudiosContratistas,
  fetchMotivoBloqueoContratistas,
  fetchSedesContratistas,
} from "@/services/microContratos/contratistasService";
import { IdOption } from "@/types/microContratos/GenericTypes";
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PickerValidDate } from "@mui/x-date-pickers/models";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";

interface ConfiguracionesProps {
  formik: any;
  formikChange: any;
  setAlertMessage?: any;
  setAlertType?: any;
  response: any;
  withoutIntegration?: boolean;
  isView?: boolean;
}

export default function ConfiguracionesOnlyEdit({
  formik,
  formikChange,
  setAlertMessage,
  setAlertType,
  response,
  withoutIntegration,
  isView,
}: ConfiguracionesProps) {
  const [politicaDiversidad, setpoliticaDiversidad] = useState<boolean | null>(
    null
  );
  const [empresaPromovida, setEmpresaPromovida] = useState<boolean | null>(
    null
  );
  const [estudioSeleccionada, setEstudioSeleccionada] =
    useState<IdOption | null>(null);
  const [sedeSeleccionada, setSedeSeleccionada] = useState<IdOption | null>(
    null
  );
  const [bloqueoSeleccionada, setBloqueoSeleccionada] =
    useState<IdOption | null>(null);

  const [motivoBloqueoSeleccionada, setMotivoBloqueoSeleccionada] = useState<
    IdOption[]
  >([]);

  const [selectedDateInicio, setSelectedDateInicio] =
    useState<PickerValidDate | null>();
  const [selectedDateFin, setSelectedDateFin] =
    useState<PickerValidDate | null>();

  const [isBloqueado, setIsBloqueado] = useState<boolean>(false);
  const [isDesbloqueoTransitorio, setIsDesbloqueoTransitorio] =
    useState<boolean>(false);
    const [isDesbloqueo, setIsDesbloqueo] =
    useState<boolean>(false);

  const handlepoliticaDiversidad = (event: any) => {
    const value = event.target.value === "true";
    setpoliticaDiversidad(value);
    formik.setFieldValue("politicaDiversidad", value);
  };
  const handleEmpresaPromovida = (event: any) => {
    const value = event.target.value === "true";
    setEmpresaPromovida(value);
    formik.setFieldValue("empresaPromovida", value);
  };

  const handleChangeEstudio = (event: any, newValue: any) => {
    if (newValue?.id && newValue?.label) {
      setEstudioSeleccionada(newValue);
      formik.setFieldValue("estudioAuditorId", newValue.id);
      setAlertMessage("El sistema emitirá una notificación al estudio auditor");
      setAlertType(typeAlert.info);
    }
  };
  const handleChangeSede = (event: any, newValue: any) => {
    if (newValue?.id && newValue?.label) {
      setSedeSeleccionada(newValue);
      formik.setFieldValue("sedeId", newValue.id);
      setAlertMessage("El sistema emitirá una notificación al estudio auditor");
      setAlertType(typeAlert.info);
    }
  };
  const handleChangeBloqueo = (event: any, newValue: any) => {
    if (newValue?.id && newValue?.label) {
      setBloqueoSeleccionada(newValue);
      formik.setFieldValue("estadoBloqueoId", newValue?.id || null);
      setIsBloqueado(newValue.label.toUpperCase() == "BLOQUEADO");
      setIsDesbloqueo(newValue.label.toUpperCase() == "DESBLOQUEADO");
      setIsDesbloqueoTransitorio(newValue.label.toUpperCase() == "DESBLOQUEADO TRANSITORIO");
      if (newValue.label.toUpperCase() !== "DESBLOQUEADO TRANSITORIO") {
        setSelectedDateInicio(null);
        setSelectedDateFin(null);

        formik.setFieldValue("motivoDesbloqueo", "");
        formik.setFieldValue("fechaInicioDesbloqueo", undefined);
        formik.setFieldValue("fechaFinalizacionDesbloqueo", undefined);
      }
    }
  };
  const handleChangeMotivoBloqueo = (event: any, newValue: any) => {
    setMotivoBloqueoSeleccionada(newValue);
    const ids = newValue.map((v: any) => {
      return v.id;
    });
    formik.setFieldValue("motivoBloqueoIds", ids);
  };

  const searchBloquoOptions = useCallback(async (e: string) => {
    const options = await fetchBloqueoContratistas(e);
    if (response.estadoBloqueo.nombre.toUpperCase() !== "BLOQUEADO") {
      const filter = options.filter((o) => {
        return (
          o.label.toUpperCase() !== "DESBLOQUEADO EXCEPTUADO" &&
          o.label.toUpperCase() !== "DESBLOQUEADO TRANSITORIO" &&
          o.label.toUpperCase() !== "DESBLOQUEADO"
        );
      });
      return filter;
    }
    return options;
  }, []);

  useEffect(() => {
    if (response) {
      setpoliticaDiversidad(response.politicaDiversidad);
      setEmpresaPromovida(response.empresaPromovida);
      if (response.estudioAuditor) {
        setEstudioSeleccionada({
          id: response.estudioAuditor.id,
          label: response.estudioAuditor.nombre,
        });
      }
      if (response.sede) {
        setSedeSeleccionada({
          id: response.sede.id,
          label: response.sede.nombre,
        });
      }
      setBloqueoSeleccionada({
        id: response.estadoBloqueo.id,
        label: response.estadoBloqueo.nombre,
      });
      
      const motivos = response.motivosBloqueo.map((motivo: any) => {
        return {
          id: motivo.motivoBloqueo.id,
          label: motivo.motivoBloqueo.nombre,
        };
      });
      setMotivoBloqueoSeleccionada(motivos);
      response.fechaInicioDesbloqueo &&
        setSelectedDateInicio(dayjs(response.fechaInicioDesbloqueo));
      response.fechaFinalizacionDesbloqueo &&
        setSelectedDateFin(dayjs(response.fechaFinalizacionDesbloqueo));
      setIsBloqueado(response.estadoBloqueo.nombre.toUpperCase() === "BLOQUEADO");
      setIsDesbloqueoTransitorio(
        response.estadoBloqueo.nombre.toUpperCase() == "DESBLOQUEADO TRANSITORIO"
      );
      setIsDesbloqueo(
        response.estadoBloqueo.nombre.toUpperCase() == "DESBLOQUEADO"
      );
    }
  }, [response]);


  const searchSedeOptions = useCallback(
    async (e: string) => {
      if (estudioSeleccionada) {
        const options = await fetchSedesContratistas(e, estudioSeleccionada.id);
        return options;
      } else {
        return [{ id: 0, label: "" }];
      }
    },
    [estudioSeleccionada]
  );

  return (
    <>
      {formik ? (
        <>
          {isView ? (
            <TextField
              disabled
              label="Pólitica de diversidad"
              value={formik.values.politicaDiversidad ? "Sí" : "No"}
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
              <Typography variant="body1">Pólitica de diversidad</Typography>
              <RadioGroup
                aria-label="politicaDiversidad"
                name="politicaDiversidad"
                sx={{
                  display: "flex",
                  flexDirection: "inherit",
                  ml: { md: 8 },
                }}
                value={formik.values.politicaDiversidad}
                onChange={handlepoliticaDiversidad}
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
          {/*todo bloquear :
       + manual rol compras
      */}
          <TextField
            id="linkPoliticaDiversidad"
            disabled={isView}
            name="linkPoliticaDiversidad"
            label="Link de pólitica de diversidad"
            value={formik.values.linkPoliticaDiversidad}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.linkPoliticaDiversidad &&
              Boolean(formik.errors.linkPoliticaDiversidad)
            }
            helperText={
              formik.touched.linkPoliticaDiversidad &&
              formik.errors.linkPoliticaDiversidad
            }
            className="input-position-2-or-3-of-3"
            size="small"
          />
          {isView ? (
            <TextField
              disabled
              label="Empresa promovida"
              value={formik.values.empresaPromovida ? "Sí" : "No"}
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
              {/*todo bloquear :
       + manual rol compras - contratista
      */}
              <Typography variant="body1">Empresa promovida</Typography>
              <RadioGroup
                aria-label="empresaPromovida"
                name="empresaPromovida"
                sx={{
                  display: "flex",
                  flexDirection: "inherit",
                  ml: { md: 8 },
                }}
                value={formik.values.empresaPromovida}
                onChange={handleEmpresaPromovida}
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

          {empresaPromovida && (
            <TextField
              disabled={isView}
              id="motivoEmpresaPromovida"
              name="motivoEmpresaPromovida"
              label="Empresa promovida comentario"
              value={formik.values.motivoEmpresaPromovida}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.motivoEmpresaPromovida &&
                Boolean(formik.errors.motivoEmpresaPromovida)
              }
              helperText={
                formik.touched.motivoEmpresaPromovida &&
                formik.errors.motivoEmpresaPromovida
              }
              className="input-position-1-of-3"
              size="small"
            />
          )}
          {/*todo bloquear :
       + manual rol compras - contratista
      */}
          <AutocompleteUpdateCreate
            idText="estudio"
            disabled={isView}
            name="estudio"
            label="Estudio"
            value={estudioSeleccionada}
            fetchOptions={fetchEstudiosContratistas}
            onChange={handleChangeEstudio}
            formikChange={formikChange}
            onBlur={formik.handleBlur}
            error={formik.touched.estudio && Boolean(formik.errors.estudio)}
            helperText={formik.touched.estudio && formik.errors.estudio}
            className="input-position-2-or-3-of-3"
          />
          {/*todo bloquear :
       + manual rol compras - contratista
      */}
          <AutocompleteUpdateCreate
            idText="sede"
            disabled={isView || !estudioSeleccionada}
            name="sede"
            label="Sede"
            value={sedeSeleccionada}
            fetchOptions={searchSedeOptions}
            onChange={handleChangeSede}
            formikChange={formikChange}
            onBlur={formik.handleBlur}
            error={formik.touched.sede && Boolean(formik.errors.sede)}
            helperText={formik.touched.sede && formik.errors.sede}
            className="input-position-2-or-3-of-3"
          />
          <AutocompleteUpdateCreate
            idText="estadoBloqueoId"
            disabled={isView || !withoutIntegration}
            name="estadoBloqueoId"
            label="Bloqueo"
            value={bloqueoSeleccionada}
            fetchOptions={searchBloquoOptions}
            onChange={handleChangeBloqueo}
            formikChange={formikChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.estadoBloqueoId &&
              Boolean(formik.errors.estadoBloqueoId)
            }
            helperText={
              formik.touched.estadoBloqueoId && formik.errors.estadoBloqueoId
            }
            className="input-position-1-of-3"
          />
          {withoutIntegration && isDesbloqueoTransitorio && (
            <>
              <LocalizationProviderCustom>
                <DatePicker
                  name="fechaInicioDesbloqueo"
                  label="Desbloqueo desde*"
                  value={selectedDateInicio}
                  disabled={isView}
                  onChange={(newValue) => {
                    const formattedDate = newValue?.format("YYYY-MM-DD");
                    setSelectedDateInicio(newValue);
                    formik.setFieldValue(
                      "fechaInicioDesbloqueo",
                      formattedDate
                    );
                  }}
                  // slots={{ textField: StyledTextField }}
                  slotProps={{
                    textField: {
                      onBlur: formik.handleBlur,
                      error:
                        formik.touched.fechaInicioDesbloqueo &&
                        Boolean(formik.errors.fechaInicioDesbloqueo),
                      helperText:
                        formik.touched.fechaInicioDesbloqueo &&
                        formik.errors.fechaInicioDesbloqueo,
                      sx: {
                        mt: { md: 15 },
                        ml: { md: 21 },
                        width: { md: "30%" },
                        fontSize: "2.5rem",
                      },
                      size: "small",
                    },
                  }}
                />
                <DatePicker
                  name="fechaFinalizacionDesbloqueo"
                  label="Desbloqueo hasta*"
                  value={selectedDateFin}
                  disabled={isView}
                  onChange={(newValue) => {
                    const formattedDate = newValue?.format("YYYY-MM-DD");
                    setSelectedDateFin(newValue);
                    formik.setFieldValue(
                      "fechaFinalizacionDesbloqueo",
                      formattedDate
                    );
                  }}
                  // slots={{ textField: StyledTextField }}
                  slotProps={{
                    textField: {
                      onBlur: formik.handleBlur,
                      error:
                        formik.touched.fechaFinalizacionDesbloqueo &&
                        Boolean(formik.errors.fechaFinalizacionDesbloqueo),
                      helperText:
                        formik.touched.fechaFinalizacionDesbloqueo &&
                        formik.errors.fechaFinalizacionDesbloqueo,
                      sx: {
                        mt: { md: 15 },
                        ml: { md: 21 },
                        width: { md: "30%" },
                        fontSize: "2.5rem",
                      },
                      size: "small",
                    },
                  }}
                />
              </LocalizationProviderCustom>
            </>
          )}
          { withoutIntegration && isDesbloqueo &&
          <TextField
          disabled={isView}
          id="motivoDesbloqueo"
          name="motivoDesbloqueo"
          label="Motivo desbloqueo*"
          value={formik.values.motivoDesbloqueo}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.motivoDesbloqueo &&
            Boolean(formik.errors.motivoDesbloqueo)
          }
          helperText={
            formik.touched.motivoDesbloqueo &&
            formik.errors.motivoDesbloqueo
          }
          className="input-position-2-or-3-of-3"
          size="small"
        />}
          {withoutIntegration && isBloqueado && (
            <AutocompleteMultipleUpdateCreate
              idText="motivoBloqueoIds"
              disabled={isView}
              name="motivoBloqueoIds"
              label="Motivo bloqueo*"
              values={motivoBloqueoSeleccionada}
              fetchOptions={fetchMotivoBloqueoContratistas}
              onChange={handleChangeMotivoBloqueo}
              formikChange={formikChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.motivoBloqueoIds &&
                Boolean(formik.errors.motivoBloqueoIds)
              }
              helperText={
                formik.touched.motivoBloqueoIds &&
                formik.errors.motivoBloqueoIds
              }
              className="input-position-2-or-3-of-3"
            />
          )}{" "}
        </>
      ) : null}
    </>
  );
}
