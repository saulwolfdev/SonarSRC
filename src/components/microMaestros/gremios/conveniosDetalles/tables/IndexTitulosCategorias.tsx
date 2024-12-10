import { useEffect, useState } from "react"
import GridTitulos from "./GridTitulos"
import GridCategorias from "./GridCategorias"
import { useSearchParams } from "next/navigation"
import { useCodigosStore } from "@/zustand/microMaestros/gremios/useCodigosStore"

interface IndexTitulosCategoriasProps {
    handleApplySort: any
  }
  

export default function IndexTitulosCategorias({handleApplySort}: IndexTitulosCategoriasProps){
    const nombreTituloConvenioColectivo = useCodigosStore((state) => state.nombreTituloConvenioColectivo)


    return(
        nombreTituloConvenioColectivo == ''?
        <GridTitulos  handleApplySort={handleApplySort} />
        : <GridCategorias  handleApplySort={handleApplySort}  /> 
    )
}