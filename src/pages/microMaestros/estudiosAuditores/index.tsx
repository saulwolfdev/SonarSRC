import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CreateButton from "@/components/shared/CreateButton";
import FilterChips from "../../../components/shared/FilterChips";
import GridEstudiosAuditores from "./components/GridEstudiosAuditores";
import { useSearchParams } from "next/navigation";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { useRouter } from "next/router";
import { EstudioAuditorFiltradoRequest, EstudioAuditorFiltradoResponse, EstudiosAuditoresGridData } from "@/types/microMaestros/estudiosAuditoresTypes";
import Spinner from "@/components/shared/Spinner";
import { activarEstudioAuditor, desactivarEstudioAuditor, fetchEstudiosAuditores } from "@/services/microMaestros/EstudioAuditoresService";
import PopperFiltrosEstudiosAuditores from "./components/PopperFiltrosEstudiosAuditores";
import ModalEstudioAuditor from "./components/ModalEstudioAuditor";
import ModalExportEstudiosAuditores from "./components/ModalExportEstudiosAuditores";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";

const HomeEstudiosAuditores = () => {
    const { modifyQueries, remove, removeQueries } = useQueryString();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [estudiosAuditores, setEstudiosAuditores] = useState<EstudiosAuditoresGridData[]>([]);
    const [filters, setFilters] = useState<[string, string, string][]>([]);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
    const theme = useTheme();
    const [pagination, setPagination] = useState<PaginacionAPI>();
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [rowId, setRowId] = useState<number>(0)
    const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
    const [query, setQuery] = useState<EstudioAuditorFiltradoRequest>({});



    const handleApplySort = (appliedFilters: EstudioAuditorFiltradoRequest) => {
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

    const setQueryParamsPaginationResponse = (
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

    const handleDeleteFilter = (key: keyof EstudioAuditorFiltradoRequest) => {
        removeQueries([key]);
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
        (isActivated: boolean | undefined, id: number) => {
            if (isActivated) {
                desactivarEstudioAuditor({ id: id })
                    .then(() => {
                        setAlertMessage("¡Todo salió bien! Se guardo con éxito.")
                        setAlertType(typeAlert.success)
                        buscarEstudiosAuditores()
                    })
                    .catch((error) => {
                        if(error.response.data.errors){
                          setAlertMessage(error.response.data.errors[0].description);
                        }
                          else{
                              }    setAlertMessage("No se pudo desactivar el estado. Inténtalo de nuevo más tarde.")
                     setAlertType(typeAlert.error)
                    })
            } else {
                activarEstudioAuditor({ id: id })
                    .then(() => {
                        setAlertMessage("¡Todo salió bien! Se guardo con éxito.")
                        setAlertType(typeAlert.success)
                        buscarEstudiosAuditores()
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


    const buscarEstudiosAuditores = async () => {

        const filtrosAplicados: EstudioAuditorFiltradoRequest = {
            id: Number(searchParams.get("id")) || undefined,
            nombre: searchParams.get("nombre") || undefined,
            estado: searchParams.get("estado") ? Boolean(searchParams.get("estado") === "1") : undefined,
            cuit: searchParams.get("cuit") || undefined,
            nombreSede: searchParams.get("nombre") || undefined,
            nombreReferente: searchParams.get("nombre") || undefined,
            pageNumber: Number(searchParams.get("pageNumber")) || 1,
            pageSize: Number(searchParams.get("pageSize")) || 9,
            sortBy: searchParams.get('sortBy') || undefined,
            orderAsc: searchParams.get('orderAsc') ? Boolean(searchParams.get("orderAsc") === "true") : null,
        };
        try {
            const response: EstudioAuditorFiltradoResponse = await fetchEstudiosAuditores(filtrosAplicados);

            console.log(response)
            const estudiosAuditoresAPI = response.data?.map((c) => {
                return {
                    id: c.id,
                    nombre: c.nombre,
                    cuit: c.cuit,
                    estado: c.estado,
                };
            });

            setEstudiosAuditores(estudiosAuditoresAPI);
            setPagination(response.paginationData);

            const pag = response.paginationData;
            setQueryParamsPaginationResponse(pag.totalCount, pag.pageNumber, pag.pageSize, pag.totalPages);

        } catch (error) {
            console.error("Error al buscar estudios auditores: ", error);
        } finally {
            setLoading(false);
        }
    };

    const getSearchParams = (): EstudioAuditorFiltradoRequest => {
        return {
            sortBy: searchParams.get("sortBy") || undefined,
            orderAsc: searchParams.get("orderAsc")
                ? Boolean(searchParams.get("orderAsc") === "true")
                : null,
            id: Number(searchParams.get("id")) || undefined,
            nombre: searchParams.get("nombre") || undefined,
            cuit: searchParams.get("cuit") || undefined,
            estado: searchParams.get("estado")
                ? Boolean(searchParams.get("estado") === "1")
                : undefined,
            nombreSede: searchParams.get("cuit") || undefined,
            nombreReferente: searchParams.get("cuit") || undefined,
            pageNumber: Number(searchParams.get("pageNumber")) || 1,
            pageSize: Number(searchParams.get("pageSize")) || 9,
        };
    };

    const getFilters = async () => {
        const array: [string, string, string][] = [];
        const appliedFilters = new URLSearchParams(searchParams.toString());
        const filtersObject: { [key: string]: string } = {};
        appliedFilters.forEach((value, key) => {
            filtersObject[key] = value;
        });

        filtersObject.id
            ? array.push(["id", filtersObject.id, "id"])
            : null;
        filtersObject.nombre
            ? array.push(["Nombre", filtersObject.nombre, "nombre"])
            : null;
        filtersObject.cuit
            ? array.push(["cuit", filtersObject.cuit, "cuit"])
            : null;
        filtersObject.estado
            ? array.push([
                "Estado",
                filtersObject.estado == "1" ? "Activo" : "Inactivo",
                "estado",
            ])
            : null;
        filtersObject.nombreSede
            ? array.push(["nombreSede", filtersObject.nombreSede, "nombreSede"])
            : null;
        filtersObject.nombreReferente
            ? array.push(["nombreReferente", filtersObject.nombreReferente, "nombreReferente"])
            : null;
        setFilters(array);
    };

    const handleOpenExportModal = () => {
        const currentQuery = getSearchParams(); // Obtiene el query actual
        setQuery(currentQuery);
        setExportModalOpen(true);
    };

    const handleCloseExportModal = () => {
        setExportModalOpen(false);
    };

    useEffect(() => {
        if (router.isReady) {
            getFilters();
            buscarEstudiosAuditores();
        }
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
                <Typography variant="h1">Estudios Auditores</Typography>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                >
                    <FilterChips
                        onDelete={(key) =>
                            handleDeleteFilter(key as keyof EstudioAuditorFiltradoRequest)
                        }
                        filters={filters}
                    />
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        gap="10px"
                    >
                        <PopperFiltrosEstudiosAuditores />
                        <CreateButton url={"/microMaestros/estudiosAuditores/crear"} />
                    </Box>
                </Box>
            </Box>

            {estudiosAuditores && estudiosAuditores.length > 0 ? (
                <GridEstudiosAuditores
                    estudiosAuditores={estudiosAuditores}
                    handleModalOpenEstado={handleModalOpenEstado}
                    handleApplySort={handleApplySort}
                    pagination={pagination}
                    exportButton={
                        <IconButton onClick={handleOpenExportModal}>
                        <FileDownloadIcon sx={{ color: "#000" }} />
                        </IconButton>
                    }
                    
                />
            ) : filters.length > 0 ? (
                <FiltradoSinDatos />
            ) : (
                <NoExistenRegistros />
            )}

            <ModalEstudioAuditor
                open={modalOpen}
                handleClose={handleModalCloseEstado}
                id={rowId}
                toggleActivation={toggleActivation}
            />
            <ModalExportEstudiosAuditores
                open={exportModalOpen}
                handleClose={handleCloseExportModal}
                setAlertMessage={setAlertMessage}
                setAlertType={setAlertType}
                query={query}
            />

        </Box>
    );
};

export default HomeEstudiosAuditores;
