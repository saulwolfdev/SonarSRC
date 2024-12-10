import { Box, Typography, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import Spinner from "@/components/shared/Spinner";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import ModalEstado from "@/components/microMaestros/compAseguradora/ModalEstado";
import {
  activarCentro,
  desactivarCentro,
  exportCompaniasAseguradoras,
  fetchCompaniasAseguradoras,
  fetchContratistaNameById,
  fetchTipoDeSeguroExceptuadoNameById,
  fetchTipoDeSeguroNameById,
  // fetchTipoDeSeguroExceptuadoNameById
} from "@/services/microMaestros/CompaniasAseguradorasService";
import {
  CompaniasAseguradorasFiltradasResponse,
  CompaniasAseguradorasGridData,
  CompaniasAseguradorasFiltradasRequest,
} from "@/types/microMaestros/companiasAseguradorasTypes";
import GridCompaniasAseguradoras from "@/components/microMaestros/compAseguradora/GridCompaniasAseguradoras";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";
import PopperFiltrosCompaniasAseguradoras from "@/components/microMaestros/compAseguradora/PopperFiltrosCompaniasAseguradoras";
import ExportButton from "@/components/shared/ExportButton";
import CreateButton from "@/components/shared/CreateButton";
import FilterChips from "@/components/shared/FilterChips";
import { useSearchParams } from "next/navigation";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";

const HomeCompaniasAseguradoras = () => {
  const { modifyQueries, remove, removeQueries } = useQueryString();
  const [loading, setLoading] = useState(true);
  const [compAseguradoras, setcompAseguradoras] = useState<CompaniasAseguradorasGridData[]>([]);
  const [filters, setFilters] = useState<[string, string, string][]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [pagination, setPagination] = useState<PaginacionAPI>();
  const searchParams = useSearchParams();

  const theme = useTheme();

  const handleApplySort = (appliedFilters: CompaniasAseguradorasFiltradasRequest) => {
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
  const getSerchParams = (): CompaniasAseguradorasFiltradasRequest => {
    return {
      codigo: searchParams.get("codigo") || undefined,
      nombre: searchParams.get("nombre") || undefined,
      cuit: searchParams.get("cuit") || undefined,
      tipoSeguroId: Number(searchParams.get("tipoSeguroId")) || undefined,
      tipoSeguroExceptuadoId: Number(searchParams.get("tipoSeguroExceptuadoId")) || undefined,
      contratistaId: Number(searchParams.get("contratistaId")) || undefined,
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

  const buscarcompAseguradoras = () => {
    const filtros: CompaniasAseguradorasFiltradasRequest = getSerchParams();
    
    fetchCompaniasAseguradoras(filtros)
      .then((response: CompaniasAseguradorasFiltradasResponse) => {
        const compAseguradorasAPI : CompaniasAseguradorasGridData[] = response.data.map((c) => ({
          id: c.id.toString(),
          nombre: c.nombre,
          cuit: c.cuit,
          estado: c.estado,
          tipoDeSeguro: c.tiposSeguros.map((s) => s.nombre).join(','), 
          tiposDeSegurosExceptuados: c.excepcionesSeguros.map(e => e.tipoSeguro.nombre).join(','),
          contratistas: c.excepcionesSeguros.flatMap(e => e.contratistas).map(c => c.razonSocial).join(','),
        }));
        setPagination(response.paginationData);
        const pag = response.paginationData;
        setQueryParamsInicial(
          pag.totalCount,
          pag.pageNumber,
          pag.pageSize,
          pag.totalCount
        );
        setcompAseguradoras(compAseguradorasAPI);
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
            setAlertMessage("¡Todo salió bien! Se guardó con éxito.");
            setAlertType(typeAlert.success);
            buscarcompAseguradoras();
          })
          .catch((error) => {
            if(error.response.data.errors){
              setAlertMessage(error.response.data.errors[0].description);
            }
              else{
            setAlertMessage(
              "No se pudo desactivar el estado. Inténtalo de nuevo más tarde."
            );
          }
            setAlertType(typeAlert.error);
          });
      } else {
        activarCentro({ id: idClasificacion })
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardó con éxito.");
            setAlertType(typeAlert.success);
            buscarcompAseguradoras();
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
    [buscarcompAseguradoras]
  );

  const handleDeleteFilter = (key: keyof CompaniasAseguradorasFiltradasRequest) => {
    removeQueries([key]);
  };

  const getFilters = async () => {
    const array: [string, string, string][] = [];
    const appliedFilters = new URLSearchParams(searchParams.toString());
    const filtersObject: { [key: string]: string } = {};
    appliedFilters.forEach((value, key) => {
      filtersObject[key] = value;
    });
    let contratista = "";
    let tipoDeSeguro = "";
    let tipoDeSeguroExceptuado = "";

    if (filtersObject.contratistaId) {
      contratista = await fetchContratistaNameById(
        Number(filtersObject.contratistaId)
      );
    }

    if (filtersObject.tipoSeguroId) {
      tipoDeSeguro = await fetchTipoDeSeguroNameById(
        Number(filtersObject.tipoSeguroId)
      );
    }

    if (filtersObject.tipoSeguroExceptuadoId) {
      tipoDeSeguroExceptuado = await fetchTipoDeSeguroExceptuadoNameById(
        Number(filtersObject.tipoSeguroExceptuadoId)
      );
    }
    filtersObject.codigo
      ? array.push(["Código", filtersObject.codigo, "codigo"])
      : null;
    filtersObject.nombre
      ? array.push(["Nombre", filtersObject.nombre, "nombre"])
      : null;      
    filtersObject.cuit
      ? array.push(["Cuit", filtersObject.cuit, "cuit"])
      : null;

    filtersObject.contratistaId
      ? array.push(["Contratista", contratista, "contratistaId"])
      : null;
    filtersObject.tipoSeguroId
      ? array.push(["TipoDeSeguro", tipoDeSeguro, "tipoSeguroId"])
      : null;
    filtersObject.tipoSeguroExceptuadoId
      ? array.push(["TipoDeSeguroExceptuado", tipoDeSeguroExceptuado, "tipoSeguroExceptuadoId"])
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
    buscarcompAseguradoras();
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
        <Typography variant="h1">Compañias aseguradoras</Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <FilterChips
            filters={filters}
            onDelete={(key) =>
              handleDeleteFilter(key as keyof CompaniasAseguradorasFiltradasRequest)
            }
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="10px"
          >
            <PopperFiltrosCompaniasAseguradoras />
            <CreateButton url={"/microMaestros/compAseguradoras/crear"} />
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
            documentName={"CompaniasAseguradoras.xlsx"}
            exportFunction={exportCompaniasAseguradoras}
            setAlertMessage={setAlertMessage}
            setAlertType={setAlertType}
          />
        </Box>
      </Box>

      {compAseguradoras && compAseguradoras.length > 0 ? (
        <GridCompaniasAseguradoras
          compAseguradas={compAseguradoras}
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

export default HomeCompaniasAseguradoras;
