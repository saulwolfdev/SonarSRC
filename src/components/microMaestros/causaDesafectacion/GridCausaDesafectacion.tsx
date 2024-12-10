import PaginationCustom from "@/components/shared/PaginationCustom"
import { Box, Chip, Typography } from "@mui/material"
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
} from "@mui/x-data-grid"
import React, { useCallback, useState } from "react"
import { ChipCustom, StatusChip } from "@/components/shared/ChipsCustom"
import { useRouter } from "next/router"
import { CausaDesafectacionGridData } from "@/types/microMaestros/causaDesafectacionTypes"
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes"
import { useRouterPush, useRouterPushQuery } from "@/hooks/useRouterPush"

interface GridCausaDesafectacionProps {
  causasDesafectaciones: CausaDesafectacionGridData[] | undefined;
  pagination?: PaginacionAPI;
  handleModalOpenEstado: (id: number) => void;
  handleApplySort: any;
  exportButton: React.ReactNode; 
}

const GridCausaDesafectacion = ({
  causasDesafectaciones,
  pagination,
  handleModalOpenEstado,
  handleApplySort,
  exportButton,
}: GridCausaDesafectacionProps) => {
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
        pathname: `/microMaestros/causaDesafectacion/editar`,
        query: { id },
      })
    },
    [router]
  )
  
  const getActionItems = React.useCallback(
    (isActive: boolean, id: number) => {
      const actions = []
      if (isActive) {
        actions.push(
          <GridActionsCellItem
            key={`edit-${id}`}
            onClick={() => {handleEditar(id)}}
            label="Editar"
            showInMenu
          />
        );
      }
      actions.push(
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
        )
      );
  
      return actions;
    },
    [router, handleModalOpenEstado]
  );
  
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Codigo",
      flex: 1,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      field: "descripcion",
      headerName: "Descripcion",
      flex: 1,
      minWidth: 80,
      maxWidth: 250,
    },
    {
      field: 'desafectaTodosLosContratos', 
      headerName: 'Desafecta todos los contratos',
      flex: 1,
      minWidth: 80,
      maxWidth: 250,
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Sí' : 'No'}  
          sx={{ width: 60 , bgcolor: params.value? '#E3EBFB' :'#EBEBEB'}} 
        />
      ),
    },
    {
      field: 'reemplazoPersonal', 
      headerName: 'Remplazo personal',
      flex: 1,
      minWidth: 80,
      maxWidth: 200, 
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Sí' : 'No'}  
          sx={{ width: 60 , bgcolor: params.value? '#E3EBFB' :'#EBEBEB'}} 
        />
      ),
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
      getActions: (params: GridRowParams) => getActionItems(params.row.estado, params.row.id),
    }
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
        rows={causasDesafectaciones}
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

export default GridCausaDesafectacion
