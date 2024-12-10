import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CreateButton from "@/components/shared/CreateButton";
import FilterChips from "../../../components/shared/FilterChips";
import GridDiagramaTrabajo from "./components/GridDiagramaTrabajo";
import { useSearchParams } from "next/navigation";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { useRouter } from "next/router";
import { DiagramaTrabajoFiltradoRequest, DiagramaTrabajoFiltradoResponse, DiagramaTrabajoGridData } from "./types/diagramaTrabajoTypes";
import Spinner from "@/components/shared/Spinner";
import { activarDiagramaTrabajo, desactivarDiagramaTrabajo, exportDiagramaTrabajo, fetchDiagramaTrabajo } from "./services/DiagramaTrabajoService";
import PopperFiltrosDiagramaTrabajo from "./components/PopperFiltrosDiagramaTrabajo";
import ModalDiagramaTrabajo from "./components/ModalDiagramaTrabajo";
import ExportButton from "@/components/shared/ExportButton";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";

const HomeDiagramaTrabajo = () => {
    const { modifyQueries, remove, removeQueries } = useQueryString();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [diagramaTrabajo, setDiagramaTrabajo] = useState<DiagramaTrabajoGridData[]>([]);
    const [filters, setFilters] = useState<[string, string, string][]>([]);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
    const theme = useTheme();
    const [pagination, setPagination] = useState<PaginacionAPI>();
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [rowId, setRowId] = useState<number>(0)
    const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
    const [query, setQuery] = useState<DiagramaTrabajoFiltradoRequest>({});



    const handleApplySort = (appliedFilters: DiagramaTrabajoFiltradoRequest) => {
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

    const handleDeleteFilter = (key: keyof DiagramaTrabajoFiltradoRequest) => {
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
                desactivarDiagramaTrabajo({ id: id })
                    .then(() => {
                        setAlertMessage("¡Todo salió bien! Se guardo con éxito.")
                        setAlertType(typeAlert.success)
                        buscarDiagramaTrabajo()
                    })
                    .catch((error: any) => {
                        if(error.response.data.errors){
                          setAlertMessage(error.response.data.errors[0].description);
                        }
                          else{
                        setAlertMessage("No se pudo desactivar el estado. Inténtalo de nuevo más tarde.")
                          }setAlertType(typeAlert.error)
                    })
            } else {
                activarDiagramaTrabajo({ id: id })
                    .then(() => {
                        setAlertMessage("¡Todo salió bien! Se guardo con éxito.")
                        setAlertType(typeAlert.success)
                        buscarDiagramaTrabajo()
                    })
                    .catch((error: any) => {
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


    const buscarDiagramaTrabajo = async () => {

        const filtrosAplicados: DiagramaTrabajoFiltradoRequest = {
            codigo: Number(searchParams.get("codigo")) || undefined,
            diasTrabajo: searchParams.get("nombre") || undefined,
            diasDescanso: searchParams.get("cuit") || undefined,
            diaTrabajoMes: searchParams.get("nombre") || undefined,
            estado: searchParams.get("estado") ? Boolean(searchParams.get("estado") === "1") : undefined,
            pageNumber: Number(searchParams.get("pageNumber")) || 1,
            pageSize: Number(searchParams.get("pageSize")) || 9,
            sortBy: searchParams.get('sortBy') || undefined,
            orderAsc: searchParams.get('orderAsc') ? Boolean(searchParams.get("orderAsc") === "true") : null,
        };
        try {
            const response: DiagramaTrabajoFiltradoResponse = await fetchDiagramaTrabajo(filtrosAplicados);

            console.log(response)
            const diagramaTrabajoAPI = response.data?.map((c) => {
                return {
                    id: c.id,
                    nombre: c.nombre,
                    diasTrabajo: c.diasTrabajo,
                    diasDescanso: c.diasDescanso,
                    diaTrabajoMes: c.diaTrabajoMes,
                    estado: c.estado,
                };
            });

            setDiagramaTrabajo(diagramaTrabajoAPI);
            setPagination(response.paginationData);

            const pag = response.paginationData;
            setQueryParamsPaginationResponse(pag.totalCount, pag.pageNumber, pag.pageSize, pag.totalPages);

        } catch (error) {
            console.error("Error al buscar DiagramaTrabajo: ", error);
        } finally {
            setLoading(false);
        }
    };

    const getSearchParams = (): DiagramaTrabajoFiltradoRequest => {
        return {
            sortBy: searchParams.get("sortBy") || undefined,
            orderAsc: searchParams.get("orderAsc")
                ? Boolean(searchParams.get("orderAsc") === "true")
                : null,
            codigo: Number(searchParams.get("codigo")) || undefined,
            nombre: searchParams.get("nombre") || undefined,
            diasTrabajo: searchParams.get("diasTrabajo") || undefined,
            diasDescanso: searchParams.get("diasDescanso") || undefined,
            diaTrabajoMes: searchParams.get("diaTrabajoMes") || undefined,
            estado: searchParams.get("estado")
                ? Boolean(searchParams.get("estado") === "1")
                : undefined,
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

        filtersObject.codigo
            ? array.push(["Codigo", filtersObject.codigo, "codigo"])
            : null;
        filtersObject.nombre
            ? array.push(["Nombre", filtersObject.nombre, "nombre"])
            : null;
        filtersObject.diasTrabajo
            ? array.push(["diasTrabajo", filtersObject.diasTrabajo, "diasTrabajo"])
            : null;
        filtersObject.diasDescanso
            ? array.push(["diasDescanso", filtersObject.diasDescanso, "diasDescanso"])
            : null;
        filtersObject.diaTrabajoMes
            ? array.push(["diaTrabajoMes", filtersObject.diaTrabajoMes, "diaTrabajoMes"])
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

    const handleOpenExportModal = () => {
        const currentQuery = getSearchParams(); // Obtiene el query actual
        setQuery(currentQuery);
        setExportModalOpen(true);
    };

    useEffect(() => {
        if (router.isReady) {
            getFilters();
            buscarDiagramaTrabajo();
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
                <Typography variant="h1">Diagramas de trabajo</Typography>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                >
                    <FilterChips
                        onDelete={(key) =>
                            handleDeleteFilter(key as keyof DiagramaTrabajoFiltradoRequest)
                        }
                        filters={filters}
                    />
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        gap="10px"
                    >
                        <PopperFiltrosDiagramaTrabajo />
                        <CreateButton url={"/microMaestros/diagramaTrabajo/crear"} />
                    </Box>
                </Box>
            </Box>
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
                   
                   {/* <ExportButton
                        getSerchParams={getSearchParams}
                        documentName={"DiagramaTrabajo.xlsx"}
                        exportFunction={exportDiagramaTrabajo}
                        setAlertMessage={setAlertMessage}
                        setAlertType={setAlertType}
                    /> */}

                </Box>
            </Box>

            {diagramaTrabajo && diagramaTrabajo.length > 0 ? (
                <GridDiagramaTrabajo
                    diagramaTrabajo={diagramaTrabajo}
                    handleModalOpenEstado={handleModalOpenEstado}
                    handleApplySort={handleApplySort}
                    pagination={pagination}
                />
            ) : filters.length > 0 ? (
                <FiltradoSinDatos />
            ) : (
                <NoExistenRegistros />
            )}

            <ModalDiagramaTrabajo
                open={modalOpen}
                handleClose={handleModalCloseEstado}
                id={rowId}
                toggleActivation={toggleActivation}
            />

        </Box>
    );
};

export default HomeDiagramaTrabajo;
