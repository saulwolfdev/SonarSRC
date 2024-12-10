import { Box, Typography, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import Spinner from "@/components/shared/Spinner";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";
import CreateButton from "@/components/shared/CreateButton";
import FilterChips from "@/components/shared/FilterChips";
import { useSearchParams } from "next/navigation";
import useQueryString, { IQuery } from "@/hooks/useQueryString";

import {
  fetchTiposUnidades,
  exportTiposUnidades,
  patchActivarTipoUnidad,
  patchDesactivarTipoUnidad,
} from "@/services/microMaestros/tiposUnidadesService";

import {
  TipoUnidadGridData,
  TipoUnidadFiltradoRequest,
} from "@/types/microMaestros/tiposUnidadesTypes";

import GridTiposUnidades from "@/components/microMaestros/tiposUnidades/GridTiposUnidades";
import PopperFiltrosTiposUnidades from "@/components/microMaestros/tiposUnidades/PopperFiltrosTiposUnidades";
import ModalEstado from "@/components/microMaestros/tiposUnidades/ModalEstado";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";

const HomeTiposUnidades = () => {
  const { modifyQueries, removeQueries } = useQueryString();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [tiposUnidades, setTiposUnidades] = useState<TipoUnidadGridData[]>([]);
  const [filters, setFilters] = useState<[string, string, string][]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [pagination, setPagination] = useState<PaginacionAPI>();
  const theme = useTheme();

  const handleApplySort = (appliedFilters: TipoUnidadFiltradoRequest) => {
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

  const getSearchParams = (): TipoUnidadFiltradoRequest => {
    return {
      sortBy: searchParams.get("sortBy") || undefined,
      orderAsc: searchParams.get("orderAsc") === "true" ? true : undefined,
      codigo: searchParams.get("codigo") || undefined,
      nombre: searchParams.get("nombre") || undefined,
      tipoRecurso: searchParams.get("tipoRecurso") || undefined,
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

  const buscarTiposUnidades = () => {
    const filtros: TipoUnidadFiltradoRequest = getSearchParams();

    fetchTiposUnidades(filtros)
      .then((response) => {
        setTiposUnidades(response.data);
        setPagination(response.paginationData);
        const pag = response.paginationData;
        setQueryParamsInicial(pag.totalCount, pag.pageNumber, pag.pageSize, pag.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  };

  const toggleActivation = useCallback(
    (isActivated: boolean | undefined, id: number, comentario?: string) => {
      if (isActivated) {
        patchDesactivarTipoUnidad(id, comentario!)
          .then(() => {
            setAlertMessage("¡Se desactivó con éxito!");
            setAlertType(typeAlert.success);
            buscarTiposUnidades();
          })
          .catch((error) => {
            if(error.response.data.errors){
              setAlertMessage(error.response.data.errors[0].description);
            }
              else{
            setAlertMessage("No se pudo desactivar. Inténtalo de nuevo más tarde.");
              }
            setAlertType(typeAlert.error);
          });
      } else {
        patchActivarTipoUnidad(id)
          .then(() => {
            setAlertMessage("¡Se activó con éxito!");
            setAlertType(typeAlert.success);
            buscarTiposUnidades();
          })
          .catch((error) => {
            if(error.response.data.errors){
              setAlertMessage(error.response.data.errors[0].description);
            }
              else{
            setAlertMessage("No se pudo activar. Inténtalo de nuevo más tarde.");
              }
            setAlertType(typeAlert.error);
          });
      }
      setModalOpen(false);
    },
    [buscarTiposUnidades]
  );
  
  const handleDeleteFilter = (key: keyof TipoUnidadFiltradoRequest) => {
    removeQueries([key]);
  };

  const getFilters = async () => {
    const array: [string, string, string][] = [];
    const appliedFilters = new URLSearchParams(searchParams.toString());
    const filtersObject: { [key: string]: string } = {};
    appliedFilters.forEach((value, key) => {
      filtersObject[key] = value;
    });

    filtersObject.codigo && array.push(["Código", filtersObject.codigo, "codigo"]);
    filtersObject.nombre && array.push(["Nombre", filtersObject.nombre, "nombre"]);
    filtersObject.tipoRecurso &&
      array.push(["Tipo de Recurso", filtersObject.tipoRecurso, "tipoRecurso"]);
    filtersObject.estado &&
      array.push(["Estado", filtersObject.estado == "1" ? "Activo" : "Inactivo", "estado"]);

    setFilters(array);
  };

  useEffect(() => {
    getFilters();
    buscarTiposUnidades();
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
        <Typography variant="h1">Tipos de Unidades</Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <FilterChips
            filters={filters}
            onDelete={(key) => handleDeleteFilter(key as keyof TipoUnidadFiltradoRequest)}
          />
          <Box display="flex" alignItems="center" justifyContent="space-between" gap="10px">
            <PopperFiltrosTiposUnidades />
            <CreateButton url={"/microMaestros/tiposUnidades/crear"} />
          </Box>
        </Box>
      </Box>

      {tiposUnidades && tiposUnidades.length > 0 ? (
        <GridTiposUnidades
          tiposUnidades={tiposUnidades}
          pagination={pagination}
          handleApplySort={handleApplySort}
          handleModalOpenEstado={handleModalOpenEstado}
          exportFunction={exportTiposUnidades}
          getSearchParams={getSearchParams}
          setAlertMessage={setAlertMessage}
          setAlertType={setAlertType}
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

export default HomeTiposUnidades;
