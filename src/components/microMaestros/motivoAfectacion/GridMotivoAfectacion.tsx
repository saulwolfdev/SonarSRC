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
import { MotivoAfectacionGridData, PaginacionAPI } from "@/types/microMaestros/motivoAfectacionTypes";
import { buscarRelacionServicio } from "@/services/microMaestros/motivoAfectacionService";

interface GridMotivoAfectacionProps {
  motivoAfectacion: MotivoAfectacionGridData[] | undefined;
  handleModalOpenEstado: (id: number) => void;
  handleApplySort: any;
  pagination?: PaginacionAPI;
}

const GridMotivoAfectacion = ({
  motivoAfectacion,
  handleModalOpenEstado,
  handleApplySort,
  pagination
}: GridMotivoAfectacionProps) => {

  const [lastSortModel, setLastSortModel] = useState({ field: '', sort: '' });
  const router = useRouter();
  const [relacionServicioMap, setRelacionServicioMap] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchRelacionServicio = async () => {
      try {
        const res = await buscarRelacionServicio();
        const map = res.reduce(
          (acc: Record<number, string>, item: { id: number; label: string }) => {
            acc[item.id] = item.label;
            return acc;
          },
          {}
        );
        setRelacionServicioMap(map);
      } catch (error) {
      }
    };

    fetchRelacionServicio();
  }, []);

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
      router.push({
        pathname: `/microMaestros/motivoAfectacion/editar`,
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
      field: "motivoDeAfectacion",
      headerName: "Motivo de afectación",
      flex: 1,
      minWidth: 200,
      maxWidth: 200,
    },
    {
      field: "relacionServicio",
      headerName: "Relación de servicio",
      flex: 1,
      minWidth: 200,
      maxWidth: 200,
      renderCell: (params) => {
        if (Array.isArray(params.value)) {
          const descripciones = params.value
            .map((id) => relacionServicioMap[id] || "Desconocido")
            .join(", ");
          return descripciones || "Desconocido";
        }
        return relacionServicioMap[params.value] || "Desconocido";
      },
    }
    ,
    {
      field: "fechaIncorporacion",
      headerName: "Solicitar fecha de incorporación",
      flex: 1,
      minWidth: 280,
      maxWidth: 280,
      renderCell: (params) => (params.value ? "Sí" : "No"),
    },
    {
      field: "bajaPorCesion",
      headerName: "Baja por cesión",
      flex: 1,
      minWidth: 160,
      maxWidth: 160,
      renderCell: (params) => (params.value ? "Sí" : "No"),
    },
    {
      field: "afectacionTemporal",
      headerName: "Afectación temporal",
      flex: 1,
      minWidth: 200,
      maxWidth: 200,
      renderCell: (params) => (params.value ? "Sí" : "No"),
    },
    {
      field: "estado",
      headerName: "Estado",
      minWidth: 90,
      maxWidth: 90,
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
      align: "right",
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
        rows={motivoAfectacion}
        columns={columns}
        autoHeight={true}
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

export default GridMotivoAfectacion;
