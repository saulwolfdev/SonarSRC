import { PaginacionAPI } from "./GenericTypes";
const GrupoArticulosTypes = () => {
    return null;
  }
  
export default GrupoArticulosTypes

export const URLBaseClasificacionGrupoArticulos = 'https://localhost:7052/api/v1'


export interface GrupoArticulosGridData {
    id: number
    grupoArticulo: string
    descripcion: string
  }
  



// GET BY ID

// sirve tambien para hacer cambio de estado
export interface GrupoArticulosByIdRequest{ 
    id:number
}

export interface GrupoArticulosDetalleResponce {
    id: number
    grupoArticulo: string
    descripcion: string
    incidenciaId: number
    incidencia: string
    cantidadRecursosAfectados: number;
}



// GET ALL 

export interface GrupoArticulosFiltradasRequest { 
    id?: number
    grupoArticulo?: string
    descripcion?: string
    pageNumber?:number
    pageSize?:number
    sortBy?: string 
    orderAsc?: boolean | null
}

export interface GrupoArticulosAPI {
    id: number
    grupoArticulo: string
    descripcion: string
}

export interface GrupoArticulosFiltradasResponse {
    paginationData: PaginacionAPI
    data: GrupoArticulosAPI[]
}

// PUT

export interface GrupoArticulosUpdate{
    id: number
    grupoArticulo: string
    descripcion: string
    incidenciaId: number
}
