import { PaginacionAPI } from "./GenericTypes";

const asociacionGremialType = () => {
    return (
      null
    )
  }
  
  export default asociacionGremialType

  export interface AsociacionGremialGridData{
    id: number
    nombre: string
    estado: boolean

  }





// GET BY ID

// sirve tambien para hacer cambio de estado
export interface AsociacionGremialByIdRequest{ 
    id: number
}

export interface AsociacionGremialDetalleResponce {
    codigo: number
    nombre: string
    provincias: string
    estado: boolean
}

// GET ALL 

export interface AsociacionesGremialesFiltradasRequest { 
    codigo?: number 
    nombre?: string     
    codigoGremioConsolidado?: number
    provinciaId?: number
    estado?: boolean 
    pageNumber?:number
    pageSize?:number
    sortBy?: string  // Codigo  Nombre  Estado  Provincias
    orderAsc?: boolean | null
}

export interface AsociacionGremialAPI {
    codigo: number // es el id
    nombre: string
    provincias: string
    estado: boolean
}


export interface AsociacionesGremialesFiltradasResponse {
    paginationData: PaginacionAPI
    data: AsociacionGremialAPI[]
}

// PUT

export interface AsociacionGremialUpdate{
    id: number
    nombre: string
    codigoGremioConsolidado: number 
    provinciasId: number[]
    conveniosColectivosId? :number[]
}
// la response es un status


// POST
export interface AsociacionGremialCreate{
    nombre:string
    codigoGremioConsolidado: number 
    provinciasId: number[]
    conveniosColectivosId?: number[]
    estado: boolean
}