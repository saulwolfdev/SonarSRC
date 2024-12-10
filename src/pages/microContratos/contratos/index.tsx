import { Box, Typography, useTheme } from "@mui/material"
import React, { useCallback, useEffect, useState } from "react"
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert"
import NoExistenRegistros from "@/components/shared/NoExistenRegistros"
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos"
import ExportButton from "@/components/shared/ExportButton"
import CreateButton from "@/components/shared/CreateButton"
import FilterChips from "../../../components/shared/FilterChips"
import {
  ContratosFiltradoRequest,
  ContratosFiltradosResponse,
  ContratosGridData,
} from "../../../types/microContratos/contratosTypes"
import Spinner from "@/components/shared/Spinner"
import {
  exportContratos,
  fetchContratistaNameById,
  fetchContratos,
} from "@/services/microContratos/ContratosService"
import PopperFiltrosContratos from "./components/PopperFiltrosContratos"
import GridContratos from "./components/GridContratos"
import { useSearchParams } from "next/navigation"
import useQueryString, { IQuery } from "@/hooks/useQueryString"
import { useRouter } from "next/router"
import { PaginacionAPI } from "@/types/microContratos/GenericTypes"

const HomeContrato = () => {
  const { modifyQueries, remove, removeQueries } = useQueryString()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [contratos, setContratos] = useState<ContratosGridData[]>([])
  const [filters, setFilters] = useState<[string, string, string][]>([])
  const [rowId, setRowId] = useState<number>(0)
  const [alertMessage, setAlertMessage] = useState<string>("")
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined)
  const theme = useTheme()
  const [pagination, setPagination] = useState<PaginacionAPI>()

  const handleApplySort = (appliedFilters: ContratosFiltradoRequest) => {
    const queries: IQuery[] = []
    appliedFilters.sortBy
      ? queries.push({
          name: "sortBy",
          value: appliedFilters.sortBy.toString(),
        })
      : null
    appliedFilters.orderAsc
      ? queries.push({
          name: "orderAsc",
          value: (appliedFilters.orderAsc.toString() == "asc").toString(),
        })
      : null
    modifyQueries(queries)
  }

  const setQueryParamsPaginationResponse = (
    totalCount: number,
    pageNumber: number,
    pageSize: number,
    totalPages: number
  ) => {
    const queries: IQuery[] = []
    queries.push({ name: "pageNumber", value: pageNumber.toString() })
    queries.push({ name: "pageSize", value: pageSize.toString() })
    queries.push({ name: "totalPages", value: totalPages.toString() })
    queries.push({ name: "totalCount", value: totalCount.toString() })
    modifyQueries(queries)
  }

  const handleDeleteFilter = (key: keyof ContratosFiltradoRequest) => {
    removeQueries([key])
  }

  const getSerchParams = (): ContratosFiltradoRequest => {
    return {
      sortBy: searchParams.get("sortBy") || undefined,
      orderAsc: searchParams.get("orderAsc")
        ? Boolean(searchParams.get("orderAsc") === "true")
        : null,
      contratistaId: Number(searchParams.get("contratistaId")) || undefined,
      numero: Number(searchParams.get("numero")) || undefined,
      estado: searchParams.get("estado") ? Boolean(searchParams.get("estado") === "1") : undefined,
      pageNumber: Number(searchParams.get("pageNumber")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 9,
    }
  }
  const getFilters = async () => {
    const array: [string, string, string][] = []
    const appliedFilters = new URLSearchParams(searchParams.toString())
    const filtersObject: { [key: string]: string } = {}
    appliedFilters.forEach((value, key) => {
      filtersObject[key] = value
    })
    let razon = ""
    if (filtersObject.contratistaId) {
      razon = await fetchContratistaNameById(Number(filtersObject.contratistaId))
    }

    filtersObject.contratistaId ? array.push(["Contratista", razon, "contratistaId"]) : null
    filtersObject.numero ? array.push(["Numero", filtersObject.numero, "numero"]) : null
    filtersObject.estado
      ? array.push(["Estado", filtersObject.estado == "1" ? "Activo" : "Inactivo", "estado"])
      : null
    setFilters(array)
  }

  const buscarContratos = async () => {
    const filtros: ContratosFiltradoRequest = getSerchParams()
    fetchContratos(filtros)
      .then((response: ContratosFiltradosResponse) => {
        const contratosAPI = response.data.map((c) => {
          return {
            id: c.id,
            contratista: c.contratistaRazonSocial,
            nroContrato: c.numero,
            origen: c.origen,
            codigoOrigen: c.codigoOrigen ? c.codigoOrigen : "--",
            descripcionContrato: c.descripcion,
            inicio: c.inicio,
            finalizacion: c.finalizacion,
            estado: c.estado,
          }
        })
        setContratos(contratosAPI)
        setPagination(response.paginationData)
        const pag = response.paginationData
        setQueryParamsPaginationResponse(
          pag.totalCount,
          pag.pageNumber,
          pag.pageSize,
          pag.totalPages
        )
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching data: ", error)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (router.isReady) {
      getFilters()
      buscarContratos()
    }
  }, [searchParams.toString()])

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
        <Typography variant="h1">Contrato</Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <FilterChips
            onDelete={(key) => handleDeleteFilter(key as keyof ContratosFiltradoRequest)}
            filters={filters}
          />
          <Box display="flex" alignItems="center" justifyContent="space-between" gap="10px">
            <PopperFiltrosContratos />
            <CreateButton url={"/microContratos/contratos/crear"} />
          </Box>
        </Box>
      </Box>
      {contratos && contratos.length > 0 ? (
        <GridContratos
          contratos={contratos}
          handleModalOpenEstado={(id: number) => {}}
          handleApplySort={handleApplySort}
          pagination={pagination}
          exportButton={
            <ExportButton
              getSerchParams={getSerchParams}
              exportFunction={exportContratos}
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

      {/* TODO AGREGAR MODAL */}
    </Box>
  )
}

export default HomeContrato
