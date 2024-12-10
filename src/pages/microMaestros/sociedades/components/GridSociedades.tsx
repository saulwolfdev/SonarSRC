import PaginationCustom from "@/components/shared/PaginationCustom";
import { Box } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from "@mui/x-data-grid";
import React, { useState } from "react";
import { ChipCustom, StatusChip } from "@/components/shared/ChipsCustom";
import { GridSociedadesProps } from "@/types/microMaestros/sociedadesTypes";

const GridSociedades = ({
  sociedades,
  pagination,
  handleModalOpenEstado,
  exportButton,
  handleApplySort,

}: GridSociedadesProps) => {

  const [lastSortModel, setLastSortModel] = useState({ field: '', sort: '' });

  const handleSortModelChange = (event: any) => {
    if (event.length === 0) {
      /* 
      A la tercera vez que tocas una misma columna ya no se produce un evento ,
      entonces vamos guardando la anterior y lo ordenamos por el metodo contrario
      */
      handleApplySort({
        sortBy: lastSortModel.field,
        orderAsc: lastSortModel.sort == 'asc' ? 'desc' : 'asc',
      });
    } else {
      setLastSortModel({ field: event[0].field, sort: event[0].sort });
      handleApplySort({
        sortBy: event[0].field,
        orderAsc: event[0].sort,
      });
    }
  };

  const getActionItems = React.useCallback(
    (isActive: boolean, id: number) => [
      isActive ? (
        <GridActionsCellItem
          key={`deactivate-${id}`}
          onClick={() => handleModalOpenEstado(id)}
          label="Desactivar"
          showInMenu
        />
      ) : (
        <GridActionsCellItem
          key={`activate-${id}`}
          onClick={() => handleModalOpenEstado(id)}
          label="Activar"
          showInMenu
        />
      ),
    ],
    [handleModalOpenEstado]
  );

  const columns: GridColDef[] = [
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      minWidth: 80,
      maxWidth: 240,
    },
    {
      field: "origen",
      headerName: "Origen",
      flex: 1,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      field: "codigoSap",
      headerName: "CodigoSap",
      flex: 1,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
      minWidth: 60,
      renderCell: (params) => (
        <Box
          className="cellEstadoDataGrid"
        >
          <ChipCustom
            label={params.value ? "Activo" : "Inactivo"}
            status={params.value ? StatusChip.success : StatusChip.disabled}
          />
        </Box>
      ),
    },
    {
      field: "actions",
      type: "actions",
      flex: 0,
      width: 80,
      headerAlign: "right",
      align: "right",
      renderHeader: () => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
          }}
        >
          {exportButton}
        </Box>
      ),
      getActions: (params: GridRowParams) =>
        getActionItems(params.row.estado, params.row.id),
    },
  ];


  // const handlePageChange = useCallback(
  //   (newPage: number) =>
  //     setPaginationModel((prev) => ({ ...prev, page: newPage })),
  //   []
  // );

  // const handleRowsPerPageChange = useCallback(
  //   (rowsPerPage: number) =>
  //     setPaginationModel((prev) => ({
  //       ...prev,
  //       pageSize: rowsPerPage,
  //       page: 0,
  //     })),
  //   []
  // );

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "100%",
        overflow: "auto",
        background: "#FFFFFF",
        height: "100%",
        boxShadow: "0.25rem 0.25rem 0.625rem #D6D6D6",
      }}
    >
      <DataGrid
        rows={sociedades}
        columns={columns}
        getRowHeight={() => 'auto'}
        rowHeight={70}
        disableRowSelectionOnClick
        disableColumnMenu
        density="compact"
        onSortModelChange={handleSortModelChange}
        slots={{
          footer: () => (
            <PaginationCustom pagination={pagination!} rowsPerPageOptions={[9, 14, 20]} />
          ),
        }}
      />
    </Box>
  );
};

export default GridSociedades;
