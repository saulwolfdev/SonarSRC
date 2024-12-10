import PaginationCustom from "@/components/shared/PaginationCustom";
import { Box } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from "@mui/x-data-grid";
import React, { useCallback, useEffect, useState } from "react";
import { ChipCustom, StatusChip } from "@/components/shared/ChipsCustom";
import { useRouter } from "next/router";
import { TiposSeguroGridData } from "@/types/microMaestros/tiposSeguroTypes";
import ModalEstadoTiposSeguro from "./ModalEstado";
import { patchTiposSeguro } from "@/services/microMaestros/TiposSeguroService";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";
import { useRouterPushQuery } from "@/hooks/useRouterPush";

interface GridTiposSeguroProps {
  tiposSeguro: TiposSeguroGridData[] | undefined;
  pagination?: PaginacionAPI;
  handleModalOpenEstado: (id: number) => void;
  handleApplySort: any;
  exportButton: React.ReactNode;
}

const GridTiposSeguro = ({
  tiposSeguro,
  pagination,
  handleModalOpenEstado,
  handleApplySort,
  exportButton
}: GridTiposSeguroProps) => {
  const router = useRouter();
  const routerPushQuery = useRouterPushQuery();

  const [lastSortModel, setLastSortModel] = useState({ field: "", sort: "" });
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const rowsPerPageOptions = [9, 14, 20];
  const adjustedPagination = pagination && {
    ...pagination,
    pageSize: rowsPerPageOptions.includes(pagination.pageSize) ? pagination.pageSize : rowsPerPageOptions[0],
  };
  useEffect(() => {
  }, [pagination]);

  const handleSortModelChange = (event: any) => {
    if (event.length === 0) {
      handleApplySort({
        sortBy: lastSortModel.field,
        orderAsc: lastSortModel.sort === "asc" ? "desc" : "asc",
      });
    } else {
      setLastSortModel({ field: event[0].field, sort: event[0].sort });
      handleApplySort({
        sortBy: event[0].field,
        orderAsc: event[0].sort,
      });
    }
  };

  const handleEditar = useCallback((id: number) => {
    routerPushQuery({
      pathname: `/microMaestros/tiposSeguro/editar`,
      query: { id },
    });
  }, [router]);

  const getActionItems = React.useCallback(
    (isActive: boolean, id: number) => [
      <GridActionsCellItem
        key={`edit-${id}`}
        onClick={() => handleEditar(id)}
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
  );

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Código",
      flex: 1,
      minWidth: 40,
      maxWidth: 100,
    },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      minWidth: 120,
      maxWidth: 300,
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
      minWidth: 120,
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
          {exportButton}
        </Box>
      ),
      getActions: (params: GridRowParams) => getActionItems(params.row.estado, params.row.id),
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
        rows={tiposSeguro}
        columns={columns}
        getRowHeight={() => 'auto'}
        rowHeight={70}
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

export default GridTiposSeguro;
