import { PaginacionAPI } from "./GenericTypes";

const categoriaType = () => {
    return (
      null
    )
  }
  
export default categoriaType

  export interface CategoriaGridData{
    id: number
    nombre: string
    estado: boolean

  }





// GET BY ID

// sirve tambien para hacer cambio de estado
export interface CategoriaByIdRequest{ 
    id: number
}

export interface CategoriaDetalleResponce {
    codigo: number
    nombre: string
    estado: boolean
}

// GET ALL 

export interface CategoriasFiltradasRequest { 
    codigo?: number 
    nombre?: string     
    codigoTituloConvenioColectivo?: number
    estado?: boolean 
    pageNumber?:number
    pageSize?:number
    sortBy?: string  // Codigo  Nombre  Estado
    orderAsc?: boolean | null
}

export interface CategoriaAPI {
    codigo: number // es el id
    nombre: string
    estado: boolean
}


export interface CategoriasFiltradasResponse {
    paginationData: PaginacionAPI
    data: CategoriaAPI[]
}

// POST
export interface CategoriaCreate{
    nombre:string
    CodigoTituloConvenioColectivo: number 
    estado: boolean
}