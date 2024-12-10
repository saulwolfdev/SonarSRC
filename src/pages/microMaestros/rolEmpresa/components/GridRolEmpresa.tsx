import PaginationCustom from "@/components/shared/PaginationCustom";
import { Box } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { ChipCustom, StatusChip } from "@/components/shared/ChipsCustom";
import { useRouter } from "next/router";
import { RolEmpresaGridData } from "@/types/microMaestros/rolEmpresaTypes";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";
import { useRouterPush } from "@/hooks/useRouterPush";

interface GridRolEmpresaProps {
  rolesEmpresas: RolEmpresaGridData[];
  pagination?: PaginacionAPI;
  handleModalOpenEstado: (id: number) => void;
  handleApplySort: any;
  exportButton: React.ReactNode;
}

const GridRolEmpresa = ({
  rolesEmpresas,
  pagination,
  handleModalOpenEstado,
  handleApplySort,
  exportButton,
}: GridRolEmpresaProps) => {
  const routerPush = useRouterPush();

  const [lastSortModel, setLastSortModel] = React.useState({ field: "", sort: "" });

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

  const handleEditar = (id: number) => {
    routerPush(`/microMaestros/rolEmpresa/editar?id=${id}`);
  };

  const getActionItems = (isActive: boolean, id: number) => [
    <GridActionsCellItem
      key={`editar-${id}`}
      onClick={() => handleEditar(id)}
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
  ];

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
      field: "descripcion", 
      headerName: "Descripción", 
      flex: 2, 
      minWidth: 80,
      maxWidth: 700,
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
      align: "right",
      flex: 0,
      width: 80,
      headerAlign: "right",
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
        rows={rolesEmpresas}
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

export default GridRolEmpresa;
