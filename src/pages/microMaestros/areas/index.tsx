import { Box, Typography, useTheme } from "@mui/material"
import React, { useCallback, useEffect, useState } from "react"
import {
  AreasFiltradasRequest,
  AreasFiltradasResponse,
  NameGridData,
} from "@/types/microMaestros/areasTypes"
import {
  activarAreas,
  desactivarAreas,
  exportAreas,
  fetchName,
} from "@/services/microMaestros/areasService"
import Spinner from "@/components/shared/Spinner";
import GridAreas from "./components/GridAreas"
import ModalAreas from "./components/ModalAreas"
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert"
import NoExistenRegistros from "@/components/shared/NoExistenRegistros"
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos"
import FilterChips from "@/components/shared/FilterChips";
import PopperFiltros from "./components/PopperFiltros"
import ExportButton from "@/components/shared/ExportButton";
import CreateButton from "@/components/shared/CreateButton";
import { useSearchParams } from "next/navigation"
import useQueryString, { IQuery } from "@/hooks/useQueryString"
import { PaginacionAPI } from "@/types/microContratos/GenericTypes";

const HomeAreas = () => {
  const {modifyQueries, remove, removeQueries} = useQueryString();
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState<AreasFiltradasRequest>()
  const searchParams = useSearchParams()
  
  // tabla
  const [areas, setFunEst] = useState<NameGridData[]>()
  const [filters, setFilters] = useState<[string,string,string][]>([])
  const [pagination, setPagination] = useState<PaginacionAPI>()

  // modal estado
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [rowId, setRowId] = useState<number>(0)

  // respuesta
  const [alertMessage, setAlertMessage] = useState<string>("")
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined)

  const theme = useTheme()

  const handleModalOpenEstado = (id: any) => {
    setRowId(id)
    setModalOpen(true)
  }
  const handleModalCloseEstado = () => {
    setModalOpen(false)
    setRowId(0)
  }
  const handleApplySort = (appliedFilters: AreasFiltradasRequest) => {
    const queries : IQuery[] = [];
    appliedFilters.sortBy ? queries.push({name: 'sortBy', value: appliedFilters.sortBy.toString()}) : null;
    appliedFilters.orderAsc ? queries.push({name: 'orderAsc', value: (appliedFilters.orderAsc.toString() == 'asc').toString()}) : null;
    modifyQueries(queries);     
  };
  const toggleActivation = useCallback(
    (isActivated: boolean | undefined, idClasificacion: number) => {
      if (isActivated) {
        desactivarAreas({ id: idClasificacion })
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardo con éxito.")
            setAlertType(typeAlert.success)
            buscarAreas()
          })
          .catch((error) => {
            if(error.response.data.errors){
              setAlertMessage(error.response.data.errors[0].description);
            }
              else{
            setAlertMessage("No se pudo desactivar el estado. Inténtalo de nuevo más tarde.")
              }setAlertType(typeAlert.error)
          })
      } else {
        activarAreas({ id: idClasificacion })
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardo con éxito.")
            setAlertType(typeAlert.success)
            buscarAreas()
          })
          .catch((error) => {
            if(error.response.data.errors){
              setAlertMessage(error.response.data.errors[0].description);
            }
              else{
            setAlertMessage("No se pudo activar el estado. Inténtalo de nuevo más tarde.")
              }setAlertType(typeAlert.error)
          })
      }
      setModalOpen(false)
    },
    [rowId, modalOpen]
  )
  

const buscarAreas = () => {
    const filtrosAplicados: AreasFiltradasRequest = {
        id: Number(searchParams.get("codigo")) || null,
        nombre: searchParams.get("nombre") || null,
        estado: searchParams.get("estado") ? Boolean(searchParams.get("estado") === "1") : null,
        pageNumber: Number(searchParams.get("pageNumber")) || 1,
        pageSize: Number(searchParams.get("pageSize")) || 9,
        sortBy: searchParams.get('sortBy') || undefined,
        orderAsc: searchParams.get('orderAsc') ? Boolean(searchParams.get("orderAsc") === "true") : null,
  
    };

    // Actualizar los filtros aplicados en el estado
    const newFilters = [];
    if (filtrosAplicados.id) {
        newFilters.push({ label: "Código", value: String(filtrosAplicados.id) });
    }
    if (filtrosAplicados.nombre) {
        newFilters.push({ label: "Nombre", value: filtrosAplicados.nombre });
    }
    if (filtrosAplicados.estado !== null) {
        newFilters.push({ label: "Estado", value: filtrosAplicados.estado ? "Activo" : "Inactivo" });
    }

    fetchName(filtrosAplicados)
        .then(function (response: AreasFiltradasResponse) {
            const funEstAPI = response.data.map((f) => {
                const fGrilla: NameGridData = {
                    id: f.id,
                    codigo: f.id,
                    nombre: f.nombre,
                    estado: f.estado,
                };
                return fGrilla;
            });
            setPagination(response.paginationData);
            setFunEst(funEstAPI);
            setLoading(false);
        })
        .catch(function (error: any) {
            console.log(error);
            setLoading(false);
        });
};

const getSerchParams = (): AreasFiltradasRequest => {
  return {
    id: Number(searchParams.get("id")) || undefined,
    nombre: searchParams.get("nombre") || undefined,
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
  filtersObject.codigo
    ? array.push(["Codigo", filtersObject.codigo, "codigo"])
    : null
  filtersObject.estado
    ? array.push([
        "Estado",
        filtersObject.estado == "1" ? "Activo" : "Inactivo",
        "estado",
      ])
    : null;
  setFilters(array);
};
const handleDeleteFilter = (key: keyof AreasFiltradasRequest) => {
  removeQueries([key]);
};

  useEffect(() => {
    buscarAreas()
    getFilters();
  }, [searchParams.toString()])

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
          alignItems: "center",
          pt: 20,
          marginBottom: theme.spacing(2),
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Typography variant="h1">Areas</Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <FilterChips filters={filters} onDelete={(key) =>
              handleDeleteFilter(key as keyof AreasFiltradasRequest)
            } />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="10px"
          >
            <PopperFiltros />
            <CreateButton url={"/microMaestros/areas/crear"}/>
          </Box>
        </Box>
      </Box>

      {areas && areas.length > 0 ? (
        <GridAreas
          clasificaciones={areas}
          pagination={pagination}
          handleModalOpenEstado={handleModalOpenEstado}
          handleApplySort={handleApplySort}
          exportButton={
            <ExportButton
              getSerchParams={getSerchParams}
              exportFunction={exportAreas}
              documentName="areas.xlsx"
              setAlertMessage={setAlertMessage}
              setAlertType={setAlertType}
            />
          }
        />
      ) : filters.length > 0 ? (
        <FiltradoSinDatos />
      ) : (
        <NoExistenRegistros />
      )}

      <ModalAreas
        open={modalOpen}
        handleClose={handleModalCloseEstado}
        id={rowId}
        toggleActivation={toggleActivation}
      />
    </Box>
  );
}

export default HomeAreas
