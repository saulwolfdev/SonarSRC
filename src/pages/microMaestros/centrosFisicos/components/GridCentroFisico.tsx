import PaginationCustom from "@/components/shared/PaginationCustom"
import { Box, Typography } from "@mui/material"
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
} from "@mui/x-data-grid"
import React, { useCallback, useState } from "react"
import { ChipCustom, StatusChip } from "@/components/shared/ChipsCustom"
import { CentroFisicoGridData } from "@/types/microMaestros/centrosFisicosTypes"
import { useRouter } from "next/router"
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes"
import { useRouterPushQuery } from "@/hooks/useRouterPush"

interface GridCentroFisicoProps {
  centros: CentroFisicoGridData[] | undefined;
  pagination?: PaginacionAPI;
  handleModalOpenEstado: (id: number) => void;
  handleApplySort: any;
  exportButton: React.ReactNode; 
}

const GridCentroFisicos = ({
  centros,
  pagination,
  handleModalOpenEstado,
  handleApplySort,
  exportButton,
}: GridCentroFisicoProps) => {
  const router = useRouter()
  const routerPushQuery = useRouterPushQuery();

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
      routerPushQuery({
        pathname: `/microMaestros/centrosFisicos/editar`,
        query: { id },
      })
    },
    [router]
  )
  const getActionItems = React.useCallback(
    (isActive: boolean, id: number) => [
      <GridActionsCellItem
        key={`edit-${id}`}
        onClick={() => {
          handleEditar(id)
        }}
        label="Editar"
        showInMenu
      />,
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
    [handleEditar, handleModalOpenEstado]
  )

  const columns: GridColDef[] = [
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      minWidth: 40,
      maxWidth: 250,
    },
    {
      field: "clasificacion",
      headerName: "Clasificación",
      flex: 1,
      minWidth: 40,
      maxWidth: 200,
    },
    {
      field: "provincia",
      headerName: "Provincia",
      flex: 1,
      minWidth: 40,
      maxWidth: 160,
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
      minWidth: 40,
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
      getActions: (params: GridRowParams) => getActionItems(params.row.estado, params.row.id),
    },
  ]

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
        rows={centros}
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
  )
}

export default GridCentroFisicos
