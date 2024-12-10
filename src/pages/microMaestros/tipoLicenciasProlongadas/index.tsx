import { Box, Typography, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import Spinner from "@/components/shared/Spinner";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import ModalEstado from "./components/ModalEstado";
import {
  activarTipoLicenciaProlongada,
  desactivarTipoLicenciaProlongada,
  exportTipoLicenciasProlongadas,
  fetchTipoLicenciasProlongadas,
  } from "../../../services/microMaestros/tipoLicenciasProlongadasService";
import {
  TipoLicenciasProlongadasFiltradasResponse,
  TipoLicenciasProlongadasGridData,
  TipoLicenciasProlongadasFiltradasRequest,
} from "../../../types/microMaestros/tipoLicenciasProlongadasTypes";
import GridTipoLicenciasProlongadas from "./components/GridTipoLicenciasProlongadas";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";
import PopperFiltrosTipoLicenciasProlongadas from "./components/PopperFiltrosTipoLicenciasProlongadas";
import ExportButton from "@/components/shared/ExportButton";
import CreateButton from "@/components/shared/CreateButton";
import FilterChips from "@/components/shared/FilterChips";
import { useSearchParams } from "next/navigation";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";

const HomeTipoLicenciasProlongadas = () => {
  const { modifyQueries, remove, removeQueries } = useQueryString();
  const [loading, setLoading] = useState(true);
  const [centros, setCentros] = useState<TipoLicenciasProlongadasGridData[]>([]);
  const [filters, setFilters] = useState<[string, string, string][]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [pagination, setPagination] = useState<PaginacionAPI>();
  const searchParams = useSearchParams();

  const theme = useTheme();

  const handleApplySort = (appliedFilters: TipoLicenciasProlongadasFiltradasRequest) => {
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
  const getSerchParams = (): TipoLicenciasProlongadasFiltradasRequest => {
    return {
      codigo: Number(searchParams.get("codigo")) || undefined,
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
    const filtros: TipoLicenciasProlongadasFiltradasRequest = getSerchParams();
    console.log('filtros',filtros);

    fetchTipoLicenciasProlongadas(filtros)
      .then((response: TipoLicenciasProlongadasFiltradasResponse) => {
        console.log('response',response);
        
        const centrosAPI = response.data.map((c) => ({
          id: c.id,
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
        setCentros(centrosAPI);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  };

  const toggleActivation = useCallback(
    (isActivated: boolean | undefined, idClasificacion: number,motivo:string | undefined) => {
      if (isActivated) {
        desactivarTipoLicenciaProlongada({ id: idClasificacion, motivo: motivo ?? "" })
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardó con éxito.");
            setAlertType(typeAlert.success);
            buscarCentros();
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
        activarTipoLicenciaProlongada({ id: idClasificacion })
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardó con éxito.");
            setAlertType(typeAlert.success);
            buscarCentros();
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
    [buscarCentros]
  );

  const handleDeleteFilter = (key: keyof TipoLicenciasProlongadasFiltradasRequest) => {
    removeQueries([key]);
  };

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
      
    filtersObject.codigo
    ? array.push(["Código", filtersObject.codigo, "codigo"])
    : null;

    filtersObject.observacionObligatoria
      ? array.push(["Observación Obligatoria", filtersObject.observacionObligatoria == '2' ? 'Si' : 'No'  , "observacionObligatoria"])
      : null;

    filtersObject.tiempoLimite
      ? array.push(["Tiempo Limite", filtersObject.tiempoLimite, "tiempoLimite"])
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
        <Typography variant="h1">Tipo de licencias prolongadas</Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <FilterChips
            filters={filters}
            onDelete={(key) =>
              handleDeleteFilter(key as keyof TipoLicenciasProlongadasFiltradasRequest)
            }
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="10px"
          >
            <PopperFiltrosTipoLicenciasProlongadas />
            <CreateButton url={"/microMaestros/tipoLicenciasProlongadas/crear"} />
          </Box>
        </Box>
      </Box>
      {centros && centros.length > 0 ? (
        <GridTipoLicenciasProlongadas
          centros={centros}
          pagination={pagination}
          handleModalOpenEstado={handleModalOpenEstado}
          handleApplySort={handleApplySort}
          exportButton={
            <ExportButton
            getSerchParams={getSerchParams}
            documentName={"TipoLicenciasProlongadas.xlsx"}
            exportFunction={exportTipoLicenciasProlongadas}
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

      <ModalEstado
        open={modalOpen}
        handleClose={handleModalCloseEstado}
        id={rowId}
        toggleActivation={toggleActivation}
      />
    </Box>
  );
};

export default HomeTipoLicenciasProlongadas;
