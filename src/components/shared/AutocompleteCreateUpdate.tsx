import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

export interface IdOption {
  id: number;
  label: string;
}

interface AutocompleteUpdateCreateProps {
  label: string;
  value: IdOption | null;
  fetchOptions: (query: string) => Promise<IdOption[]>;
  onChange: (event: any, newValue: any) => void;
  formikChange: (event: any) => void;
  getOptionLabel?: (option: IdOption) => string;
  idText?: string;
  name?: string;
  sx?: object;
  onBlur: any;
  error: any;
  helperText: any;
  disabled?: boolean;
  className?: string
}

const AutocompleteUpdateCreate: React.FC<AutocompleteUpdateCreateProps> = ({
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
  className
}) => {
  const [options, setOptions] = useState<IdOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    if (!disabled) {
      fetchOptions(inputValue)
        .then((res) => setOptions(res))
        .catch(() => setOptions([]))
        .finally(() => setLoading(false));
    } else {
      setOptions([]);
      setLoading(false);
    }
  }, [inputValue, fetchOptions]); 

  return (
    <Autocomplete
      className={className}
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
      getOptionLabel={(option) => option?.label || ""}
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

export default AutocompleteUpdateCreate;
