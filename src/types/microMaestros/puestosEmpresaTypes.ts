import { PaginacionAPI } from "./GenericTypes";
export interface PaginatedRequest {
  pageNumber?: number;
  pageSize?: number;
}


export interface EstadoOption {
  id: number;
  label: string;
  estado: boolean;
}

export interface PuestoEmpresaGridData {
  id: number;
  nombre: string;
  codigoAfip: string;
  estado: boolean;
}

export interface PuestosEmpresaAPI {
  id: number;
  nombre: string;
  codigoAfip: string;
  estado: boolean;
}

export interface NombreAPI {
  id: number;
  nombre: string;
}

// REQUESTS Y RESPONSES

export interface PuestosEmpresaFiltradosRequest extends PaginatedRequest {
  nombre?: string;
  codigoAfip?: string;
  estado?: boolean;
  sortBy?: string 
    orderAsc?: boolean | null
}

export interface PuestosEmpresaFiltradosResponse {
  paginationData: PaginacionAPI;
  data: PuestosEmpresaAPI[];
}

export interface ListaNombreRequest extends PaginatedRequest {
  nombre?: string;
}

export interface ListaResponse {
  paginationData: PaginacionAPI;
  data: NombreAPI[];
}

export interface PuestoEmpresaCreateRequest {
  nombre: string;
  codigoAfip: string;
}

export interface PuestoEmpresaCreateResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  traceId: string;
}

export interface PuestoEmpresaUpdateRequest {
  id: number;
  nombre: string;
  codigoAfip: string;
}

export interface PuestoEmpresaUpdateResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  traceId: string;
}

// GET BY ID

export interface PuestoEmpresaByIdRequest {
  id: number;
}

export interface PuestoEmpresaDetalleResponse {
  id: number;
  nombre: string;
  codigoAfip: string;
  estado: boolean;
}

export interface PuestoEmpresaCargaMasivaRequest {
  FileContent: File;
}

export interface PuestoEmpresaCargaMasivaResponse {
  cargaMasivaId: number;
  cantPuestosCreados: number;
  cantErrores: number;
  puestosCreados: string[];
  errores: string[];
}

const dummy = () => {console.log('...')}; // dummy function for export default

export default dummy