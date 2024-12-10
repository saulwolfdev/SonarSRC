"use Client";

import { Box, TextField, Typography } from "@mui/material";
import AutocompleteMultipleCreateUpdate from "@/components/shared/AutocompleteMultipleCreateUpdate";

// import RegistrosExistentes from "./RegistrosExistentes";
import { useCallback, useState } from "react";
import {
  CompaniasAseguradorasAPI,
  CompaniasAseguradorasDetalleDTO,
  ExcepcionSeguroCreateRequest,
  FormikCompaniaAseguradoraCreateOrUpdateRequest,
} from "@/types/microMaestros/companiasAseguradorasTypes";
import {
  fetchCompaniasAseguradoras,
  fetchTipoDeSeguro,
} from "@/services/microMaestros/CompaniasAseguradorasService";
import { FormikErrors, FormikProps } from 'formik';
import ExcepcionSeguroForm from "./ExcepcionSeguroForm";
import { IdOption } from "@/types/microMaestros/GenericTypes";

interface InputsCreateUpdateProps {
  formik: FormikProps<FormikCompaniaAseguradoraCreateOrUpdateRequest>;
  response?: CompaniasAseguradorasDetalleDTO | null;
}

export default function InputsCreateUpdate({
  formik,
  response,
}: InputsCreateUpdateProps) {
  const [centrosExisting, setCentrosExisting] = useState<CompaniasAseguradorasAPI[]>([]);
  const [tiposSegurosSeleccionados, setTiposSegurosSeleccionados] =
    useState<IdOption[]>(response ? 
      [
        ...response.excepcionesSeguros.map(e =>({ id: e.tipoSeguro.id, label: e.tipoSeguro.nombre })), 
        ...response.tiposSeguros.map(ts => ({ id: ts.id, label: ts.nombre }))
      ] :
      []);

  
  const handleObservacionesChange = (event: any) => {
    formik.handleChange(event);
  };

  const handleChangeNombre = (event: any) => {
    formik.handleChange(event);
    if (event.target.value.length > 2) {
      fetchCompaniasAseguradoras({ nombre: event.target.value })
        .then((response) => {
          setCentrosExisting(response.data);
        })
        .catch((error) => { });
    } else {
      setCentrosExisting([]);
    }
  };

  const handleChangeCuit = (event: any) => {
    formik.handleChange(event);
    if (event.target.value.length > 2) {
      fetchCompaniasAseguradoras({ cuit: event.target.value })
        .then((response) => {
          setCentrosExisting(response.data);
        })
        .catch((error) => { });
    } else {
      setCentrosExisting([]);
    }
  };

  const handleChangeTipoDeSeguroMulti = (event: any, newValue: IdOption[]) => {
    setTiposSegurosSeleccionados(values => 
      Array.from(
        new Map(
          [...values, ...newValue].map(item => [item.id, item]) 
        ).values()
      )
    );
    formik.setFieldValue('tiposSegurosIds', newValue.map(o => o.id));
  };  

  const fetchTipoDeSeguroNoSeleccionados = useCallback(async (query: string): Promise<IdOption[]> => {
    const tiposSegurosSelecionados = [
      ...formik.values.tiposSegurosIds,
      ...formik.values.excepcionesSeguros.map(e => e.tipoSeguroId),
    ];
    const cantidadResultados = 9 + tiposSegurosSelecionados.length;
    const res = await fetchTipoDeSeguro(query, cantidadResultados);
    return res.filter(o => !tiposSegurosSelecionados.includes(o.id));
  }, [formik.values.tiposSegurosIds, formik.values.excepcionesSeguros]); 
  

  const getErrorTipoSeguroExceptuado = (index: number) => {
    const excepcionesSegurosErrors = formik.errors.excepcionesSeguros;

    if (Array.isArray(excepcionesSegurosErrors) && excepcionesSegurosErrors[index]) {
      const errorObj = excepcionesSegurosErrors[index] as FormikErrors<ExcepcionSeguroCreateRequest>;
      return errorObj.tipoSeguroId as string || "";
    }
  
    return "";
  }

  return (
    <>
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
          <TextField
            id="cuit"
            name="cuit"
            label="CUIT*"
            type="number"
            value={formik.values.cuit}
            onChange={(event) => {
              if (event.target.value.length <= 11) {
                handleChangeCuit(event);
              }
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.cuit && Boolean(formik.errors.cuit)}
            helperText={formik.touched.cuit && formik.errors.cuit}
            sx={{
              mt: { md: 15 },
              ml: { md: 21 },
              width: { md: "30%" },
            }}
            inputProps={{ maxLength: 11 }}
            size="small"
          />


          <AutocompleteMultipleCreateUpdate
            idText="tiposSegurosIds"
            name="tiposSegurosIds"
            label="Tipo de seguro"
            values={tiposSegurosSeleccionados.filter( ts => formik.values.tiposSegurosIds.includes(ts.id) )}
            fetchOptions={fetchTipoDeSeguroNoSeleccionados}
            onChange={handleChangeTipoDeSeguroMulti}
            formikChange={() => {}}
            onBlur={formik.handleBlur}
            error={
              formik.touched.tiposSegurosIds && Boolean(formik.errors.tiposSegurosIds)
            }
            helperText={formik.touched.tiposSegurosIds && formik.errors.tiposSegurosIds}
            sx={{
              mt: { md: 15 },
              mr: { md: 21 },

              width: { md: "30%" },
            }}
          />

          <Box sx={{ mt: { md: 15 }, ml: { md: 21 }, width: { md: "97%" } }}>
            <TextField
              id="observacion"
              name="observacion"
              label="Observaciones*"
              value={formik.values.observacion}
              onChange={handleObservacionesChange}
              onBlur={formik.handleBlur}
              error={formik.touched.observacion && Boolean(formik.errors.observacion)}
              helperText={formik.touched.observacion && formik.errors.observacion}
              inputProps={{ maxLength: 250 }}
              multiline
              rows={4}
              size="small"
              fullWidth // Asegúrate de que el TextField ocupe todo el ancho disponible
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end", // Alinea el contenido a la derecha
                width: "100%", // Asegúrate de que el contenedor ocupe todo el ancho
                color: "black",
                mt: 1, // Ajusta el margen superior para separar del TextField
              }}
            >
              <Typography>
                {formik.values.observacion?.length}/250
              </Typography>
            </Box>
          </Box>
        </Box>

      </Box>
      <br></br>
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
                Habilitado por excepción
            </Typography>
            {formik.values.excepcionesSeguros.map((excepcion, index) => (
                <ExcepcionSeguroForm 
                    key={index}
                    excepcion={excepcion}
                    formik={formik} 
                    index={index} 
                    tiposSegurosSeleccionados={tiposSegurosSeleccionados}
                    fetchTipoDeSeguroNoSeleccionados={fetchTipoDeSeguroNoSeleccionados}
                    setTiposSegurosSeleccionados={setTiposSegurosSeleccionados}
                    response={response}
                     />
            ))}
        </Box>
      {/* <RegistrosExistentes centrosExisting={centrosExisting} /> */}
    </>
  );
}
