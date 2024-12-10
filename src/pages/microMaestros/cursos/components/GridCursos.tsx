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
import { CursosGridData, PaginacionAPI } from "../../../../types/microMaestros/cursosTypes"
import { useRouter } from "next/router"

interface GridCursosProps {
  centros: CursosGridData[] | undefined
  pagination?: PaginacionAPI
  handleModalOpenEstado: (id: number) => void
  handleApplySort: any
}

const GridCursoss = ({
  centros,
  pagination,
  handleModalOpenEstado,
  handleApplySort,
}: GridCursosProps) => {
  const router = useRouter()
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
      router.push({
        pathname: `/microMaestros/cursos/editar`,
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
      field: "id",
      headerName: "Código",
      flex: 1,
      minWidth: 40,
      maxWidth: 250,
    },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      minWidth: 40,
      maxWidth: 250,
    },
    {
      field: "especialidad",
      headerName: "Especialidad",
      flex: 1,
      minWidth: 40,
      maxWidth: 250,
    },
    {
      field: "institucion",
      headerName: "Institución",
      flex: 1,
      minWidth: 40,
      maxWidth: 250,
    },
    {
      field: "modalidad",
      headerName: "Modalidad",
      flex: 1,
      minWidth: 40,
      maxWidth: 250,
    },
    {
      field: "areaSolicitante",
      headerName: "Área solicitante",
      flex: 1,
      minWidth: 40,
      maxWidth: 250,
    },
    {
      field: "horas",
      headerName: "Horas",
      flex: 1,
      minWidth: 40,
      maxWidth: 250,
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
      minWidth: 40,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "100%",
          }}
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
        autoHeight={true}
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

export default GridCursoss
