import { PaginacionAPI } from "./GenericTypes";
const zonaType = () => {
    return (
      null
    )
  }
  
  export default zonaType

  export interface ZonaGridData{
    id: number
    nombre: string
    estado: boolean
    porcentajeAdicional: number

  }





// GET BY ID

// sirve tambien para hacer cambio de estado
export interface ZonaByIdRequest{ 
    id: number
}

export interface ZonaDetalleResponce {
    codigo: number
    nombre: string
    porcentajeAdicional : number
    estado: boolean
}

// GET ALL 

export interface ZonasFiltradasRequest { 
    codigo?: number 
    nombre?: string     
    CodigoConvenioColectivo?: number
    estado?: boolean 
    pageNumber?:number
    pageSize?:number
    sortBy?: string  // Codigo  Nombre  Estado  PorcenAdic
    orderAsc?: boolean | null
}

export interface ZonaAPI {
    codigo: number // es el id
    nombre: string
    porcentajeAdicional : number
    estado: boolean
}


export interface ZonasFiltradasResponse {
    paginationData: PaginacionAPI
    data: ZonaAPI[]
}


// POST
export interface ZonaCreate{
    nombre:string
    codigoConvenioColectivo: number 
    porcentajeAdicional : number 
    estado: boolean
}