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
import router from "next/router";
import { SedesGridData } from "@/types/microMaestros/SedesTypes";
import { useRouterPushQuery } from "@/hooks/useRouterPush";

interface GridSedesProps {
  sedes: SedesGridData[] | undefined;
  handleModalOpenEstado: (id: number) => void;
  handleApplySort: any;
  nombreEstudioAuditor: string;
  pagination?: PaginacionAPI;
}

const GridSedes = ({
  sedes,
  handleModalOpenEstado,
  handleApplySort,
  pagination,
  nombreEstudioAuditor,
}: GridSedesProps) => {

  const [lastSortModel, setLastSortModel] = useState({ field: '', sort: '' });
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

  const handleVerDetalle = (id: number, nombreSede: string, nombreEstudioAuditor: string) => {
    routerPushQuery({
      pathname: `/microMaestros/estudiosAuditores/referentes`,
      query: {
        id,
        nombreEstudioAuditor: encodeURIComponent(nombreEstudioAuditor),
        nombreSede: encodeURIComponent(nombreSede)
      },
    });
  };
  
  const handleEditar = useCallback(
    (id: number) => {
      routerPushQuery({
        pathname: `/microMaestros/estudiosAuditores/sedes/editar`,
        query: { id },
      })
    },
    [router]
  )

  const getActionItems = React.useCallback(
    (isActive: boolean, id: number, nombreSede: string) => [
      <GridActionsCellItem
        key={`verdetalle-${id}`}
        onClick={(e) => {
          console.log(e.target);
          handleVerDetalle(id, nombreSede, nombreEstudioAuditor);
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

  const columns: GridColDef[] = [
    {
      field: "codigoSede",
      headerName: "Código",
      flex: 1,
      minWidth: 90,
      maxWidth: 90,
    },
    {
      field: "nombreSede",
      headerName: "Nombre",
      flex: 1,
      minWidth: 220,
      maxWidth: 220,
    },
    {
      field: "telefonoPrincipal",
      headerName: "Telefono",
      minWidth: 180,
      maxWidth: 180,
    },
    {
      field: "provincia",
      headerName: "Provincia",
      minWidth: 180,
      maxWidth: 180,
    },
    {
      field: "localidad",
      headerName: "Localidad",
      minWidth: 170,
      maxWidth: 180,
    },
    {
      field: "calle",
      headerName: "Calle",
      minWidth: 250,
      maxWidth: 250,
    },
    {
      field: "numero",
      headerName: "Número",
      minWidth: 50,
      maxWidth: 180,
    },
    {
      field: "pisodepto",
      headerName: "Piso/Depto",
      minWidth: 120,
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
    {
      field: "actions",
      type: "actions",
      align: "right",
      minWidth: 40,
      maxWidth: 40,
      getActions: (params: GridRowParams) =>
        getActionItems(params.row.estado, params.row.id, params.row.nombreSede),
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
        rows={sedes}
        columns={columns}
        getRowHeight={() => 'auto'}
        disableRowSelectionOnClick
        disableColumnMenu
        density="compact"
        onSortModelChange={handleSortModelChange}
        // onRowClick={(params) => onRowClick(params.row)}
        slots={{
          footer: () => (
            <PaginationCustom pagination={pagination!} rowsPerPageOptions={[9, 14, 20]} />
          ),
        }}
      />
    </Box>
  );
};

export default GridSedes;
