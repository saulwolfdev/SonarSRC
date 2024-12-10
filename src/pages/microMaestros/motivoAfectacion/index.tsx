import { Box, Typography, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";
import CreateButton from "@/components/shared/CreateButton";
import FilterChips from "../../../components/shared/FilterChips";
import { useSearchParams } from "next/navigation";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { useRouter } from "next/router";
import Spinner from "@/components/shared/Spinner";
import ExportButton from "@/components/shared/ExportButton";
import GridMotivoAfectacion from "../../../components/microMaestros/motivoAfectacion/GridMotivoAfectacion";
import ModalMotivoAfectacion from "../../../components/microMaestros/motivoAfectacion/ModalMotivoAfectacion";
import PopperFiltrosMotivoAfectacion from "../../../components/microMaestros/motivoAfectacion/PopperFiltrosMotivoAfectacion";
import {
  desactivarMotivoAfectacion,
  activarMotivoAfectacion,
  fetchMotivoAfectacion,
  exportMotivoAfectacion,
} from "../../../services/microMaestros/motivoAfectacionService";
import {
  MotivoAfectacionGridData,
  PaginacionAPI,
  MotivoAfectacionFiltradoRequest,
  MotivoAfectacionFiltradoResponse,
} from "../../../types/microMaestros/motivoAfectacionTypes";

const HomeMotivoAfectacion = () => {
  const { modifyQueries, remove, removeQueries } = useQueryString();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [motivoAfectacion, setMotivoAfectacion] = useState<
    MotivoAfectacionGridData[]
  >([]);
  const [filters, setFilters] = useState<[string, string, string][]>([]);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const theme = useTheme();
  const [pagination, setPagination] = useState<PaginacionAPI>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);
  // const [query, setQuery] = useState<MotivoAfectacionFiltradoRequest>({});

  const handleApplySort = (appliedFilters: MotivoAfectacionFiltradoRequest) => {
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

  const setQueryParamsPaginationResponse = (
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

  const handleDeleteFilter = (key: keyof MotivoAfectacionFiltradoRequest) => {
    removeQueries([key]);
  };

  const handleModalOpenEstado = (id: any) => {
    setRowId(id);
    setModalOpen(true);
  };
  const handleModalCloseEstado = () => {
    setModalOpen(false);
    setRowId(0);
  };
  const toggleActivation = useCallback(
    (isActivated: boolean | undefined, id: number, comentario?: string) => {
      // Recibe comentario
      if (isActivated) {
        desactivarMotivoAfectacion({ id: id, motivo: comentario }) // Pasamos el comentario a la petición
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardó con éxito.");
            setAlertType(typeAlert.success);
            buscarMotivoAfectacion();
          })
          .catch((error) => {
            if (error.response.data.errors) {
              setAlertMessage(error.response.data.errors[0].description);
            } else {
              setAlertMessage(
                "No se pudo desactivar el estado. Inténtalo de nuevo más tarde."
              );
            }
            setAlertType(typeAlert.error);
          });
      } else {
        activarMotivoAfectacion({ id: id })
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardó con éxito.");
            setAlertType(typeAlert.success);
            buscarMotivoAfectacion();
          })
          .catch((error) => {
            if (error.response.data.errors) {
              setAlertMessage(error.response.data.errors[0].description);
            } else {
              setAlertMessage(
                "No se pudo activar el estado. Inténtalo de nuevo más tarde."
              );
            }
            setAlertType(typeAlert.error);
          });
      }
      setModalOpen(false);
    },
    [rowId, modalOpen]
  );

  const buscarMotivoAfectacion = async () => {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAA");
    const filtrosAplicados: MotivoAfectacionFiltradoRequest = {
      id: Number(searchParams.get("id")) || undefined,
      motivoAfectacion: searchParams.get("motivoDeAfectacion") || undefined,
      relacionesServicio: searchParams.get("relacionesServicio")
        ? searchParams
            .get("relacionesServicio")!
            .split(",")
            .map((value) => Number(value))
            .filter((num) => !isNaN(num))
        : undefined,
      fechaIncorporacion: searchParams.get("fechaIncorporacion")
        ? Boolean(searchParams.get("fechaIncorporacion") === "1")
        : undefined,
      bajaPorCesion: searchParams.get("bajaPorCesion")
        ? Boolean(searchParams.get("bajaPorCesion") === "1")
        : undefined,
      afectacionTemporal: searchParams.get("afectacionTemporal")
        ? Boolean(searchParams.get("afectacionTemporal") === "1")
        : undefined,
      estado: searchParams.get("estado")
        ? Boolean(searchParams.get("estado") === "1")
        : undefined,
      pageSize: Number(searchParams.get("pageSize")) || 9,
      sortBy: searchParams.get("sortBy") || undefined,
      orderAsc: searchParams.get("orderAsc")
        ? Boolean(searchParams.get("orderAsc") === "true")
        : null,
    };
    try {
      const response: MotivoAfectacionFiltradoResponse =
        await fetchMotivoAfectacion(filtrosAplicados);

      const motivoAfectacionAPI = response.data?.map((c) => ({
        id: c.id,
        motivoDeAfectacion: c.motivoDeAfectacion,
        relacionServicio: c.relacionServicio,
        fechaIncorporacion: c.fechaIncorporacion,
        bajaPorCesion: c.bajaPorCesion,
        afectacionTemporal: c.afectacionTemporal,
        estado: c.estado,
      }));

      setMotivoAfectacion(motivoAfectacionAPI);
      setPagination(response.paginationData);

      const pag = response.paginationData;
      setQueryParamsPaginationResponse(
        pag.totalCount,
        pag.pageNumber,
        pag.pageSize,
        pag.totalPages
      );
    } catch (error) {
      console.error("Error al buscar MotivoAfectacion: ", error);
    } finally {
      setLoading(false);
    }
  };

  const getSearchParams = (): MotivoAfectacionFiltradoRequest => {
    return {
      sortBy: searchParams.get("sortBy") || undefined,
      orderAsc: searchParams.get("orderAsc")
        ? Boolean(searchParams.get("orderAsc") === "true")
        : null,
      id: Number(searchParams.get("id")) || undefined,
      motivoAfectacion: searchParams.get("motivoDeAfectacion") || undefined,
      relacionesServicio: searchParams.get("relacionesServicio")
        ? searchParams
            .get("relacionesServicio")!
            .split(",")
            .map((value) => Number(value))
            .filter((num) => !isNaN(num))
        : undefined,
      estado: searchParams.get("estado")
        ? Boolean(searchParams.get("estado") === "1")
        : undefined,
      fechaIncorporacion: searchParams.get("fechaIncorporacion")
        ? Boolean(searchParams.get("fechaIncorporacion") === "1")
        : undefined,
      bajaPorCesion: searchParams.get("bajaPorCesion")
        ? Boolean(searchParams.get("bajaPorCesion") === "1")
        : undefined,
      afectacionTemporal: searchParams.get("afectacionTemporal")
        ? Boolean(searchParams.get("afectacionTemporal") === "1")
        : undefined,
      pageNumber: Number(searchParams.get("pageNumber")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 9,
    };
  };

  const getFilters = async () => {
    const array: [string, string, string][] = [];
    const appliedFilters = new URLSearchParams(searchParams.toString());
    const filtersObject: { [key: string]: string } = {};
    appliedFilters.forEach((value, key) => {
      filtersObject[key] = value;
    });

    filtersObject.id ? array.push(["Código", filtersObject.id, "id"]) : null;
    filtersObject.motivoDeAfectacion
      ? array.push([
          "Motivo Afectación",
          filtersObject.motivoDeAfectacion,
          "motivoDeAfectacion",
        ])
      : null;
    filtersObject.relacionesServicio
      ? array.push([
          "Relacion de servicio",
          filtersObject.relacionesServicio,
          "relacionesServicio",
        ])
      : null;
    filtersObject.fechaIncorporacion
      ? array.push([
          "Solic. fecha incorporación",
          filtersObject.fechaIncorporacion == "1" ? "Si" : "No",
          "fechaIncorporacion",
        ])
      : null;
    filtersObject.bajaPorCesion
      ? array.push([
          "Baja por cesión",
          filtersObject.bajaPorCesion == "1" ? "Si" : "No",
          "bajaPorCesion",
        ])
      : null;
    filtersObject.afectacionTemporal
      ? array.push([
          "Afectación temporal",
          filtersObject.afectacionTemporal == "1" ? "Si" : "No",
          "afectacionTemporal",
        ])
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
    buscarMotivoAfectacion();
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
        }}
      >
        <Typography variant="h1">Motivos de afectación</Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <FilterChips
            onDelete={(key) =>
              handleDeleteFilter(key as keyof MotivoAfectacionFiltradoRequest)
            }
            filters={filters}
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="10px"
          >
            <PopperFiltrosMotivoAfectacion />
            <CreateButton url={"/microMaestros/motivoAfectacion/crear"} />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap="10px"
        >
          <ExportButton
            getSerchParams={getSearchParams}
            documentName={"MotivoAfectacion.xlsx"}
            exportFunction={exportMotivoAfectacion}
            setAlertMessage={setAlertMessage}
            setAlertType={setAlertType}
          />
        </Box>
      </Box>

      {motivoAfectacion && motivoAfectacion.length > 0 ? (
        <GridMotivoAfectacion
          motivoAfectacion={motivoAfectacion}
          handleModalOpenEstado={handleModalOpenEstado}
          handleApplySort={handleApplySort}
          pagination={pagination}
        />
      ) : filters.length > 0 ? (
        <FiltradoSinDatos />
      ) : (
        <NoExistenRegistros />
      )}

      <ModalMotivoAfectacion
        open={modalOpen}
        handleClose={handleModalCloseEstado}
        id={rowId}
        toggleActivation={toggleActivation}
      />
    </Box>
  );
};

export default HomeMotivoAfectacion;
