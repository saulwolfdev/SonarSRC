import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

interface ClasificationSearchProps {
  label: string;
  value: string;
  fetchOptions: (query: string) => Promise<string[]>;
  onChange: (value: string) => void;
  getOptionLabel?: (option: string) => string;
}

const ClasificationSearch: React.FC<ClasificationSearchProps> = ({
  label,
  value,
  onChange,
  fetchOptions,
  getOptionLabel,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = async (event: React.SyntheticEvent, newValue: string) => {
    setInputValue(newValue);

    if (newValue.length < 3) {
      setOptions([]);
      return;
    }

    setLoading(true);

    try {
      const fetchedOptions = await fetchOptions(newValue);
      setOptions(fetchedOptions);
    } catch (error) {
      console.error('Error fetching options:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Autocomplete
      inputValue={inputValue}
      onInputChange={handleInputChange}
      value={value}
      onChange={(event, newValue) => onChange(newValue || "")}
      options={options}
      getOptionLabel={getOptionLabel || ((option) => option)}
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
