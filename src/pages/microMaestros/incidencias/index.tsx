import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import CreateButton from "@/components/shared/CreateButton";
import Spinner from "@/components/shared/Spinner";
import { useSearchParams } from "next/navigation";
import GridIncidencias from "@/components/microMaestros/incidencias/GridIncidencias";
import { fetchIncidencias } from "@/services/microMaestros/incidenciasService";
import { IncidenciasFiltradasRequest, IncidenciasFiltradasResponse, IncidenciasGridData, IncidenciasPagination } from "@/types/microMaestros/incidenciasTypes";

const HomeIncidencias = () => {
  const theme = useTheme();
  const searchParams = useSearchParams();

  // States for data handling
  const [loading, setLoading] = useState(true);
  const [incidencias, setIncidencias] = useState<IncidenciasGridData[]>([]);
  const [pagination, setPagination] = useState<IncidenciasPagination>();
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [openExportModal, setOpenExportModal] = useState<boolean>(false);

  const fetchData = useCallback(() => {
    const pageNumber = Number(searchParams.get("pageNumber")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;

    const params: IncidenciasFiltradasRequest = {
      pageNumber,
      pageSize,
    };

    fetchIncidencias(params)
      .then((response: IncidenciasFiltradasResponse) => {
        const incidenciasConId: IncidenciasGridData[] = response.data.map((incidencia) => ({
          ...incidencia,
          id: incidencia.codigo,
          tipo: incidencia.tipoIncidencia || "N/A",
        }));
        setIncidencias(incidenciasConId);
        setPagination(response.paginationData);
        setLoading(false);
      })
      .catch((error) => {
        setAlertMessage("Error al cargar datos");
          setAlertType(typeAlert.error);
        setLoading(false);
      });
  }, [searchParams]);

  const handleApplySort = () => {
    fetchData();
  };

  const handleModalOpenEstado = (id: number) => {
    console.log(`Abrir modal de estado para incidencia con ID: ${id}`);
  };

  useEffect(() => {
    fetchData();
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
          mb: 10,
        }}
      >
        <Typography variant="h1">Incidencias</Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <CreateButton url={"/microMaestros/incidencias/crear"} />
        </Box>
      </Box>

      {incidencias.length > 0 ? (
        <GridIncidencias
          incidencias={incidencias}
          pagination={pagination}
          handleModalOpenEstado={handleModalOpenEstado}
          handleApplySort={handleApplySort}
          setOpenExportModal={setOpenExportModal}
        />
      ) : (
        <NoExistenRegistros />
      )}
    </Box>
  );
};

export default HomeIncidencias;
