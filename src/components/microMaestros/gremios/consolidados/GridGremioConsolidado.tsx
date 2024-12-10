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
import { useRouter } from "next/router"
import { GremioConsolidadoGridData } from "@/types/microMaestros/gremiosConsolidadosTypes"
import useQueryString from "@/hooks/useQueryString"
import { useSearchParams } from "next/navigation"
import { useCodigosStore } from "@/zustand/microMaestros/gremios/useCodigosStore"
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes"
import { useRouterPush, useRouterPushQuery } from "@/hooks/useRouterPush"
import ExportButtonModal from "@/components/shared/ExportButtonModal"

interface GridGremiosConsolidadosProps {
  gremiosConsolidados: GremioConsolidadoGridData[] | undefined
  pagination?: PaginacionAPI
  handleModalOpenEstado: (id: number, setRowId: any, setModalOpen: any) => void
  handleApplySort: any
  setOpenExportModal: (open: boolean) => void, 
  setRowId: any
  setModalOpen: any
}

const GridGremiosConsolidados = ({
  gremiosConsolidados,
  pagination,
  handleModalOpenEstado,
  handleApplySort,
  setOpenExportModal,  
  setRowId,
setModalOpen,
}: GridGremiosConsolidadosProps) => {
  const updateCodigoGremioConsolidado = useCodigosStore((state) => state.updateCodigoGremioConsolidado)
  const updateNombreGremioConsolidado = useCodigosStore((state) => state.updateNombreGremioConsolidado)
  const routerPush = useRouterPush();
  const routerPushQuery
 = useRouterPushQuery();

  const searchParams = useSearchParams();
  const [lastSortModel, setLastSortModel] = useState({ field: '', sort: '' });
  const { modifyQueries, removeQueries } = useQueryString();

const handleSortModelChange = (event: any) => {
  if (event.length === 0) {
    /* 
    A la tercera vez que tocas una misma columna ya no se produce un evento ,
    entonces vamos guardando la anterior y lo ordenamos por el metodo contrario
    */
    handleApplySort({
      sortBy: lastSortModel.field,
      orderAsc: lastSortModel.sort == 'asc' ? 'desc' : 'asc',
    }, modifyQueries);
  } else {
    setLastSortModel({ field: event[0].field, sort: event[0].sort });
    handleApplySort({
      sortBy: event[0].field,
      orderAsc: event[0].sort,
    }, modifyQueries);
  }
};

  // const handleEditar = useCallback(
  //   (id: number) => {
  //     routerPushQuery({
  //       pathname: `/microMaestros/gremios/consolidados/editar`,
  //       query: { id },
  //     })
  //   },
  //   [router]
  // )

  const goToAsociacion = (id: number, nombre: string) =>{
    routerPush(`/microMaestros/gremios/asociacionesGremiales`)
    updateCodigoGremioConsolidado(id.toString())
    updateNombreGremioConsolidado(nombre)
  }

  const getActionItems = React.useCallback(
    (isActive: boolean, id: number, nombre: string) => [
      <GridActionsCellItem
        key={`detalle-${id}`}
        onClick={() => goToAsociacion(id, nombre) }
        label="Ver detalle"
        showInMenu

      />,
      /*
      <GridActionsCellItem
        key={`edit-${id}`}
        onClick={() => console.log('todavia no se implementa')}
        label="Editar"
        showInMenu
      />,
      isActive ? (
        <GridActionsCellItem
          key={`deactivate-${id}`}
          onClick={() => handleModalOpenEstado(id,setRowId,setModalOpen)}
          label="Desactivar"
          showInMenu
        />
      ) : (
        <GridActionsCellItem
          key={`activate-${id}`}
          onClick={() => handleModalOpenEstado(id, setRowId,setModalOpen)}
          label="Activar"
          showInMenu
        />
      ),*/
    ],
    [handleModalOpenEstado]
  )

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Código",
      flex: 1,
      minWidth: 50,
      maxWidth: 100,
    },
    {
      field: "nombre",
      headerName: "Gremio consolidado",
      flex: 1,
      minWidth: 40,
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
           <ExportButtonModal setOpenExportModal={setOpenExportModal} />
        </Box>
      ),
      getActions: (params: GridRowParams) => getActionItems(params.row.estado, params.row.id, params.row.nombre),
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
        rows={gremiosConsolidados}
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

export default GridGremiosConsolidados
