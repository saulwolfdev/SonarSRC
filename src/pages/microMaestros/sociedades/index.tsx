import { Box, Typography, useTheme } from "@mui/material"
import React, { useCallback, useEffect, useState } from "react"
import Spinner from "@/components/shared/Spinner"
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert"
import ModalEstado from "./components/ModalEstado"
import {
  activarSociedades,
  desactivarSociedades,
  exportSociedades,
  fetchSociedades,
} from "@/services/microMaestros/SociedadesService"
import {
  SociedadesFiltradasResponse,
  SociedadesGridData,
  SociedadesFiltradasRequest,
} from "@/types/microMaestros/sociedadesTypes";
import GridSociedades from "./components/GridSociedades";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";
import PopperFiltrosSociedades from "./components/PopperFiltrosSociedades"; 
import ExportButton from "@/components/shared/ExportButton";
import FilterChips from "@/components/shared/FilterChips";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { useSearchParams } from "next/navigation";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes"

const HomeSociedades = () => {
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginacionAPI>();
  const [sociedades, setSociedades] = useState<SociedadesGridData[]>([]);
  const [filters, setFilters] = useState<[string,string,string][]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const { removeQueries ,modifyQueries} = useQueryString();
  const searchParams = useSearchParams();

  const theme = useTheme();

  const handleApplySort = (appliedFilters: SociedadesFiltradasRequest) => {
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
    setRowId(id)
    setModalOpen(true)
  }

  const handleModalCloseEstado = () => {
    setModalOpen(false)
    setRowId(0)
  }

  const buscarSociedades = useCallback(() => {
    const filtros: SociedadesFiltradasRequest = getSerchParams()
  

    fetchSociedades(filtros)
      .then((response: SociedadesFiltradasResponse) => {
        const sociedadesAPI = response.data.map((c) => ({
          id: c.id,
          nombre: c.nombre,

          origen: c.origen,         
          codigoSap: c.codigoSap,   
          estado: c.estado,           
        }));
  
        setSociedades(sociedadesAPI); 
        setPagination(response.paginationData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, [searchParams.toString()]);

  const toggleActivation = useCallback(
    async (isActivated: boolean | undefined, idOrigen: number, motivo?: string) => {
      if (isActivated === true) {
        // Desactivar: requiere motivo
        if (!motivo || motivo.trim() === "") {
          setAlertMessage("El motivo es requerido para desactivar.")
          setAlertType(typeAlert.error)
          return
        }
        try {
          await desactivarSociedades({ id: idOrigen, motivo })
          setAlertMessage("¡Todo salió bien! Se desactivó con éxito.")
          setAlertType(typeAlert.success)
          buscarSociedades()
        } catch (error: any) {
            if(error.response.data.errors){
              setAlertMessage(error.response.data.errors[0].description);
            }
              else{
          setAlertMessage("No se pudo desactivar el estado. Inténtalo de nuevo más tarde.")
              }
              setAlertType(typeAlert.error)
        }
      } else {
        // Activar: no requiere motivo
        try {
          await activarSociedades({ id: idOrigen })
          setAlertMessage("¡Todo salió bien! Se activó con éxito.")
          setAlertType(typeAlert.success)
          buscarSociedades()
        } catch (error: any) {
            if(error.response.data.errors){
              setAlertMessage(error.response.data.errors[0].description);
            }
              else{
          setAlertMessage("No se pudo activar el estado. Inténtalo de nuevo más tarde.")
              }
          setAlertType(typeAlert.error)
        }
      }
      setModalOpen(false)
    },
    [buscarSociedades]
  )



  const handleDeleteFilter = (key: keyof SociedadesFiltradasRequest) => {
    removeQueries([key]);
  };


  const getSerchParams = (): SociedadesFiltradasRequest => {
    return {
      nombre: searchParams.get("nombre") || undefined,
      origen: searchParams.get("origen") || undefined,
      codigoSap: searchParams.get("codigoSap") || undefined,
      estado: searchParams.get("estado")
        ? Boolean(searchParams.get("estado") === "1")
        : undefined,
      pageNumber: Number(searchParams.get("pageNumber")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 9,
      // sortBy: searchParams.get("sortBy") || undefined,
      // orderAsc: searchParams.get("orderAsc")
      //   ? Boolean(searchParams.get("orderAsc") === "true")
      //   : null,
    };
  };

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
    filtersObject.origen
      ? array.push(["Origen", filtersObject.origen, "origen"])
      : null;
    filtersObject.codigoSap
      ? array.push(["Codigo SAP", filtersObject.codigoSap, "codigoSap"])
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

    getFilters()
    buscarSociedades();
  }, [searchParams.toString(), buscarSociedades]);

  if (loading) {
    return <Spinner />
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
        <Typography variant="h1">Sociedades</Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <FilterChips

            filters={filters}
            onDelete={(key) =>
              handleDeleteFilter(key as keyof SociedadesFiltradasRequest)
            }
          />
          <Box display="flex" alignItems="center" justifyContent="space-between" gap="10px">
            <PopperFiltrosSociedades />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          paddingTop: 20,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" gap="10px">
        </Box>
      </Box>

      {sociedades && sociedades.length > 0 ? (
        <GridSociedades
          sociedades={sociedades}
          pagination={pagination}
          handleModalOpenEstado={handleModalOpenEstado}
          handleApplySort={handleApplySort}
          exportButton={
            <ExportButton
              getSerchParams={getSerchParams}
              documentName={"Sociedades.xlsx"}
              exportFunction={exportSociedades}
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
  )
}

export default HomeSociedades
