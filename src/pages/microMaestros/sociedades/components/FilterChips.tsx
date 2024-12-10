import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { FilterChipsProps } from '@/types/microMaestros/sociedadesTypes';


export const FilterChips: React.FC<FilterChipsProps> = ({ filters = [], onDelete }) => {
  // Filtramos solo los filtros que tienen un valor válido
  const appliedFilters = filters.filter((filter) => filter.value !== undefined && filter.value !== '');

  return (
    <Box display="flex" alignItems="center" gap={2}>
      {appliedFilters.length > 0 && (
        <>
          <Typography variant="subtitle1">Filtros aplicados:</Typography>
          {appliedFilters.map((filter) => (
            <Chip
              key={filter.label}
              label={`${filter.label}: ${filter.value}`}
              onDelete={() => onDelete(filter.label)} // Eliminamos el filtro por su label
              color="primary"
              variant="outlined"
            />
          ))}
        </>
      )}
    </Box>
  );
};

export default FilterChips;
