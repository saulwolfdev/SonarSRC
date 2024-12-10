import { PaginacionAPI } from "./GenericTypes";
const consolidadosType = () => {
    return (
      null
    )
  }
  
  export default consolidadosType

  export interface GremioConsolidadoGridData{
    id: number
    nombre: string
    estado: boolean

  }





// GET BY ID

// sirve tambien para hacer cambio de estado
export interface GremioConsolidadoByIdRequest{ 
    id: number
}

export interface GremioConsolidadoDetalleResponce {
    codigo: number
    nombre: string
    estado: boolean
}

// GET ALL 

export interface GremiosConsolidadosFiltradasRequest { 
    codigo?: number 
    nombre?: string     
    codigoGremioConsolidador?: number
    estado?: boolean 
    pageNumber?:number
    pageSize?:number
    sortBy?: string  // Codigo  Nombre  Estado  
    orderAsc?: boolean | null
}

export interface GremioConsolidadoAPI {
    codigo: number // es el id
    nombre: string
    estado: boolean
}


export interface GremiosConsolidadosFiltradasResponse {
    paginationData: PaginacionAPI
    data: GremioConsolidadoAPI[]
}

// PUT

export interface GremioConsolidadoUpdate{
    id: number
    nombre: string
}
// la response es un status


// POST
export interface GremioConsolidadoCreate{
    nombre:string
    codigoGremioConsolidador: number
}