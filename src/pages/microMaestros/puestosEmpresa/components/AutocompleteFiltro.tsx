import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

interface AutocompleteFiltroProps<T extends { id: number }> {
  label: string;
  value: T | null;
  fetchOptions: (query?: string) => Promise<T[]>;
  onChange: (value: T | null) => void;
  getOptionLabel?: (option: T) => string;
}

function AutocompleteFiltro<T extends { id: number }>({
  label,
  value,
  onChange,
  fetchOptions,
  getOptionLabel = (option: T) => String(option),
}: AutocompleteFiltroProps<T>) {
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchOptions()
      .then((res) => setOptions(res))
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
  }, [fetchOptions]);

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      options={options}
      getOptionLabel={getOptionLabel}
      loading={loading}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
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
}

export default AutocompleteFiltro;
