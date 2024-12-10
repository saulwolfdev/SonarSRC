export interface MotivoBloqueoGridData {
  id: number; 
  codigoOrigen: string;
  nombre: string;
  origenNombre: string;
  origenId: string;
  enviaNotificacion: boolean;
  enviaComunicacionFormal: boolean;
}


export interface MotivoBloqueoFiltradoRequest {
  codigoOrigen?: string;
  origenId?: number;
  enviaNotificacion?: boolean;
  enviaComunicacionFormal?: boolean;
  nombre?: string;
  origen?: string;
  sortBy?: string;
  orderAsc?: boolean | null;
  pageNumber?: number;
  pageSize?: number;
}

export interface PaginacionAPI {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
