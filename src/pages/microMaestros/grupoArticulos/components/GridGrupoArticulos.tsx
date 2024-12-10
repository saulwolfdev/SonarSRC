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
import { GrupoArticulosGridData } from "@/types/microMaestros/grupoArticulosTypes"
import { useRouter } from "next/router"
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes"
import { useRouterPushQuery } from "@/hooks/useRouterPush"

interface GridGrupoArticulosProps {
  centros: GrupoArticulosGridData[] | undefined
  pagination?: PaginacionAPI
  exportButton: React.ReactNode;
  handleApplySort: any
}

const GridGrupoArticulos = ({
  centros,
  pagination,
  handleApplySort,
  exportButton,
}: GridGrupoArticulosProps) => {
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
        pathname: `/microMaestros/grupoArticulos/editar`,
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
    ],
    [handleEditar]
  )

  const columns: GridColDef[] = [
    {
      field: "grupoArticulo",
      headerName: "Grupo de artículo",
      flex: 1,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      field: "descripcion",
      headerName: "Descripción",
      flex: 1,
      minWidth: 100,
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

export default GridGrupoArticulos
