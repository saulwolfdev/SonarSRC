import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";
import CreateButton from "@/components/shared/CreateButton";
import FilterChips from "../../../components/shared/FilterChips";
import { useSearchParams } from "next/navigation";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { useRouter } from "next/router";
import Spinner from "@/components/shared/Spinner";
import GridCategoriasMonotributo from "./components/GridCategoriasMonotributo";
import ModalCategoriasMonotributo from "./components/ModalCategoriasMonotributo";
import PopperFiltrosCategoriasMonotributo from "./components/PopperFiltrosCategoriasMonotributo";
import { desactivarCategoriasMonotributo, activarCategoriasMonotributo, fetchCategoriasMonotributo, exportCategoriasMonotributo } from "./services/CategoriasMonotributoService";
import { CategoriasMonotributoGridData, CategoriasMonotributoFiltradoRequest, CategoriasMonotributoFiltradoResponse } from "./types/CategoriasMonotributoTypes";
import ExportButton from "@/components/shared/ExportButton";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";

const HomeCategoriasMonotributo = () => {
    const { modifyQueries, remove, removeQueries } = useQueryString();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [categoriasMonotributo, setCategoriasMonotributo] = useState<CategoriasMonotributoGridData[]>([]);
    const [filters, setFilters] = useState<[string, string, string][]>([]);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
    const theme = useTheme();
    const [pagination, setPagination] = useState<PaginacionAPI>();
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [rowId, setRowId] = useState<number>(0)
    const [query, setQuery] = useState<CategoriasMonotributoFiltradoRequest>({});



    const handleApplySort = (appliedFilters: CategoriasMonotributoFiltradoRequest) => {
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

    const handleDeleteFilter = (key: keyof CategoriasMonotributoFiltradoRequest) => {
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
        (isActivated: boolean | undefined, id: number, comentario?: string) => { // Recibe comentario
            if (isActivated) {
                desactivarCategoriasMonotributo({ id: id, motivo: comentario }) // Pasamos el comentario a la petición
                    .then(() => {
                        setAlertMessage("¡Todo salió bien! Se guardó con éxito.");
                        setAlertType(typeAlert.success);
                        buscarCategoriasMonotributo();
                    })
                    .catch((error: any) => {
                        if(error.response.data.errors){
                          setAlertMessage(error.response.data.errors[0].description);
                        }
                          else{
                        setAlertMessage("No se pudo desactivar el estado. Inténtalo de nuevo más tarde.");
                          }setAlertType(typeAlert.error);
                    });
            } else {
                activarCategoriasMonotributo({ id: id })
                    .then(() => {
                        setAlertMessage("¡Todo salió bien! Se guardó con éxito.");
                        setAlertType(typeAlert.success);
                        buscarCategoriasMonotributo();
                    })
                    .catch((error: any) => {
                        if(error.response.data.errors){
                          setAlertMessage(error.response.data.errors[0].description);
                        }
                          else{
                        setAlertMessage("No se pudo activar el estado. Inténtalo de nuevo más tarde.");
                          }
                          setAlertType(typeAlert.error);
                    });
            }
            setModalOpen(false);
        },
        [rowId, modalOpen]
    );


    const buscarCategoriasMonotributo = async () => {

        const filtrosAplicados: CategoriasMonotributoFiltradoRequest = {
            id: Number(searchParams.get("id")) || undefined,
            nombre: searchParams.get("nombre") || undefined,
            estado: searchParams.get("estado") ? Boolean(searchParams.get("estado") === "1") : undefined,
            pageNumber: Number(searchParams.get("pageNumber")) || 1,
            pageSize: Number(searchParams.get("pageSize")) || 9,
            sortBy: searchParams.get('sortBy') || undefined,
            orderAsc: searchParams.get('orderAsc') ? Boolean(searchParams.get("orderAsc") === "true") : null,
        };
        try {
            const response: CategoriasMonotributoFiltradoResponse = await fetchCategoriasMonotributo(filtrosAplicados);

            console.log(response)
            const categoriasMonotributoAPI = response.data?.map((c) => {
                return {
                    id: c.id,
                    nombre: c.nombre,
                    cuit: c.cuit,
                    estado: c.estado,
                };
            });

            setCategoriasMonotributo(categoriasMonotributoAPI);
            setPagination(response.paginationData);

            const pag = response.paginationData;
            setQueryParamsPaginationResponse(pag.totalCount, pag.pageNumber, pag.pageSize, pag.totalPages);

        } catch (error) {
            console.error("Error al buscar CategoriasMonotributo: ", error);
        } finally {
            setLoading(false);
        }
    };

    const getSearchParams = (): CategoriasMonotributoFiltradoRequest => {
        return {
            sortBy: searchParams.get("sortBy") || undefined,
            orderAsc: searchParams.get("orderAsc")
                ? Boolean(searchParams.get("orderAsc") === "true")
                : null,
            id: Number(searchParams.get("id")) || undefined,
            nombre: searchParams.get("nombre") || undefined,
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

    useEffect(() => {
        if (router.isReady) {
            getFilters();
            buscarCategoriasMonotributo();
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
                <Typography variant="h1">Categorias Monotributo</Typography>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                >
                    <FilterChips
                        onDelete={(key) =>
                            handleDeleteFilter(key as keyof CategoriasMonotributoFiltradoRequest)
                        }
                        filters={filters}
                    />
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        gap="10px"
                    >
                        <PopperFiltrosCategoriasMonotributo />
                        <CreateButton url={"/microMaestros/categoriasMonotributo/crear"} />
                    </Box>
                </Box>
            </Box>

            {categoriasMonotributo && categoriasMonotributo.length > 0 ? (
                <GridCategoriasMonotributo
                    categoriasMonotributo={categoriasMonotributo}
                    handleModalOpenEstado={handleModalOpenEstado}
                    handleApplySort={handleApplySort}
                    pagination={pagination}
                    exportButton={
                        <ExportButton
                            getSerchParams={getSearchParams}
                            documentName={"CategoriasMonotributos.xlsx"}
                            exportFunction={exportCategoriasMonotributo}
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

            <ModalCategoriasMonotributo
                open={modalOpen}
                handleClose={handleModalCloseEstado}
                id={rowId}
                toggleActivation={toggleActivation}
            />

        </Box>
    );
};

export default HomeCategoriasMonotributo;
