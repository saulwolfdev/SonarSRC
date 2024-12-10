export const URLBaseCategoriasMonotributo = 'https://localhost:7052/api/v1'

const categoriasMonotributoTypes = () => {
  return (
    null
  )
}

export default categoriasMonotributoTypes

export interface IdOption {
  id: number;
  label: string;
}

export interface PaginacionAPI {
    totalCount: number
    pageNumber: number
    pageSize: number
    totalPages: number
}

export interface CategoriasMonotributoGridData {
    id?: number
    nombreCategoriasMonotributo?: string
    cuit?: string
    estado?: boolean
}

export interface CategoriasMonotributoFiltradoRequest {
  id?: number 
  nombre?: string 
  estado?: boolean
  sortBy?: string 
  orderAsc?: boolean | null
  pageNumber?:number
  pageSize?:number
}

export interface CategoriasMonotributoAPI {
  id?: number 
  nombre?: string 
  estado?: boolean
  cuit?: string
}

export interface CategoriasMonotributoFiltradoResponse {
  paginationData: PaginacionAPI
  data: CategoriasMonotributoAPI[]
}

export interface CategoriasMonotributoCreate {
  id: number;
  nombre: string;
  estado: boolean;
  cuit: string;
  nombreSede: string;
  nombreReferente: string;
}

export interface CategoriasMonotributoCreateRequest {
  nombre: string
}

export interface CategoriasMonotributoCreateResponse {
  body: string
}

export interface CategoriasMonotributoDetalleResponse {
  id: number;
  nombre: string;
  estado: boolean;
}

export interface CategoriasMonotributoUpdateRequest {
  id: number;
  nombre: string;
}

export interface CategoriasMonotributoActivar {
  id: number
}

export interface CategoriasMonotributoDesactivar {
  id: number
  motivo?: string
}