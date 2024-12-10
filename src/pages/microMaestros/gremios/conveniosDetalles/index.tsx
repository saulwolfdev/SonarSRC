import { BreadcrumbProps } from "@/components/shared/BreadcrumbCustom";
import ConvenioDetalleComponet from "@/components/microMaestros/gremios/conveniosDetalles/ConvenioDetalleComponet";
import { goBackAsociacionesGremiales, goBackConsolidadores, goBackConsolidados, goBackConvenios, goBackConveniosDetalles } from "@/utils/microMaestros/gremiosUtils";
import { useCodigosStore } from "@/zustand/microMaestros/gremios/useCodigosStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRouterPush } from "@/hooks/useRouterPush";

const HomeConveniosDetalles = () => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbProps[]>();
  const routerPush = useRouterPush();


  const {
    nombreGremioConsolidador,
    nombreGremioConsolidado,
    nombreAsociacionGremial,
    nombreConvenioColectivo,
    nombreTituloConvenioColectivo,
  } = useCodigosStore();

  const {
    updateCodigoGremioConsolidador,
    updateNombreGremioConsolidador,
    updateCodigoGremioConsolidado,
    updateNombreGremioConsolidado,
    updateCodigoAsociacionGremial,
    updateNombreAsociacionGremial,
    updateCodigoConvenioColectivo,
    updateNombreConvenioColectivo,
    updateCodigoTituloConvenioColectivo,
    updateNombreTituloConvenioColectivo,
  } = useCodigosStore();

  const updateBreadcrumbs = (page: string) => {
    const newBreadcrumbs: BreadcrumbProps[] = [
      {
        name: "GREMIOS",
        path: `/microMaestros/gremios/consolidadores`,
        goBack: () =>
          goBackConsolidadores(
            updateCodigoGremioConsolidador,
            updateNombreGremioConsolidador,
            updateCodigoGremioConsolidado,
            updateNombreGremioConsolidado,
            updateCodigoAsociacionGremial,
            updateNombreAsociacionGremial,
            updateCodigoConvenioColectivo,
            updateNombreConvenioColectivo,
            updateCodigoTituloConvenioColectivo,
            updateNombreTituloConvenioColectivo
          ),
      },
      {
        name: nombreGremioConsolidador,
        path: `/microMaestros/gremios/consolidados`,
        goBack: () =>
          goBackConsolidados(
            updateCodigoGremioConsolidado,
            updateNombreGremioConsolidado,
            updateCodigoAsociacionGremial,
            updateNombreAsociacionGremial,
            updateCodigoConvenioColectivo,
            updateNombreConvenioColectivo,
            updateCodigoTituloConvenioColectivo,
            updateNombreTituloConvenioColectivo
          ),
      },
      {
        name: nombreGremioConsolidado,
        path: `/microMaestros/gremios/asociacionesGremiales`,
        goBack: () =>
          goBackAsociacionesGremiales(
            updateCodigoAsociacionGremial,
            updateNombreAsociacionGremial,
            updateCodigoConvenioColectivo,
            updateNombreConvenioColectivo,
            updateCodigoTituloConvenioColectivo,
            updateNombreTituloConvenioColectivo
          ),
      },
      {
        name: nombreAsociacionGremial,
        path: `/microMaestros/gremios/convenios`,
        goBack: () =>
          goBackConvenios(
            updateCodigoConvenioColectivo,
            updateNombreConvenioColectivo,
            updateCodigoTituloConvenioColectivo,
            updateNombreTituloConvenioColectivo
          ),
      },
      {
        name: nombreConvenioColectivo,
        ...(page == "categoria" && {
          path: `/microMaestros/gremios/conveniosDetalles`,
          goBack: () =>
            goBackConveniosDetalles(
              updateCodigoTituloConvenioColectivo,
              updateNombreTituloConvenioColectivo
            ),
        }),
      },
      ...(page == "categoria" ? [{ name: nombreTituloConvenioColectivo }] : []),
    ];
    setBreadcrumbs(newBreadcrumbs);
  };

  useEffect(() =>{
    if(!nombreGremioConsolidador || !nombreGremioConsolidado || !nombreAsociacionGremial || !nombreConvenioColectivo ){
       routerPush('/microMaestros/gremios/consolidadores')
      }
  },[nombreGremioConsolidador, nombreGremioConsolidado, nombreAsociacionGremial, nombreConvenioColectivo])

  
  return <ConvenioDetalleComponet breadcrumbs={breadcrumbs} updateBreadcrumbs={updateBreadcrumbs}  canCreate={false}/>
};

export default HomeConveniosDetalles;
