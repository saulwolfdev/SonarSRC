import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { IdOptionCompaniaAseguradora } from "@/types/microContratos/polizaSeguroTypes";

interface AutocompleteCompaniaAseguradoraProps {
  label: string;
  value: IdOptionCompaniaAseguradora | null;
  fetchOptions: (query: string) => Promise<IdOptionCompaniaAseguradora[]>;
  onChange: (event: any, newValue: any) => void;
  formikChange: (event: any) => void;
  getOptionLabel?: (option: IdOptionCompaniaAseguradora) => string;
  idText?: string;
  name?: string;
  sx?: object;
  onBlur: any;
  error: any;
  helperText: any;
  disabled?: boolean;
}

const AutocompleteCompaniaAseguradora: React.FC<AutocompleteCompaniaAseguradoraProps> = ({
  label,
  value,
  onChange,
  fetchOptions,
  getOptionLabel,
  formikChange,
  idText,
  name,
  sx,
  onBlur,
  error,
  helperText,
  disabled = false,
}) => {
  const [options, setOptions] = useState<IdOptionCompaniaAseguradora[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    fetchOptions(inputValue)
      .then((res) => setOptions(res))
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
    setOptions([]);
  }, [inputValue, fetchOptions]);

  return (
    <Autocomplete
      sx={sx || {}}
      inputValue={inputValue}
      onInputChange={(event, newValue) => setInputValue(newValue)}
      value={value}
      onChange={(event, newValue) => {
        onChange(event, newValue);
        if (newValue) {
          formikChange({ target: { name, value: newValue.id } });
        }
      }}
      options={options}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      loading={loading}
      noOptionsText="No hay opciones"
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          id={idText}
          name={name}
          label={label}
          variant="outlined"
          size="small"
          onBlur={onBlur}
          error={error}
          helperText={helperText}
          disabled={disabled}
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

export default AutocompleteCompaniaAseguradora;
