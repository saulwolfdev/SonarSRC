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
import { CompaniasAseguradorasGridData} from "@/types/microMaestros/companiasAseguradorasTypes"
import { useRouter } from "next/router"
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes"
import { useRouterPushQuery } from "@/hooks/useRouterPush"

interface GridCompaniasAseguradorasProps {
  compAseguradas: CompaniasAseguradorasGridData[] | undefined
  pagination?: PaginacionAPI
  handleModalOpenEstado: (id: number) => void
  handleApplySort: any
}

const GridCompaniasAseguradoras = ({
  compAseguradas,
  pagination,
  handleModalOpenEstado,
  handleApplySort,
}: GridCompaniasAseguradorasProps) => {
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
        pathname: `/microMaestros/compAseguradoras/editar`,
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
      field: "cuit",
      headerName: "CUIT",
      flex: 1,
      minWidth: 40,
      maxWidth: 250,
    },
    {
      field: "tipoDeSeguro",
      headerName: "Tipo de seguro",
      flex: 1,
      minWidth: 40,
      maxWidth: 250,
    },
    {
      field: "tiposDeSegurosExceptuados",
      headerName: "Tipo de seguro exceptuado",
      flex: 1,
      minWidth: 40,
      maxWidth: 250,
    },
    {
      field: "contratistas",
      headerName: "Contratista",
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
        rows={compAseguradas}
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

export default GridCompaniasAseguradoras
