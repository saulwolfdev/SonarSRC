import PaginationCustom from "@/components/shared/PaginationCustom"
import { Box } from "@mui/material"
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
} from "@mui/x-data-grid"
import React, { useState } from "react"
import { ContratistasGridData} from "@/types/microContratos/contratistasTypes"
import { ChipCustom, StatusChip } from "@/components/shared/ChipsCustom"
import { PaginacionAPI } from "@/types/microContratos/GenericTypes"
import { useRouterPush, useRouterPushQuery } from "@/hooks/useRouterPush"

interface GridContratistasProps {
  contratistas: ContratistasGridData[] | undefined
  handleModalOpenEstado: (id: number) => void;
  handleApplySort: any;
  pagination?: PaginacionAPI;
  exportButton: React.ReactNode; 
}

const GridContratistas = ({
  contratistas,
  handleModalOpenEstado,
  handleApplySort,
  pagination,
  exportButton
}: GridContratistasProps) => {

  const routerPush = useRouterPush();
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

  const handleEditar = (id: number) => {
    routerPushQuery({ pathname: `/microContratos/contratistas/editar`, query: { id } });
  }
  const handleVerDetalle = (id: number) => {
    routerPushQuery({ pathname: `/microContratos/contratistas/verDetalle`, query: { id } });
  }

  const getActionItems = React.useCallback(
    (isActive: boolean, id: number) => {
      const actions = [];
      actions.push(
      <GridActionsCellItem
        key={`edit-${id}`}
        onClick={() => { handleVerDetalle(id) }}
        label="Ver detalle"
        showInMenu
        sx={{ width: 190 }}
      />)
      isActive && actions.push(
        <GridActionsCellItem
          key={`edit-${id}`}
          onClick={() => { routerPush(`/microContratos/contratistas/editar?id=${id}`) }}
          label="Editar"
          showInMenu
          sx={{ width: 190 }}
        />
      ),
      actions.push(
        isActive ? (
        <GridActionsCellItem
          key={`deactivate-${id}`}
          onClick={() => handleModalOpenEstado(id)}
          label="Desactivar"
          showInMenu
          sx={{ width: 190 }}
        />
      ) : (
        <GridActionsCellItem
          key={`activate-${id}`}
          onClick={() => handleModalOpenEstado(id)}
          label="Activar"
          showInMenu
          sx={{ width: 190 }}
        />
      ))
      return actions;
    },
    [handleEditar, handleModalOpenEstado, handleVerDetalle]
  );
  

  const columns: GridColDef<ContratistasGridData>[] = [
    { field: "numeroIdentificacion", headerName: "N° de identificación", flex: 1, minWidth: 200, maxWidth: 450 },
    { field: "razonSocial", headerName: "Razón Social", flex: 1, minWidth: 150, maxWidth: 250 },
    { field: "paisNombre", headerName: "País", flex: 1, minWidth: 40, maxWidth: 250 },
    { field: "emailContactoComercial", headerName: "Email Comercial", flex: 1, minWidth: 300, maxWidth: 550 },
    { field: "origen", headerName: "Origen", flex: 1, minWidth: 40, maxWidth: 250 },
    { field: "estudioNombre", headerName: "Estudio", flex: 1, minWidth: 40, maxWidth: 250 },
    { field: "sedeNombre", headerName: "Sede", flex: 1, minWidth: 40, maxWidth: 250 },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
      minWidth: 40,
      renderCell: (params) => (
        <Box
          className='cellEstadoDataGrid'
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
      getActions: (params: GridRowParams) => getActionItems(params.row.estado, params.row.id),
      renderHeader: () => (
        <Box
          sx={{
            position: "absolute",
            right: 0,
            bottom: 11,
            display: "flex",
            alignItems: "center",
          }}
        >
          {exportButton}
        </Box>)
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
        rows={contratistas}
        columns={columns}
        getRowHeight={() => 'auto'}
        disableRowSelectionOnClick
        disableColumnMenu
        density="compact"
        onSortModelChange={handleSortModelChange}
        slots={{
          footer: () => (
            <PaginationCustom pagination={pagination!} rowsPerPageOptions={[9, 14, 20]} />
          ),
        }}
        sx={{
          "& .MuiDataGrid-cell": {
            whiteSpace: "normal",
            wordWrap: "break-word",
            height: "auto",
          },
        }}
      />
    </Box>
  )
}

export default GridContratistas
