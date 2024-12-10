import PaginationCustom from "@/components/shared/PaginationCustom"
import { Box, Typography } from "@mui/material"
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridPaginationModel,
    GridRowParams,
} from "@mui/x-data-grid"
import React, { useCallback, useState } from "react"
import { ChipCustom, StatusChip } from "@/components/shared/ChipsCustom"
import { useRouter } from "next/router"
import { PolizaSeguroGridData, PolizaSeguroFiltradoRequest } from "@/types/microContratos/polizaSeguroTypes"
import ExportButton from "@/components/shared/ExportButton"
import { exportPolizaSeguro } from "@/services/microContratos/polizaSeguroService"
import { typeAlert } from "@/components/shared/SnackbarAlert"
import { useSearchParams } from "next/navigation"
import { format, isBefore } from 'date-fns';
import { PaginacionAPI } from "@/types/microContratos/GenericTypes"
import { useRouterPush, useRouterPushQuery } from "@/hooks/useRouterPush"

interface GridPolizaSeguroProps {
    polizaSeguro: PolizaSeguroGridData[] | undefined
    pagination?: PaginacionAPI
    handleModalOpenEstado: (id: number) => void
    handleApplySort: any
    setAlertMessage: (message: string) => void
    setAlertType: (type: typeAlert) => void
    getSerchParams: any
}

const GridPolizaSeguro = ({
    polizaSeguro,
    pagination,
    handleModalOpenEstado,
    handleApplySort,
    setAlertMessage,
    setAlertType,
    getSerchParams
}: GridPolizaSeguroProps) => {
  const routerPush = useRouterPush();
  const routerPushQuery
 = useRouterPushQuery();
    
    const [lastSortModel, setLastSortModel] = useState({ field: '', sort: '' });
    const searchParams = useSearchParams()

    const handleSortModelChange = (event: any) => {
        if (event.length === 0) {
            /* 
            A la tercera vez que tocas una misma columna ya no se produce un evento ,
            entonces vamos guardando la anterior y lo ordenamos por el metodo contrario
            */
            handleApplySort({
                sortBy: lastSortModel.field,
                orderAsc: lastSortModel.sort == 'asc' ? 'desc' : 'asc',
            });
        } else {
            setLastSortModel({ field: event[0].field, sort: event[0].sort });
            handleApplySort({
                sortBy: event[0].field,
                orderAsc: event[0].sort,
            });
        }
    };

    const handleEditar = useCallback((id: number) => {
        // routerPushQuery({pathname: `todo`, query: { id}});
    }, []);
    const getActionItems = React.useCallback(
        (isActive: boolean, id: number) => [
            <GridActionsCellItem
                key={`edit-${id}`}
                onClick={() => { routerPush(`/microContratos/polizaSeguro/editar?id=${id}`) }}
                label="Editar"
                showInMenu
            />,
            isActive ? (
                <GridActionsCellItem
                    key={`deactivate-${id}`}
                    onClick={() => handleModalOpenEstado(id)}
                    label="Desactivar"
                    showInMenu
                />
            ) : (
                <GridActionsCellItem
                    key={`activate-${id}`}
                    onClick={() => handleModalOpenEstado(id)}
                    label="Activar"
                    showInMenu
                />
            ),
        ],
        [handleEditar, handleModalOpenEstado]
    )
    const columns: GridColDef[] = [
        {
            field: "contratista",
            headerName: "Contratista",
            flex: 1,
            minWidth: 40,
            maxWidth: 200,
        },
        {
            field: "numero",
            headerName: "N° de póliza",
            flex: 1,
            minWidth: 40,
            maxWidth: 200,
        },
        {
            field: "tipoSeguro",
            headerName: "Tipo de seguro",
            flex: 1,
            minWidth: 40,
            maxWidth: 200,
        },
        {
            field: "companiaAseguradora",
            headerName: "Compañia aseguradora",
            flex: 1,
            minWidth: 40,
            maxWidth: 250,
        },
        {
            field: "cuitCompaniaAseguradora",
            headerName: "CUIT Compañía aseguradora",
            flex: 1,
            minWidth: 40,
            maxWidth: 300,
        },
        {
            field: "vigencia",
            headerName: "Vigencia hasta",
            flex: 1,
            minWidth: 40,
            maxWidth: 200,
            renderCell: (params) => {
                const vigenciaDate = new Date(params.value);
                const isExpired = isBefore(vigenciaDate, new Date());

                return (
                    <div style={{ color: isExpired ? '#DC3545' : 'inherit' }}>
                        {format(vigenciaDate, 'dd/MM/yyyy')}
                    </div>
                )
            }
        },
        {
            field: "estado",
            headerName: "Estado",
            flex: 1,
            minWidth: 60,
            renderCell: (params) => (
                <Box className='cellEstadoDataGrid'>
                    <ChipCustom
                        label={params.value ? "Activo" : "Inactivo"}
                        status={params.value ? StatusChip.success : StatusChip.disabled}
                    />
                </Box>
            ),
        },
        {
            field: "actions",
            type: "actions",
            flex: 0,
            width: 80,
            headerAlign: "right",
            align: "right",
            renderHeader: () => (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <ExportButton
                        getSerchParams={getSerchParams}
                        exportFunction={exportPolizaSeguro}
                        documentName={'Listado de Pólizas de seguro'}
                        setAlertMessage={setAlertMessage}
                        setAlertType={setAlertType}
                    />
                </Box>
            ),
            getActions: (params: GridRowParams) => getActionItems(params.row.estado, params.row.id),
        },
    ]

    return (
        <Box
            sx={{
                flexGrow: 1,
                width: "100%",
                overflow: "auto",
                background: "#FFFFFF",
                height: "100%",
                boxShadow: "0.25rem 0.25rem 0.625rem #D6D6D6",
            }}
        >
            <DataGrid
                rowHeight={70}
                rows={polizaSeguro}
                columns={columns}
                getRowHeight={() => 'auto'}
                disableRowSelectionOnClick
                disableColumnMenu
                density="compact"
                onSortModelChange={handleSortModelChange}
                slots={{
                    footer: () => (
                        <PaginationCustom pagination={pagination!} rowsPerPageOptions={[9, 14, 20]} />
                    ),
                }}
            />
        </Box>
    )
}

export default GridPolizaSeguro
