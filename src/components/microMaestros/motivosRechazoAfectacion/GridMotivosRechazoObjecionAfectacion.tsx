import PaginationCustom from "@/components/shared/PaginationCustom";
import { Box, Chip, Typography } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
} from "@mui/x-data-grid";
import React, { useCallback, useState } from "react";
import { ChipCustom, StatusChip } from "@/components/shared/ChipsCustom";
import { useRouter } from "next/router";
import {
  MotivoRechazoObjecionAfectacionGridData,
} from "@/types/microMaestros/motivosRechazoAfectacionTypes";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";
import { useRouterPushQuery } from "@/hooks/useRouterPush";

interface GridMotivoRechazoObjecionAfectacionProps {
  motivos: MotivoRechazoObjecionAfectacionGridData[] | undefined;
  pagination?: PaginacionAPI;
  handleModalOpenEstado: (id: number) => void;
  handleApplySort: any;
  exportButton: React.ReactNode;
}

const GridMotivosRechazoObjecionAfectacion = ({
  motivos: motivos,
  pagination,
  handleModalOpenEstado,
  handleApplySort,
  exportButton,
}: GridMotivoRechazoObjecionAfectacionProps) => {
  const router = useRouter();
  const routerPushQuery = useRouterPushQuery();

  const [lastSortModel, setLastSortModel] = useState({ field: "", sort: "" });

  const handleSortModelChange = (event: any) => {
    if (event.length === 0) {
      /* 
    A la tercera vez que tocas una misma columna ya no se produce un evento ,
    entonces vamos guardando la anterior y lo ordenamos por el metodo contrario
    */
      handleApplySort({
        sortBy: lastSortModel.field,
        orderAsc: lastSortModel.sort == "asc" ? "desc" : "asc",
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
        pathname: `/microMaestros/motivosRechazoAfectacion/editar`,
        query: { id },
      });
    },
    [router]
  );
  const getActionItems = React.useCallback(
    (isActive: boolean, id: number) =>
      isActive
        ? [
            <GridActionsCellItem
              key={`edit-${id}`}
              onClick={() => {
                handleEditar(id);
              }}
              label="Editar"
              showInMenu
              sx={{ width: 190 }}
            />,
            <GridActionsCellItem
              key={`deactivate-${id}`}
              onClick={() => handleModalOpenEstado(id)}
              label="Desactivar"
              showInMenu
            />,
          ]
        : [
            <GridActionsCellItem
              key={`activate-${id}`}
              onClick={() => handleModalOpenEstado(id)}
              label="Activar"
              showInMenu
            />,
          ],
    [handleEditar, handleModalOpenEstado]
  );

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Código",
      flex: 1,
      minWidth: 40,
      maxWidth: 130,
    },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      minWidth: 40,
      maxWidth: 400,
    },
    {
      field: "descripcion",
      headerName: "Descripción",
      flex: 1,
      minWidth: 40,
      maxWidth: 400,
    },
    {
      field: "objecion",
      headerName: "Objeción",
      flex: 1,
      minWidth: 40,
      maxWidth: 130,
      renderCell: (params) => (
        <Box className="cellEstadoDataGrid">
          <Chip
            label={params.value ? "Si" : "No"}
            sx={{ width: 60, bgcolor: params.value ? "#E3EBFB" : "#EBEBEB" }}
          />
        </Box>
      ),
    },
    {
      field: "rechazo",
      headerName: "Rechazo",
      flex: 1,
      minWidth: 40,
      maxWidth: 130,
      renderCell: (params) => (
        <Box className="cellEstadoDataGrid">
          <Chip
            label={params.value ? "Si" : "No"}
            sx={{ width: 60, bgcolor: params.value ? "#E3EBFB" : "#EBEBEB" }}
          />
        </Box>
      ),
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
      minWidth: 40,
      renderCell: (params) => (
        <Box className="cellEstadoDataGrid">
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
      getActions: (params: GridRowParams) =>
        getActionItems(params.row.estado, params.row.id),
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
        rows={motivos}
        columns={columns}
        getRowHeight={() => "auto"}
        rowHeight={70}
        disableRowSelectionOnClick
        disableColumnMenu
        density="compact"
        onSortModelChange={handleSortModelChange}
        slots={{
          footer: () => (
            <PaginationCustom
              pagination={pagination!}
              rowsPerPageOptions={[9, 14, 20]}
            />
          ),
        }}
      />
    </Box>
  );
};

export default GridMotivosRechazoObjecionAfectacion;
