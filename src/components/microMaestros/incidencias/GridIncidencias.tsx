import PaginationCustom from "@/components/shared/PaginationCustom";
import { Box } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Incidencia, IncidenciasPagination } from "@/types/microMaestros/incidenciasTypes";
import { useRouterPush } from "@/hooks/useRouterPush";

interface GridIncidenciasProps {
  incidencias: Incidencia[] | undefined;
  pagination?: IncidenciasPagination;
  handleModalOpenEstado: (id: number) => void;
  handleApplySort: any;
  setOpenExportModal: (open: boolean) => void;
}

const GridIncidencias = ({
  incidencias,
  pagination,
  handleModalOpenEstado,
  handleApplySort,
  setOpenExportModal,
}: GridIncidenciasProps) => {
  const routerPush = useRouterPush();
  
  const [lastSortModel, setLastSortModel] = useState({ field: "", sort: "" });

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

  const handleEdit = (id: number) => {
    routerPush(`/microMaestros/incidencias/editar?id=${id}`);
  };

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
      minWidth: 120,
      maxWidth: 180,
    },
    {
      field: "tipo",
      headerName: "Tipo",
      flex: 1,
      minWidth: 80,
    },
    {
      field: "actions",
      type: "actions",
      flex: 0,
      width: 80,
      headerAlign: "right",
      align: "right",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key={`edit-${params.id}`}
          label="Editar"
          onClick={() => handleEdit(params.id as number)}
          showInMenu
        />,
      ],
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
        rowHeight={70}
        rows={incidencias || []}
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

export default GridIncidencias;
