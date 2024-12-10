import { Badge, Box, IconButton, Typography, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";
import ExportButton from "@/components/microContratos/contratistas/ExportButton";
import CreateButton from "@/components/shared/CreateButton";
import {
  ContratistasFiltradosRequest,
  ContratistasFiltradosResponse,
  ContratistasGridData,
} from "@/types/microContratos/contratistasTypes";
import Spinner from "@/components/shared/Spinner";
import { fetchBloqueoContratistas, fetchContratistas, fetchEstadoBloqueoById, fetchEstadoBloqueoNombreById, desactivarContratista, activarContratista, fetchOrigenById } from "@/services/microContratos/contratistasService";
import PopperFiltrosContratistas from "@/components/microContratos/contratistas/PopperFiltrosContratistas";
import GridContratistas from "@/components/microContratos/contratistas/GridContratistas";
import { useSearchParams } from "next/navigation";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import FilterChips from "@/components/shared/FilterChips";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useRouter } from "next/router";
import moment from "moment";
import ModalEstado from "@/components/microContratos/contratistas/ModalEstado";
import { fetchPaisPorId } from "@/services/microMaestros/ubicacionGeograficaService";
import { PaginacionAPI } from "@/types/microContratos/GenericTypes";
import { useRouterPush } from "@/hooks/useRouterPush";

const HomeContratista = () => {
  const { modifyQueries, removeQueries } = useQueryString();
  const router = useRouter();
  const routerPush = useRouterPush();

  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [contratistas, setContratistas] = useState<ContratistasGridData[]>([]);
  const [filters, setFilters] = useState<[string, string, string][]>([]);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [pagination, setPagination] = useState<PaginacionAPI>();
  const theme = useTheme();
  // ss
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [openExportModal, setOpenExportModal] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);
//ss
  const handleApplySort = (appliedFilters: ContratistasFiltradosRequest) => {
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

  const setQueryParamsInicial = (
    totalCount: number,
    pageNumber: number,
    pageSize: number,
    totalPages: number
  ) => {
    const queries: IQuery[] = [];
    queries.push({ name: "pageNumber", value: pageNumber.toString() });
    queries.push({ name: "pageSize", value: pageSize.toString() });
    queries.push({ name: "totalPages", value: totalPages.toString() });
    queries.push({ name: "totalCount", value: totalCount.toString() });
    modifyQueries(queries);
  };

  const handleDeleteFilter = (key: keyof ContratistasFiltradosRequest) => {
    removeQueries([key]);
  };

  const getSerchParams = (): ContratistasFiltradosRequest => {
    return {
      sortBy: searchParams.get("sortBy") || undefined,
      orderAsc: searchParams.get("orderAsc")
        ? Boolean(searchParams.get("orderAsc") === "asc")
        : undefined,
      numeroIdentificacion:
        Number(searchParams.get("numeroIdentificacion")) || undefined,
      pageNumber: Number(searchParams.get("pageNumber")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 9,
      razonSocial: searchParams.get("razonSocial") || undefined,
      fechaCreacion: searchParams.get('fechaCreacion') ? new Date(searchParams.get('fechaCreacion') || '') : undefined,
      emailContactoComercial:
        searchParams.get("emailContactoComercial") || undefined,
      paisId: Number(searchParams.get("paisId")) || undefined,
      origenId: Number(searchParams.get("origenId")) || undefined,
      estado: searchParams.get("estado")
        ? Boolean(searchParams.get("estado") === "1")
        : undefined,
      estadoBloqueoId: Number(searchParams.get("estadoBloqueoId")) || undefined,
    };
  };

  const getFilters = async () => {
    const array: [string, string, string][] = [];
    const appliedFilters = new URLSearchParams(searchParams.toString());
    const filtersObject: { [key: string]: string } = {};
    appliedFilters.forEach((value, key) => {
      filtersObject[key] = value;
    });

    let bloqueo = ''
    if (filtersObject.estadoBloqueoId) {
      bloqueo = await fetchEstadoBloqueoNombreById(
        Number(filtersObject.estadoBloqueoId)
      );
    }

    let origen = ''
    if(filtersObject.origenId){
      origen = await fetchOrigenById(
        Number(filtersObject.origenId)
      );

    }

    let pais = ''
    if(filtersObject.pais){
      const p = await fetchPaisPorId({id : Number(filtersObject.pais)})
      pais= p.isoName;
    }


    // todo que se muestre la palabra y no el id origenId - estadoBloqueoId
    filtersObject.razonSocial
      ? array.push(["Razon Social", filtersObject.razonSocial, "razonSocial"])
      : null;
    filtersObject.numeroIdentificacion
      ? array.push([
          "N° Id",
          filtersObject.numeroIdentificacion,
          "numeroIdentificacion",
        ])
      : null;
    filtersObject.fechaCreacion
      ? array.push([
          "Fecha Creación",
          moment(filtersObject.fechaCreacion).format("DD-MM-YYYY"),
          "fechaCreacion",
        ])
      : null;
    filtersObject.emailContactoComercial
      ? array.push([
          "Email",
          filtersObject.emailContactoComercial,
          "emailContactoComercial",
        ])
      : null;
    filtersObject.pais
      ? array.push(["Pais", pais, "pais"])
      : null;
    filtersObject.origenId
      ? array.push(["Origen", origen, "origenId"])
      : null;
      filtersObject.estado
      ? array.push([
          "Estado",
          filtersObject.estado == "1" ? "Activo" : "Inactivo",
          "estado",
        ])
      : null;
    filtersObject.estadoBloqueoId
      ? array.push([
          "Bloqueo",
          bloqueo,
          "estadoBloqueoId",
        ])
      : null;
    setFilters(array);
  };

  const buscarContratistas = async () => {
    const filtros: ContratistasFiltradosRequest = getSerchParams();

    fetchContratistas(filtros)
      .then((response: ContratistasFiltradosResponse) => {
        const contratistasAPI = response.data.map((c) => {
          const uniqueId = parseInt(
            `${c.numeroIdentificacion}${c.sedeNombre}${c.estudioAuditorId}${new Date(c.fechaCreacion).getTime()}`
          );

          return {
            id: c.id,
            numeroIdentificacion: Number(c.numeroIdentificacion) || 0,
            razonSocial: c.razonSocial || "--",
            paisNombre: c.paisNombre || "--",
            emailContactoComercial: c.emailContactoComercial || "--",
            origen: c.origen || "--",
            estudioNombre: c.estudioNombre || "--",
            sedeNombre: c.sedeNombre || "--",
            estado: c.estado,
            fechaCreacion: c.fechaCreacion,
          };
        });

        setPagination(response.paginationData);
        const pag = response.paginationData;
        setQueryParamsInicial(
          pag.totalCount,
          pag.pageNumber,
          pag.pageSize,
          pag.totalCount
        );
        setContratistas(contratistasAPI);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error); // Mostrar error
        setLoading(false);
      });
  };

//ss
const handleModalOpenEstado = (id: number) => {
  setRowId(id);
  setModalOpen(true);
};
const handleModalCloseEstado = () => {
  setModalOpen(false);
  setRowId(0);
};

const toggleActivation = useCallback(
  (isActivated: boolean | undefined, id: number, motivo?: string) => {
    if (isActivated) {
      motivo && desactivarContratista({ id: id , motivo: motivo })
        .then(() => {
          setAlertMessage("¡Todo salió bien! Se guardó con éxito.")
          setAlertType(typeAlert.success)
          buscarContratistas()
        })
        .catch((error : any) => {
          if(error.response.data.errors){
            setAlertMessage(error.response.data.errors[0].description);
          }
            else{
          setAlertMessage("No se pudo desactivar el estado. Inténtalo de nuevo más tarde.")
            }
          setAlertType(typeAlert.error)
        })
    } else {
      activarContratista({ id: id })
        .then(() => {
          setAlertMessage("¡Todo salió bien! Se guardó con éxito.")
          setAlertType(typeAlert.success)
          buscarContratistas()
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
  [buscarContratistas]
)
//ss

  useEffect(() => {
    if (router.isReady) {
      getFilters();
      buscarContratistas();
    }
  }, [searchParams.toString(), router.isReady]);

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
        <Typography variant="h1">Contratista</Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <FilterChips
            onDelete={(key) =>
              handleDeleteFilter(key as keyof ContratistasFiltradosRequest)
            }
            filters={filters}
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="10px"
          >
            <PopperFiltrosContratistas />
            <IconButton
             sx={{ width: 50, height: 50 }}
              onClick={() => {
                routerPush("/microContratos/contratistas/editarMasivo");
              }}
            >
              <Badge sx={{ width: 50, height: 50 }}>
                <EditOutlinedIcon
                  sx={{ color: "#000", width: 50, height: 50 }}
                />
              </Badge>
            </IconButton>
            <CreateButton url={"/microContratos/contratistas/crear"} />
          </Box>
        </Box>
      </Box>

      {contratistas && contratistas.length > 0 ? (
        <GridContratistas
          contratistas={contratistas}
          handleModalOpenEstado={handleModalOpenEstado}
          handleApplySort={handleApplySort}
          pagination={pagination}
          exportButton={<ExportButton getSerchParams={getSerchParams} />}
        />
      ) : filters.length > 0 ? (
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
  );
};

export default HomeContratista;
