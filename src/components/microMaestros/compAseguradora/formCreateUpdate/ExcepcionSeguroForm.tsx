import AutocompleteUpdateCreate from '@/components/shared/AutocompleteCreateUpdate'
import { Box, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import React, { Dispatch, SetStateAction, useState } from 'react'
import { FormikErrors, FormikProps } from 'formik';
import { CompaniasAseguradorasDetalleDTO, ExcepcionSeguroCreateRequest, ExcepcionSeguroUpdateRequest, FormikCompaniaAseguradoraCreateOrUpdateRequest } from '@/types/microMaestros/companiasAseguradorasTypes';
import AutocompleteMultipleCreateUpdate from '@/components/shared/AutocompleteMultipleCreateUpdate';
import { fetchContratista } from '@/services/microMaestros/CompaniasAseguradorasService';
import { IdOption } from '@/types/microMaestros/GenericTypes';

interface ExcepcionSeguroFormProps {
    formik: FormikProps<FormikCompaniaAseguradoraCreateOrUpdateRequest>;
    index: number;
    tiposSegurosSeleccionados: IdOption[];
    excepcion: ExcepcionSeguroUpdateRequest;
    response?: CompaniasAseguradorasDetalleDTO | null; 
    setTiposSegurosSeleccionados: Dispatch<SetStateAction<IdOption[]>>;
    fetchTipoDeSeguroNoSeleccionados : (query: string) => Promise<IdOption[]>
  }
  

function ExcepcionSeguroForm({ 
    formik,
    excepcion,
    index,
    tiposSegurosSeleccionados,
    setTiposSegurosSeleccionados,
    fetchTipoDeSeguroNoSeleccionados,
    response
} : ExcepcionSeguroFormProps) {

    const [contratistasSeleccionada, setContratistasSeleccionada] = useState<IdOption[]>(
        response ?
            Array.from(new Map(
                response.excepcionesSeguros
                    .flatMap(e => e.contratistas.map(c => [c.bdOrigenId, { id: Number(c.bdOrigenId), label: c.razonSocial }]))
            ).values())
            : []
    );

    const handleAddExcepcion = async () => {
        const newExcepcion = { tipoSeguroId: 0, contratistasIds: [] };
        formik.setFieldValue('excepcionesSeguros', [...formik.values.excepcionesSeguros, newExcepcion]);
    };

    const handleRemoveExcepcion = (index: number) => {
        const updatedExcepciones = formik.values.excepcionesSeguros.filter((_, i) => i !== index);
        formik.setFieldValue('excepcionesSeguros', updatedExcepciones);
    };

    const handleChangeTipoDeSeguro = (event: any, newValue: IdOption | null, index: number) => {
        if (newValue) {
            setTiposSegurosSeleccionados(values => [...values, newValue]);
        }
        const updated = [...formik.values.excepcionesSeguros]
        updated[index].tipoSeguroId = newValue ? newValue.id : 0;
        formik.setFieldValue('excepcionesSeguros', updated);
    };

    const getErrorContratista = (index: number) => {
        const excepcionesSegurosErrors = formik.errors.excepcionesSeguros;
    
        if (Array.isArray(excepcionesSegurosErrors) && excepcionesSegurosErrors[index]) {
          const errorObj = excepcionesSegurosErrors[index] as FormikErrors<ExcepcionSeguroCreateRequest>;
          return errorObj.contratistasIds as string || "";
        }
      
        return "";
      }

      const handleChangeContratista = (event: any, newValue: IdOption[], index: number) => {
        setContratistasSeleccionada((values) =>
            Array.from(
                new Map(
                    [...values, ...newValue].map(item => [item.id, item])
                ).values()
            )
        );

        const updated = [...formik.values.excepcionesSeguros]
        updated[index].contratistasIds = newValue.map(o => o.id);
        formik.setFieldValue('excepcionesSeguros', updated);
    };

  return (
    <Box
    key={index}
    sx={{
      display: "flex",
      alignItems: "center",
      mt: { md: 2 },
      gap: 1,
    }}
  >

    <AutocompleteUpdateCreate
      idText={`tipoDeSeguroExceptuadoId-${index}`}
      name={`tipoDeSeguroExceptuadoId-${index}`}
      label="Tipo de seguro"
      value={tiposSegurosSeleccionados.find( ts => ts.id == excepcion.tipoSeguroId) ?? null}
      fetchOptions={fetchTipoDeSeguroNoSeleccionados}
      onChange={(e, newValue) => handleChangeTipoDeSeguro(e, newValue, index)}
      formikChange={() => {}}
      onBlur={formik.handleBlur}
      error={""}
      helperText={""}
      sx={{
        mt: { md: 15 },
        ml: { md: 21 },
        mb: { md: 21 },
        color: 'black',
        width: "30%",
      }}
    />
    <AutocompleteMultipleCreateUpdate
      idText={`contratistas-${index}`}
      name={`contratistas-${index}`}
      label="Contratista"
      values={contratistasSeleccionada.filter( c => formik.values.excepcionesSeguros[index].contratistasIds.includes(c.id) )}
      fetchOptions={fetchContratista}
      onChange={(e, newValue) => handleChangeContratista(e, newValue, index)}
      formikChange={() => {}}
      onBlur={formik.handleBlur}
      error={getErrorContratista(index)}
      helperText={getErrorContratista(index)}
      sx={{
        mt: { md: 15 },
        ml: { md: 21 },
        mb: { md: 21 },
        color: 'black',
        width: "30%",
      }}
    />
    <IconButton
      onClick={() => handleRemoveExcepcion(index)}
      disabled={formik.values.excepcionesSeguros.length === 1}
      sx={{ ml: 1, color: 'black' }}
    >
      <DeleteOutlineIcon />
    </IconButton>
    <IconButton
      onClick={handleAddExcepcion}
      sx={{ ml: 1, color: 'black' }}
    >
      <AddIcon />
    </IconButton>
  </Box>
  )
}

export default ExcepcionSeguroForm