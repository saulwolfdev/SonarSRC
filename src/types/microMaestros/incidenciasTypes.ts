import { PaginacionAPI } from "./GenericTypes";
export interface IncidenciasGridData {
  codigo: number;
  nombre: string;
  tipo: string; // "Default" o "MOP"
  tipoIncidencia: string;
}
  
  export interface IncidenciasPagination {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }
  
  // Parámetros para la solicitud de incidencias con paginación
  export interface IncidenciasFiltradasRequest {
    nombre?: string;
    tipo?: string;  // "Default" o "MOP"
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;  // Código, Nombre, Tipo
    orderAsc?: boolean | null;
  }
  
  // Respuesta de la API al listar incidencias
  export interface IncidenciasFiltradasResponse {
    paginationData: IncidenciasPagination;
    data: IncidenciasGridData[];
  }
  
  // Parámetros para la solicitud de incidencia específica por ID
  export interface IncidenciaByIdRequest {
    id: number;
  }
  
  // Respuesta detallada de una incidencia específica
  export interface IncidenciaDetalleResponse {
    id: number;
    nombre: string;
    tipoIncidencia: string;
    estado: boolean;
  }
  
  // Parámetros para crear una nueva incidencia
  export interface IncidenciaCreate {
    nombre: string;
    tipo: string;  // "Default" o "MOP"
  }
  
  // Parámetros para actualizar una incidencia existente
  export interface IncidenciaUpdate {
    id: number;
    nombre: string;
    tipo: string;  // "Default" o "MOP"
  }
  
  export interface Incidencia {
    codigo: number;
    nombre: string;
    tipo: string;
  }
  
  export interface IncidenciasPagination {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }
  
  export interface IncidenciasFiltradasRequest {
    id?: number;
    nombre?: string;
    tipo?: string;
    estado?: boolean;
    sortBy?: string;
    orderAsc?: boolean | null;
    pageNumber?: number;
    pageSize?: number;
  }
  
  export interface IncidenciasFiltradasResponse {
    paginationData: IncidenciasPagination;
    data: IncidenciasGridData[];
  }