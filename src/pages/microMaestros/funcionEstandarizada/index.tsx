import { Box, Typography, useTheme } from "@mui/material"
import React, { useCallback, useEffect, useState } from "react"
import {
  FuncionesEstandarizadasFiltradasRequest,
  FuncionesEstandarizadasFiltradasResponse,
  NameGridData,
} from "@/types/microMaestros/funcionEstandarizadaTypes"
import {
  activarFuncionEstandarizada,
  desactivarFuncionEstandarizada,
  exportFuncionstandarizadaFisico,
  fetchName,
} from "@/services/microMaestros/funcionEstandarizadaService"
import Spinner from "@/components/shared/Spinner";
import GridFuncionEstandarizada from "./components/GridFuncionEstandarizada"
import ModalFuncionesEstandarizadas from "./components/ModalFuncionesEstandarizadas"
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert"
import NoExistenRegistros from "@/components/shared/NoExistenRegistros"
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos"
import FilterChips from "@/components/shared/FilterChips";
import PopperFiltros from "./components/PopperFiltros"
import ExportButton from "@/components/shared/ExportButton";
import CreateButton from "@/components/shared/CreateButton"
import { useSearchParams } from "next/navigation"
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";

const HomeFuncionEstandarizada = () => {
  const { modifyQueries, remove, removeQueries } = useQueryString();

  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()
  
  // tabla
  const [funcEst, setFunEst] = useState<NameGridData[]>()
  const [filters, setFilters] = useState<[string, string, string][]>([])
  const [pagination, setPagination] = useState<PaginacionAPI>()

  // modal estado
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [rowId, setRowId] = useState<number>(0)

  // respuesta
  const [alertMessage, setAlertMessage] = useState<string>("")
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined)

  const theme = useTheme()

  const handleApplySort = (appliedFilters: FuncionesEstandarizadasFiltradasRequest) => {
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

  const handleModalOpenEstado = (id: any) => {
    setRowId(id)
    setModalOpen(true)
  }
  const handleModalCloseEstado = () => {
    setModalOpen(false)
    setRowId(0)
  }

  const toggleActivation = useCallback(
    (isActivated: boolean | undefined, idClasificacion: number) => {
      if (isActivated) {
        desactivarFuncionEstandarizada({ id: idClasificacion })
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardo con éxito.")
            setAlertType(typeAlert.success)
            buscarFuncionEstandarizada()
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
        activarFuncionEstandarizada({ id: idClasificacion })
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardo con éxito.")
            setAlertType(typeAlert.success)
            buscarFuncionEstandarizada()
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
    [rowId, modalOpen]
  )

  const handleDeleteFilter = (key: keyof FuncionesEstandarizadasFiltradasRequest) => {
    removeQueries([key]);
  };


  const getSerchParams = (): FuncionesEstandarizadasFiltradasRequest => {
    return {
      id: Number(searchParams.get("id")) || undefined,
      nombre: searchParams.get("nombre") || undefined,
      estado: searchParams.get("estado") ? Boolean(searchParams.get("estado") === "1") : undefined,
      pageNumber: Number(searchParams.get("pageNumber")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 9,
      // sortBy: searchParams.get("sortBy") || undefined,
      // orderAsc: searchParams.get("orderAsc")
      //   ? Boolean(searchParams.get("orderAsc") === "true")
      //   : null,
    };
  };
  const buscarFuncionEstandarizada = () => {
    const filtrosAplicados: FuncionesEstandarizadasFiltradasRequest = getSerchParams()

    fetchName(filtrosAplicados)
      .then(function (response: FuncionesEstandarizadasFiltradasResponse) {
        const funEstAPI = response.data.map((f) => {
          const fGrilla: NameGridData = {
            id: f.id,
            codigo: f.id,
            nombre: f.nombre,
            estado: f.estado,
          }
          return fGrilla
        })
        setPagination(response.paginationData)
        setFunEst(funEstAPI)
        setLoading(false)
      })
      .catch(function (error: any) {
        console.log(error)
        setLoading(false)
      })
  }

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
    filtersObject.id
      ? array.push(["Codigo", filtersObject.id, "id"])
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
    buscarFuncionEstandarizada()
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
        <Typography variant="h1">Funciones estandarizadas</Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <FilterChips filters={filters}
            onDelete={(key) =>
              handleDeleteFilter(key as keyof FuncionesEstandarizadasFiltradasRequest)
            } />
          <Box display="flex" alignItems="center" justifyContent="space-between" gap="10px">
            <PopperFiltros />
            <CreateButton url={"/microMaestros/funcionEstandarizada/crear"} />
          </Box>
        </Box>
      </Box>

      {funcEst && funcEst.length > 0 ? (
        <GridFuncionEstandarizada
          clasificaciones={funcEst}
          pagination={pagination}
          handleModalOpenEstado={handleModalOpenEstado}
          handleApplySort={handleApplySort}
          exportButton={
            <ExportButton
              getSerchParams={getSerchParams}
              exportFunction={exportFuncionstandarizadaFisico}
              documentName="FuncionesEstandarizadas.xlsx"
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

      <ModalFuncionesEstandarizadas
        open={modalOpen}
        handleClose={handleModalCloseEstado}
        id={rowId}
        toggleActivation={toggleActivation}
      />
    </Box>
  )
}

export default HomeFuncionEstandarizada
