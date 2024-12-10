import { PaginacionAPI } from "./GenericTypes";
const tituloType = () => {
    return (
      null
    )
  }
  
  export default tituloType

  export interface TituloGridData{
    id: number
    nombre: string
    estado: boolean

  }





// GET BY ID

// sirve tambien para hacer cambio de estado
export interface TituloByIdRequest{ 
    id: number
}

export interface TituloDetalleResponce {
    codigo: number
    nombre: string
    estado: boolean
}

// GET ALL 

export interface TitulosFiltradasRequest { 
    codigo?: number 
    nombre?: string     
    estado?: boolean 
    codigoConvenioColectivo?: number
    pageNumber?:number
    pageSize?:number
    sortBy?: string  // Codigo  Nombre  Estado  
    orderAsc?: boolean | null
}

export interface TituloAPI {
    codigo: number // es el id
    nombre: string
    estado: boolean
}


export interface TitulosFiltradasResponse {
    paginationData: PaginacionAPI
    data: TituloAPI[]
}

// POST
export interface TituloCreate{
    nombre:string
    codigoConvenioColectivo: number 
    nombreCategoria: string
    estado: boolean
}