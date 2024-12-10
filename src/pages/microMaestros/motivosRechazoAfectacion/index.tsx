import { Box, Typography, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import Spinner from "@/components/shared/Spinner";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";
import ExportButton from "@/components/shared/ExportButton";
import CreateButton from "@/components/shared/CreateButton";
import FilterChips from "@/components/shared/FilterChips";
import { useSearchParams } from "next/navigation";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import {
  MotivoRechazoObjecionAfectacionFiltradasRequest,
  MotivoRechazoObjecionAfectacionFiltradasResponse,
  MotivoRechazoObjecionAfectacionGridData,
} from "@/types/microMaestros/motivosRechazoAfectacionTypes";
import {
  activarMotivoRechazoObjecionAfectacion,
  desactivarMotivoRechazoObjecionAfectacion,
  exportMotivoRechazoObjecionAfectacion,
  fetchMotivosRechazoObjecionAfectacion,
} from "@/services/microMaestros/motivosRechazoAfectacionService";
import PopperFiltrosMotivosRechazoObjecionAfectacion from "@/components/microMaestros/motivosRechazoAfectacion/PopperFiltrosMotivosRechazoObjecionAfectacion";
import GridMotivosRechazoObjecionAfectacion from "@/components/microMaestros/motivosRechazoAfectacion/GridMotivosRechazoObjecionAfectacion";
import ModalEstado from "@/components/microMaestros/motivosRechazoAfectacion/ModalEstado";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";

const HomeMotivoRechazoObjecionAfectacion = () => {
  const { modifyQueries, remove, removeQueries } = useQueryString();
  const [loading, setLoading] = useState(true);
  const [motivos, setMotivos] = useState<
    MotivoRechazoObjecionAfectacionGridData[]
  >([]);
  const [filters, setFilters] = useState<[string, string, string][]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [pagination, setPagination] = useState<PaginacionAPI>();
  const searchParams = useSearchParams();

  const theme = useTheme();

  const handleApplySort = (
    appliedFilters: MotivoRechazoObjecionAfectacionFiltradasRequest
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

  const getSerchParams =
    (): MotivoRechazoObjecionAfectacionFiltradasRequest => {
      return {
        codigo: Number(searchParams.get("codigo")) || undefined,
        nombre: searchParams.get("nombre") || undefined,
        objecion: searchParams.get("objecion")
          ? Boolean(searchParams.get("objecion") === "1")
          : undefined,
        rechazo: searchParams.get("rechazo")
          ? Boolean(searchParams.get("rechazo") === "1")
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

  const buscarMotivos = useCallback(() => {
    const filtros: MotivoRechazoObjecionAfectacionFiltradasRequest =
      getSerchParams();
    console.log(filtros);

    fetchMotivosRechazoObjecionAfectacion(filtros)
      .then((response: MotivoRechazoObjecionAfectacionFiltradasResponse) => {
        const motivosAPI = response.data.map((c) => ({
          id: c.codigo,
          nombre: c.nombre,
          descripcion: c.descripcion,
          estado: c.estado,
          objecion: c.objecion,
          rechazo: c.rechazo,
        }));
        setPagination(response.paginationData);
        const pag = response.paginationData;
        setQueryParamsInicial(
          pag.totalCount,
          pag.pageNumber,
          pag.pageSize,
          pag.totalCount
        );
        setMotivos(motivosAPI);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, [searchParams.toString()]);

  const toggleActivation = useCallback(
    (
      isActivated: boolean | undefined,
      id: number,
      motivo?: string | undefined
    ) => {
      if (isActivated) {
        desactivarMotivoRechazoObjecionAfectacion({ id: id, motivo: motivo })
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardó con éxito.");
            setAlertType(typeAlert.success);
            buscarMotivos();
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
        activarMotivoRechazoObjecionAfectacion({ id: id })
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardó con éxito.");
            setAlertType(typeAlert.success);
            buscarMotivos();
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
    [buscarMotivos]
  );

  const handleDeleteFilter = (
    key: keyof MotivoRechazoObjecionAfectacionFiltradasRequest
  ) => {
    removeQueries([key]);
  };

  const getFilters = async () => {
    const array: [string, string, string][] = [];
    const appliedFilters = new URLSearchParams(searchParams.toString());
    const filtersObject: { [key: string]: string } = {};
    appliedFilters.forEach((value, key) => {
      filtersObject[key] = value;
    });

    filtersObject.objecion
      ? array.push([
          "Objeción",
          filtersObject.objecion == "1" ? "Si" : "No",
          "objecion",
        ])
      : null;

    filtersObject.rechazo
      ? array.push([
          "Rechazo",
          filtersObject.rechazo == "1" ? "Si" : "No",
          "rechazo",
        ])
      : null;

    filtersObject.nombre
      ? array.push(["Nombre", filtersObject.nombre, "nombre"])
      : null;

    filtersObject.codigo
      ? array.push(["Código", filtersObject.codigo, "codigo"])
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
    buscarMotivos();
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
        <Typography variant="h1">
          Motivos de rechazo y/u objeción de afectación
        </Typography>
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
                key as keyof MotivoRechazoObjecionAfectacionFiltradasRequest
              )
            }
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="10px"
          >
            <PopperFiltrosMotivosRechazoObjecionAfectacion />
            <CreateButton
              url={"/microMaestros/motivosRechazoAfectacion/crear"}
            />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: 20,
          width: "100%",
        }}
      ></Box>

      {motivos && motivos.length > 0 ? (
        <GridMotivosRechazoObjecionAfectacion
          motivos={motivos}
          pagination={pagination}
          handleModalOpenEstado={handleModalOpenEstado}
          handleApplySort={handleApplySort}
          exportButton={
            <ExportButton
              getSerchParams={getSerchParams}
              documentName={
                "Listado de Motivos de rechazos y objeciones de afectación.xlsx"
              }
              exportFunction={exportMotivoRechazoObjecionAfectacion}
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

export default HomeMotivoRechazoObjecionAfectacion;
