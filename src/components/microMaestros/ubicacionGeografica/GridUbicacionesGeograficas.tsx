import PaginationCustom from "@/components/shared/PaginationCustom"
import { Box } from "@mui/material"
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid"
import React, { useState } from "react"
import { UbicacionesGridData } from "@/types/microMaestros/ubicacionGeograficaTypes"
import { ChipCustom, StatusChip } from "@/components/shared/ChipsCustom";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes"

interface GridUbicacionesGeograficasProps {
  ubicaciones: UbicacionesGridData[] | undefined
  pagination?: PaginacionAPI
  handleActivacion: (row: UbicacionesGridData) => void
  handleApplySort: any;
}

const GridUbicacionesGeograficas = ({
  ubicaciones,
  pagination,
  handleActivacion,
  handleApplySort,
}: GridUbicacionesGeograficasProps) => {

  const [lastSortModel, setLastSortModel] = useState({ field: '', sort: '' });

  const handleSortModelChange = (event: any) => {
    if (event.length === 0) {
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

  const columns: GridColDef<UbicacionesGridData>[] = [
    { 
      field: "pais", 
      headerName: "País", 
      flex: 1,       
      minWidth: 80,
      maxWidth: 120,
    },
    {
      field: "provincia",
      headerName: "Provincia",
      flex: 1,
      minWidth: 80,
      maxWidth: 120,
    },
    {
      field: "localidad",
      headerName: "Localidad",
      flex: 1,
      minWidth: 80,
      maxWidth: 120,
    },
    {
      field: "codigoPostalCodigo",
      headerName: "Código Postal",
      flex: 1,
      minWidth: 80,
      maxWidth: 140,
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
      minWidth: 60,
      renderCell: (params) => (
        <Box className="cellEstadoDataGrid">
          <ChipCustom
            label={params.value === "Activo" ? "Activo" : "Inactivo"}
            status={
              params.value === "Activo" ? StatusChip.success : StatusChip.disabled
            }
          />
        </Box>
      ),
    },

    {
      field: "actions",
      type: "actions",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="toggleActivacion"
          onClick={() => handleActivacion(params.row)}
          label={params.row.estado == "Activo" ? "Desactivar" : "Activar"}
          showInMenu
          sx={{ width: 190 }}
        />,
      ],
    },
  ]

  return (
    <Box sx={{ flexGrow: 1, width: "100%", overflow: "auto", background: "#FFFFFF", height: "100%" }}>
      <DataGrid
        rows={ubicaciones}
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

export default GridUbicacionesGeograficas
