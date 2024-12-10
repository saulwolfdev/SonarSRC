export const URLBaseMotivoAfectacion = 'https://localhost:7052/api/v1'

const MotivoAfectacionTypes = () => {
  return (
    null
  )
}

export default MotivoAfectacionTypes


export interface PaginacionAPI {
    totalCount: number
    pageNumber: number
    pageSize: number
    totalPages: number
}

export interface MotivoAfectacionGridData {
    id?: number
    motivoDeAfectacion?: string
    relacionServicio?: number[]
    fechaIncorporacion?: boolean
    bajaPorCesion?: boolean
    afectacionTemporal?: boolean
    estado?: boolean
}

export interface MotivoAfectacionFiltradoRequest {
  id?: number 
  motivoAfectacion?: string 
  estado?: boolean
  fechaIncorporacion?: boolean
  bajaPorCesion?: boolean
  afectacionTemporal?: boolean
  relacionesServicio?: number[]
  pageNumber?:number
  pageSize?:number
  sortBy?: string 
  orderAsc?: boolean | null
}

export interface MotivoAfectacionAPI {
  id?: number 
  motivoDeAfectacion?: string 
  relacionServicio?: []
  fechaIncorporacion?: boolean
  bajaPorCesion?: boolean
  afectacionTemporal?: boolean
  estado?: boolean
}

export interface MotivoAfectacionFiltradoResponse {
  paginationData: PaginacionAPI
  data: MotivoAfectacionAPI[]
}

export interface MotivoAfectacionCreateRequest {
  motivoDeAfectacion?: string
  relacionServicio?: number[]
  fechaIncorporacion?: boolean
  bajaPorCesion?: boolean
  afectacionTemporal?: boolean
}

export interface MotivoAfectacionCreateResponse {
  body: string
}

export interface MotivoAfectacionDetalleResponse {
  id: number;
  motivoDeAfectacion: string;
  relacionServicio: number[]
  fechaIncorporacion: boolean
  bajaPorCesion: boolean
  afectacionTemporal: boolean
  estado: boolean;
}

export interface MotivoAfectacionUpdateRequest {
  id: number;
  motivoDeAfectacion: string;
  relacionServicio: number[]
  fechaIncorporacion: boolean
  bajaPorCesion: boolean
  afectacionTemporal: boolean
}

export interface MotivoAfectacionActivar {
  id: number
}

export interface MotivoAfectacionDesactivar {
  id: number
  motivo?: string
}