import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Spinner from "@/components/shared/Spinner";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import FilterChips from "@/components/shared/FilterChips";
import PopperFiltrosMotivosBloqueos from "@/components/microMaestros/motivosBloqueos/PopperFiltrosMotivosBloqueos";
import GridMotivosBloqueos from "@/components/microMaestros/motivosBloqueos/GridMotivosBloqueos";
import ModalErrorDescarga from "@/components/microMaestros/motivosBloqueos/ModalErrorDescarga";

import { fetchMotivosBloqueos, exportMotivosBloqueos, fetchOrigenes } from "@/services/microMaestros/motivosBloqueosService";
import {
  MotivoBloqueoFiltradoRequest,
  PaginacionAPI,
  MotivoBloqueoGridData,
} from "@/types/microMaestros/motivosBloqueosTypes";
import { IQuery } from "@/hooks/useQueryString";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";

const HomeMotivosBloqueos = () => {
  const [loading, setLoading] = useState(true);
  const [motivosBloqueos, setMotivosBloqueos] = useState<MotivoBloqueoGridData[]>([]);
  const [pagination, setPagination] = useState<PaginacionAPI>();
  const [filters, setFilters] = useState<[string, string, string][]>([]);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert>();
  const [modalErrorOpen, setModalErrorOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<MotivoBloqueoFiltradoRequest>({});
  const [origenes, setOrigenes] = useState<{ id: number; nombre: string }[]>([]);

  const theme = useTheme();

  useEffect(() => {
    const obtenerOrigenes = async () => {
      try {
        const data = await fetchOrigenes();
        setOrigenes(data);
      } catch (error) {
        console.error("Error al cargar los orígenes:", error);
      }
    };
    obtenerOrigenes();
  }, []);

  const fetchData = useCallback(() => {
    setLoading(true);
    fetchMotivosBloqueos(appliedFilters)
      .then((response) => {
        setMotivosBloqueos(response.data);
        setPagination(response.paginationData);
        setLoading(false);
      })
      .catch((error) => {
        setAlertMessage("Error al cargar los datos.");        
        setAlertType(typeAlert.error);
        setLoading(false);
      });
  }, [appliedFilters]);

  const handleApplySort = (appliedFilters: MotivoBloqueoFiltradoRequest) => {
    setAppliedFilters((prevFilters) => ({
      ...prevFilters,
      sortBy: appliedFilters.sortBy,
      orderAsc: appliedFilters.orderAsc,
    }));
  };

  const handleDeleteFilter = (key: keyof MotivoBloqueoFiltradoRequest) => {
    setAppliedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      delete newFilters[key];
      return newFilters;
    });
  };

  const getFilters = () => {
    const array: [string, string, string][] = [];

    if (appliedFilters.nombre)
      array.push(["Nombre", appliedFilters.nombre, "nombre"]);
    if (appliedFilters.codigoOrigen)
      array.push(["Código", appliedFilters.codigoOrigen, "codigoOrigen"]);
    if (appliedFilters.origenId) {
      const origen = origenes.find((o) => o.id === appliedFilters.origenId);
      array.push(["Origen", origen ? origen.nombre : appliedFilters.origenId.toString(), "origenId"]);
    }
    if (appliedFilters.enviaNotificacion !== undefined)
      array.push([
        "Envia Notificación",
        appliedFilters.enviaNotificacion ? "Sí" : "No",
        "enviaNotificacion",
      ]);
    if (appliedFilters.enviaComunicacionFormal !== undefined)
      array.push([
        "Envia Comunicación Formal",
        appliedFilters.enviaComunicacionFormal ? "Sí" : "No",
        "enviaComunicacionFormal",
      ]);

    setFilters(array);
  };

  useEffect(() => {
    getFilters();
    fetchData();
  }, [appliedFilters]);

  if (loading) return <Spinner />;

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
        <Typography variant="h1">Motivos de Bloqueo</Typography>
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
                key as keyof MotivoBloqueoFiltradoRequest
              )
            }
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="10px"
          >
            <PopperFiltrosMotivosBloqueos onApply={(filters) => setAppliedFilters(filters)} />
            {/* Puedes agregar aquí el botón de crear si es necesario */}
          </Box>
        </Box>
      </Box>

      {motivosBloqueos.length > 0 ? (
        <GridMotivosBloqueos
          motivosBloqueos={motivosBloqueos}
          pagination={pagination}
          handleApplySort={handleApplySort}
          getSearchParams={() => appliedFilters}
          exportFunction={exportMotivosBloqueos}
          setAlertMessage={setAlertMessage}
          setAlertType={setAlertType}
        />
      ) : filters.length > 0 ? (
        <FiltradoSinDatos />
      ) : (
        <NoExistenRegistros />
      )}
      <ModalErrorDescarga open={modalErrorOpen} handleClose={() => setModalErrorOpen(false)} />
    </Box>
  );
};

export default HomeMotivosBloqueos;
