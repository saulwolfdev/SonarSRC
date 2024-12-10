import { Box, Typography, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import {
  PuestosEmpresaFiltradosRequest,
  PuestosEmpresaFiltradosResponse,
  PuestoEmpresaGridData,
  PuestoEmpresaByIdRequest,
} from "../../../types/microMaestros/puestosEmpresaTypes"
import {
  activarPuestoEmpresa,
  desactivarPuestoEmpresa,
  exportPuestosEmpresa,
  fetchPuestosEmpresa,
} from "../../../services/microMaestros/puestosEmpresaService"
import Spinner from "@/components/shared/Spinner";
import GridPuestosEmpresa from "./components/GridPuestosEmpresa";
import ModalPuestosEmpresa from "./components/ModalPuestosEmpresa";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";
import FiltradoSinDatos from "@/components/shared/FiltradoSinDatos";
import FilterChips from "@/components/shared/FilterChips";
import PopperFiltrosPuestosEmpresa from "@/components/microMaestros/puestosEmpresa/PopperFiltrosPuestosEmpresa";
import CreateButton from "@/components/shared/CreateButton";
import ExportButton from "@/components/shared/ExportButton"; 
import { useSearchParams } from "next/navigation";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { PaginacionAPI } from "@/types/microMaestros/GenericTypes";

const HomePuestosEmpresa = () => {
  const { modifyQueries, removeQueries } = useQueryString();

  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  // Tabla
  const [puestosEmpresa, setPuestosEmpresa] = useState<PuestoEmpresaGridData[]>();
  const [filters, setFilters] = useState<[string, string, string][]>([]);
  const [pagination, setPagination] = useState<PaginacionAPI>();

  // Modal estado
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);

  // Respuesta
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const theme = useTheme();

  const handleApplySort = (appliedFilters: PuestosEmpresaFiltradosRequest) => {
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


  const handleModalOpenEstado = (id: number) => {
    setRowId(id);
    setModalOpen(true);
  };

  const handleModalCloseEstado = () => {
    setModalOpen(false);
    setRowId(0);
  };

  const buscarPuestosEmpresa = () => {
    const filtrosAplicados: PuestosEmpresaFiltradosRequest = getSearchParams();

    fetchPuestosEmpresa(filtrosAplicados)
      .then(function (response: PuestosEmpresaFiltradosResponse) {
        const puestosEmpresaAPI = response.data.map((p) => {
          const pGrilla: PuestoEmpresaGridData = {
            id: p.id,
            nombre: p.nombre,
            codigoAfip: p.codigoAfip,
            estado: p.estado,
          };
          return pGrilla;
        });
        setPagination(response.paginationData);
        setPuestosEmpresa(puestosEmpresaAPI);
        setLoading(false);
      })
      .catch(function (error: any) {
        console.log(error);
        setLoading(false);
      });
  };

  const toggleActivation = useCallback(
    (isActivated: boolean | undefined, id: number) => {
      if (isActivated) {
        desactivarPuestoEmpresa({ id: id })
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardó con éxito.");
            setAlertType(typeAlert.success);
            buscarPuestosEmpresa(); // Actualiza la grilla
          })
          .catch((error) => {
            if(error.response.data.errors){
              setAlertMessage(error.response.data.errors[0].description);
            }
              else{
            setAlertMessage("No se pudo desactivar el estado. Inténtalo de nuevo más tarde.");
              }
            setAlertType(typeAlert.error);
          });
      } else {
        activarPuestoEmpresa({ id: id })
          .then(() => {
            setAlertMessage("¡Todo salió bien! Se guardó con éxito.");
            setAlertType(typeAlert.success);
            buscarPuestosEmpresa(); // Actualiza la grilla
          })
          .catch((error) => {
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
    [buscarPuestosEmpresa]
  );
  

  const handleDeleteFilter = (key: keyof PuestosEmpresaFiltradosRequest) => {
    removeQueries([key]);
  };

  const getSearchParams = (): PuestosEmpresaFiltradosRequest => {
    return {
      nombre: searchParams.get("nombre") || undefined,
      codigoAfip: searchParams.get("codigoAfip") || undefined,
      estado:
        searchParams.get("estado") === "true"
          ? true
          : searchParams.get("estado") === "false"
          ? false
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

    if (filtersObject.nombre) {
      array.push(["Nombre", filtersObject.nombre, "nombre"]);
    }
    if (filtersObject.codigoAfip) {
      array.push(["Código AFIP", filtersObject.codigoAfip, "codigoAfip"]);
    }
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
    getFilters();
    buscarPuestosEmpresa();
  }, [searchParams.toString()]);

  if (loading) {
    return <Spinner />;
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
        <Typography variant="h1">Puestos Empresa</Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <FilterChips
            filters={filters}
            onDelete={(key) =>
              handleDeleteFilter(key as keyof PuestosEmpresaFiltradosRequest)
            }
          />
          <Box display="flex" alignItems="center" justifyContent="space-between" gap="10px">
            <PopperFiltrosPuestosEmpresa />
            <CreateButton url={"/microMaestros/puestosEmpresa/crear"} />
          </Box>
        </Box>
      </Box>

      {puestosEmpresa && puestosEmpresa.length > 0 ? (
        <GridPuestosEmpresa
          puestosEmpresa={puestosEmpresa}
          pagination={pagination}
          handleModalOpenEstado={handleModalOpenEstado}
          getSearchParams={getSearchParams}
          setAlertMessage={setAlertMessage}
          setAlertType={setAlertType}
          handleApplySort={handleApplySort}
          exportButton={
            <ExportButton
              getSerchParams={getSearchParams} 
              documentName={"PuestosEmpresa.xlsx"}
              exportFunction={exportPuestosEmpresa}
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

      <ModalPuestosEmpresa
        open={modalOpen}
        handleClose={handleModalCloseEstado}
        id={rowId}
        toggleActivation={toggleActivation}
      />
    </Box>
  );
};

export default HomePuestosEmpresa;
