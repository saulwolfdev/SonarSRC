import { PaginacionAPI } from "./GenericTypes";
const consolidadorType = () => {
    return (
        null
    )
}

export default consolidadorType
export interface GremioConsolidadorGridData {
    id: number
    nombre: string
    estado: boolean

}



// GET BY ID
// sirve tambien para hacer cambio de estado
export interface GremioConsolidadorByIdRequest {
    id: number
}
export interface GremioConsolidadorDetalleResponse {
    codigo: number
    nombre: string
    estado: boolean
}
// GET ALL 
export interface GremiosConsolidadoresFiltradasRequest {
    codigo?: number
    nombre?: string
    estado?: boolean
    nombreGremioConsolidado?: string
    nombreAsociacionGremial?: string
    provinciaId?: number;
    nombreConvenioColectivo?: string
    sortBy?: string  // Codigo  Nombre  Estado  
    orderAsc?: boolean | null
    pageNumber?: number
    pageSize?: number
}
export interface GremioConsolidadorAPI {
    codigo: number // es el id
    nombre: string
    estado: boolean
}

export interface GremiosConsolidadoresFiltradasResponse {
    paginationData: PaginacionAPI
    data: GremioConsolidadorAPI[]
}

// PUT
export interface GremioConsolidadorUpdate {
    id: number
    nombre: string
}
// la response es un status

// POST
export interface GremioConsolidadorCreate {
    nombre: string
}