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
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";
import { useRouter } from "next/router";
import { ReferentesGridData } from "@/types/microMaestros/ReferentesTypes";
import { useRouterPushQuery } from "@/hooks/useRouterPush";

interface GridReferentesProps {
  referentes: ReferentesGridData[] | undefined;
  handleModalOpenEstado: (id: number) => void;
  handleApplySort: any;
  pagination?: PaginacionAPI;
}

const GridReferentes = ({
  referentes,
  handleModalOpenEstado,
  handleApplySort,
  pagination
}: GridReferentesProps) => {

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
        pathname: `/microMaestros/estudiosAuditores/referentes/editar`,
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
      minWidth: 90,
      maxWidth: 90,
    },
    {
      field: "usuarioEPID",
      headerName: "ID de Usuario EP",
      flex: 1,
      minWidth: 120,
      maxWidth: 180,
    },
    {
      field: "nombreReferente",
      headerName: "Nombre",
      minWidth: 210,
      maxWidth: 210,
    },
    {
      field: "emailReferente",
      headerName: "Email",
      minWidth: 260,
      maxWidth: 260,
    },
    {
      field: "rolReferente",
      headerName: "Rol - Especialidad",
      minWidth: 180,
      maxWidth: 180,
    },
    {
      field: "estado",
      headerName: "Estado",
      minWidth: 90,
      maxWidth: 90,
       renderCell: (params) => (
                <Box className='cellEstadoDataGrid'>
                    <ChipCustom
                        label={params.value ? "Activo" : "Inactivo"}
                        status={params.value ? StatusChip.success : StatusChip.disabled}
                    />
                </Box>
            ),
    },
    { field: "filler", headerName: "", flex: 1, minWidth: 400, maxWidth: 400 },
    {
      field: "actions",
      type: "actions",
      align: "right",
      minWidth: 40,
      maxWidth: 40,
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
        rows={referentes}
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
  );
};

export default GridReferentes;
