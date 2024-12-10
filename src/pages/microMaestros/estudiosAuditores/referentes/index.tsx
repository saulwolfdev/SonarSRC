import { Box, Typography, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";
import CreateButton from "@/components/shared/CreateButton";
import FilterChips from "../../../../components/shared/FilterChips";
import GridReferentes from "./components/GridReferentes";
import BreadcrumbCustom from "@/components/shared/BreadcrumbCustom";
import { useSearchParams } from "next/navigation";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { useRouter } from "next/router";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";
import Spinner from "@/components/shared/Spinner";
import ExportButton from "@/components/shared/ExportButton";
import PopperFiltrosReferentes from "./components/PopperFiltrosReferentes";
import ModalReferentes from "./components/ModalReferentes";
import { desactivarReferente, activarReferente, fetchReferentes, exportReferentes } from "@/services/microMaestros/ReferentesServices";
import { ReferentesGridData, ReferenteFiltradoRequest, ReferenteFiltradoResponse } from "@/types/microMaestros/ReferentesTypes";

const HomeReferentes = () => {
    const { modifyQueries, removeQueries } = useQueryString();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [referentes, setReferentes] = useState<ReferentesGridData[]>([]);
    const [filters, setFilters] = useState<[string, string, string][]>([]);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
    const theme = useTheme();
    const [pagination, setPagination] = useState<PaginacionAPI>();
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [rowId, setRowId] = useState<number>(0)
    const { id, nombreSede, nombreEstudioAuditor } = router.query;

    const breadcrumbs = [
        { name: "Estudios auditores", path: "/microMaestros/estudiosAuditores" },
        {
            name: Array.isArray(nombreEstudioAuditor) ? nombreEstudioAuditor.map(decodeURIComponent).join(", ") : nombreEstudioAuditor ? decodeURIComponent(nombreEstudioAuditor.toString()) : "",
            path: `/microMaestros/estudiosAuditores/sedes?nombreEstudioAuditor=${encodeURIComponent(nombreEstudioAuditor?.toString() || "")}`
        },
        {
            name: Array.isArray(nombreSede) ? nombreSede.map(decodeURIComponent).join(", ") : nombreSede ? decodeURIComponent(nombreSede.toString()) : ""
        },
    ];
    
    const handleApplySort = (appliedFilters: ReferenteFiltradoRequest) => {
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

    const handleDeleteFilter = (key: keyof ReferenteFiltradoRequest) => {
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
          desactivarReferente({ id: id })
            .then(() => {
              setAlertMessage("¡Todo salió bien! Se guardo con éxito.")
              setAlertType(typeAlert.success)
              buscarReferentes()
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
          activarReferente({ id: id })
            .then(() => {
              setAlertMessage("¡Todo salió bien! Se guardo con éxito.")
              setAlertType(typeAlert.success)
              buscarReferentes()
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

    const buscarReferentes = async () => {
        const filtrosAplicados: ReferenteFiltradoRequest = {
            nombreSede: searchParams.get("nombreSede") || undefined,
            nombreEstudioAuditor: searchParams.get("nombreEstudioAuditor") || undefined,
            codigoReferente: Number(searchParams.get("codigoReferente")) || undefined,
            nombreReferente: searchParams.get("nombre") || undefined,
            rolReferente: searchParams.get("rolReferente") || undefined,
            estado: searchParams.get("estado") ? Boolean(searchParams.get("estado") === "1") : undefined,
            pageNumber: Number(searchParams.get("pageNumber")) || 1,
            pageSize: Number(searchParams.get("pageSize")) || 9,
            sortBy: searchParams.get("sortBy") || undefined,
            orderAsc: searchParams.get("orderAsc") ? Boolean(searchParams.get("orderAsc") === "true") : null,
        };
        try {
            const response: ReferenteFiltradoResponse = await fetchReferentes(filtrosAplicados);
            const referentesAPI = response.data?.map((c) => ({
                id: c.id,
                // codigoSede: c.codigoSede, tiene que venir del back
                usuarioEPID: c.usuarioEPId,
                nombreReferente: c.nombre,
                emailReferente: c.email,
                rolReferente: c.rolEspecialidad,
                estado: c.estado,
            }));
            setReferentes(referentesAPI);
            setPagination(response.paginationData);

            const pag = response.paginationData;
            setQueryParamsPaginationResponse(pag.totalCount, pag.pageNumber, pag.pageSize, pag.totalPages);
        } catch (error) {
            console.error("Error al buscar referentes: ", error);
        } finally {
            setLoading(false);
        }
    };
    const getSearchParams = (): ReferenteFiltradoRequest => {
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
            buscarReferentes();
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
                <Typography variant="h1">Referentes</Typography>

                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                >
                    <FilterChips
                        onDelete={(key) =>
                            handleDeleteFilter(key as keyof ReferenteFiltradoRequest)
                        }
                        filters={filters}
                    />
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        gap="10px"
                    >
                        <PopperFiltrosReferentes />
                        <CreateButton url={`/microMaestros/estudiosAuditores/referentes/crear?sedeId=${id}`} />
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
                        exportFunction={exportReferentes}
                        documentName={"Referentes.xlsx"}
                        setAlertMessage={setAlertMessage}
                        setAlertType={setAlertType}
                    />
                </Box>
            </Box>

            {referentes && referentes.length > 0 ? (
                <GridReferentes
                    referentes={referentes}
                    handleModalOpenEstado={handleModalOpenEstado}
                    handleApplySort={handleApplySort}
                    pagination={pagination}
                />
            ) : filters.length > 0 ? (
                <FiltradoSinDatos />
            ) : (
                <NoExistenRegistros />
            )}


        <ModalReferentes
        open={modalOpen}
        handleClose={handleModalCloseEstado}
        id={rowId}
        toggleActivation={toggleActivation}
      />
        </Box>
    );
};

export default HomeReferentes;
