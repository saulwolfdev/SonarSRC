import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import CancelButton from "@/components/shared/CancelButton";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import { fetchLocalidadesEstudioAuditor } from "@/services/microMaestros/EstudioAuditoresService";
import { IdOption } from "@/types/microMaestros/GenericTypes";
import AutocompleteUpdateCreate from "@/components/shared/AutocompleteCreateUpdate";
import { UbicacionesGeograficasFiltradasRequest } from "@/types/microMaestros/ubicacionGeograficaTypes";
import {
  fetchProvincias,
  fetchUbicaciones,
} from "@/services/microMaestros/ubicacionGeograficaService";
import AccordionForm from "@/components/shared/AcordeonForm";
import { fetchSedeById, putSede } from "@/services/microMaestros/SedesServices";
import { SedeDetalleResponse } from "@/types/microMaestros/SedesTypes";
import Spinner from "@/components/shared/Spinner";

export const EditSede: React.FC = () => {
  const router = useRouter();

  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [provinciaSeleccionada, setProvinciaSeleccionada] =
    useState<IdOption | null>(null);
  const [localidadSeleccionada, setLocalidadSeleccionada] =
    useState<IdOption | null>(null);
  const [id, setId] = useState<number | null>(null);

  useEffect(() => {
    if (router.isReady) {
      setId(Number(router.query.id) || 0);
    }
  }, [router.isReady]);

  const numericId = typeof id === "string" ? parseInt(id) : undefined;

  const handleChangeProvincia = (event: any, newValue: IdOption | null) => {
    setProvinciaSeleccionada(newValue);
    formik.setFieldValue("provincia", newValue?.label || "");
    formik.setFieldValue("localidad", "");
    setLocalidadSeleccionada(null);
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
          formik.setFieldValue("codigoPostal", ubicacion.codigoPostalCodigo);
          formik.setFieldValue("codigoPostalId", ubicacion.codigoPostalId);
        } else {
          formik.setFieldValue("codigoPostal", "");
          formik.setFieldValue("codigoPostalId", null);
        }
      } catch (error) {
        console.error("Error al obtener ubicaciones geográficas: ", error);
      }
    }
  };

  const buscarProvincias = async (busqueda?: string): Promise<IdOption[]> => {
    const listaProvincias = await fetchProvincias({ nombre: busqueda });
    const provinciasUnicas = listaProvincias.data.filter(
      (item: any, index: number, self: any[]) =>
        index === self.findIndex((p: any) => p.id === item.id)
    );
    return provinciasUnicas.map((p: any) => ({ id: p.id, label: p.nombre }));
  };

  useEffect(() => {
    if (numericId !== undefined) {
      fetchSedeById(numericId)
        .then((data: SedeDetalleResponse) => {
          formik.setValues({
            nombre: data.nombre,
            provinciaId: data.provinciaId,
            localidadId: data.localidadId,
            codigoPostalId: data.codigoPostalId,
            calle: data.calle,
            nroCalle: data.nroCalle,
            piso: data.piso || "",
            departamento: data.departamento || "",
            telefonoPrincipal: data.telefonoPrincipal || "",
            telefonoAlternativo: data.telefonoAlternativo || "",
            email: data.email,
            diaYHorario: data.diaYHorario,
          });
        })
        .catch((error) => {
            setAlertMessage("Error al cargar los datos");
          setAlertType(typeAlert.error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [numericId]);

  const formikChange = (event: any) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const validationSchema = Yup.object({
    // nombre: Yup.string()
    //     .min(3, 'Debe tener entre 3 y 80 caracteres.')
    //     .max(80, 'Debe tener entre 3 y 80 caracteres.')
    //     .required('El nombre es obligatorio'),
    // provinciaId: Yup.number().required('La provincia es obligatoria'),
    // localidadId: Yup.number().required('La localidad es obligatoria'),
    // codigoPostalId: Yup.number().required('El código postal es obligatorio'),
    // calle: Yup.string().required('La calle es obligatoria'),
    // nroCalle: Yup.number().required('El número de calle es obligatorio'),
    // telefonoPrincipal: Yup.string().required('El teléfono principal es obligatorio'),
    // email: Yup.string().email('Debe ser un email válido').required('El email es obligatorio'),
    // diaYHorario: Yup.string().required('El horario es obligatorio'),
  });

  const formik = useFormik({
    initialValues: {
      nombre: "",
      provinciaId: 0,
      localidadId: 0,
      codigoPostalId: 0,
      calle: "",
      nroCalle: 0,
      piso: "",
      departamento: "",
      telefonoPrincipal: "",
      telefonoAlternativo: "",
      email: "",
      diaYHorario: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (numericId !== undefined) {
        try {
          await putSede({ id: numericId, ...values });
          setAlertMessage("Se actualizó con éxito");
          setAlertType(typeAlert.success);
          setTimeout(() => {
            router.back();
          }, 1000);
        } catch (error: any) {
          if (error.errors) {
            setAlertMessage(error.response.data.errors[0].description);
          } else {
            setAlertMessage("Error al actualizar la sede");
          }
          setAlertType(typeAlert.error);
        }
      }
    },
  });

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        overflow: "hidden",
      }}
    >
      <SnackbarAlert
        message={alertMessage}
        type={alertType}
        setAlertMessage={setAlertMessage}
        setAlertType={setAlertType}
      />
      <Box
        display="flex"
        alignItems="center"
        sx={{ width: "100%", display: "ruby", mt: 8 }}
      >
        <ArrowbackButton />
        <Typography variant="h1">Editar Sede</Typography>
      </Box>

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ width: "100%", mt: 4 }}
      >
        <AccordionForm title="Definición general/Ubicación">
          <TextField
            id="nombre"
            name="nombre"
            label="Nombre Sede*"
            value={formik.values.nombre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.nombre && Boolean(formik.errors.nombre)}
            helperText={formik.touched.nombre && formik.errors.nombre}
            sx={{ width: { md: "30%" } }}
            size="small"
          />

          <AutocompleteUpdateCreate
            key={provinciaSeleccionada?.id || "localidadId"}
            idText="localidadId"
            name="localidadId"
            label="Provincia*"
            value={provinciaSeleccionada}
            fetchOptions={buscarProvincias}
            onChange={handleChangeProvincia}
            formikChange={formikChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.provinciaId && Boolean(formik.errors.provinciaId)
            }
            helperText={formik.touched.provinciaId && formik.errors.provinciaId}
            sx={{ width: { md: "30%" } }}
            getOptionLabel={(option) => option.label}
          />

          <AutocompleteUpdateCreate
            key={localidadSeleccionada?.id || "localidadId"}
            idText="localidadId"
            name="localidadId"
            label="Localidad*"
            value={localidadSeleccionada}
            fetchOptions={fetchLocalidadesEstudioAuditor}
            onChange={handleChangeLocalidad}
            formikChange={formikChange}
            onBlur={formik.handleBlur}
            disabled={!provinciaSeleccionada} // Deshabilitar si no hay provincia seleccionada
            error={
              formik.touched.localidadId && Boolean(formik.errors.localidadId)
            }
            helperText={formik.touched.localidadId && formik.errors.localidadId}
            sx={{ width: { md: "30%" } }}
          />

          <TextField
            id="calle"
            name="calle"
            label="Calle*"
            value={formik.values.calle}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.calle && Boolean(formik.errors.calle)}
            helperText={formik.touched.calle && formik.errors.calle}
            sx={{ width: { md: "30%" } }}
            size="small"
          />

          <TextField
            id="nroCalle"
            name="nroCalle"
            label="Número*"
            type="number"
            value={formik.values.nroCalle}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.nroCalle && Boolean(formik.errors.nroCalle)}
            helperText={formik.touched.nroCalle && formik.errors.nroCalle}
            sx={{ width: { md: "30%" } }}
            size="small"
          />

          <TextField
            id="piso"
            name="piso"
            label="Piso"
            value={formik.values.piso}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.piso && Boolean(formik.errors.piso)}
            helperText={formik.touched.piso && formik.errors.piso}
            sx={{ width: { md: "30%" } }}
            size="small"
          />

          <TextField
            id="departamento"
            name="departamento"
            label="Depto."
            value={formik.values.departamento}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.departamento && Boolean(formik.errors.departamento)
            }
            helperText={
              formik.touched.departamento && formik.errors.departamento
            }
            sx={{ width: { md: "30%" } }}
            size="small"
          />

          <TextField
            id="codigoPostalId"
            name="codigoPostalId"
            label="Código Postal*"
            value={formik.values.codigoPostalId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.codigoPostalId &&
              Boolean(formik.errors.codigoPostalId)
            }
            helperText={
              formik.touched.codigoPostalId && formik.errors.codigoPostalId
            }
            sx={{ width: { md: "30%" } }}
            size="small"
          />
        </AccordionForm>

        <AccordionForm title="Contacto">
          <TextField
            id="telefonoPrincipal"
            name="telefonoPrincipal"
            label="Teléfono de contacto principal*"
            value={formik.values.telefonoPrincipal}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.telefonoPrincipal &&
              Boolean(formik.errors.telefonoPrincipal)
            }
            helperText={
              formik.touched.telefonoPrincipal &&
              formik.errors.telefonoPrincipal
            }
            sx={{ width: { md: "30%" } }}
            size="small"
          />
          <TextField
            id="telefonoAlternativo"
            name="telefonoAlternativo"
            label="Teléfono de contacto alternativo"
            value={formik.values.telefonoAlternativo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.telefonoAlternativo &&
              Boolean(formik.errors.telefonoAlternativo)
            }
            helperText={
              formik.touched.telefonoAlternativo &&
              formik.errors.telefonoAlternativo
            }
            sx={{ width: { md: "30%" } }}
            size="small"
          />
          <TextField
            id="email"
            name="email"
            label="Email*"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{ width: { md: "30%" } }}
            size="small"
          />
          <TextField
            id="diaYHorario"
            name="diaYHorario"
            label="Días y horarios de atención"
            value={formik.values.diaYHorario}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.diaYHorario && Boolean(formik.errors.diaYHorario)
            }
            helperText={formik.touched.diaYHorario && formik.errors.diaYHorario}
            sx={{ width: { md: "30%" } }}
            size="small"
          />
        </AccordionForm>
      </Box>

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          mt: { md: 40 },
        }}
      >
        <CancelButton />
        <Button
          type="submit"
          variant="contained"
          disabled={!formik.isValid || !formik.dirty}
          className="MuiButton-primary"
          sx={{ ml: { md: 8 } }}
        >
          EDITAR
        </Button>
      </Box>
    </Box>
  );
};

export default EditSede;
