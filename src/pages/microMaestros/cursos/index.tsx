import { Box, Typography, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import Spinner from "@/components/shared/Spinner";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import ModalEstado from "./components/ModalEstado";
import {
  activarCurso,
  desactivarCurso,
  exportCursos,
  fetchCursos,
  } from "../../../services/microMaestros/cursosService";
import {
  CursosFiltradasResponse,
  CursosGridData,
  CursosFiltradasRequest,
  PaginacionAPI,
} from "../../../types/microMaestros/cursosTypes";
import GridCursos from "./components/GridCursos";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";
import PopperFiltrosCursos from "./components/PopperFiltrosCursos";
import ExportButton from "@/components/shared/ExportButton";
import CreateButton from "@/components/shared/CreateButton";
import FilterChips from "@/components/shared/FilterChips";
import { useSearchParams } from "next/navigation";
import useQueryString, { IQuery } from "@/hooks/useQueryString";

const HomeCursos = () => {
  const { modifyQueries, remove, removeQueries } = useQueryString();
  const [loading, setLoading] = useState(true);
  const [centros, setCentros] = useState<CursosGridData[]>([]);
  const [filters, setFilters] = useState<[string, string, string][]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [pagination, setPagination] = useState<PaginacionAPI>();
  const searchParams = useSearchParams();

  const theme = useTheme();

  const handleApplySort = (appliedFilters: CursosFiltradasRequest) => {
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
  const getSerchParams = (): CursosFiltradasRequest => {
    return {
      codigo: Number(searchParams.get("codigo")) || undefined,
      nombre: searchParams.get("nombre") || undefined,
      especialidad: searchParams.get("especialidad") || undefined,
      institucion: searchParams.get("institucion") || undefined,
      areaSolicitante: searchParams.get("areaSolicitante") || undefined,
      modalidad: searchParams.get("modalidad") || undefined,
      horas: Number(searchParams.get("horas")) || undefined,

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
    const filtros: CursosFiltradasRequest = getSerchParams();
    console.log('filtros',filtros);

    fetchCursos(filtros)
      .then((response: CursosFiltradasResponse) => {
        console.log('response',response);
        
        const centrosAPI = response.data.map((c) => ({
          id: c.id,
          nombre: c.nombre,
          especialidad: c.especialidad,
          institucion: c.institucion,
          areaSolicitante:c.areaSolicitante,
          modalidad:c.modalidad,
          horas: c.horas,
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
        desactivarCurso({ id: idClasificacion, motivo: motivo ?? "" })
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardó con éxito.");
            setAlertType(typeAlert.success);
            buscarCentros();
          })
          .catch(() => {
            setAlertMessage(
              "No se pudo desactivar el estado. Inténtalo de nuevo más tarde."
            );
            setAlertType(typeAlert.error);
          });
      } else {
        activarCurso({ id: idClasificacion })
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardó con éxito.");
            setAlertType(typeAlert.success);
            buscarCentros();
          })
          .catch(() => {
            setAlertMessage(
              "No se pudo activar el estado. Inténtalo de nuevo más tarde."
            );
            setAlertType(typeAlert.error);
          });
      }
      setModalOpen(false);
    },
    [buscarCentros]
  );

  const handleDeleteFilter = (key: keyof CursosFiltradasRequest) => {
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

    filtersObject.especialidad
    ? array.push(["Especialidad", filtersObject.especialidad, "especialidad"])
    : null;

    filtersObject.institucion
    ? array.push(["Institución", filtersObject.institucion, "institucion"])
    : null;

    filtersObject.modalidad
    ? array.push(["Modalidad", filtersObject.modalidad, "modalidad"])
    : null;

    filtersObject.areaSolicitante
    ? array.push(["Area solicitante", filtersObject.areaSolicitante, "areaSolicitante"])
    : null;

    filtersObject.horas
    ? array.push(["Horas", filtersObject.horas, "horas"])
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
        <Typography variant="h1">Cursos</Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <FilterChips
            filters={filters}
            onDelete={(key) =>
              handleDeleteFilter(key as keyof CursosFiltradasRequest)
            }
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="10px"
          >
            <PopperFiltrosCursos />
            <CreateButton url={"/microMaestros/cursos/crear"} />
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
            getSerchParams={getSerchParams}
            documentName={"Cursos.xlsx"}
            exportFunction={exportCursos}
            setAlertMessage={setAlertMessage}
            setAlertType={setAlertType}
          />
        </Box>
      </Box>
      {centros && centros.length > 0 ? (
        <GridCursos
          centros={centros}
          pagination={pagination}
          handleModalOpenEstado={handleModalOpenEstado}
          handleApplySort={handleApplySort}
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

export default HomeCursos;
