import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

interface ClasificationSearchProps {
  label: string;
  value: any;
  fetchOptions: (query: string) => Promise<any[]>;
  onChange: (value: any) => void;
  getOptionLabel?: (option: any) => string;
}

const ClasificationSearch: React.FC<ClasificationSearchProps> = ({
  label,
  value,
  onChange,
  fetchOptions,
  getOptionLabel,
}) => {
  const [inputValue, setInputValue] = useState(''); // Inicializar el input vacío
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Actualizar opciones solo si hay al menos 3 caracteres
  useEffect(() => {
    if (inputValue.length >= 3) {
      setLoading(true);
      fetchOptions(inputValue)
        .then((fetchedOptions) => {
          setOptions(fetchedOptions);
        })
        .catch(() => setOptions([]))
        .finally(() => setLoading(false));
    } else {
      setOptions([]); // Limpiar opciones si no hay suficientes caracteres
    }
  }, [inputValue, fetchOptions]);

  return (
    <Autocomplete
      inputValue={inputValue}
      onInputChange={(event, newValue) => setInputValue(newValue)} // Actualizar el valor del input
      value={value || ''} // Inicializar el valor del select vacío
      onChange={(event, newValue) => onChange(newValue || null)} // Cambiar el valor cuando el usuario selecciona una opción
      options={options} // Mostrar las opciones cuando se cumplan los 3 caracteres
      getOptionLabel={getOptionLabel || ((option) => option.nombre || '')}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
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
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default ClasificationSearch;