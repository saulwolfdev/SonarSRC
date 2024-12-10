"use Client";

import {
  Alert,
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  IdOptionCompaniaAseguradora,
  PolizaSeguroResponse,
} from "@/types/microContratos/polizaSeguroTypes";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AutocompleteCompaniaAseguradora from "./AutocompleteCompaniaAseguradora";
import {
  fecthCompaniaAseguradoraByCuit,
  fecthCompaniaAseguradoraByName,
  fecthTiposSeguros,
} from "@/services/microContratos/polizaSeguroService";
import { PickerValidDate } from "@mui/x-date-pickers/models";
import { typeAlert } from "@/components/shared/SnackbarAlert";
import moment from "moment";
import LocalizationProviderCustom from "@/components/shared/LocalizationProviderCustom";
import dayjs from "dayjs";

interface InputsCreateUpdateProps {
  formik: any;
  recusosAfetcados?: boolean;
  response?: PolizaSeguroResponse;
}

export function InputsCreateUpdate({
  formik,
  recusosAfetcados,
  response,
}: InputsCreateUpdateProps) {
  const [companiaAseguradoraSeleccionada, setCompaniaAseguradoraSeleccionada] =
    useState<IdOptionCompaniaAseguradora | null>(null);
  const [seguroSeleccionado, setSeguroSeleccionado] = useState<number>(0);
  const [seguros, setSeguros] = useState<any>([]);
  const [open, setOpen] = useState(recusosAfetcados);

  const [selectedDate, setSelectedDate] = useState<PickerValidDate | null>(null);

  const formikChange = (event: any) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const handleChangeCompaniaAseguradora = async (event: any, newValue: any) => {
    setCompaniaAseguradoraSeleccionada(newValue);
    formikChange({
      target: {
        name: "companiaAseguradoraId",
        value: newValue.id,
      },
    });
  };

  const handleChangeTipoSeguro = (event: any) => {
    const value = event.target.value;
    setSeguroSeleccionado(Number(value));
    formik.setFieldValue("tipoSeguroId", Number(value));
  };

  useEffect(() => {
    const funct = async () => {
      if (companiaAseguradoraSeleccionada?.id) {
        const segurosArray = await fecthTiposSeguros(
          companiaAseguradoraSeleccionada.id
        );
        setSeguros(segurosArray);
      }
    };

    funct();
  }, [companiaAseguradoraSeleccionada]);

  useEffect(() => {
    if (response) {
      setCompaniaAseguradoraSeleccionada({
        id: response.companiaAseguradora.id,
        nombre: response.companiaAseguradora.nombre,
        cuit: response.companiaAseguradora.cuit.toString(),
        observacion: response.companiaAseguradora.observacion,
      });
      setSeguroSeleccionado(Number(response.tipoSeguro.id));
      setSelectedDate(dayjs(response.vigencia));
    }
  }, [response]);

  return (
    <Box className="box-form-create-update">
      <Typography
        variant="body1"
        sx={{
          fontWeight: "bold",
          color: "grey",
          mt: { md: 25 },
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
          justifyContent: "flex-start",
        }}
      >
        { open && 
        <Alert
          severity={typeAlert.warning}
          onClose={() => {setOpen(false)}}
          sx={{ mt: { md: 25 }, ml: { md: 21 },  mr: { md: 21 } ,width: { md: "100%" } }}
        >
          <b>Póliza asociada a persona o vehículo.</b> El único campo editable
          es vigencia.
        </Alert>}

        <AutocompleteCompaniaAseguradora
          disabled={recusosAfetcados}
          idText="companiaAseguradoraId"
          name="companiaAseguradoraId"
          label="Comapañia aseguradora*"
          value={companiaAseguradoraSeleccionada}
          getOptionLabel={(option) => option?.nombre || ""}
          fetchOptions={fecthCompaniaAseguradoraByName}
          onChange={handleChangeCompaniaAseguradora}
          formikChange={formikChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.companiaAseguradoraId &&
            Boolean(formik.errors.companiaAseguradoraId)
          }
          helperText={
            formik.touched.companiaAseguradoraId &&
            formik.errors.companiaAseguradoraId
          }
          sx={{
            mt: { md: 25 },
            ml: { md: 21 },
            width: { md: "30%" },
          }}
        />
        <AutocompleteCompaniaAseguradora
          disabled={recusosAfetcados}
          idText="companiaAseguradoraId"
          name="companiaAseguradoraId"
          label="CUIT Comapeñia aseguradora*"
          value={companiaAseguradoraSeleccionada}
          getOptionLabel={(option) => option?.cuit || ""}
          fetchOptions={fecthCompaniaAseguradoraByCuit}
          onChange={handleChangeCompaniaAseguradora}
          formikChange={formikChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.companiaAseguradoraId &&
            Boolean(formik.errors.companiaAseguradoraId)
          }
          helperText={
            formik.touched.companiaAseguradoraId &&
            formik.errors.companiaAseguradoraId
          }
          sx={{
            mt: { md: 25 },
            ml: { md: 21 },
            width: { md: "30%" },
          }}
        />
        <TextField
          id="observacion"
          name="observacion"
          label="Observación"
          value={companiaAseguradoraSeleccionada ? companiaAseguradoraSeleccionada.observacion : ''}
          disabled
          size="small"
          sx={{
            mt: { md: 25 },
            ml: { md: 21 },
            mr: { md: 21 },
            width: { md: "100%" },
          }}
        />

        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          sx={{ mt: { md: 25 }, ml: { md: 21 }, width: { md: "100%" } }}
        >
          <Typography variant="body1" sx={{mr: {md: 50}}}>Tipo seguro*</Typography>
          <RadioGroup
            aria-label="tipoSeguroId"
            name="tipoSeguroId"
            sx={{ display: "flex", flexDirection: "inherit", ml: { md: 8 } }}
            value={seguroSeleccionado}
            onChange={handleChangeTipoSeguro}
          >
            {seguros.length > 0 &&
              seguros.map((seg: { id: number; nombre: string }) => {
                return (
                  <FormControlLabel
                    key={seg.id}
                    value={seg.id}
                    control={<Radio />}
                    label={seg.nombre}
                    disabled={recusosAfetcados}
                  />
                );
              })}
          </RadioGroup>
        </Box>

        <TextField
          disabled={recusosAfetcados}
          size="small"
          name="numero"
          label="N° de póliza*"
          value={formik.values.numero}
          onChange={formikChange}
          onBlur={formik.handleBlur}
          error={formik.touched.numero && Boolean(formik.errors.numero)}
          helperText={formik.touched.numero && formik.errors.numero}
          sx={{
            mt: { md: 25 },
            ml: { md: 21 },
            width: { md: "30%" },
          }}
        />
        <LocalizationProviderCustom>
          <DatePicker
            name="vigencia"
            label="Vigente hasta*"
            value={selectedDate}
            onChange={(newValue) => {
              const formattedDate = newValue?.format("YYYY-MM-DD");
              setSelectedDate(newValue);
              formik.setFieldValue("vigencia", formattedDate);
            }}
            slotProps={{
              textField: {
                onBlur: formik.handleBlur,
                error:
                  formik.touched.vigencia && Boolean(formik.errors.vigencia),
                helperText: formik.touched.vigencia && formik.errors.vigencia,
                sx: {
                  mt: { md: 25 },
                  ml: { md: 21 },
                  width: { md: "30%" },
                  fontSize: "2.5rem",
                },
                size: "small",
              },
            }}
          />
        </LocalizationProviderCustom>
      </Box>
    </Box>
  );
}


const dummy = () => {
  console.log('...')
}
export default dummy