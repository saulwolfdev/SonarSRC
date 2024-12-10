"use client";
import React, { useState } from "react";
import { TextField } from "@mui/material";
import { FormikProvider } from "formik";
import AccordionForm from "@/components/shared/AcordeonForm";
import AutocompleteUpdateCreate from "@/components/shared/AutocompleteCreateUpdate";
import { IdOption } from "@/types/microMaestros/GenericTypes";
import { fetchProvincias, fetchUbicaciones } from "@/services/microMaestros/ubicacionGeograficaService"
import { fetchLocalidadesEstudioAuditor } from "@/services/microMaestros/EstudioAuditoresService";
import { UbicacionesGeograficasFiltradasRequest } from "@/types/microMaestros/ubicacionGeograficaTypes";

interface InputsSedeProps {
  formik: any;
}

export function InputsSede({
  formik,
}: InputsSedeProps) {
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<IdOption | null>(null);
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState<IdOption | null>(null);

  const handleChangeProvincia = (event: any, newValue: IdOption | null) => {
    setProvinciaSeleccionada(newValue);
    formik.setFieldValue('provinciaNombre', newValue?.label || null);
    formik.setFieldValue('provinciaId', newValue?.id || null);
    formik.setFieldValue("localidad", "");
    setLocalidadSeleccionada(null);
  };

  const handleChangeLocalidad = async (event: any, newValue: any) => {
    if (newValue?.id && newValue?.label) {
      setLocalidadSeleccionada(newValue);
      formik.setFieldValue('localidadNombre', newValue?.label || null);
      formik.setFieldValue('localidadId', newValue?.id || null);

      const request: UbicacionesGeograficasFiltradasRequest = {
        localidadId: newValue.id,
      };

      try {
        const response = await fetchUbicaciones(request);
        if (response.data && response.data.length > 0) {
          const ubicacion = response.data[0];
          formik.setFieldValue('codigoPostal', ubicacion.codigoPostalCodigo);
          formik.setFieldValue('codigoPostalId', ubicacion.codigoPostalId);
        } else {
          formik.setFieldValue('codigoPostal', '');
          formik.setFieldValue('codigoPostalId', null);
        }
      } catch (error) {
        console.error("Error al obtener ubicaciones geográficas: ", error);
      }
    }
  };

  const buscarProvincias = async (busqueda?: string): Promise<IdOption[]> => {
    const listaProvincias = await fetchProvincias({ nombre: busqueda });
    const provinciasUnicas = listaProvincias.data.filter((item: any, index: number, self: any[]) =>
      index === self.findIndex((p: any) => p.id === item.id)
    );
    return provinciasUnicas.map((p: any) => ({ id: p.id, label: p.nombre }));
  };

  const formikChange = (event: any) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };


  const handleNumericInput = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    //Función para solo permitir números
    const { value } = event.target;
    const numericValue = value.replace(/\D/g, "");
    formik.setFieldValue(fieldName, numericValue);
  };

  if (!formik?.values) return null;
  return (
    <FormikProvider value={formik}>
      <AccordionForm title="Definición general/Ubicación">
        <TextField
          id="nombreSede"
          name="nombreSede"
          label="Nombre Sede*"
          value={formik.values?.nombreSede || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.nombreSede && Boolean(formik.errors.nombreSede)}
          helperText={formik.touched.nombreSede && formik.errors.nombreSede}
          sx={{ width: { md: "30%" }, pb: { md: 16} }}
          size="small"
        />

        <AutocompleteUpdateCreate
          key={provinciaSeleccionada?.id || 'provincia'}
          idText="provincia"
          name="provincia"
          label="Provincia*"
          value={provinciaSeleccionada}
          fetchOptions={buscarProvincias}
          onChange={handleChangeProvincia}
          formikChange={formikChange}
          onBlur={formik.handleBlur}
          error={formik.touched.provincia && Boolean(formik.errors.provincia)}
          helperText={formik.touched.provincia && formik.errors.provincia}
          sx={{ width: { md: "30%" }, pb: { md: 16} }}
          getOptionLabel={(option) => option.label}
        />


        <AutocompleteUpdateCreate
          key={localidadSeleccionada?.id || 'localidad'}
          idText="localidad"
          name="localidad"
          label="Localidad*"
          value={localidadSeleccionada}
          fetchOptions={fetchLocalidadesEstudioAuditor}
          onChange={handleChangeLocalidad}
          formikChange={formikChange}
          onBlur={formik.handleBlur}
          disabled={!provinciaSeleccionada} // Deshabilitar si no hay provincia seleccionada
          error={formik.touched.localidad && Boolean(formik.errors.localidad)}
          helperText={formik.touched.localidad && formik.errors.localidad}
          sx={{ width: { md: "30%" }, pb: { md: 16} }}
        />

        <TextField
          id="calle"
          name="calle"
          label="Calle*"
          value={formik.values?.calle || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.calle && Boolean(formik.errors.calle)}
          helperText={formik.touched.calle && formik.errors.calle}
          sx={{ width: { md: "30%" }, pb: { md: 16} }}
          size="small"
        />

        <TextField
          id="nroCalle"
          name="nroCalle"
          label="Número*"
          value={formik.values?.nroCalle || ""}
          onChange={(e:any) => handleNumericInput(e, 'nroCalle')}
          onBlur={formik.handleBlur}
          error={formik.touched.nroCalle && Boolean(formik.errors.nroCalle)}
          helperText={formik.touched.nroCalle && formik.errors.nroCalle}
          sx={{ width: { md: "30%" }, pb: { md: 16} }}
          size="small"
        />

        <TextField
          id="piso"
          name="piso"
          label="Piso"
          value={formik.values?.piso  || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.piso && Boolean(formik.errors.piso)}
          helperText={formik.touched.piso && formik.errors.piso}
          sx={{ width: { md: "30%" }, pb: { md: 16} }}
          size="small"
        />

        <TextField
          id="departamento"
          name="departamento"
          label="Depto."
          value={formik.values?.departamento  || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.departamento && Boolean(formik.errors.departamento)}
          helperText={formik.touched.departamento && formik.errors.departamento}
          sx={{ width: { md: "30%" }, pb: { md: 16} }}
          size="small"
        />

        <TextField
          id="codigoPostal"
          name="codigoPostal"
          label="Código Postal*"
          value={formik.values?.codigoPostal || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.codigoPostal && Boolean(formik.errors.codigoPostal)}
          helperText={formik.touched.codigoPostal && formik.errors.codigoPostal}
          sx={{ width: { md: "30%" }, pb: { md: 16} }}
          size="small"
        />
      </AccordionForm>

      <AccordionForm title="Contacto">
        <TextField
          id="telefonoPrincipal"
          name="telefonoPrincipal"
          label="Teléfono de contacto principal*"
          value={formik.values?.telefonoPrincipal || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.telefonoPrincipal && Boolean(formik.errors.telefonoPrincipal)}
          helperText={formik.touched.telefonoPrincipal && formik.errors.telefonoPrincipal}
          sx={{ width: { md: "30%" }, pb: { md: 16} }}
          size="small"
        />
        <TextField
          id="telefonoAlternativo"
          name="telefonoAlternativo"
          label="Teléfono de contacto alternativo"
          value={formik.values?.telefonoAlternativo || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.telefonoAlternativo && Boolean(formik.errors.telefonoAlternativo)}
          helperText={formik.touched.telefonoAlternativo && formik.errors.telefonoAlternativo}
          sx={{ width: { md: "30%" }, pb: { md: 16} }}
          size="small"
        />
        <TextField
          id="emailSede"
          name="emailSede"
          label="Email*"
          value={formik.values?.emailSede || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.emailSede && Boolean(formik.errors.emailSede)}
          helperText={formik.touched.emailSede && formik.errors.emailSede}
          sx={{ width: { md: "30%" }, pb: { md: 16} }}
          size="small"
        />
        <TextField
          id="diayhorario"
          name="diayhorario"
          label="Días y horarios de atención"
          value={formik.values?.diayhorario || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.diayhorario && Boolean(formik.errors.diayhorario)}
          helperText={formik.touched.diayhorario && formik.errors.diayhorario}
          sx={{ width: { md: "30%" }, pb: { md: 16} }}
          size="small"
        />
      </AccordionForm>
    </FormikProvider>
  );
}

export default InputsSede;

// const dummy = () => {console.log('...')}
// export default dummy