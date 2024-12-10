
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, useTheme } from '@mui/material';
import Spinner from "@/components/shared/Spinner";
import FilterButton from '@/pages/microMaestros/funcionEstandarizada/components/FilterButton';
import FilterChips from './FilterChips';


interface Data {
  id: number;
  pais: string;
  provincia: string;
  localidad: string;
  codigoPostal: string;
  estado: string;
}

const LayoutMaestros = ({ ...props }) => {
  const { originalData, columns, tituloMaestro, paginationModel, setPaginationModel, modalDeOpciones } = props
  const [loading, setLoading] = useState(true);

  const [filteredData, setFilteredData] = useState<Data[]>(originalData);
  const [filters, setFilters] = useState<[string, string, string][]>([]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hydrationCompleted, setHydrationCompleted] = useState(false);


  const theme = useTheme();
  // const handleModalOpen = () => setModalOpen(true);
  // const handleModalClose = () => setModalOpen(false);
  // const toggleActivation = () => {
  //   setIsActivated(!isActivated);
  //   handleModalClose();
  // };

  const handleApplyFilters = (appliedFilters: { label: string; value: string }[]) => {
    setFilters(appliedFilters.map((filter) => [filter.label, filter.value, `${filter.label}-${filter.value}`]));
  };

  const handleDeleteFilter = (key: string) => {
    setFilters((prevFilters) => prevFilters.filter((filter) => filter[2] !== key));
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  useEffect(() => {
    let filtered = originalData;

    filters.forEach((filter) => {
      filtered = filtered.filter((row: any) =>
        Object.values(row).some((field) =>
          String(field).toLowerCase().includes(filter[1].toLowerCase())
        )
      );
    });

    setFilteredData(filtered);
  }, [filters, originalData]);


  useEffect(() => {
    setHydrationCompleted(true);
    setTimeout(() => setLoading(false), 3000); // Simula una carga de 3 segundos
  }, []);

  if (!hydrationCompleted) {
    return null; // No renderizar hasta que la hidratación esté completa, tira error
  }


  if (loading) {
    return <Spinner />;
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(2),
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: theme.spacing(2),
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: '#1F1F1F',
          }}
        >
          {tituloMaestro}
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <FilterChips filters={filters} onDelete={handleDeleteFilter} />
          <FilterButton onApplyFilters={handleApplyFilters} />
        </Box>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          overflow: 'auto',
          background: '#FFFFFF',
          boxShadow: '0.25rem 0.25rem 0.625rem #D6D6D6',
        }}
      >
        <DataGrid
          rows={filteredData}
          columns={columns}
          autoHeight={true}
          disableRowSelectionOnClick
          hideFooterPagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          slots={{
            footer: () => (
              <></>
            ),
          }}
          sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
              backgroundColor: 'transparent',
              color: '#0065BD',
              fontWeight: 'bold',
            },
          }}
        />
      </Box>
      {modalDeOpciones}
    </Box>
  );
};

export default LayoutMaestros;