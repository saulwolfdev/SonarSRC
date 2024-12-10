import { PaginacionAPI } from "./GenericTypes";
export const URLBaseTitulosAcademicos = 'https://localhost:7052/api/v1'

const titulosAcademicosTypes = () => {
  return (
    null
  )
}

export default titulosAcademicosTypes





export interface TitulosAcademicosGridData {
    id?: number
    nombreTitulosAcademicos?: string
    cuit?: string
    estado?: boolean
}

export interface TitulosAcademicosFiltradoRequest {
  id?: number 
  nombre?: string 
  estado?: boolean
  sortBy?: string 
  orderAsc?: boolean | null
  pageNumber?:number
  pageSize?:number
}

export interface TitulosAcademicosAPI {
  id?: number 
  nombre?: string 
  estado?: boolean
  cuit?: string
}

export interface TitulosAcademicosFiltradoResponse {
  paginationData: PaginacionAPI
  data: TitulosAcademicosAPI[]
}

export interface TitulosAcademicosCreate {
  id: number;
  nombre: string;
  estado: boolean;
  cuit: string;
  nombreSede: string;
  nombreReferente: string;
}

export interface TitulosAcademicosCreateRequest {
  nombre: string
}

export interface TitulosAcademicosCreateResponse {
  body: string
}

export interface TitulosAcademicosDetalleResponse {
  id: number;
  nombre: string;
  estado: boolean;
}

export interface TitulosAcademicosUpdateRequest {
  id: number;
  nombre: string;
}

export interface TitulosAcademicosActivar {
  id: number
}

export interface TitulosAcademicosDesactivar {
  id: number
  motivo?: string
}