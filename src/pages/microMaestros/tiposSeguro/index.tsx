import { Box, Typography, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import Spinner from "@/components/shared/Spinner";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import ModalEstadoTiposSeguro from "./components/ModalEstado";
import {
  exportTiposSeguro,
  fetchTiposSeguro,
  patchActivarTipoSeguro, 
  patchDesactivarTipoSeguro,
} from "@/services/microMaestros/TiposSeguroService";
import {
  TiposSeguroFiltradoRequest,
  TiposSeguroFiltradosResponse,
  TiposSeguroGridData,
} from "@/types/microMaestros/tiposSeguroTypes";
import GridTiposSeguro from "./components/GridTiposSeguro";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";
import PopperFiltrosTiposSeguro from "./components/PopperFiltrosTiposSeguro";
import ExportButton from "@/components/shared/ExportButton";
import CreateButton from "@/components/shared/CreateButton";
import FilterChips from "@/components/shared/FilterChips";
import { useSearchParams } from "next/navigation";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";

const HomeTiposSeguro = () => {
  const { modifyQueries, removeQueries } = useQueryString();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [tiposSeguro, setTiposSeguro] = useState<TiposSeguroGridData[]>([]);
  const [filters, setFilters] = useState<[string, string, string][]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [pagination, setPagination] = useState<PaginacionAPI>();
  const theme = useTheme();

  const handleApplySort = (appliedFilters: TiposSeguroFiltradoRequest) => {
    const queries: IQuery[] = [];
    appliedFilters.sortBy
      ? queries.push({ name: "sortBy", value: appliedFilters.sortBy.toString() })
      : null;
    appliedFilters.orderAsc
      ? queries.push({ name: "orderAsc", value: appliedFilters.orderAsc.toString() })
      : null;
    modifyQueries(queries);
  };

  const handleModalOpenEstado = (id: number) => {
    setRowId(id);
    setModalOpen(true);
  };

  const handleModalCloseEstado = () => {
    setModalOpen(false);
    setRowId(0);
  };

  const getSearchParams = (): TiposSeguroFiltradoRequest => {
    return {
      sortBy: searchParams.get("sortBy") || undefined,
      orderAsc: searchParams.get("orderAsc") === "true" ? true : undefined,
      codigo: searchParams.get("codigo") || undefined,
      nombre: searchParams.get("nombre") || undefined,
      estado: searchParams.get("estado")
        ? Boolean(searchParams.get("estado") === "1")
        : undefined,
      pageNumber: Number(searchParams.get("pageNumber")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
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

  const buscarTiposSeguro = () => {
    const filtros: TiposSeguroFiltradoRequest = getSearchParams();

    fetchTiposSeguro(filtros)
      .then((response: TiposSeguroFiltradosResponse) => {
        const tiposSeguroAPI = response.data.map((c) => ({
          id: c.id,
          codigo: c.codigo,
          nombre: c.nombre,
          estado: c.estado,
        }));
        setPagination(response.paginationData);
        const pag = response.paginationData;
        setQueryParamsInicial(pag.totalCount, pag.pageNumber, pag.pageSize, pag.totalPages);
        setTiposSeguro(tiposSeguroAPI);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  };

  const toggleActivation = useCallback(
    (isActivated: boolean | undefined, id: number) => {
      if (isActivated) {
        patchDesactivarTipoSeguro(id)
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardó con éxito.");
            setAlertType(typeAlert.success);
            buscarTiposSeguro(); // Vuelve a buscar los datos actualizados
          })
          .catch((error) => {
            if(error.response.data.errors){
              setAlertMessage(error.response.data.errors[0].description);
            }
              else{
            setAlertMessage("No se pudo desactivar el estado. Inténtalo de nuevo más tarde.");
              }
            setAlertType(typeAlert.error);
          });
      } else {
        patchActivarTipoSeguro(id)
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardó con éxito.");
            setAlertType(typeAlert.success);
            buscarTiposSeguro(); // Vuelve a buscar los datos actualizados
          })
          .catch((error) => {
            if(error.response.data.errors){
              setAlertMessage(error.response.data.errors[0].description);
            }
              else{
            setAlertMessage("No se pudo activar el estado. Inténtalo de nuevo más tarde.");
              }
            setAlertType(typeAlert.error);
          });
      }
      setModalOpen(false);
    },
    [buscarTiposSeguro]
  );

  const handleDeleteFilter = (key: keyof TiposSeguroFiltradoRequest) => {
    removeQueries([key]);
  };

  const getFilters = async () => {
    const array: [string, string, string][] = [];
    const appliedFilters = new URLSearchParams(searchParams.toString());
    const filtersObject: { [key: string]: string } = {};
    appliedFilters.forEach((value, key) => {
      filtersObject[key] = value;
    });

    filtersObject.codigo ? array.push(["Código", filtersObject.codigo, "codigo"]) : null;
    filtersObject.nombre ? array.push(["Nombre", filtersObject.nombre, "nombre"]) : null;
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
    buscarTiposSeguro();
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
        <Typography variant="h1">Tipos de Seguros</Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <FilterChips
            filters={filters}
            onDelete={(key) => handleDeleteFilter(key as keyof TiposSeguroFiltradoRequest)}
          />
          <Box display="flex" alignItems="center" justifyContent="space-between" gap="10px">
            <PopperFiltrosTiposSeguro />
            <CreateButton url={"/microMaestros/tiposSeguro/crear"} />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          paddingTop: 20,
        }}
      >
      </Box>

      {tiposSeguro && tiposSeguro.length > 0 ? (
        <GridTiposSeguro
          tiposSeguro={tiposSeguro}
          pagination={pagination}
          handleApplySort={handleApplySort}
          handleModalOpenEstado={handleModalOpenEstado}
          exportButton={
            <ExportButton
              getSerchParams={getSearchParams}
              documentName={"TiposSeguro.xlsx"}
              exportFunction={exportTiposSeguro}
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

      <ModalEstadoTiposSeguro
        open={modalOpen}
        handleClose={handleModalCloseEstado}
        id={rowId}
        toggleActivation={toggleActivation}
      />
    </Box>
  );
};

export default HomeTiposSeguro;