import React, { useCallback, useState } from "react";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";
import PaginationCustom from "@/components/shared/PaginationCustom";
import { useRouter } from "next/router";
import { typeAlert } from "@/components/shared/SnackbarAlert"
import ExportButton from "@/components/shared/ExportButton";
import { MotivoBloqueoGridData, MotivoBloqueoFiltradoRequest } from "@/types/microMaestros/motivosBloqueosTypes";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";
import { exportMotivosBloqueos } from "@/services/microMaestros/motivosBloqueosService";

interface GridMotivosBloqueosProps {
  motivosBloqueos: MotivoBloqueoGridData[];
  pagination?: PaginacionAPI;
  handleApplySort: (filters: MotivoBloqueoFiltradoRequest) => void;
  getSearchParams: () => MotivoBloqueoFiltradoRequest;
  exportFunction: any;
  setAlertMessage: (message: string) => void;
  setAlertType: (type: typeAlert | undefined) => void
}

const GridMotivosBloqueos = ({
  motivosBloqueos,
  pagination,
  handleApplySort,
  getSearchParams,
  exportFunction,
  setAlertMessage,
  setAlertType,
}: GridMotivosBloqueosProps) => {
  const router = useRouter();
  const [lastSortModel, setLastSortModel] = useState({ field: "", sort: "" });

  const rowsPerPageOptions = [9, 14, 20];

  const adjustedPagination = pagination && {
    ...pagination,
    pageSize: rowsPerPageOptions.includes(pagination.pageSize) ? pagination.pageSize : rowsPerPageOptions[0],
  };

  const handleSortModelChange = (event: any) => {
    if (event.length === 0) {
      handleApplySort({
        sortBy: lastSortModel.field,
        orderAsc: lastSortModel.sort === "asc" ? false : true,
      });
    } else {
      setLastSortModel({ field: event[0].field, sort: event[0].sort });
      handleApplySort({
        sortBy: event[0].field,
        orderAsc: event[0].sort === "asc",
      });
    }
  };

  const handleEditar = useCallback(
    (id: number) => {
      router.push(`/microMaestros/motivosBloqueos/editar?id=${id}`);
    },
    [router]
  );
  

  const columns: GridColDef[] = [
    {
      field: "codigoOrigen",
      headerName: "Código",
      flex: 1,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      minWidth: 100,
      maxWidth: 180,
    },
    {
      field: "origenNombre",
      headerName: "Origen",
      flex: 1,
      minWidth: 100,
      maxWidth: 180,
    },
    {
      field: "enviaNotificacion",
      headerName: "Envia Notificación",
      flex: 1,
      minWidth: 100,
      maxWidth: 200,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Sí" : "No"}
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%", 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: params.value ? "#E3EBFB" : "#EBEBEB",
            "& .MuiChip-label": { 
              padding: 0, 
            },
          }}
        />
      ),
    },
    {
      field: "enviaComunicacionFormal",
      headerName: "Envia Comunicación Formal",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Sí" : "No"}
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%", 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: params.value ? "#E3EBFB" : "#EBEBEB",
            "& .MuiChip-label": { 
              padding: 0, 
            },
          }}
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
          <ExportButton
            documentName="MotivosBloqueos.xlsx"
            getSerchParams={getSearchParams}
            exportFunction={exportMotivosBloqueos}
            setAlertMessage={setAlertMessage}
            setAlertType={setAlertType}
          />
        </Box>
      ),
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key={`edit-${params.row.id}`}
          label="Editar"
          onClick={() => handleEditar(params.row.id)}
          showInMenu
        />,
      ],
    }
  ];

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "100%",
        overflow: "auto",
        background: "#FFFFFF",
        height: "100%",
      }}
    >
      <DataGrid
        rows={motivosBloqueos}
        rowHeight={70}
        columns={columns}
        getRowHeight={() => 'auto'}
        disableRowSelectionOnClick
        disableColumnMenu
        density="compact"
        onSortModelChange={handleSortModelChange}
        slots={{
          footer: () =>
            adjustedPagination ? (
              <PaginationCustom pagination={adjustedPagination} rowsPerPageOptions={rowsPerPageOptions} />
            ) : null,
        }}
      />
    </Box>
  );
};

export default GridMotivosBloqueos;
