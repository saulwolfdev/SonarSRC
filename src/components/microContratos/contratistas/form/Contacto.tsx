import AutocompleteUpdateCreate from "@/components/shared/AutocompleteCreateUpdate";
import { Box, TextField } from "@mui/material";
import { IdOption } from "@/types/microContratos/GenericTypes";
import { useCallback, useEffect, useState } from "react";
import { fetchLocalidadesContratistas } from "@/services/microContratos/contratistasService";
import {
  ListaPaisesRequest,
  ListaProvinciasRequest,
  UbicacionesGeograficasFiltradasRequest,
} from "@/types/microMaestros/ubicacionGeograficaTypes";
import {
  fetchPaises,
  fetchProvincias,
  fetchUbicaciones,
} from "@/services/microMaestros/ubicacionGeograficaService";

interface ContactoProps {
  formik: any;
  formikChange: any;
  response?: any;
  withoutIntegration?: boolean;
  isView?: boolean;
}

export default function Contacto({
  formik,
  formikChange,
  response,
  withoutIntegration,
  isView,
}: ContactoProps) {
  const [paisSeleccionado, setPaisSeleccionado] = useState<IdOption | null>({
    id: 1,
    label: "Argentina",
  });
  const [provinciaSeleccionada, setProvinciaSeleccionada] =
    useState<IdOption | null>(null);
  const [localidadSeleccionada, setLocalidadSeleccionada] =
    useState<IdOption | null>(null);

  const buscarProvincias = useCallback(async (busqueda?: string): Promise<IdOption[]> => {
    const filtros: ListaProvinciasRequest = { nombre: busqueda };
    const listaProvincias = await fetchProvincias(filtros);

    return listaProvincias.data.map((p: any) => {
      const provinciaSeleccion: IdOption = {
        id: p.id,
        label: p.nombre,
      };
      return provinciaSeleccion;
    });
  }, [])

  const buscarPaises = useCallback(async (busqueda?: string): Promise<IdOption[]> => {
    const filtros: ListaPaisesRequest = { nombre: busqueda };
    const listaPaises = await fetchPaises(filtros);

    return listaPaises.data.map((p) => {
      const paisSeleccion: IdOption = {
        id: p.id,
        label: p.nombre,
      };
      return paisSeleccion;
    });
  }, [])

  const handleChangePais = (event: any, newValue: any) => {
    if (newValue?.id && newValue?.label) {
      setPaisSeleccionado(newValue);
      formik.setFieldValue("paisNombre", newValue.label);
      formik.setFieldValue("paisId", newValue.id);
    }
  };

  const handleChangeProvincia = (event: any, newValue: any) => {
    if (newValue?.id && newValue?.label) {
      setProvinciaSeleccionada(newValue);
      formik.setFieldValue("provinciaNombre", newValue?.label || null);
      formik.setFieldValue("provinciaId", newValue?.id || null);
    }
  };

  const handleChangeLocalidad = async (event: any, newValue: any) => {
    if (newValue?.id && newValue?.label) {
      setLocalidadSeleccionada(newValue);
      formik.setFieldValue("localidadNombre", newValue?.label || null);
      formik.setFieldValue("localidadId", newValue?.id || null);

      const request: UbicacionesGeograficasFiltradasRequest = {
        localidadId: newValue.id,
      };

      try {
        const response = await fetchUbicaciones(request);
        if (response.data && response.data.length > 0) {
          const ubicacion = response.data[0];
          formik.setFieldValue(
            "codigoPostalNombre",
            ubicacion.codigoPostalCodigo || null
          );
          formik.setFieldValue(
            "codigoPostalId",
            ubicacion.codigoPostalId || null
          );
        } else {
          formik.setFieldValue("codigoPostalNombre", "");
          formik.setFieldValue("codigoPostalId", null);
        }
      } catch (error) {
        console.error("Error al obtener ubicaciones geográficas: ", error);
      }
    }
  };

  useEffect(() => {
    if (response) {
      setPaisSeleccionado({
        id: response.ubicacion.paisId,
        label: response.ubicacion.paisNombre,
      });
      setProvinciaSeleccionada({
        id: response.ubicacion.provinciaId,
        label: response.ubicacion.provinciaNombre,
      });
      setLocalidadSeleccionada({
        id: response.ubicacion.localidadId,
        label: response.ubicacion.localidadNombre,
      });
      if (response.ubicacion.localidadId) {
        formik.setFieldValue(
          "codigoPostalNombre",
          response.ubicacion.codigoPostalNombre || null
        );
        formik.setFieldValue(
          "codigoPostalId",
          response.ubicacion.codigoPostalId || null
        );
      }
    }
  }, [response]);


  return (
    <>
     {/*todo bloquear :
       + manual rol compras - contratista
      */}
    {formik ? (
     <>
      <AutocompleteUpdateCreate
        idText="pais"
        name="pais"
        label="País*"
        disabled={isView ||!withoutIntegration}
        value={paisSeleccionado}
        fetchOptions={buscarPaises}
        onChange={handleChangePais}
        formikChange={formikChange}
        onBlur={formik.handleBlur}
        error={formik.touched.pais && Boolean(formik.errors.pais)}
        helperText={formik.touched.pais && formik.errors.pais}
        className='input-position-1-of-3'
      />

      <AutocompleteUpdateCreate
        idText="provincia"
        name="provincia"
        label="Provincia"
        disabled={isView || !withoutIntegration}
        value={provinciaSeleccionada}
        fetchOptions={buscarProvincias}
        onChange={handleChangeProvincia}
        formikChange={formikChange}
        onBlur={formik.handleBlur}
        error={formik.touched.provincia && Boolean(formik.errors.provincia)}
        helperText={formik.touched.provincia && formik.errors.provincia}
        className="input-position-2-or-3-of-3"
      />

      <AutocompleteUpdateCreate
        idText="localidad"
        name="localidad"
        label="Localidad"
        disabled={isView ||!provinciaSeleccionada || !withoutIntegration}
        value={localidadSeleccionada}
        fetchOptions={fetchLocalidadesContratistas}
        onChange={handleChangeLocalidad}
        formikChange={formikChange}
        onBlur={formik.handleBlur}
        error={formik.touched.localidad && Boolean(formik.errors.localidad)}
        helperText={formik.touched.localidad && formik.errors.localidad}
        className="input-position-2-or-3-of-3"
      />

      <TextField
        id="codigoPostalNombre"
        name="codigoPostalNombre"
        label="Código Postal"
        disabled={isView || !withoutIntegration}
        value={formik.values.codigoPostalNombre}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.codigoPostalNombre && Boolean(formik.errors.codigoPostalNombre)
        }
        helperText={formik.touched.codigoPostalNombre && formik.errors.codigoPostalNombre}
        size="small"
       className="input-position-1-of-3"
      />
      <TextField
        id="calle"
        name="calle"
        label="Calle*"
        disabled={isView || !withoutIntegration}
        value={formik.values.calle}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.calle && Boolean(formik.errors.calle)}
        helperText={formik.touched.calle && formik.errors.calle}
        className="input-position-2-or-3-of-3"
        size="small"
      />
      <TextField
        id="nroCalle"
        name="nroCalle"
        label="Número de Calle*"
        disabled={isView || !withoutIntegration}
        value={formik.values.nroCalle}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.nroCalle && Boolean(formik.errors.nroCalle)}
        helperText={formik.touched.nroCalle && formik.errors.nroCalle}
        className="input-position-2-or-3-of-3"
        size="small"
      />

      <TextField
        id="piso"
        name="piso"
        label="Piso"
        disabled={isView || !withoutIntegration}
        value={formik.values.piso}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.piso && Boolean(formik.errors.piso)}
        helperText={formik.touched.piso && formik.errors.piso}
        className="input-position-1-of-3"
        size="small"
      />
      <TextField
        id="departamento"
        name="departamento"
        label="Departamento"
        disabled={isView || !withoutIntegration}
        value={formik.values.departamento}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.departamento && Boolean(formik.errors.departamento)
        }
        helperText={formik.touched.departamento && formik.errors.departamento}
       className="input-position-2-or-3-of-3"
        size="small"
      />
      <TextField
        id="telefono"
        name="telefono"
        label="Teléfono*"
        disabled={isView || !withoutIntegration}
        value={formik.values.telefono}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.telefono && Boolean(formik.errors.telefono)}
        helperText={formik.touched.telefono && formik.errors.telefono}
        className="input-position-2-or-3-of-3"
        size="small"
      />

      <TextField
        disabled={isView}
        id="nombreContactoComercial"
        name="nombreContactoComercial"
        label="Nombre Contacto Comercial*"
        value={formik.values.nombreContactoComercial}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.nombreContactoComercial &&
          Boolean(formik.errors.nombreContactoComercial)
        }
        helperText={
          formik.touched.nombreContactoComercial &&
          formik.errors.nombreContactoComercial
        }
        className="input-position-1-of-3"
        size="small"
      />
      <TextField
        type="email"
        id="emailContactoComercial"
        name="emailContactoComercial"
        label="Email Comercial*"
        disabled={isView || !withoutIntegration}
        value={formik.values.emailContactoComercial}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.emailContactoComercial &&
          Boolean(formik.errors.emailContactoComercial)
        }
        helperText={
          formik.touched.emailContactoComercial &&
          formik.errors.emailContactoComercial
        }
        className="input-position-2-or-3-of-3"
        size="small"
      />
      </> ) : null}
    </>
  );
}
