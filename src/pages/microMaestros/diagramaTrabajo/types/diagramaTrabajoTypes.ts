import { PaginacionAPI } from "@/types/microMaestros/GenericTypes"

export const URLBaseDiagramaTrabajo = 'https://localhost:7052/api/v1'

const diagramaTrabajoTypes = () => {
  return (
    null
  )
}

export default diagramaTrabajoTypes





export interface DiagramaTrabajoGridData {
    id?: number
    nombreDiagramaTrabajo?: string
    cuit?: string
    estado?: boolean
}

export interface DiagramaTrabajoFiltradoRequest {
  codigo?: number 
  diasTrabajo?: string 
  diasDescanso?: string 
  nombre?: string 
  diaTrabajoMes?: string 
  estado?: boolean
  sortBy?: string 
  orderAsc?: boolean | null
  pageNumber?:number
  pageSize?:number
}

export interface DiagramaTrabajoAPI {
  id: number 
  diasTrabajo: string 
  diasDescanso: string 
  nombre : string 
  diaTrabajoMes: string 
  estado: boolean
}

export interface DiagramaTrabajoFiltradoResponse {
  paginationData: PaginacionAPI
  data: DiagramaTrabajoAPI[]
}

export interface DiagramaTrabajoCreate {
  id: number;
  nombre: string;
  estado: boolean;
  cuit: string;
  nombreSede: string;
  nombreReferente: string;
}

export interface DiagramaTrabajoCreateRequest {
  diasTrabajo: string,
  diasDescanso: string,
  diaTrabajoMes: string
}

export interface DiagramaTrabajoCreateResponse {
  body: string
}

export interface DiagramaTrabajoDetalleResponse {
  id: number;
  nombre: string;
  estado: boolean;
  cuit: string;
}

export interface DiagramaTrabajoUpdateRequest {
  id: number;
  nombre: string;
  cuit: string;
}

export interface DiagramaTrabajoChange {
  id: number
}