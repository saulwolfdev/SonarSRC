import PaginationCustom from "@/components/shared/PaginationCustom";
import { Box } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from "@mui/x-data-grid";
import React, { useState } from "react";
import { PuestoEmpresaGridData } from "@/types/microMaestros/puestosEmpresaTypes";
import { ChipCustom, StatusChip } from "@/components/shared/ChipsCustom";
import { useRouter } from "next/router";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";
import { useRouterPushQuery } from "@/hooks/useRouterPush";

interface GridPuestosEmpresaProps {
  puestosEmpresa: PuestoEmpresaGridData[] | undefined;
  pagination?: PaginacionAPI;
  handleModalOpenEstado: (id: number) => void;
  getSearchParams: () => any;
  setAlertMessage: (message: string) => void;
  setAlertType: (type: any) => void;
  exportButton: React.ReactNode;
    handleApplySort: any;
}

const GridPuestosEmpresa = ({
  puestosEmpresa,
  pagination,
  handleModalOpenEstado,
  getSearchParams,
  setAlertMessage,
  setAlertType,
  exportButton,
    handleApplySort,
}: GridPuestosEmpresaProps) => {
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

  const handleNavigation = (id: number) => {
    routerPushQuery({
      pathname: "/microMaestros/puestosEmpresa/editar",
      query: { id },
    });
  };

  const getActionItems = React.useCallback(
    (isActive: boolean, id: number) => [
      <GridActionsCellItem
        key={`edit-${id}`}
        onClick={() => handleNavigation(id)}
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
    [handleNavigation, handleModalOpenEstado]
  );

  const columns: GridColDef[] = [
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      field: "codigoAfip",
      headerName: "Código AFIP",
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
        rows={puestosEmpresa}
        columns={columns}
        getRowHeight={() => 'auto'}
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

export default GridPuestosEmpresa;
