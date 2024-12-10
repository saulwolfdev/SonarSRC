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
  PolizaSeguroFiltradoResponse,
  PolizaSeguroGridData,
  PolizaSeguroFiltradoRequest,
} from "@/types/microContratos/polizaSeguroTypes";
import {
  fetchPolizaSeguro, desactivarPolizaSeguro, activarPolizaSeguro
} from "@/services/microContratos/polizaSeguroService";
import GridPolizaSeguro from "./components/GridPolizaSeguro";
import PopperFiltrosPolizaSeguro from "./components/PopperFiltrosPolizaSeguro";
import ModalEstado from "./components/ModalEstado";
import { PaginacionAPI } from "@/types/microContratos/GenericTypes";


const HomePolizaSeguro = () => {
  const { modifyQueries, removeQueries } = useQueryString();
  const [loading, setLoading] = useState(true);
  const [polizaSeguro, setPolizaSeguro] = useState<
    PolizaSeguroGridData[]
  >([]);
  const [filters, setFilters] = useState<[string, string, string][]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [openExportModal, setOpenExportModal] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [pagination, setPagination] = useState<PaginacionAPI>();
  const searchParams = useSearchParams();

  const theme = useTheme();

  const handleApplySort = (
    appliedFilters: PolizaSeguroFiltradoRequest
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
  const getSerchParams = (): PolizaSeguroFiltradoRequest => {
    return {
      numero: searchParams.get("numero") || undefined,
      vencido: searchParams.get("vencido") ? Boolean(searchParams.get("vencido") === "1") : undefined,
      estado: searchParams.get("estado") ? Boolean(searchParams.get("estado") === "1") : undefined,
      razonSocialContratista: searchParams.get("razonSocialContratista") || undefined,
      nombreTipoSeguro: searchParams.get("nombreTipoSeguro") || undefined,
      nombreCompaniaAseguradora: searchParams.get("nombreCompaniaAseguradora") || undefined,
      contratistaId: Number(searchParams.get("contratistaId")) || undefined,
      pageNumber: Number(searchParams.get("pageNumber")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 9,
      sortBy: searchParams.get("sortBy") || undefined,
      orderAsc: searchParams.get("orderAsc") ? Boolean(searchParams.get("orderAsc") === "true") : null,
    };
  };

  const getFilters = async () => {
    const array: [string, string, string][] = [];
    const appliedFilters = new URLSearchParams(searchParams.toString());
    const filtersObject: { [key: string]: string } = {};
    appliedFilters.forEach((value, key) => {
      filtersObject[key] = value;
    });

    filtersObject.numero ? array.push(["Numero", filtersObject.numero, "numero"]) : null;
    filtersObject.vencido ? array.push(["Vencido", filtersObject.vencido == "1" ? "vencido" : "no vencido", "vencido"]) : null;
    filtersObject.estado ? array.push(["Estado", filtersObject.estado == "1" ? "Activo" : "Inactivo", "estado"]) : null;
    filtersObject.razonSocialContratista ? array.push(["razonSocialContratista", filtersObject.razonSocialContratista, "razonSocialContratista"]) : null;
    filtersObject.nombreTipoSeguro ? array.push(["nombreTipoSeguro", filtersObject.nombreTipoSeguro, "nombreTipoSeguro"]) : null;
    filtersObject.nombreCompaniaAseguradora ? array.push(["nombreCompaniaAseguradora", filtersObject.nombreCompaniaAseguradora, "nombreCompaniaAseguradora"]) : null;
    filtersObject.contratistaId ? array.push(["Contratista", filtersObject.contratistaId, "contratistaId"]) : null;

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

  const buscarPolizaSeguro = () => {
    const filtros: PolizaSeguroFiltradoRequest = getSerchParams();

    fetchPolizaSeguro(filtros)
      .then((response: PolizaSeguroFiltradoResponse) => {
        const PolizaSeguroGrid = response.data.map((p) => ({ // todo aca colocar los datos 
          id: p.id,
          contratista: p.razonSocialContratista? p.razonSocialContratista: "",
          numero: p.numero,
          tipoSeguro: p.nombreTipoSeguro,
          companiaAseguradora: p.nombreCompaniaAseguradora,
          cuitCompaniaAseguradora: Number(p.cuitCompaniaAseguradora),
          vigencia: p.vigencia,
          estado: p.estado,
        }));
        setPagination(response.paginationData);
        const pag = response.paginationData;
        setQueryParamsInicial(
          pag.totalCount,
          pag.pageNumber,
          pag.pageSize,
          pag.totalCount
        );
        setPolizaSeguro(PolizaSeguroGrid);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  };

  const toggleActivation = useCallback(
    (isActivated: boolean | undefined, id: number, motivo?: string) => {
      if (isActivated) {
        motivo && desactivarPolizaSeguro({ id: id , motivo: motivo })
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardó con éxito.")
            setAlertType(typeAlert.success)
            buscarPolizaSeguro()
          })
          .catch((error) => {
            if(error.response.data.errors){
              setAlertMessage(error.response.data.errors[0].description);
            }
              else{
            setAlertMessage("No se pudo desactivar el estado. Inténtalo de nuevo más tarde.")
              }
            setAlertType(typeAlert.error)
          })
      } else {
        activarPolizaSeguro({ id: id })
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardó con éxito.")
            setAlertType(typeAlert.success)
            buscarPolizaSeguro()
          })
          .catch((error) => {
            if(error.response.data.errors){
              setAlertMessage(error.response.data.errors[0].description);
            }
              else{
            setAlertMessage("No se pudo activar el estado. Inténtalo de nuevo más tarde.")
              }
            setAlertType(typeAlert.error)
          })
      }
      setModalOpen(false)
    },
    [buscarPolizaSeguro]
  )

  const handleDeleteFilter = (
    key: keyof PolizaSeguroFiltradoRequest) => {
    removeQueries([key]);
  };

  useEffect(() => {
    getFilters();
    buscarPolizaSeguro();
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
        <Typography variant="h1">Póliza de Seguro</Typography>
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
                key as keyof PolizaSeguroFiltradoRequest
              )
            }
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="10px"
          >
            <PopperFiltrosPolizaSeguro />
            <CreateButton url={"/microContratos/polizaSeguro/crear"} />
          </Box>
        </Box>
      </Box>

      {polizaSeguro && polizaSeguro.length > 0 ? (
        <GridPolizaSeguro
          polizaSeguro={polizaSeguro}
          pagination={pagination}
          handleModalOpenEstado={handleModalOpenEstado}
          handleApplySort={handleApplySort}
          setAlertMessage={setAlertMessage}
          setAlertType={setAlertType}
          getSerchParams={getSerchParams}
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

export default HomePolizaSeguro;