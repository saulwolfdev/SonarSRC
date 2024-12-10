import { Box, Typography, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import Spinner from "@/components/shared/Spinner";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";
import CreateButton from "@/components/shared/CreateButton";
import FilterChips from "@/components/shared/FilterChips";
import { useSearchParams } from "next/navigation";

import {
  GremioConsolidadoGridData,
  GremiosConsolidadosFiltradasRequest
} from "@/types/microMaestros/gremiosConsolidadosTypes";
import {
  exportGremiosConsolidados,
  exportGremiosConsolidadosAnidados,
} from "@/services/microMaestros/consolidadosService";

import GridGremiosConsolidados from "@/components/microMaestros/gremios/consolidados/GridGremioConsolidado";
import BreadcrumbCustom from "@/components/shared/BreadcrumbCustom";
import ExportButtonGremios from "@/components/shared/ExportButtonModal";
import ModalExportGremio from "@/components/microMaestros/gremios/ModalExportGremio";
import PopperFiltrosGremiosConsolidados from "@/components/microMaestros/gremios/consolidados/PopperFiltrosGremiosConsolidados";
import {
  buscarGremiosConsolidados,
  getFilters,
  getSerchParams,
  handleApplySort,
  handleDeleteFilter,
  handleModalOpenEstado,
  setQueryParamasDeFiltros,
} from "@/utils/microMaestros/gremiosConsolidadosUtils"
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { useCodigosStore } from "@/zustand/microMaestros/gremios/useCodigosStore";
import { goBackConsolidadores } from "@/utils/microMaestros/gremiosUtils";
import { useFiltrosConsolidadosStore } from "@/zustand/microMaestros/gremios/consolidados/useFiltrosStore";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";
import { useRouterPush } from "@/hooks/useRouterPush";
import { useRouter } from "next/router";

const HomeGremioConsolidado = () => {
  const codigoGremioConsolidador = useCodigosStore(
    (state) => state.codigoGremioConsolidador
  );
  const nombreGremioConsolidador = useCodigosStore(
    (state) => state.nombreGremioConsolidador
  );

  const codigo = useFiltrosConsolidadosStore((state) => state.codigo);
  const nombre = useFiltrosConsolidadosStore((state) => state.nombre);
  const estado = useFiltrosConsolidadosStore((state) => state.estado);

  const updateCodigoGremioConsolidador = useCodigosStore(
    (state) => state.updateCodigoGremioConsolidador
  );
  const updateNombreGremioConsolidador = useCodigosStore(
    (state) => state.updateNombreGremioConsolidador
  );
  const updateCodigoGremioConsolidado = useCodigosStore(
    (state) => state.updateCodigoGremioConsolidado
  );
  const updateNombreGremioConsolidado = useCodigosStore(
    (state) => state.updateNombreGremioConsolidado
  );
  const updateCodigoAsociacionGremial = useCodigosStore(
    (state) => state.updateCodigoAsociacionGremial
  );
  const updateNombreAsociacionGremial = useCodigosStore(
    (state) => state.updateNombreAsociacionGremial
  );
  const updateCodigoConvenioColectivo = useCodigosStore(
    (state) => state.updateCodigoConvenioColectivo
  );
  const updateNombreConvenioColectivo = useCodigosStore(
    (state) => state.updateNombreConvenioColectivo
  );
  const updateCodigoTituloConvenioColectivo = useCodigosStore(
    (state) => state.updateCodigoTituloConvenioColectivo
  );
  const updateNombreTituloConvenioColectivo = useCodigosStore(
    (state) => state.updateNombreTituloConvenioColectivo
  );

  const [loading, setLoading] = useState(true);
  const [gremiosConsolidados, setGremiosConsolidado] = useState<
    GremioConsolidadoGridData[]
  >([]);
  const [filters, setFilters] = useState<[string, string, string][]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [openExportModal, setOpenExportModal] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [pagination, setPagination] = useState<PaginacionAPI>();

  const [gremioConsolidadoName, setGremioConsolidadoName] =
    useState<string>("");

  const [gremioConsolidadorName, setGremioConsolidadorName] =
    useState<string>("");
  const searchParams = useSearchParams();
  const { modifyQueries, removeQueries } = useQueryString();

  const theme = useTheme();
  const router = useRouter();


  const breadcrumbs = [
    {
      name: "GREMIOS",
      path: `/microMaestros/gremios/consolidadores`,
      goBack: () =>
        goBackConsolidadores(
          updateCodigoGremioConsolidador,
          updateNombreGremioConsolidador,
          updateCodigoGremioConsolidado,
          updateNombreGremioConsolidado,
          updateCodigoAsociacionGremial,
          updateNombreAsociacionGremial,
          updateCodigoConvenioColectivo,
          updateNombreConvenioColectivo,
          updateCodigoTituloConvenioColectivo,
          updateNombreTituloConvenioColectivo
        ),
    },
    {
      name: nombreGremioConsolidador,
    },
  ];

  useEffect(() => {
    // MUY IMPORTANTE QUE ESTE USEEFFECT SE EJECUTE ANTES QUE EL OTRO
    setQueryParamasDeFiltros(codigo, nombre, estado, modifyQueries);
  }, []);

  useEffect(() => {
    getFilters(setFilters, searchParams);
    buscarGremiosConsolidados(
      setPagination,
      setGremiosConsolidado,
      setLoading,
      modifyQueries,
      searchParams,
      codigoGremioConsolidador
    );
  }, [searchParams.toString()]);

  useEffect(() => {
    if (!nombreGremioConsolidador) {
      router.push("/microMaestros/gremios/consolidadores");
    }
  }, [nombreGremioConsolidador]);

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
        <Typography variant="h1">Gremio consolidado</Typography>
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
                key as keyof GremiosConsolidadosFiltradasRequest,
                removeQueries
              )
            }
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="10px"
          >
            <PopperFiltrosGremiosConsolidados />
            <CreateButton url={`/microMaestros/gremios/consolidados/crear`} />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          pt: { md: 5 },
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          width: "100%",
        }}
      >
        <BreadcrumbCustom breadcrumbs={breadcrumbs} />
      </Box>

      {gremiosConsolidados && gremiosConsolidados.length > 0 ? (
        <GridGremiosConsolidados
          gremiosConsolidados={gremiosConsolidados}
          pagination={pagination}
          handleModalOpenEstado={handleModalOpenEstado}
          handleApplySort={handleApplySort}
          setRowId={setRowId}
          setModalOpen={setModalOpen}
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
        type="gremio consolidado"
        getSerchParams={getSerchParams}
        exportFunctionSimple={exportGremiosConsolidados}
        exportFunctionAnidada={exportGremiosConsolidadosAnidados}
        documentNameSimple={"Gremios consolidados"}
        documentNameAnidado={"Gremios consolidados Completo"}
        setAlertMessage={setAlertMessage}
        setAlertType={setAlertType}
      />
    </Box>
  );
};

export default HomeGremioConsolidado;
