import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { IdOption } from "@/types/microMaestros/GenericTypes";

interface AutocompleteFiltroProps {
  label: string;
  value: IdOption | null;
  fetchOptions: (query: string) => Promise<IdOption[]>;
  onChange: (value: IdOption | null) => void;
  getOptionLabel?: (option: IdOption) => string;
}

const AutocompleteFiltro: React.FC<AutocompleteFiltroProps> = ({
  label,
  value,
  onChange,
  fetchOptions,
  getOptionLabel,
}) => {
  const [options, setOptions] = useState<IdOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    fetchOptions(inputValue)
      .then((res) => setOptions(res))
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
    setOptions([]); // Limpiamos las opciones si no hay suficientes caracteres
  }, [inputValue, fetchOptions]);

  return (
    <Autocomplete
      inputValue={inputValue}
      onInputChange={(event, newValue) => setInputValue(newValue)}
      value={value} // Asegúrate de pasar el objeto completo (con id y label)
      onChange={(event, newValue) => onChange(newValue)} // Pasamos el objeto completo
      options={options}
      getOptionLabel={(option) => option?.label || ""} // Asegúrate de siempre obtener el label correcto
      isOptionEqualToValue={(option, value) => option?.id === value?.id} // Comparar por id
      loading={loading}
      noOptionsText="No hay opciones"
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          size="small"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default AutocompleteFiltro;
