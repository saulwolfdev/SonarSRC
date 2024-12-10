import { Box, Typography, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import Spinner from "@/components/shared/Spinner";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
// import ModalEstado from "./components/ModalEstado";
import {
  // activarCentro,
  // desactivarCentro,
  exportGrupoArticulos,
  fetchGrupoArticulos,
  fetchIncidenciaNameById,
} from "../../../services/microMaestros/grupoArticulosService";
import {
  GrupoArticulosFiltradasResponse,
  GrupoArticulosGridData,
  GrupoArticulosFiltradasRequest,
} from "../../../types/microMaestros/grupoArticulosTypes";
import GridGrupoArticuloss from "./components/GridGrupoArticulos";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";
import PopperFiltrosGrupoArticulos from "@/components/microMaestros/grupoArticulos/PopperFiltrosGrupoArticulos";
import ExportButton from "@/components/shared/ExportButton";
import CreateButton from "@/components/shared/CreateButton";
import FilterChips from "@/components/shared/FilterChips";
import { useSearchParams } from "next/navigation";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";

const HomeGrupoArticulos = () => {
  const { modifyQueries, remove, removeQueries } = useQueryString();
  const [loading, setLoading] = useState(true);
  const [centros, setCentros] = useState<GrupoArticulosGridData[]>([]);
  const [filters, setFilters] = useState<[string, string, string][]>([]);
 
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [pagination, setPagination] = useState<PaginacionAPI>();
  const searchParams = useSearchParams();

  const theme = useTheme();

  const handleApplySort = (appliedFilters: GrupoArticulosFiltradasRequest) => {
    const queries: IQuery[] = [];
    appliedFilters.sortBy
      ? queries.push({
        name: "sortBy",
        value: appliedFilters.sortBy.toString(),
      })
      : null;
    appliedFilters.orderAsc
      ? queries.push({
        name: "orderAsc",
        value: (appliedFilters.orderAsc.toString() == "asc").toString(),
      })
      : null;
    modifyQueries(queries);
  };


  const getSerchParams = (): GrupoArticulosFiltradasRequest => {
    return {
      grupoArticulo: searchParams.get("grupoArticulo") || undefined,
      descripcion: searchParams.get("descripcion") || undefined,
      pageNumber: Number(searchParams.get("pageNumber")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 9,
      sortBy: searchParams.get("sortBy") || undefined,
      orderAsc: searchParams.get("orderAsc")
        ? Boolean(searchParams.get("orderAsc") === "true")
        : null,
    };
  };
  const setQueryParamsInicial = (
    totalCount: number,
    pageNumber: number,
    pageSize: number,
    totalPages: number
  ) => {
    const queries: IQuery[] = [];
    queries.push({ name: "pageNumber", value: pageNumber.toString() });
    queries.push({ name: "pageSize", value: pageSize.toString() });
    queries.push({ name: "totalPages", value: totalPages.toString() });
    queries.push({ name: "totalCount", value: totalCount.toString() });
    modifyQueries(queries);
  };

  const buscarCentros = () => {
    const filtros: GrupoArticulosFiltradasRequest = getSerchParams();
    console.log(filtros);

    fetchGrupoArticulos(filtros)
      .then((response: GrupoArticulosFiltradasResponse) => {
        console.log(response.data);
        const centrosAPI = response.data.map((c) => ({
          grupoArticulo: c.grupoArticulo,
          descripcion: c.descripcion,
          id: c.id,

        }));
        setPagination(response.paginationData);
        const pag = response.paginationData;
        setQueryParamsInicial(
          pag.totalCount,
          pag.pageNumber,
          pag.pageSize,
          pag.totalCount
        );
        setCentros(centrosAPI);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  };

  const handleDeleteFilter = (key: keyof GrupoArticulosFiltradasRequest) => {
    removeQueries([key]);
  };

  const getFilters = async () => {
    const array: [string, string, string][] = [];
    const appliedFilters = new URLSearchParams(searchParams.toString());
    const filtersObject: { [key: string]: string } = {};
    appliedFilters.forEach((value, key) => {
      filtersObject[key] = value;
    });
    let incidencia = "";

    if (filtersObject.incidenciaId) {
      incidencia = await fetchIncidenciaNameById(
        Number(filtersObject.incidenciaId)
      );
    }

    filtersObject.id
      ? array.push(["Id", filtersObject.id, "id"])
      : null;
    filtersObject.grupoArticulo
      ? array.push(["Grupo Articulo", filtersObject.grupoArticulo, "grupoArticulo"])
      : null;
      filtersObject.descripcion
      ? array.push(["Descripción", filtersObject.descripcion, "descripcion"])
      : null;
    filtersObject.estado
      ? array.push([
        "Estado",
        filtersObject.estado == "1" ? "Activo" : "Inactivo",
        "estado",
      ])
      : null;
    setFilters(array);
  };

  useEffect(() => {
    getFilters();
    buscarCentros();
  }, [searchParams.toString()]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        overflow: "hidden",
      }}
    >
      <SnackbarAlert
        message={alertMessage}
        type={alertType}
        setAlertMessage={setAlertMessage}
        setAlertType={setAlertType}
      />

      <Box
        sx={{
          display: "flex",
          pt: 20,
          alignItems: "center",
          marginBottom: theme.spacing(2),
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Typography variant="h1">Grupo de articulo</Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <FilterChips
            filters={filters}
            onDelete={(key) =>
              handleDeleteFilter(key as keyof GrupoArticulosFiltradasRequest)
            }
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="10px"
          >
            <PopperFiltrosGrupoArticulos />
            {/* <CreateButton url={"/microMaestros/GrupoArticulos/crear"} /> */}
          </Box>
        </Box>
      </Box>

      {centros && centros.length > 0 ? (
        <GridGrupoArticuloss
          centros={centros}
          pagination={pagination}
          handleApplySort={handleApplySort}
          exportButton={
            <ExportButton
              getSerchParams={getSerchParams}
              exportFunction={exportGrupoArticulos}
              documentName="GrupoArticulos.xlsx"
              setAlertMessage={setAlertMessage}
              setAlertType={setAlertType}
            />
          }
        />
      ) : Object.keys(filters).length > 0 ? (
        <FiltradoSinDatos />
      ) : (
        <NoExistenRegistros />
      )}
    </Box>
  );
};


export default HomeGrupoArticulos;
