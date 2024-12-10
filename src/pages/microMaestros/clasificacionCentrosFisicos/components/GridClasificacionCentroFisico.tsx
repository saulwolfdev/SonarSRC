import PaginationCustom from "@/components/shared/PaginationCustom";
import { Box } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from "@mui/x-data-grid";
import React, { useCallback, useState } from "react";
import { ClasificacionCentroFisicoGridData } from "@/types/microMaestros/clasificacionCentrosFisicosTypes";
import { ChipCustom, StatusChip } from "@/components/shared/ChipsCustom";
import { useRouter } from "next/router";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";
import { useRouterPushQuery } from "@/hooks/useRouterPush";

interface GridClasificacionCentroFisicoProps {
  clasificaciones: ClasificacionCentroFisicoGridData[] | undefined;
  pagination?: PaginacionAPI;
  handleModalOpenEstado: (id: number) => void;
  handleApplySort: any;
  exportButton: React.ReactNode; // Añadir exportButton como una propiedad
}

const GridClasificacionCentroFisicos = ({
  clasificaciones,
  pagination,
  handleModalOpenEstado,
  handleApplySort,
  exportButton,
}: GridClasificacionCentroFisicoProps) => {
  const routerPushQuery = useRouterPushQuery();
  
  const router = useRouter();

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

  const handleEditar = useCallback(
    (id: number) => {
      routerPushQuery({ pathname: `/microMaestros/clasificacionCentrosFisicos/editar`, query: { id } });
    },
    [router]
  );

  const getActionItems = (isActive: boolean, id: number) => [
    <GridActionsCellItem
      key={`edit-${id}`}
      onClick={() => handleEditar(id)}
      label="Editar"
      showInMenu
    />,
    isActive ? (
      <GridActionsCellItem
        key={`desactivar-${id}`}
        onClick={() => handleModalOpenEstado(id)}
        label="Desactivar"
        showInMenu
      />
    ) : (
      <GridActionsCellItem
        key={`activar-${id}`}
        onClick={() => handleModalOpenEstado(id)}
        label="Activar"
        showInMenu
      />
    ),
  ];

  const columns: GridColDef[] = [
    {
      field: "nombre",
      headerName: "Clasificación",
      flex: 1,
      minWidth: 180,
      maxWidth: 250,
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
      align: "right",
      flex: 0,
      width: 80,
      headerAlign: "right",
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
        rows={clasificaciones}
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

export default GridClasificacionCentroFisicos;
