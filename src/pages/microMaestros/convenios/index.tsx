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
  buscarConvenios,
  getFilters,
  getSerchParams,
  handleApplySort,
  handleDeleteFilter,
  handleModalOpenEstado,
  setQueryParamasDeFiltros,
} from "@/utils/microMaestros/conveniosColectivosUtils";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import {
  ConvenioGridData,
  ConveniosFiltradasRequest
} from "@/types/microMaestros/convenioColectivoTypes";
import GridConvenios from "@/components/microMaestros/convenios/GridConvenios";
import PopperFiltrosConveniosColectivos from "@/components/microMaestros/convenios/PopperFiltrosConveniosColectivos";
import { useFiltrosConveniosStore } from "@/zustand/microMaestros/gremios/convenios/useFiltrosStore";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";

const HomeConvenios = () => {
  const [loading, setLoading] = useState(true);
  const [convenios, setConvenios] = useState<ConvenioGridData[]>([]);
  const [filters, setFilters] = useState<[string, string, string][]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [pagination, setPagination] = useState<PaginacionAPI>();
  const searchParams = useSearchParams();
  const { modifyQueries, removeQueries } = useQueryString();

  const theme = useTheme();

  const codigo = useFiltrosConveniosStore((state) => state.codigo);
  const nombre = useFiltrosConveniosStore((state) => state.nombre);
  const horasDiariasDeTrabajo = useFiltrosConveniosStore(
    (state) => state.horasDiariasDeTrabajo
  );
  const nombreTitulo = useFiltrosConveniosStore((state) => state.nombreTitulo);
  const nombreZona = useFiltrosConveniosStore((state) => state.nombreZona);
  const nombreTurno = useFiltrosConveniosStore((state) => state.nombreTurno);
  const estado = useFiltrosConveniosStore((state) => state.estado);

  useEffect(() => {
    // MUY IMPORTANTE QUE ESTE USEEFFECT SE EJECUTE ANTES QUE EL OTRO
    setQueryParamasDeFiltros(
      codigo,
      nombre,
      horasDiariasDeTrabajo,
      nombreTitulo,
      nombreZona,
      nombreTurno,
      estado,
      modifyQueries
    );
  }, []);

  useEffect(() => {
    getFilters(setFilters, searchParams);
    buscarConvenios(
      setPagination,
      setConvenios,
      setLoading,
      modifyQueries,
      searchParams
    );
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
        <Typography variant="h1">Convenios</Typography>
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
                key as keyof ConveniosFiltradasRequest,
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
            <PopperFiltrosConveniosColectivos />
            <CreateButton url={`/microMaestros/convenios/crear`} />
          </Box>
        </Box>
      </Box>

      {convenios && convenios.length > 0 ? (
        <GridConvenios
          convenios={convenios}
          pagination={pagination}
          handleModalOpenEstado={handleModalOpenEstado}
          handleApplySort={handleApplySort}
          setRowId={setRowId}
          setModalOpen={setModalOpen}
          setAlertMessage={setAlertMessage}
          setAlertType={setAlertType}
        />
      ) : Object.keys(filters).length > 0 ? (
        <FiltradoSinDatos />
      ) : (
        <NoExistenRegistros />
      )}
    </Box>
  );
};

export default HomeConvenios;
