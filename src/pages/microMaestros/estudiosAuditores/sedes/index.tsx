import { Box, Typography, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";
import CreateButton from "@/components/shared/CreateButton";
import FilterChips from "../../../../components/shared/FilterChips";
import GridSedes from "./components/GridSedes";
import BreadcrumbCustom from "@/components/shared/BreadcrumbCustom";
import { useSearchParams } from "next/navigation";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { useRouter } from "next/router";
import {PaginacionAPI } from "@/types/microMaestros/GenericTypes";
import Spinner from "@/components/shared/Spinner";
import ExportButton from "@/components/shared/ExportButton";
import PopperFiltrosSedes from "./components/PopperFiltrosSedes";
import ModalSedes from "./components/ModalSedes";
import { desactivarSede, activarSede, fetchSedes, exportSedes } from "@/services/microMaestros/SedesServices";
import { SedesGridData, SedeFiltradoRequest, SedeFiltradoResponse } from "@/types/microMaestros/SedesTypes";

const HomeSedes = () => {
    const { modifyQueries, removeQueries } = useQueryString();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [sedes, setSedes] = useState<SedesGridData[]>([]);
    const [filters, setFilters] = useState<[string, string, string][]>([]);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
    const theme = useTheme();
    const [pagination, setPagination] = useState<PaginacionAPI>();
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [rowId, setRowId] = useState<number>(0)
    const [nombreEstudioAuditor, setNombreEstudioAuditor] = useState<string | null>(null);

    const breadcrumbs = [
        { name: "Estudios auditores", path: "/microMaestros/estudiosAuditores" },
        { name: nombreEstudioAuditor ? decodeURIComponent(nombreEstudioAuditor.toString()) : "" },
    ];
    
    useEffect(() => {
        if (router.isReady && router.query.nombreEstudioAuditor) {
            setNombreEstudioAuditor(router.query.nombreEstudioAuditor as string);
        }
    }, [router.isReady, router.query]);


    useEffect(() => {
        console.log("searchParams:", searchParams.toString());
    }, [searchParams.toString()]);

    const handleApplySort = (appliedFilters: SedeFiltradoRequest) => {
        const queries: IQuery[] = [];
        if (appliedFilters.sortBy) {
            queries.push({ name: "sortBy", value: appliedFilters.sortBy.toString() });
        }
        if (appliedFilters.orderAsc) {
            queries.push({ name: "orderAsc", value: (appliedFilters.orderAsc.toString() == "asc").toString() });
        }
        modifyQueries(queries);
    };

    const setQueryParamsPaginationResponse = (
        totalCount: number,
        pageNumber: number,
        pageSize: number,
        totalPages: number
    ) => {
        const queries: IQuery[] = [
            { name: "pageNumber", value: pageNumber.toString() },
            { name: "pageSize", value: pageSize.toString() },
            { name: "totalPages", value: totalPages.toString() },
            { name: "totalCount", value: totalCount.toString() },
        ];
        modifyQueries(queries);
    };

    const handleDeleteFilter = (key: keyof SedeFiltradoRequest) => {
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
                desactivarSede({ id: id })
                    .then(() => {
                        setAlertMessage("¡Todo salió bien! Se guardo con éxito.")
                        setAlertType(typeAlert.success)
                        buscarSedes()
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
                activarSede({ id: id })
                    .then(() => {
                        setAlertMessage("¡Todo salió bien! Se guardo con éxito.")
                        setAlertType(typeAlert.success)
                        buscarSedes()
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

    const buscarSedes = async () => {
        const filtrosAplicados: SedeFiltradoRequest = {
            id: Number(searchParams.get("id")) || undefined,
            nombreSede: searchParams.get("nombreSede") || undefined,
            nombreEstudioAuditor: searchParams.get("nombreEstudioAuditor") || undefined,
            provincia: searchParams.get("provincia") || undefined,
            localidad: searchParams.get("localidad") || undefined,
            estado: searchParams.get("estado") ? Boolean(searchParams.get("estado") === "1") : undefined,
            pageNumber: Number(searchParams.get("pageNumber")) || 1,
            pageSize: Number(searchParams.get("pageSize")) || 9,
            sortBy: searchParams.get("sortBy") || undefined,
            orderAsc: searchParams.get("orderAsc") ? Boolean(searchParams.get("orderAsc") === "true") : null,
        };
        try {
            const response: SedeFiltradoResponse = await fetchSedes(filtrosAplicados);
            const sedesAPI = response.data?.map((c) => ({
                id: c.id,
                estudioID: c.estudioID,
                codigoSede: c.id,
                nombreSede: c.nombre || "",
                telefono: c.telefonoPrincipal,
                provincia: c.provinciaId,
                localidad: c.localidadId,
                calle: c.calle,
                numero: c.nroCalle,
                pisodepto: c.piso,
                estado: c.estado,
            }));
            setSedes(sedesAPI);
            setPagination(response.paginationData);

            const pag = response.paginationData;
            setQueryParamsPaginationResponse(pag.totalCount, pag.pageNumber, pag.pageSize, pag.totalPages);
        } catch (error) {
            console.error("Error al buscar sedes: ", error);
        } finally {
            setLoading(false);
        }
    };

    const getSearchParams = (): SedeFiltradoRequest => {
        return {
            sortBy: searchParams.get("sortBy") || undefined,
            orderAsc: searchParams.get("orderAsc")
                ? Boolean(searchParams.get("orderAsc") === "true")
                : null,
            id: Number(searchParams.get("id")) || undefined,
            // nombre: searchParams.get("nombre") || undefined,
            // cuit: searchParams.get("cuit") || undefined,
            estado: searchParams.get("estado")
                ? Boolean(searchParams.get("estado") === "1")
                : undefined,
            // nombreSede: searchParams.get("cuit") || undefined,
            // nombreReferente: searchParams.get("cuit") || undefined,
            pageNumber: Number(searchParams.get("pageNumber")) || 1,
            pageSize: Number(searchParams.get("pageSize")) || 9,
        };
    };

    useEffect(() => {
        if (router.isReady) {
            buscarSedes();
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
                <Typography variant="h1">Sedes</Typography>

                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                >
                    <FilterChips
                        onDelete={(key) =>
                            handleDeleteFilter(key as keyof SedeFiltradoRequest)
                        }
                        filters={filters}
                    />
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        gap="10px"
                    >
                        <PopperFiltrosSedes />
                        <CreateButton url={"/microMaestros/estudiosAuditores/sedes/crear"} />
                    </Box>

                </Box>
            </Box>
            <BreadcrumbCustom breadcrumbs={breadcrumbs} />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                }}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    gap="10px"
                >
                    <ExportButton
                        getSerchParams={getSearchParams}
                        exportFunction={exportSedes}
                        documentName={"Sedes.xlsx"}
                        setAlertMessage={setAlertMessage}
                        setAlertType={setAlertType}
                    />
                </Box>
            </Box>

            {sedes && sedes.length > 0 ? (
                <GridSedes
                    sedes={sedes}
                    handleModalOpenEstado={handleModalOpenEstado}
                    handleApplySort={handleApplySort}
                    pagination={pagination}
                    nombreEstudioAuditor={nombreEstudioAuditor?.toString() ? nombreEstudioAuditor.toString() : ""}
                />
            ) : filters.length > 0 ? (
                <FiltradoSinDatos />
            ) : (
                <NoExistenRegistros />
            )}

            <ModalSedes
                open={modalOpen}
                handleClose={handleModalCloseEstado}
                id={rowId}
                toggleActivation={toggleActivation}
            />
        </Box>
    );
};

export default HomeSedes;
