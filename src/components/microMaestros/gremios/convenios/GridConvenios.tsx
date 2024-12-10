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
import useQueryString from "@/hooks/useQueryString"
import { useSearchParams } from "next/navigation"
import { ConvenioGridData } from "@/types/microMaestros/convenioGremioTypes"
import { useCodigosStore } from "@/zustand/microMaestros/gremios/useCodigosStore"
import { getSerchParams } from "@/utils/microMaestros/conveniosGremiosUtils"
import { exportConvenios } from "@/services/microMaestros/conveniosGremiosService"
import ExportButton from "@/components/shared/ExportButton"
import { AnyRecord } from "dns"
import { typeAlert } from "@/components/shared/SnackbarAlert"
import { PaginacionAPI } from "@/types/microContratos/GenericTypes"
import { useRouterPush } from "@/hooks/useRouterPush"

interface GridConveniosProps {
  convenios: ConvenioGridData[] | undefined
  pagination?: PaginacionAPI
  handleModalOpenEstado: (id: number, setRowId: any, setModalOpen: any) => void
  handleApplySort: any
  setAlertMessage: (message: string) => void, 
  setAlertType: (type: typeAlert | undefined) => void
  setRowId: any
  setModalOpen: any
}

const GridConvenios = ({
  convenios,
  pagination,
  handleModalOpenEstado,
  handleApplySort,
  setAlertMessage, 
  setAlertType,
  setRowId,
  setModalOpen
}: GridConveniosProps) => {
  const routerPush = useRouterPush();

  const [lastSortModel, setLastSortModel] = useState({ field: '', sort: '' });
  const { modifyQueries, removeQueries } = useQueryString();
  const searchParams = useSearchParams();
  
  const updateCodigoConvenioColectivo = useCodigosStore((state) => state.updateCodigoConvenioColectivo)
  const updateNombreConvenioColectivo = useCodigosStore((state) => state.updateNombreConvenioColectivo)

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

const goToDetalles = (id: number, nombre: string) =>{
  routerPush(`/microMaestros/gremios/conveniosDetalles`)
  updateCodigoConvenioColectivo(id.toString())
  updateNombreConvenioColectivo(nombre)
}

const getActionItems = React.useCallback(
  (isActive: boolean, id: number, nombre:string) => [
    <GridActionsCellItem
      key={`detalle-${id}`}
      onClick={() => goToDetalles(id, nombre)}
      label="Ver detalle"
      showInMenu
    />
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
      headerName: "Convenio",
      flex: 1,
      minWidth: 80,
      maxWidth: 140,
    },
    {
      field: "horasDiariasDeTrabajo",
      headerName: "Horas de trabajo diarias",
      flex: 1,
      minWidth: 40,
      maxWidth: 200,
      valueFormatter: (params: any) => {
        const array = params.split(":"); 
        const minutes = array[1] != '00' ? `,${array[1]}` : ''
        return `${array[0]}${minutes}`;
      },
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
      minWidth: 60,
      renderCell: (params) => (
        <Box className='cellEstadoDataGrid'>
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
         <ExportButton
              getSerchParams={() => getSerchParams(searchParams)}
              exportFunction={exportConvenios}
              documentName={"Listado de Convenios colectivos"}
              setAlertMessage={setAlertMessage}
              setAlertType={setAlertType}
            />
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
       rowHeight={70}
        rows={convenios}
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
      />
    </Box>
  )
}

export default GridConvenios
