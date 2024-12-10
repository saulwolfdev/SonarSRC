import PaginationCustom from "@/components/shared/PaginationCustom";
import { Box } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from "@mui/x-data-grid";
import React, { useCallback, useState } from "react";
import { ChipCustom, StatusChip } from "@/components/shared/ChipsCustom";
import { TitulosAcademicosGridData } from "@/types/microMaestros/TitulosAcademicosTypes";
import { useRouter } from "next/router";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";
import { useRouterPushQuery } from "@/hooks/useRouterPush";

interface GridTitulosAcademicosProps {
  titulosAcademicos: TitulosAcademicosGridData[] | undefined;
  handleModalOpenEstado: (id: number) => void;
  handleApplySort: any;
  exportButton: React.ReactNode;
  pagination?: PaginacionAPI;
}

const GridTitulosAcademicos = ({
  titulosAcademicos,
  handleModalOpenEstado,
  handleApplySort,
  exportButton,
  pagination
}: GridTitulosAcademicosProps) => {

  const [lastSortModel, setLastSortModel] = useState({ field: '', sort: '' });
  const router = useRouter();
  const routerPushQuery = useRouterPushQuery();


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
  
  const handleEditar = useCallback(
    (id: number) => {
      routerPushQuery({
        pathname: `/microMaestros/titulosAcademicos/editar`,
        query: { id },
      })
    },
    [router]
  )

  const getActionItems = React.useCallback(
    (isActive: boolean, id: number, nombre: string) => [
      <GridActionsCellItem
        key={`editar-${id}`}
        onClick={() => {
          handleEditar(id);
        }}
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
    ],
    [handleEditar, handleModalOpenEstado]
  );  

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
      headerName: "Nombre",
      flex: 1,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
      minWidth: 60,
      renderCell: (params) => (
        <ChipCustom
          label={params.value ? "Activo" : "Inactivo"}
          status={params.value ? StatusChip.success : StatusChip.disabled}
        />
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
      getActions: (params: GridRowParams) =>
        getActionItems(params.row.estado, params.row.id, params.row.nombre),
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
        rows={titulosAcademicos}
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

export default GridTitulosAcademicos;
