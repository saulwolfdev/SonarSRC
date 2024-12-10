import { PaginacionAPI } from "./GenericTypes";

const MotivoRechazoObjecionAfectacionTypes = () => {
  return null;
};

export default MotivoRechazoObjecionAfectacionTypes;

export interface MotivoRechazoObjecionAfectacionGridData {
  id: number;
  nombre: string;
  descripcion: string;
  objecion: boolean;
  rechazo: boolean;
  estado: boolean;
}

// GET BY ID
// sirve tambien para hacer cambio de estado
export interface MotivoRechazoObjecionAfectacionByIdRequest {
  id: number;
}
//ss DTO
export interface MotivoRechazoObjecionAfectacionDetalleResponse {
  codigo: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
  objecion: boolean;
  rechazo: boolean;
}

// Desactivar
export interface DesactivarMotivoRechazoObjecionAfectacionRequest {
  id: number;
  motivo?: string;
}

// GET ALL
//ss GetDTO
export interface MotivoRechazoObjecionAfectacionFiltradasRequest {
  // filtros
  codigo?: number;
  nombre?: string;
  estado?: boolean;
  objecion?: boolean;
  rechazo?: boolean;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  orderAsc?: boolean | null;
}
//ss response
export interface MotivoRechazoObjecionAfectacionAPI {
  codigo: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
  objecion: boolean;
  rechazo: boolean;
}

export interface MotivoRechazoObjecionAfectacionFiltradasResponse {
  paginationData: PaginacionAPI;
  data: MotivoRechazoObjecionAfectacionAPI[];
}

// PUT
export interface MotivoRechazoObjecionAfectacionUpdate {
  id: number;
  nombre?: string;
  descripcion?: string;
  rechazo?: boolean;
  objecion?: boolean;
}

// POST
export interface MotivoRechazoObjecionAfectacionCreate {
  nombre: string;
  descripcion: string;
  rechazo?: boolean;
  objecion?: boolean;
}
