import { Box, Card, TextField, Typography } from "@mui/material";
import { useState } from "react";
import RegistrosExistentes from "./RegistrosExistentes";
import {
  AsociacionGremialAPI,
  AsociacionGremialDetalleResponce,
} from "@/types/microMaestros/asociacionGremialTypes";
import {
  fetchAsociacionesGremiales,
  fetchConveniosColectivos,
  fetchProvinciasArgentinasHabilitadas,
} from "@/services/microMaestros/asociacionesGremialesService";
import AutocompleteMultipleUpdateCreate from "@/components/shared/AutocompleteMultipleCreateUpdate";
import { IdOption } from "@/types/microMaestros/GenericTypes";

interface InputsCreateUpdateProps {
  formik: any;
  response?: AsociacionGremialDetalleResponce | null;
}

export function InputsCreateUpdate({
  formik,
  response,
}: InputsCreateUpdateProps) {
  const [asociacionesExisting, setAsociacionesExisting] = useState<
    AsociacionGremialAPI[]
  >([]);
  const [provinciasIdSeleccionadas, setProvinciasIdSeleccionadas] = useState<
    IdOption[]
  >([]);
  const [
    conveniosColectivosIdSeleccionados,
    setConveniosColectivosIdSeleccionados,
  ] = useState<IdOption[]>([]);

  const handleChangeNombre = (event: any) => {
    formik.handleChange(event);
    if (event.target.value.length > 2) {
      fetchAsociacionesGremiales({ nombre: event.target.value })
        .then((response) => {
          setAsociacionesExisting(response.data);
        })
        .catch((error) => {});
    } else {
      setAsociacionesExisting([]);
    }
  };

  const formikChange = (event: any) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const handleChangeProvinciasIdSeleccionadas = (event: any, newValue: any) => {
    setProvinciasIdSeleccionadas(newValue);
  };

  const handleChangeConveniosColectivosIdSeleccionados = (
    event: any,
    newValue: any
  ) => {
    setConveniosColectivosIdSeleccionados(newValue);
  };
  return (
    <Box className="box-form-create-update">
      <Typography
        variant="body1"
        sx={{
          fontWeight: "bold",
          color: "grey",
          mt: { md: 15 },
          ml: { md: 21 },
        }}
      >
        Definición general
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
      <TextField
        id="nombre"
        name="nombre"
        label="Nombre*"
        value={formik.values.nombre}
        onChange={handleChangeNombre}
        onBlur={formik.handleBlur}
        error={formik.touched.nombre && Boolean(formik.errors.nombre)}
        helperText={formik.touched.nombre && formik.errors.nombre}
        sx={{
          mt: { md: 15 },
          ml: { md: 21 },
          width: { md: "30%" },
        }}
        size="small"
      />
      <AutocompleteMultipleUpdateCreate
        idText="provinciasId"
        name="provinciasId"
        label="Provincia/s*"
        values={provinciasIdSeleccionadas}
        fetchOptions={fetchProvinciasArgentinasHabilitadas}
        onChange={handleChangeProvinciasIdSeleccionadas}
        formikChange={formikChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.provinciasId && Boolean(formik.errors.provinciasId)
        }
        helperText={formik.touched.provinciasId && formik.errors.provinciasId}
        sx={{
          mt: { md: 15 },
          mr: { md: 21 },
          ml: { md: 21 },
          width: { md: "30%" },
        }}
      />
      <AutocompleteMultipleUpdateCreate
        idText="conveniosColectivosId"
        name="conveniosColectivosId"
        label="Convenios Colectivos"
        values={conveniosColectivosIdSeleccionados}
        fetchOptions={fetchConveniosColectivos}
        onChange={handleChangeConveniosColectivosIdSeleccionados}
        formikChange={formikChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.conveniosColectivosId &&
          Boolean(formik.errors.conveniosColectivosId)
        }
        helperText={
          formik.touched.conveniosColectivosId &&
          formik.errors.conveniosColectivosId
        }
        sx={{
          mt: { md: 15 },
          mr: { md: 21 },
          ml: { md: 21 },
          width: { md: "30%" },
        }}
      />
      </Box>
      <RegistrosExistentes asociacionesExisting={asociacionesExisting} />
    </Box>
  );
}

const dummy = () => {
  console.log("...");
};
export default dummy;
