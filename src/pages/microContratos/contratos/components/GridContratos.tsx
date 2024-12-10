import PaginationCustom from "@/components/shared/PaginationCustom";
import { Box, Typography } from "@mui/material";
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
import { ContratosGridData } from "@/types/microContratos/contratosTypes";
import moment from "moment";
import { PaginacionAPI } from "@/types/microContratos/GenericTypes";
import { useRouterPushQuery } from "@/hooks/useRouterPush";

interface GridContratosProps {
  contratos: ContratosGridData[] | undefined;
  handleModalOpenEstado: (id: number) => void;
  handleApplySort: any;
  exportButton: React.ReactNode;
  pagination?: PaginacionAPI;
}

const GridContratos = ({
  contratos,
  handleModalOpenEstado,
  handleApplySort,
  exportButton,
  pagination
}: GridContratosProps) => {

  const routerPushQuery
 = useRouterPushQuery();


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

  const handleVerDetalle = (id: number) => {
    // routerPushQuery({pathname: `todo`, query: { id}});
  };
  const handleEditar = useCallback((id: number) => {
    // routerPushQuery({pathname: `todo`, query: { id}});
  }, []);

  const getActionItems = React.useCallback(
    (isActive: boolean, id: number) => [
      <GridActionsCellItem
        key={`verdetalle-${id}`}
        onClick={() => {
          handleVerDetalle(id);
        }}
        label="Ver Detalle"
        showInMenu
      />,
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
          key={`acitvar-${id}`}
          onClick={() => handleModalOpenEstado(id)}
          label="Activar"
          showInMenu
        />
      ),
    ],
    [handleEditar, handleModalOpenEstado]
  );

  const formatDateTime = (dateTime: Date) => {
    const momentDate = moment(dateTime);
    const formattedDate = momentDate.format("DD/MM/YYYY");
    return (
      <Typography variant="body1">
        {formattedDate}
      </Typography>
    );
  };

  const columns: GridColDef[] = [
    {
      field: "contratista",
      headerName: "Contratista",
      flex: 1,
      minWidth: 180,
      maxWidth: 180,
    },
    {
      field: "nroContrato",
      headerName: "N° de contrato",
      flex: 1,
      minWidth: 120,
      maxWidth: 120,
    },
    {
      field: "origen",
      headerName: "Origen",
      minWidth: 100,
      maxWidth: 100,
    },
    {
      field: "codigoOrigen",
      headerName: "Código origen",
      minWidth: 160,
      maxWidth: 160,
    },
    {
      field: "descripcionContrato",
      headerName: "Descripción del contrato",
      flex: 2,
      minWidth: 300,
      maxWidth: 300,
    },
    {
      field: "inicio",
      headerName: "inicio",
      flex: 1,
      minWidth: 140,
      maxWidth: 140,
      renderCell: (params) => formatDateTime(params.value),
    },
    {
      field: "finalizacion",
      headerName: "Finalizacion",
      flex: 1,
      minWidth: 140,
      maxWidth: 140,
      renderCell: (params) => formatDateTime(params.value),
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
        rows={contratos}
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
        sx={{
          "& .MuiDataGrid-cell": {
            whiteSpace: "normal",
            wordWrap: "break-word",
            height: "auto",
          },
        }}
      />
    </Box>
  );
};

export default GridContratos;
