import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import FilterChips from "@/components/shared/FilterChips";
import { useSearchParams } from "next/navigation";
import BreadcrumbCustom from "@/components/shared/BreadcrumbCustom";
import TabsCustom from "./TabsCustom";
import {
  getFilters,
  handleApplySort,
  handleDeleteFilter
} from "@/utils/microMaestros/conveniosDetallesUtils";
import PopperFiltrosConveniosDetalles from "./PopperFiltrosConveniosDetalles";
import GridZonas from "./tables/GridZonas";
import GridTurnos from "./tables/GridTurnos";
import IndexTitulosCategorias from "./tables/IndexTitulosCategorias";
import { useRouter } from "next/router";
import { useCodigosStore } from "@/zustand/microMaestros/gremios/useCodigosStore";
import { useFiltrosConveniosTitulosStore } from "@/zustand/microMaestros/gremios/conveniosDetalles/useFiltrosTitulosStore";
import { useFiltrosConveniosCategoriasStore } from "@/zustand/microMaestros/gremios/conveniosDetalles/useFiltrosCategoriasStore";
import { useFiltrosConveniosZonasStore } from "@/zustand/microMaestros/gremios/conveniosDetalles/useFiltrosZonasStore";
import { useFiltrosConveniosTurnosStore } from "@/zustand/microMaestros/gremios/conveniosDetalles/useFiltrosTurnosStore";
import useQueryString from "@/hooks/useQueryString";
import CreateButton from "@/components/shared/CreateButton";
import { chageOnePage } from "@/utils/microMaestros/conveniosDetallesUtils";

interface ConvenioDetalleComponetProps {
  breadcrumbs: any;
  updateBreadcrumbs: any;
  canCreate: boolean
}

const ConvenioDetalleComponet = ({breadcrumbs, updateBreadcrumbs, canCreate}:ConvenioDetalleComponetProps ) => {
  const [value, setValue] = useState(0);
  const [urlCreate, setUrlCreate] = useState('/microMaestros/convenios/titulos/crear')
  const [page, setPage] = useState<"titulo" | "zona" | "turno" | "categoria">("titulo");

  const [filters, setFilters] = useState<[string, string, string][]>([]);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const theme = useTheme();

  const { nombreTituloConvenioColectivo } = useCodigosStore();


  const {codigoFiltroConvenioCategoria,nombreFiltroConvenioCategoria,estadoFiltroConvenioCategoria} = useFiltrosConveniosCategoriasStore();
  const {codigoFiltroConvenioTitulo,nombreFiltroConvenioTitulo,estadoFiltroConvenioTitulo} = useFiltrosConveniosTitulosStore();
  const {codigoFiltroConvenioTurno,nombreFiltroConvenioTurno,estadoFiltroConvenioTurno,} = useFiltrosConveniosTurnosStore();
  const { codigoFiltroConvenioZona, nombreFiltroConvenioZona, estadoFiltroConvenioZona,} = useFiltrosConveniosZonasStore();

  const {updateCodigoFiltroConvenioTitulo,updateNombreFiltroConvenioTitulo, updateEstadoFiltroConvenioTitulo} = useFiltrosConveniosTitulosStore()
  const {updateCodigoFiltroConvenioCategoria,updateNombreFiltroConvenioCategoria,updateEstadoFiltroConvenioCategoria} = useFiltrosConveniosCategoriasStore()
  const {updateCodigoFiltroConvenioZona,updateNombreFiltroConvenioZona ,updateEstadoFiltroConvenioZona } = useFiltrosConveniosZonasStore()
  const {updateCodigoFiltroConvenioTurno,updateNombreFiltroConvenioTurno,updateEstadoFiltroConvenioTurno} = useFiltrosConveniosTurnosStore()


  const options = [
    {
      name: "Títulos",
      element: <IndexTitulosCategorias handleApplySort={handleApplySort} />,
    },
    {
      name: "Zonas",
      element: <GridZonas handleApplySort={handleApplySort} />,
    },
    {
      name: "Turnos",
      element: <GridTurnos handleApplySort={handleApplySort} />,
    },
  ];

  useEffect(() => {
    changePage();
  }, [nombreTituloConvenioColectivo, value]);

  const changePage = () => {
    switch (
      value // segun el orden del array options
    ) {
      case 0:
        if (nombreTituloConvenioColectivo == "") {
          chageOnePage("titulo",codigoFiltroConvenioTitulo,nombreFiltroConvenioTitulo,estadoFiltroConvenioTitulo,'/microMaestros/convenios/crearTitulo',setPage,updateBreadcrumbs, setFilters,setUrlCreate)        
        } else {
          chageOnePage("categoria", codigoFiltroConvenioCategoria, nombreFiltroConvenioCategoria, estadoFiltroConvenioCategoria, '/microMaestros/convenios/titulos/crearCategoria',setPage,updateBreadcrumbs, setFilters,setUrlCreate)
        }
        break;
      case 1:
        chageOnePage("zona",codigoFiltroConvenioZona,nombreFiltroConvenioZona,estadoFiltroConvenioZona, '/microMaestros/convenios/crearZona',setPage,updateBreadcrumbs, setFilters,setUrlCreate)
        break;
      case 2:
        chageOnePage("turno",codigoFiltroConvenioTurno,nombreFiltroConvenioTurno,estadoFiltroConvenioTurno,'/microMaestros/convenios/crearTurno',setPage,updateBreadcrumbs, setFilters,setUrlCreate)
        break;
    }
  };

  const handleDeleteFilterSwitch = (key: any) => {
    switch ( page ){
      case 'titulo':   
        handleDeleteFilter(key, updateCodigoFiltroConvenioTitulo, updateNombreFiltroConvenioTitulo,updateEstadoFiltroConvenioTitulo, filters, setFilters)
        break;  
      case 'categoria':
        handleDeleteFilter(key,updateCodigoFiltroConvenioCategoria, updateNombreFiltroConvenioCategoria, updateEstadoFiltroConvenioCategoria, filters, setFilters)
        break;
      case 'zona':
        handleDeleteFilter(key, updateCodigoFiltroConvenioZona, updateNombreFiltroConvenioZona, updateEstadoFiltroConvenioZona, filters, setFilters)
        break;
      case 'turno':
        handleDeleteFilter(key,updateCodigoFiltroConvenioTurno, updateNombreFiltroConvenioTurno, updateEstadoFiltroConvenioTurno, filters, setFilters)
        break;
    }
  };


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
          pt: 20,
          alignItems: "center",
          marginBottom: theme.spacing(2),
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Typography variant="h1">Convenios</Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <FilterChips
            filters={filters}
            onDelete={(key) => handleDeleteFilterSwitch(key)}
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="10px"
          >
            <PopperFiltrosConveniosDetalles page={page}  setFilters={setFilters}/>
            {canCreate && <CreateButton url={urlCreate}/>}
          </Box>
        </Box>
      </Box>
      {breadcrumbs && <BreadcrumbCustom breadcrumbs={breadcrumbs} />}

      <TabsCustom options={options} value={value} setValue={setValue} />
    </Box>
  );
};

export default ConvenioDetalleComponet;
