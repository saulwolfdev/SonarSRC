import PaginationCustom from "@/components/shared/PaginationCustom";
import { Box, Typography } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
} from "@mui/x-data-grid";
import React, { useCallback, useEffect, useState } from "react";
import { ChipCustom, StatusChip } from "@/components/shared/ChipsCustom";
import { useRouter } from "next/router";
import useQueryString from "@/hooks/useQueryString";
import { useSearchParams } from "next/navigation";
import Spinner from "@/components/shared/Spinner";
import { getSerchParams, setQueryParamasDeFiltros, setQueryParamsInicial } from "@/utils/microMaestros/conveniosDetallesUtils";
import {
  CategoriaGridData,
  CategoriasFiltradasRequest,
  CategoriasFiltradasResponse,
} from "@/types/microMaestros/categoriasTypes";
import { fetchCategorias } from "@/services/microMaestros/categoriasService";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import { useFiltrosConveniosCategoriasStore } from "@/zustand/microMaestros/gremios/conveniosDetalles/useFiltrosCategoriasStore";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";

interface GridCategoriasProps {
  handleApplySort: any;
}

const GridCategorias = ({ handleApplySort  }: GridCategoriasProps) => {
  const router = useRouter();
  const [lastSortModel, setLastSortModel] = useState({ field: "", sort: "" });
  const { modifyQueries, removeQueries } = useQueryString();
  const searchParams = useSearchParams();
  const [pagination, setPagination] = useState<PaginacionAPI>();
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<CategoriaGridData[]>([]);

  const {
    codigoFiltroConvenioCategoria,
    nombreFiltroConvenioCategoria,
    estadoFiltroConvenioCategoria,
  } = useFiltrosConveniosCategoriasStore();

  const handleSortModelChange = (event: any) => {
    if (event.length === 0) {
      /* 
    A la tercera vez que tocas una misma columna ya no se produce un evento ,
    entonces vamos guardando la anterior y lo ordenamos por el metodo contrario
    */
      handleApplySort(
        {
          sortBy: lastSortModel.field,
          orderAsc: lastSortModel.sort == "asc" ? "desc" : "asc",
        },
        modifyQueries
      );
    } else {
      setLastSortModel({ field: event[0].field, sort: event[0].sort });
      handleApplySort(
        {
          sortBy: event[0].field,
          orderAsc: event[0].sort,
        },
        modifyQueries
      );
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Código",
      flex: 1,
      minWidth: 40,
      maxWidth: 250,
    },
    {
      field: "nombre",
      headerName: "Nombre categoría",
      flex: 1,
      minWidth: 40,
      maxWidth: 250,
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
      minWidth: 40,
      renderCell: (params) => (
        <Box
          className="cellEstadoDataGrid"
        >
          <ChipCustom
            label={params.value ? "Activo" : "Inactivo"}
            status={params.value ? StatusChip.success : StatusChip.disabled}
          />
        </Box>
      ),
    },
  ];

  const buscarCategorias = () => {
    const filtros: CategoriasFiltradasRequest = getSerchParams(searchParams,codigoFiltroConvenioCategoria,
      nombreFiltroConvenioCategoria,
      estadoFiltroConvenioCategoria,);

    fetchCategorias(filtros)
      .then((response: CategoriasFiltradasResponse) => {
        const conveniosAPI = response.data.map((c) => ({
          id: c.codigo,
          nombre: c.nombre,
          estado: c.estado,
        }));
        setPagination(response.paginationData);
        const pag = response.paginationData;
        setQueryParamsInicial(
          pag.totalCount,
          pag.pageNumber,
          pag.pageSize,
          pag.totalCount,
          modifyQueries
        );
        setCategorias(conveniosAPI);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  };

  useEffect(() => {

    buscarCategorias();
  }, [searchParams.toString(),codigoFiltroConvenioCategoria, nombreFiltroConvenioCategoria, estadoFiltroConvenioCategoria]);

  
  return loading ? (
    <Spinner />
  ) : categorias && categorias.length > 0 ? (
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
        rows={categorias}
        columns={columns}
        getRowHeight={() => 'auto'}
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
  ) : (codigoFiltroConvenioCategoria  &&  nombreFiltroConvenioCategoria &&   estadoFiltroConvenioCategoria) ? 
      <FiltradoSinDatos />
    :
    <NoExistenRegistros />
  
};

export default GridCategorias;