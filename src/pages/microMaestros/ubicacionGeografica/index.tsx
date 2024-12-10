import { Box, Typography, useTheme } from "@mui/material"
import React, { useEffect, useState } from "react"
import PopperFiltros from "../../../components/microMaestros/ubicacionGeografica/PopperFiltros"
import GridUbicacionesGeograficas from "../../../components/microMaestros/ubicacionGeografica/GridUbicacionesGeograficas"
import {
  fetchLocalidadPorId,
  fetchPaisPorId,
  fetchProvinciaPorId,
  fetchActivarUbicacion,
  fetchUbicaciones,
  fetchDesactivarUbicacion,
  fetchProvinciaNameById,
  fetchLocalidadNameById,
  fetchCodigoPostalNameById,
} from "@/services/microMaestros/ubicacionGeograficaService"
import {
  LocalidadPorIdRequest,
  PaisPorIdRequest,
  ProvinciaPorIdRequest,
  ToggleActivacionRequest,
  UbicacionEditar,
  UbicacionesGeograficasFiltradasRequest,
  UbicacionesGeograficasFiltradasResponse,
  UbicacionesGridData,
  UbicacionGeograficaAPI,
} from "@/types/microMaestros/ubicacionGeograficaTypes"
import ModalUbicacionGeografica from "../../../components/microMaestros/ubicacionGeografica/ModalUbicacionGeografica"
import { useSearchParams } from "next/navigation"
import FilterChips from "@/components/shared/FilterChips"
import useQueryString, { IQuery } from "@/hooks/useQueryString"
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes"
import Spinner from "@/components/shared/Spinner"
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";

const HomeUbicacionesGeograficas = () => {
  const [loading, setLoading] = useState(true)
  const [ubicaciones, setUbicaciones] = useState<UbicacionesGridData[]>()
  const [filters, setFilters] = useState<[string, string, string][]>([]);
  const { removeQueries, modifyQueries } = useQueryString();
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<UbicacionEditar>()
  const [modalOpen, setModalOpen] = useState(false)
  const [pagination, setPagination] = useState<PaginacionAPI>()
  const [loadingModal, setLoadingModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const searchParams = useSearchParams()
  const theme = useTheme()
  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)

  const handleApplySort = (appliedFilters: UbicacionesGeograficasFiltradasRequest) => {
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

  const toggleActivation = async (level: string) => {
    let req: ToggleActivacionRequest
    try {
      if (level === "pais") {
        req = { paisId: ubicacionSeleccionada?.paisId };
        if (!ubicacionSeleccionada?.paisEstado) {
          await fetchActivarUbicacion(req);
        } else {
          await fetchDesactivarUbicacion(req);
        }
      }
      if (level === "provincia") {
        req = { provinciaId: ubicacionSeleccionada?.provinciaId };
        if (!ubicacionSeleccionada?.provinciaEstado) {
          await fetchActivarUbicacion(req);
        } else {
          await fetchDesactivarUbicacion(req);
        }
      }
      if (level === "localidad") {
        req = { localidadId: ubicacionSeleccionada?.localidadId };
        if (!ubicacionSeleccionada?.localidadEstado) {
          await fetchActivarUbicacion(req);
        } else {
          await fetchDesactivarUbicacion(req);
        }
      }
      setAlertMessage("¡Todo salió bien! Se guardó con éxito.");
      setAlertType(typeAlert.success);
      } catch (error: any) {
        // Manejar errores y mostrar mensaje de error
        if (error.response?.data?.errors) {
          setAlertMessage(error.response.data.errors[0].description);
        } else {
          setAlertMessage(
            "No se pudo cambiar el estado. Inténtalo de nuevo más tarde."
          );
        }
        setAlertType(typeAlert.error);
      } finally {
        buscarUbicaciones();
        handleModalClose();
      }
  }

  const handleActivacion = async (row: UbicacionesGridData) => {
    setLoadingModal(true);
    const ubicacionEditada: UbicacionEditar = {} as UbicacionEditar;

    try {
      const reqPais: PaisPorIdRequest = { id: row.paisId ?? 0 };
      const res = await fetchPaisPorId(reqPais);
      ubicacionEditada.pais = res.isoName;
      ubicacionEditada.paisId = res.id;
      ubicacionEditada.cantidadProvincias = res.cantidadProvincias;
      ubicacionEditada.paisEstado = res.estado;

      if (row.provinciaId) {
        const reqProvincia: ProvinciaPorIdRequest = { id: row.provinciaId };
        const resPrv = await fetchProvinciaPorId(reqProvincia);
        ubicacionEditada.provincia = resPrv.isoName;
        ubicacionEditada.provinciaId = resPrv.id;
        ubicacionEditada.cantidadLocalidades = resPrv.cantidadLocalidades;
        ubicacionEditada.provinciaEstado = resPrv.estado;
      }

      if (row.localidadId) {
        const reqLocalidad: LocalidadPorIdRequest = { id: row.localidadId };
        const resLoc = await fetchLocalidadPorId(reqLocalidad);
        ubicacionEditada.localidad = resLoc.nombre;
        ubicacionEditada.localidadId = resLoc.id;
        ubicacionEditada.cantidadLocalidades = resLoc.cantidadCodigosPostales;
        ubicacionEditada.localidadEstado = resLoc.estado;
      }

      setUbicacionSeleccionada(ubicacionEditada);
      setLoadingModal(false);
      handleModalOpen();
    } catch (error) {
      console.error("Error al cargar los datos de la ubicación:", error);
      setLoadingModal(false);
    }
  };


  const getEstadoUnicacion = (ubicacion: UbicacionGeograficaAPI): string => {
    if (ubicacion.localidadId) return ubicacion.localidadEstado ? "Activo" : "Desactivado"
    if (ubicacion.provinciaId) return ubicacion.provinciaEstado ? "Activo" : "Desactivado"
    if (ubicacion.paisId) return ubicacion.paisEstado ? "Activo" : "Desactivado"
    return "Desactivado"
  }

  const buscarUbicaciones = () => {
    fetchUbicaciones({
      paisId: Number(searchParams.get("paisId")) || null,
      provinciaId: Number(searchParams.get("provinciaId")) || null,
      localidadId: Number(searchParams.get("localidadId")) || null,
      codigoPostalId: Number(searchParams.get("codigoPostalId")) || null,
      estado: searchParams.get("estado") ? Boolean(searchParams.get("estado") === "1") : null,
      pageNumber: Number(searchParams.get("pageNumber")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 9,
    })
      .then(function (response: UbicacionesGeograficasFiltradasResponse) {
        const ubicacionesAPI = response.data.map((u) => {
          const uGrilla: UbicacionesGridData = {
            id: u.paisId * 100000 + u.provinciaId + 1000 + u.localidadId + 10 + u.codigoPostalId,
            pais: u.paisNombre,
            paisId: u.paisId,
            codigoPostalCodigo: u.codigoPostalCodigo,
            localidad: u.localidadNombre,
            localidadId: u.localidadId,
            provincia: u.provinciaNombre,
            provinciaId: u.provinciaId,
            estado: getEstadoUnicacion(u),
          }
          return uGrilla
        })
        setPagination(response.paginationData)
        setUbicaciones(ubicacionesAPI)
        getFilters()
        setLoading(false)
      })
      .catch(function (error: any) {
        console.log(error)
      })
      .finally(function () {
        // always executed
      })
  }

  const getFilters = async () => {
    const array: [string, string, string][] = [];
    const appliedFilters = new URLSearchParams(searchParams.toString());
    const filtersObject: { [key: string]: string } = {};
    appliedFilters.forEach((value, key) => {
      filtersObject[key] = value;
    });


    let provincia = "";
    if (filtersObject.provinciaId) {
      provincia = await fetchProvinciaNameById(Number(filtersObject.provinciaId));
    }

    let localidad = "";
    if (filtersObject.localidadId) {
      localidad = await fetchLocalidadNameById(Number(filtersObject.localidadId));
    }

    let codigoPostal = "";
    if (filtersObject.codigoPostalId) {
      codigoPostal = await fetchCodigoPostalNameById(Number(filtersObject.codigoPostalId));
    }

    filtersObject.paisId
      ? array.push(["Pais", filtersObject.paisId, "paisId"])
      : null;
    filtersObject.provinciaId
      ? array.push(["Provincia", provincia, "provinciaId"])
      : null;
    filtersObject.localidadId
      ? array.push(["Localidad", localidad, "localidadId"])
      : null;
    filtersObject.codigoPostalId
      ? array.push(["Código Postal", codigoPostal, "codigoPostalId"])
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


  const handleDeleteFilter = (key: keyof UbicacionesGeograficasFiltradasRequest) => {
    removeQueries([key]);
  };


  useEffect(() => {
    getFilters()
    buscarUbicaciones()
  }, [searchParams.toString()])

  if (loading) {
    return <Spinner />
  }

  return (
    <Box
      sx={{
        position: "relative", // Necesario para el overlay
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
      {loadingModal && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner />
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: theme.spacing(2),
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Typography variant="h1">Gestión de ubicaciones</Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <FilterChips
            filters={filters}
            onDelete={(key) =>
              handleDeleteFilter(key as keyof UbicacionesGeograficasFiltradasRequest)
            }
          />
          <PopperFiltros />
        </Box>
      </Box>
      <GridUbicacionesGeograficas
        ubicaciones={ubicaciones}
        pagination={pagination}
        handleActivacion={handleActivacion}
        handleApplySort={handleApplySort}

      />
      <ModalUbicacionGeografica
        open={modalOpen}
        handleClose={handleModalClose}
        toggleActivation={toggleActivation}
        ubicacionSeleccionada={ubicacionSeleccionada}
      />
    </Box>
  );
}

export default HomeUbicacionesGeograficas
