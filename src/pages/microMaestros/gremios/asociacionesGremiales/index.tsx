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
  AsociacionGremialGridData,
  AsociacionesGremialesFiltradasRequest,
} from "@/types/microMaestros/asociacionGremialTypes";
import {
  exportAsociacionesGremiales,
  exportAsociacionesGremialesAnidados,
} from "@/services/microMaestros/asociacionesGremialesService";
import GridAsociacionesGremiales from "@/components/microMaestros/gremios/asociacionesGremiales/GridAsociacionGremial";
import BreadcrumbCustom from "@/components/shared/BreadcrumbCustom";
import ExportButtonGremios from "@/components/shared/ExportButtonModal";
import ModalExportGremio from "@/components/microMaestros/gremios/ModalExportGremio";
import PopperFiltrosAsociacionesGremiales from "@/components/microMaestros/gremios/asociacionesGremiales/PopperFiltrosAsociacionesGremiales";
import {
  buscarAsociacionesGremiales,
  getFilters,
  getSerchParams,
  handleApplySort,
  handleDeleteFilter,
  handleModalOpenEstado,
  setQueryParamasDeFiltros,
} from "@/utils/microMaestros/asociacionesGremialesUtils";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { useCodigosStore } from "@/zustand/microMaestros/gremios/useCodigosStore";
import { goBackConsolidadores, goBackConsolidados } from "@/utils/microMaestros/gremiosUtils";
import { useFiltrosAsociacionesGremialesStore } from "@/zustand/microMaestros/gremios/asosiacionesGremiales/useFiltrosStore";
import { useRouter } from "next/router";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";
import { useRouterPush } from "@/hooks/useRouterPush";

const HomeAsociacionGremial = () => {
  const [loading, setLoading] = useState(true);
  const [asociacionesGremiales, setAsociacionesGremiales] = useState<
    AsociacionGremialGridData[]
  >([]);
  const [filters, setFilters] = useState<[string, string, string][]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [openExportModal, setOpenExportModal] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [pagination, setPagination] = useState<PaginacionAPI>();
  const [gremioConsolidadorName, setGremioConsolidadorName] =
    useState<string>("");
  const [gremioConsolidadoName, setGremioConsolidadoName] =
    useState<string>("");
  const searchParams = useSearchParams();
  const { modifyQueries, removeQueries } = useQueryString();

  const theme = useTheme();
  const router = useRouter();


  const codigoGremioConsolidado = useCodigosStore(
    (state) => state.codigoGremioConsolidado
  );
  const nombreGremioConsolidador = useCodigosStore(
    (state) => state.nombreGremioConsolidador
  );
  const nombreGremioConsolidado = useCodigosStore(
    (state) => state.nombreGremioConsolidado
  );

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

  const codigo = useFiltrosAsociacionesGremialesStore((state) => state.codigo);
  const nombre = useFiltrosAsociacionesGremialesStore((state) => state.nombre);
  const estado = useFiltrosAsociacionesGremialesStore((state) => state.estado);
  const provinciaId = useFiltrosAsociacionesGremialesStore(
    (state) => state.provinciaId
  );

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
      path: `/microMaestros/gremios/consolidados`,
      goBack: () =>
        goBackConsolidados(
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
      name: nombreGremioConsolidado,
    },
  ];

  useEffect(() => {
    // MUY IMPORTANTE QUE ESTE USEEFFECT SE EJECUTE ANTES QUE EL OTRO
    setQueryParamasDeFiltros(
      codigo,
      nombre,
      estado,
      provinciaId,
      modifyQueries
    );
  }, []);

  useEffect(() => {
    getFilters(setFilters, searchParams);
    buscarAsociacionesGremiales(
      setPagination,
      setAsociacionesGremiales,
      setLoading,
      modifyQueries,
      searchParams,
      codigoGremioConsolidado
    );
  }, [searchParams.toString()]);

  useEffect(() => {
    if (!nombreGremioConsolidador || !nombreGremioConsolidado) {
      router.push("/microMaestros/gremios/consolidadores");
    }
  }, [nombreGremioConsolidador, nombreGremioConsolidado]);

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
        <Typography variant="h1">Asociación gremial</Typography>
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
                key as keyof AsociacionesGremialesFiltradasRequest,
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
            <PopperFiltrosAsociacionesGremiales />
            <CreateButton
              url={`/microMaestros/gremios/asociacionesGremiales/crear`}
            />
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

      {asociacionesGremiales && asociacionesGremiales.length > 0 ? (
        <GridAsociacionesGremiales
          asociacionesGremiales={asociacionesGremiales}
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
        exportFunctionSimple={exportAsociacionesGremiales}
        exportFunctionAnidada={exportAsociacionesGremialesAnidados}
        documentNameSimple={"Asociaciones Gremiales"}
        documentNameAnidado={"Asociaciones Gremiales Completo"}
        setAlertMessage={setAlertMessage}
        setAlertType={setAlertType}
      />
    </Box>
  );
};

export default HomeAsociacionGremial;
