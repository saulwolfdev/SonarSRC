import { Box, Typography, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import {
  ClasificacionesCentrosFisicosFiltradasRequest,
  ClasificacionCentroFisicoFiltradasResponse,
  ClasificacionCentroFisicoGridData,
} from "@/types/microMaestros/clasificacionCentrosFisicosTypes";
import {
  activarCentro,
  desactivarCentro,
  exportClasificacionCentroFisico,
  fetchClasificacionCentroFisico,
  fetchClasificacionCentroFisicoById,
} from "@/services/microMaestros/clasificacionCentroFisicoService";
import Spinner from "@/components/shared/Spinner";
import GridClasificacionCentroFisicos from "./components/GridClasificacionCentroFisico";
import ModalEstado from "./components/ModalEstado";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";

import PopperFiltrosClasificacionCentrosFisicos from "./components/PopperFiltrosClasificacionCentrosFisicos";
import ExportButton from "@/components/shared/ExportButton";
import CreateButton from "@/components/shared/CreateButton";
import FilterChips from "@/components/shared/FilterChips";
import { useSearchParams } from "next/navigation";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { PaginacionAPI } from "@/types/microContratos/GenericTypes";

const HomeClasificacionCentroFisico = () => {
  const [loading, setLoading] = useState(true);
  const { modifyQueries, remove, removeQueries } = useQueryString();

  // tabla
  const [clasificaciones, setclasificaciones] =
    useState<ClasificacionCentroFisicoGridData[]>();
  const [totalCount, setTotalCount] = useState<number>();
  const [filteredData, setFilteredData] = useState<
    ClasificacionCentroFisicoGridData[]
  >(clasificaciones ?? []);
  const [filters, setFilters] = useState<[string, string, string][]>([]);

  // modal estado
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);

  // respuesta
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const [pagination, setPagination] = useState<PaginacionAPI>();
  const searchParams = useSearchParams();
  const theme = useTheme();

  const handleModalOpenEstado = (id: number) => {
    setRowId(id);
    setModalOpen(true);
  };
  const handleModalCloseEstado = () => {
    setModalOpen(false);
    setRowId(0);
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
  const handleApplySort = (
    appliedFilters: ClasificacionesCentrosFisicosFiltradasRequest
  ) => {
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

  const getSerchParams = (): ClasificacionesCentrosFisicosFiltradasRequest => {
    return {
      nombre: searchParams.get("nombre") || undefined,
      estado: searchParams.get("estado")
        ? Boolean(searchParams.get("estado") === "1")
        : undefined,
      pageNumber: Number(searchParams.get("pageNumber")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 9,
      sortBy: searchParams.get("sortBy") || undefined,
      orderAsc: searchParams.get("orderAsc")
        ? Boolean(searchParams.get("orderAsc") === "true")
        : null,
    };
  };
  const buscarClasificaciones = () => {
    const filtros: ClasificacionesCentrosFisicosFiltradasRequest =
      getSerchParams();

    fetchClasificacionCentroFisico(filtros)
      .then((response: ClasificacionCentroFisicoFiltradasResponse) => {
        const clasificacionAPI = response.data.map((c) => ({
          id: c.id,
          nombre: c.nombre,
          estado: c.estado,
        }));
        setPagination(response.paginationData);
        setclasificaciones(clasificacionAPI);
        const pag = response.paginationData;
        setQueryParamsInicial(
          pag.totalCount,
          pag.pageNumber,
          pag.pageSize,
          pag.totalCount
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  };

  const toggleActivation = useCallback(
    (isActivated: boolean | undefined, idClasificacion: number) => {
      if (isActivated) {
        desactivarCentro({ id: idClasificacion })
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardo con éxito.");
            setAlertType(typeAlert.success);
            buscarClasificaciones();
          })
          .catch((error) => {
            if(error.response.data.errors){
              setAlertMessage(error.response.data.errors[0].description);
            }
              else{
            setAlertMessage(
              "No se pudo desactivar el estado. Inténtalo de nuevo más tarde."
            );}
            setAlertType(typeAlert.error);
          });
      } else {
        activarCentro({ id: idClasificacion })
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardo con éxito.");
            setAlertType(typeAlert.success);
            buscarClasificaciones();
          })
          .catch((error) => {
            if(error.response.data.errors){
              setAlertMessage(error.response.data.errors[0].description);
            }
              else{
            setAlertMessage(
              "No se pudo activar el estado. Inténtalo de nuevo más tarde."
            );}
            setAlertType(typeAlert.error);
          });
      }
      setModalOpen(false);
    },
    [buscarClasificaciones]
  );

  const getFilters = async () => {
    const array: [string, string, string][] = [];
    const appliedFilters = new URLSearchParams(searchParams.toString());
    const filtersObject: { [key: string]: string } = {};
    appliedFilters.forEach((value, key) => {
      filtersObject[key] = value;
    });

    filtersObject.nombre
      ? array.push(["Nombre", filtersObject.nombre, "nombre"])
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

  const handleDeleteFilter = (key: string) => {
    removeQueries([key]);
  };

  useEffect(() => {
    getFilters();
    buscarClasificaciones();
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
          alignItems: "center",
          pt: 20,
          marginBottom: theme.spacing(2),
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Typography variant="h1">Clasificación de centros físicos</Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <FilterChips filters={filters} onDelete={handleDeleteFilter} />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="10px"
          >
            <PopperFiltrosClasificacionCentrosFisicos />
            <CreateButton
              url={"/microMaestros/clasificacionCentrosFisicos/crear"}
            />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          paddingTop: 20,
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
      </Box>

      {clasificaciones && clasificaciones.length > 0 ? (
        <GridClasificacionCentroFisicos
          handleApplySort={handleApplySort}
          clasificaciones={clasificaciones}
          pagination={pagination}
          handleModalOpenEstado={handleModalOpenEstado}
          exportButton={
            <ExportButton
              getSerchParams={getSerchParams}
              exportFunction={exportClasificacionCentroFisico}
              documentName={"ClasificacionesCentrosFisicos.xlsx"}
              setAlertMessage={setAlertMessage}
              setAlertType={setAlertType}
            />
          }
        />
      ) : filters.length > 0 ? (
        <FiltradoSinDatos />
      ) : (
        <NoExistenRegistros />
      )}

      <ModalEstado
        open={modalOpen}
        handleClose={handleModalCloseEstado}
        id={rowId}
        toggleActivation={toggleActivation}
      />
    </Box>
  );
};

export default HomeClasificacionCentroFisico;
