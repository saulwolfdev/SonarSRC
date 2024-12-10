import { Box, Typography, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import Spinner from "@/components/shared/Spinner";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import ModalEstado from "@/components/microMaestros/causaDesafectacion/ModalEstado";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";
import ExportButton from "@/components/shared/ExportButton";
import CreateButton from "@/components/shared/CreateButton";
import FilterChips from "@/components/shared/FilterChips";
import { useSearchParams } from "next/navigation";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { CausaDesafectacionFiltradasResponse, CausaDesafectacionGridData, CausasDesafectacionesFiltradasRequest} from "@/types/microMaestros/causaDesafectacionTypes";
import { activarCausaDesafectacion, desactivarCausaDesafectacion, exportCausasDesafectaciones, fetchCausasDesafectaciones } from "@/services/microMaestros/causaDesafectacionService";
import GridCausaDesafectacion from "@/components/microMaestros/causaDesafectacion/GridCausaDesafectacion";
import PopperFiltrosCausasDesafectaciones from "@/components/microMaestros/causaDesafectacion/PopperFiltrosCausaDesafectacion";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";


const HomeCausaDesafectacion = () => {
  const { modifyQueries, remove, removeQueries } = useQueryString();
  const [loading, setLoading] = useState(true);
  const [causasDesafectaciones, setCausasDesafectaciones] = useState<CausaDesafectacionGridData[]>([]);
  const [filters, setFilters] = useState<[string, string, string][]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [pagination, setPagination] = useState<PaginacionAPI>();
  const searchParams = useSearchParams();

  const theme = useTheme();

  const handleApplySort = (appliedFilters: CausasDesafectacionesFiltradasRequest) => {
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
 
  const getSerchParams = (): CausasDesafectacionesFiltradasRequest => {
    return {
      nombre: searchParams.get("nombre") || undefined,
      codigo: Number(searchParams.get("codigo")) || undefined,
      desafectaTodosLosContratos: searchParams.get("desafectaTodosLosContratos")  ? Boolean(searchParams.get("desafectaTodosLosContratos") === "1")
      : undefined,
      reemplazoPersonal: searchParams.get("reemplazoPersonal")  ? Boolean(searchParams.get("reemplazoPersonal") === "1")
      : undefined,
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

  const buscarCausasDesafectaciones = () => {
    const filtros: CausasDesafectacionesFiltradasRequest = getSerchParams();
    console.log(filtros);

    fetchCausasDesafectaciones(filtros)
      .then((response: CausaDesafectacionFiltradasResponse) => {
        const causasAPI = response.data.map((c) => ({
          id: c.codigo,
          nombre: c.nombre,
          descripcion: c.descripcion,
          desafectaTodosLosContratos: c.desafectaTodosLosContratos,
          reemplazoPersonal: c.reemplazoPersonal,
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
        setCausasDesafectaciones(causasAPI);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  };

  const toggleActivation = useCallback(
    (isActivated: boolean | undefined, idClasificacion: number, motivo?: string) => {
      if (isActivated && motivo) {
        desactivarCausaDesafectacion({ id: idClasificacion , motivo: motivo })
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardó con éxito.");
            setAlertType(typeAlert.success);
            buscarCausasDesafectaciones();
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
        activarCausaDesafectacion({ id: idClasificacion })
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardó con éxito.");
            setAlertType(typeAlert.success);
            buscarCausasDesafectaciones();
          })
          .catch((error) => {
            if(error.response.data.errors){
              setAlertMessage(error.response.data.errors[0].description);
            }
              else{
            setAlertMessage(
              "No se pudo activar el estado. Inténtalo de nuevo más tarde."
            );
          }
            setAlertType(typeAlert.error);
          });
      }
      setModalOpen(false);
    },
    [buscarCausasDesafectaciones]
  );

  const handleDeleteFilter = (key: keyof CausasDesafectacionesFiltradasRequest) => {
    removeQueries([key]);
  };

  //todo cambia
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
      ? array.push(["Codigo", filtersObject.codigo, "codigo"])
      : null;
      filtersObject.desafectaTodosLosContratos
      ? array.push([
          "Desafecta Todos Los Contratos",
          filtersObject.desafectaTodosLosContratos == "1" ? "Sí" : "No",
          "desafectaTodosLosContratos",
        ])
      : null;
      filtersObject.reemplazoPersonal
      ? array.push([
          "Remplazo Personal",
          filtersObject.reemplazoPersonal == "1" ? "Sí" : "no",
          "reemplazoPersonal",
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
    buscarCausasDesafectaciones();
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
        <Typography variant="h1">Causa desafectacion</Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <FilterChips
            filters={filters}
            onDelete={(key) =>
              handleDeleteFilter(key as keyof CausasDesafectacionesFiltradasRequest)
            }
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="10px"
          >
            <PopperFiltrosCausasDesafectaciones />
            <CreateButton url={"/microMaestros/causaDesafectacion/crear"} />
          </Box>
        </Box>
      </Box>

      {causasDesafectaciones && causasDesafectaciones.length > 0 ? (
        <GridCausaDesafectacion
          causasDesafectaciones={causasDesafectaciones}
          pagination={pagination}
          handleModalOpenEstado={handleModalOpenEstado}
          handleApplySort={handleApplySort}
          exportButton={
            <ExportButton
              getSerchParams={getSerchParams}
              documentName={"CausaDesafectacion.xlsx"}
              exportFunction={exportCausasDesafectaciones}
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

export default HomeCausaDesafectacion;
