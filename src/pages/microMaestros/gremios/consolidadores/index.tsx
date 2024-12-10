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
  GremiosConsolidadoresFiltradasResponse,
  GremioConsolidadorGridData,
  GremiosConsolidadoresFiltradasRequest,
} from "@/types/microMaestros/gremiosConsolidadoresTypes.js";
import {
  exportGremiosConsolidadores,
  exportGremiosConsolidadoresAnidados,
  fetchGremiosConsolidadores,
} from "@/services/microMaestros/consolidadorService";
import GridGremiosConsolidadores from "@/components/microMaestros/gremios/consolidadores/GridGremioConsolidador";
import ExportButtonGremios from "@/components/shared/ExportButtonModal";
import ModalExportGremio from "@/components/microMaestros/gremios/ModalExportGremio";
import PopperFiltrosGremiosConsolidadores from "@/components/microMaestros/gremios/consolidadores/PopperFiltrosGremiosConsolidador";
import { useFiltrosConsolidadoresStore } from "@/zustand/microMaestros/gremios/consolidadores/useFiltrosStore";

import { fetchProvinciaNameById } from "@/services/microMaestros/conveniosGremiosService";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";

const HomeGremioConsolidador = () => {
  const { modifyQueries, removeQueries } = useQueryString();
  const [loading, setLoading] = useState(true);
  const [gremiosConsolidadores, setGremiosConsolidadores] = useState<
    GremioConsolidadorGridData[]
  >([]);
  const [filters, setFilters] = useState<[string, string, string][]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [openExportModal, setOpenExportModal] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [pagination, setPagination] = useState<PaginacionAPI>();
  const searchParams = useSearchParams();

  const codigo = useFiltrosConsolidadoresStore((state) => state.codigo);
  const nombre = useFiltrosConsolidadoresStore((state) => state.nombre);
  const estado = useFiltrosConsolidadoresStore((state) => state.estado);
  const nombreGremioConsolidado = useFiltrosConsolidadoresStore(
    (state) => state.nombreGremioConsolidado
  );
  const nombreAsociacionGremial = useFiltrosConsolidadoresStore(
    (state) => state.nombreAsociacionGremial
  );
  const provinciaId = useFiltrosConsolidadoresStore(
    (state) => state.provinciaId
  );
  const nombreConvenioColectivo = useFiltrosConsolidadoresStore(
    (state) => state.nombreConvenioColectivo
  );

  const theme = useTheme();

  const handleApplySort = (
    appliedFilters: GremiosConsolidadoresFiltradasRequest
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

  const handleModalOpenEstado = (id: number) => {
    setRowId(id);
    setModalOpen(true);
  };

  const handleModalCloseEstado = () => {
    setModalOpen(false);
    setRowId(0);
  };

  const getSerchParams = (): GremiosConsolidadoresFiltradasRequest => {
    return {
      codigo: Number(searchParams.get("codigo")) || undefined,
      nombre: searchParams.get("nombre") || undefined,
      estado: searchParams.get("estado")
        ? Boolean(searchParams.get("estado") === "1")
        : undefined,
      nombreGremioConsolidado:
        searchParams.get("nombreGremioConsolidado") || undefined,
      nombreAsociacionGremial:
        searchParams.get("nombreAsociacionGremial") || undefined,
      provinciaId: Number(searchParams.get("provinciaId")) || undefined,
      nombreConvenioColectivo:
        searchParams.get("nombreConvenioColectivo") || undefined,
      pageNumber: Number(searchParams.get("pageNumber")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 9,
      sortBy: searchParams.get("sortBy") || undefined,
      orderAsc: searchParams.get("orderAsc")
        ? Boolean(searchParams.get("orderAsc") === "true")
        : null,
    };
  };

  const getFilters = async () => {
    const array: [string, string, string][] = [];
    const appliedFilters = new URLSearchParams(searchParams.toString());
    const filtersObject: { [key: string]: string } = {};
    appliedFilters.forEach((value, key) => {
      filtersObject[key] = value;
    });

    let provinciaId = "";
    if (filtersObject.provinciaId) {
      provinciaId = await fetchProvinciaNameById(
        Number(filtersObject.provinciaId)
      );
    }

    filtersObject.codigo
      ? array.push(["Código", filtersObject.codigo, "codigo"])
      : null;
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
    filtersObject.nombreGremioConsolidado
      ? array.push([
          "NombreGremioConsolidado",
          filtersObject.nombreGremioConsolidado,
          "nombreGremioConsolidado",
        ])
      : null;
    filtersObject.nombreAsociacionGremial
      ? array.push([
          "NombreAsociacionGremial",
          filtersObject.nombreAsociacionGremial,
          "nombreAsociacionGremial",
        ])
      : null;
    filtersObject.provinciaId
      ? array.push(["Provincia", provinciaId, "provinciaId"])
      : null;
    filtersObject.nombreConvenioColectivo
      ? array.push([
          "NombreConvenioColectivo",
          filtersObject.nombreConvenioColectivo,
          "nombreConvenioColectivo",
        ])
      : null;

    setFilters(array);
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

  const buscarGremiosConsolidadores = () => {
    const filtros: GremiosConsolidadoresFiltradasRequest = getSerchParams();

    fetchGremiosConsolidadores(filtros)
      .then((response: GremiosConsolidadoresFiltradasResponse) => {
        const consolidadoresAPI = response.data.map((c) => ({
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
          pag.totalCount
        );
        setGremiosConsolidadores(consolidadoresAPI);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  };

  const setQueryParamasDeFiltros = () => {
    console.log(codigo);
    const queries: IQuery[] = [];
    codigo && queries.push({ name: "codigo", value: codigo.toString() });
    nombre && queries.push({ name: "nombre", value: nombre.toString() });
    estado && queries.push({ name: "estado", value: estado ? "1" : "0" });
    nombreGremioConsolidado &&
      queries.push({
        name: "nombreGremioConsolidado",
        value: nombreGremioConsolidado.toString(),
      });
    nombreAsociacionGremial &&
      queries.push({
        name: "nombreAsociacionGremial",
        value: nombreAsociacionGremial.toString(),
      });
    provinciaId &&
      queries.push({ name: "provinciaId", value: provinciaId.toString() });
    nombreConvenioColectivo &&
      queries.push({
        name: "nombreConvenioColectivo",
        value: nombreConvenioColectivo.toString(),
      });
    modifyQueries(queries);
  };

  // const toggleActivation = useCallback(
  //   (isActivated: boolean | undefined, idClasificacion: number) => {
  //     if (isActivated) {
  //       desactivarGremio({ id: idClasificacion })
  //         .then(() => {
  //           setAlertMessage("¡Todo salió bien! Se guardó con éxito.")
  //           setAlertType(typeAlert.success)
  //           buscarConsolidado()
  //         })
  //         .catch(() => {
  //           setAlertMessage("No se pudo desactivar el estado. Inténtalo de nuevo más tarde.")
  //           setAlertType(typeAlert.error)
  //         })
  //     } else {
  //       activarCentro({ id: idClasificacion })
  //         .then(() => {
  //           setAlertMessage("¡Todo salió bien! Se guardó con éxito.")
  //           setAlertType(typeAlert.success)
  //           buscarConsolidado()
  //         })
  //         .catch(() => {
  //           setAlertMessage("No se pudo activar el estado. Inténtalo de nuevo más tarde.")
  //           setAlertType(typeAlert.error)
  //         })
  //     }
  //     setModalOpen(false)
  //   },
  //   [buscarConsolidado]
  // )

  const handleDeleteFilter = (
    key: keyof GremiosConsolidadoresFiltradasRequest
  ) => {
    removeQueries([key]);
  };

  useEffect(() => {
    // MUY IMPORTANTE QUE ESTE USEEFFECT SE EJECUTE ANTES QUE EL OTRO
    setQueryParamasDeFiltros();
  }, []);

  useEffect(() => {
    getFilters();
    buscarGremiosConsolidadores();
  }, [searchParams.toString()]);

  return loading ? (
    <Spinner />
  ) : (
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
          mb: 10
        }}
      >
        <Typography variant="h1">Gremio Consolidador</Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <FilterChips
            filters={filters}
            onDelete={(key) =>
              handleDeleteFilter(
                key as keyof GremiosConsolidadoresFiltradasRequest
              )
            }
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="10px"
          >
            <PopperFiltrosGremiosConsolidadores />
            <CreateButton url={"/microMaestros/gremios/consolidadores/crear"} />
          </Box>
        </Box>
      </Box>

      {gremiosConsolidadores && gremiosConsolidadores.length > 0 ? (
        <GridGremiosConsolidadores
          gremiosConsolidadores={gremiosConsolidadores}
          pagination={pagination}
          handleModalOpenEstado={handleModalOpenEstado}
          handleApplySort={handleApplySort} 
          setOpenExportModal={setOpenExportModal} 
        />
      ) : Object.keys(filters).length > 0 ? (
        <FiltradoSinDatos />
      ) : (
        <NoExistenRegistros />
      )}
      <ModalExportGremio
        open={openExportModal}
        setOpenExportModal={setOpenExportModal}
        type="gremio consolidador"
        getSerchParams={getSerchParams}
        exportFunctionSimple={exportGremiosConsolidadores}
        exportFunctionAnidada={exportGremiosConsolidadoresAnidados}
        documentNameSimple={"Gremios consolidadores"}
        documentNameAnidado={"Gremios consolidadores Completo"}
        setAlertMessage={setAlertMessage}
        setAlertType={setAlertType}
      />
    </Box>
  );
};

export default HomeGremioConsolidador;
