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
    nombreConvenioColectivo,
    nombreTituloConvenioColectivo,
  } = useCodigosStore();

  const {
    updateCodigoTituloConvenioColectivo,
    updateNombreTituloConvenioColectivo,
  } = useCodigosStore();

  
const updateBreadcrumbs = (page: string) => {
  console.log(page)
    const newBreadcrumbs: BreadcrumbProps[] = [
      {
        name: nombreConvenioColectivo,
        ...(page == "categoria" && {
          path: `/microMaestros/convenios/detalles`,
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
    if( !nombreConvenioColectivo ){
       routerPush('/microMaestros/gremios/consolidadores')
      }
  },[ nombreConvenioColectivo])
  
  return <ConvenioDetalleComponet breadcrumbs={breadcrumbs} updateBreadcrumbs={updateBreadcrumbs} canCreate={true}/>
};


export default HomeConveniosDetalles;

