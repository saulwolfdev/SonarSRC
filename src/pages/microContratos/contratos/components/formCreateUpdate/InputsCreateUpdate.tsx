"use Client";

import { Box, styled, TextField, Typography } from "@mui/material";
import AutocompleteUpdateCreate from "@/components/shared/AutocompleteCreateUpdate";
import { useEffect, useState } from "react";
import {
  ContratoAPI,
  ContratoResponce,
} from "@/types/microContratos/contratosTypes";
import { fetchAsociacionesGremiales, fetchContratistasCreateIdOption, fetchNumeroContratistaById, fetchNumeroContratistaIdOption, fetchRazonSocialById, fetchReferente, fetchRolEmpresa, fetchSociedades, fetchTipoContrato, fetchUsuariosSolicitantes } from "@/services/microContratos/ContratosService";
import AccordionForm from "@/components/shared/AcordeonForm";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "moment/locale/es";
import { PickerValidDate } from "@mui/x-date-pickers/models";
import AutocompleteMultipleUpdateCreate from "@/components/shared/AutocompleteMultipleCreateUpdate";
import LocalizationProviderCustom from "@/components/shared/LocalizationProviderCustom";
import React from "react";
import { IdOption } from "@/types/microContratos/GenericTypes";

interface InputsCreateUpdateProps {
  formik: any;
  response?: ContratoResponce | null;
}
export function InputsCreateUpdate({
  formik,
  response,
}: InputsCreateUpdateProps) {
  const [centrosExisting, setCentrosExisting] = useState<ContratoAPI[]>([]);
  const [selectedDate, setSelectedDate] = useState<PickerValidDate | null>();

  const [contratistaSeleccionada, setContratistaSeleccionada] =
    useState<IdOption | null>(null);
  const [
    CUITSeleccionada,
    setCUITSeleccionada,
  ] = useState<IdOption | null>(null);
  const [rolEmpresaIdSeleccionada, setRolEmpresaIdSeleccionada] =
    useState<IdOption | null>(null);
  const [tipoIdSeleccionada, setTipoIdSeleccionada] = useState<IdOption | null>(
    null
  );
  const [asociacionGremialIdSeleccionada, setAsociacionGremialIdSeleccionada] =
    useState<IdOption | null>(null);

  const [sociedadIdSeleccionada, setSociedadIdSeleccionada] =
    useState<IdOption | null>(null);

  const [
    referenteDeComprasIdSeleccionada,
    setReferenteDeComprasIdSeleccionada,
  ] = useState<IdOption| null>(null);

 const [
    UsuariosSolicitantesSeleccionada,
    setUsuariosSolicitantesSeleccionada,
  ] = useState<IdOption[]>();

  useEffect(() => {
    if (response) {
      //todo cargar por defecto cuando sea para editar
    }
  }, [response]);

  const handleChangeContratista = async (event: any, newValue: any) => {
    setContratistaSeleccionada(newValue);
    const CUIT = await fetchNumeroContratistaById(newValue.id)
    setCUITSeleccionada(CUIT)
  };
  const handleChangeCUIT = async (event: any, newValue: any) => {
    setCUITSeleccionada(newValue);
    const razonSocial = await fetchRazonSocialById(newValue.id)
    setContratistaSeleccionada(razonSocial)
    formikChange({
      target: {
        name: 'contratistaId',
        value: razonSocial.id
      }})
  };
  const handleChangeRolEmpresaId = (event: any, newValue: any) => {
    setRolEmpresaIdSeleccionada(newValue);
  };
  const handleChangeTipoId = (event: any, newValue: any) => {
    setTipoIdSeleccionada(newValue);
  };
  const handleChangeAsociacionGremialId = (event: any, newValue: any) => {
    setAsociacionGremialIdSeleccionada(newValue);
  };
  const handleChangeSociedadId = (event: any, newValue: any) => {
    setSociedadIdSeleccionada(newValue);
  };

  const handleChangeReferenteDeComprasId = (event: any, newValue: any) => {
    setReferenteDeComprasIdSeleccionada(newValue);
  };

  const handleChangeUsuariosSolicitantes = (event: any, newValue: any) => {
    setUsuariosSolicitantesSeleccionada(newValue);
  };

  const formikChange = (event: any) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  return (
    <>
      <AccordionForm title="Definición general">
        <AutocompleteUpdateCreate
          idText="contratistaId"
          name="contratistaId"
          label="Contratista*"
          value={contratistaSeleccionada}
          fetchOptions={fetchContratistasCreateIdOption}
          onChange={handleChangeContratista}
          formikChange={formikChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.contratistaId && Boolean(formik.errors.contratistaId)
          }
          helperText={
            formik.touched.contratistaId && formik.errors.contratistaId
          }
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            mr: { md: 21 },
            width: { md: "30%" },
          }}
        />
        <AutocompleteUpdateCreate
          idText="CUIT"
          name="CUIT"
          label="CUIT*"
          value={CUITSeleccionada}
          fetchOptions={fetchNumeroContratistaIdOption}
          onChange={handleChangeCUIT}
          formikChange={formikChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.numero && Boolean(formik.errors.numero)
          }
          helperText={formik.touched.numero && formik.errors.numero}
          sx={{
            mt: { md: 15 },
            mr: { md: 21 },
            width: { md: "30%" },
          }}
        />
        <AutocompleteUpdateCreate
          idText="rolEmpresaId"
          name="rolEmpresaId"
          label="Rol empresa*"
          value={rolEmpresaIdSeleccionada}
          fetchOptions={fetchRolEmpresa}
          onChange={handleChangeRolEmpresaId}
          formikChange={formikChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.rolEmpresaId && Boolean(formik.errors.rolEmpresaId)
          }
          helperText={formik.touched.rolEmpresaId && formik.errors.rolEmpresaId}
          sx={{
            mt: { md: 15 },
            mr: { md: 21 },
            width: { md: "30%" },
          }}
        />
        <AutocompleteUpdateCreate
          idText="tipoId"
          name="tipoId"
          label="Tipo de contrato*"
          value={tipoIdSeleccionada}
          fetchOptions={fetchTipoContrato}
          onChange={handleChangeTipoId}
          formikChange={formikChange}
          onBlur={formik.handleBlur}
          error={formik.touched.tipoId && Boolean(formik.errors.tipoId)}
          helperText={formik.touched.tipoId && formik.errors.tipoId}
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            mr: { md: 21 },
            width: { md: "30%" },
          }}
        />

        <TextField
          id="numero"
          name="numero"
          label="N° contrato*"
          type='string'
          value={formik.values.numero}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.numero &&
            Boolean(formik.errors.numero)
          }
          helperText={
            formik.touched.numero && formik.errors.numero
          }
          sx={{
            mt: { md: 15 },
            mr: { md: 21 },
            width: { md: "30%" },
          }}
          size="small"
        />
        <AutocompleteUpdateCreate
          idText="asociacionGremialId"
          name="asociacionGremialId"
          label="Asociaciones gremiales"
          value={asociacionGremialIdSeleccionada}
          fetchOptions={fetchAsociacionesGremiales}
          onChange={handleChangeAsociacionGremialId}
          formikChange={formikChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.asociacionGremialId &&
            Boolean(formik.errors.asociacionGremialId)
          }
          helperText={
            formik.touched.asociacionGremialId &&
            formik.errors.asociacionGremialId
          }
          sx={{
            mt: { md: 15 },
            mr: { md: 21 },
            width: { md: "30%" },
          }}
        />

        <TextField
          id="descripcion"
          name="descripcion"
          label="Descripcion"
          multiline
          rows={3}
          inputProps={{ maxLength: 250 }}
          value={formik.values.descripcion}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.descripcion && Boolean(formik.errors.descripcion)
          }
          helperText={formik.touched.descripcion && formik.errors.descripcion}
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            mr: { md: 21 },
            width: { md: "100%" },
          }}
        />
        <Box
          display="flex"
          justifyContent="flex-end"
          sx={{ mr: { md: 21 }, mb: { md: 45 }, width: { md: "100%" } }}
        >
          <Typography variant="body1" color="textSecondary">
            {formik.values.descripcion.length}/250
          </Typography>
        </Box>
      </AccordionForm>
      <AccordionForm title="Usuarios Referenctes">
        <AutocompleteUpdateCreate
          idText="sociedadId"
          name="sociedadId"
          label="Sociedad*"
          value={sociedadIdSeleccionada}
          fetchOptions={fetchSociedades}
          onChange={handleChangeSociedadId}
          formikChange={formikChange}
          onBlur={formik.handleBlur}
          error={formik.touched.sociedadId && Boolean(formik.errors.sociedadId)}
          helperText={formik.touched.sociedadId && formik.errors.sociedadId}
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            mr: { md: 21 },
            width: { md: "30%" },
          }}
        />
        <AutocompleteUpdateCreate
          idText="referenteDeComprasId"
          name="referenteDeComprasId"
          label="Referente de compras"
          value={referenteDeComprasIdSeleccionada}
          fetchOptions={fetchReferente}
          onChange={handleChangeReferenteDeComprasId}
          formikChange={formikChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.referenteDeComprasId &&
            Boolean(formik.errors.referenteDeComprasId)
          }
          helperText={
            formik.touched.referenteDeComprasId &&
            formik.errors.referenteDeComprasId
          }
          sx={{
            mt: { md: 15 },
            mr: { md: 21 },
            width: { md: "30%" },
          }}
        />
        <TextField
          id="usuariosANotificar"
          name="usuariosANotificar"
          label="Notificar la creacion a"
          size="small"
          value={formik.values.usuariosANotificar}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.usuariosANotificar && Boolean(formik.errors.usuariosANotificar)
          }
          helperText={formik.touched.usuariosANotificar && formik.errors.usuariosANotificar}
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            mr: { md: 21 },
            width: { md: "30%" },
          }}
        />
        <AutocompleteMultipleUpdateCreate
          idText="usuariosSolicitantes"
          name="usuariosSolicitantes"
          label="Usuario solicitante*"
          values={UsuariosSolicitantesSeleccionada}
          fetchOptions={fetchUsuariosSolicitantes}
          onChange={handleChangeUsuariosSolicitantes}
          formikChange={formikChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.usuariosSolicitantes &&
            Boolean(formik.errors.usuariosSolicitantes)
          }
          helperText={
            formik.touched.usuariosSolicitantes &&
            formik.errors.usuariosSolicitantes
          }
          sx={{
            mt: { md: 15 },
            mr: { md: 21 },
            ml: { md: 21 },
            width: { md: "100%" },
          }}
        />
      </AccordionForm>
      <AccordionForm title="Vigencia">
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          sx={{ width: "67%" }} // Asegura que ocupen todo el ancho disponible
        >
          <LocalizationProviderCustom>
            <DatePicker
              name="inicio"
              label="Desde*"
              onChange={(newValue) => {
                const formattedDate = newValue?.format("YYYY-MM-DD");
                setSelectedDate(newValue);
                formik.setFieldValue("inicio", formattedDate);
              }}
              slotProps={{
                textField: {
                  onBlur: formik.handleBlur,
                  error:
                    formik.touched.inicio &&
                    Boolean(formik.errors.inicio),
                  helperText:
                    formik.touched.inicio &&
                    formik.errors.inicio,
                  sx: {
                    mt: { md: 15 },
                    ml: { md: 21 },
                    mb: { md: 45 },
                    width: "45%",
                    fontSize: "2.5rem",
                  },
                  size: "small",
                },
              }}
            />
            <DatePicker
              name="finalizacion"
              label="Hasta*"
              onChange={(newValue) => {
                const formattedDate = newValue?.format("YYYY-MM-DD");
                setSelectedDate(newValue);
                formik.setFieldValue("finalizacion", formattedDate);
              }}
              slotProps={{
                textField: {
                  onBlur: formik.handleBlur,
                  error:
                    formik.touched.finalizacion &&
                    Boolean(formik.errors.finalizacion),
                  helperText:
                    formik.touched.finalizacion &&
                    formik.errors.finalizacion,
                  sx: {
                    mt: { md: 15 },
                    mr: { md: 21 },
                    mb: { md: 45 },
                    width: "45%",
                    fontSize: "2.5rem",
                  },
                  size: "small",
                },
              }}
            />
          </LocalizationProviderCustom>
        </Box>
      </AccordionForm>
    </>
  );
}

const dummy = () => {
  console.log('...')
}
export default dummy