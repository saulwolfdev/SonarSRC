import { PaginacionAPI } from "./GenericTypes";
const zonaType = () => {
    return (
      null
    )
  }
  
  export default zonaType

  export interface TurnoGridData{
    id: number
    nombre: string
    estado: boolean
    porcentajeAdicional: number

  }





// GET BY ID

// sirve tambien para hacer cambio de estado
export interface TurnoByIdRequest{ 
    id: number
}

export interface TurnoDetalleResponce {
    codigo: number
    nombre: string
    porcentajeAdicional : number
    estado: boolean
}

// GET ALL 

export interface TurnosFiltradasRequest { 
    codigo?: number 
    nombre?: string     
    CodigoConvenioColectivo?: number
    estado?: boolean 
    pageNumber?:number
    pageSize?:number
    sortBy?: string  // Codigo  Nombre  Estado  PorcenAdic
    orderAsc?: boolean | null
}

export interface TurnoAPI {
    codigo: number // es el id
    nombre: string
    porcentajeAdicional : number
    estado: boolean
}


export interface TurnosFiltradasResponse {
    paginationData: PaginacionAPI
    data: TurnoAPI[]
}


// POST
export interface TurnoCreate{
    nombre:string
    codigoConvenioColectivo: number 
    porcentajeAdicional : number
    estado: boolean
}