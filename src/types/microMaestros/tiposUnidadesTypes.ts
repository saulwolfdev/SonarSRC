import { PaginacionAPI } from "./GenericTypes";
export interface TipoUnidadGridData {
    id: number;
    nombre: string;
    tipoRecurso: string;
    estado: boolean;
  }
  
 export interface TipoUnidadCreate {
    nombre: string;
    codigoTipoRecurso: number;
    estado: boolean;
  }
  
  export interface TipoUnidadUpdate extends TipoUnidadCreate {
    id: number;
  }
  
  export interface TipoUnidadAPI {
    id: number;
    nombre: string;
    tipoRecurso: string;
    estado: boolean;
  }
  
  export interface TipoUnidadFiltradoRequest {
    codigo?: string;
    nombre?: string;
    tipoRecurso?: string;
    estado?: boolean;
    sortBy?: string;
    orderAsc?: boolean | null;
    pageNumber?: number;
    pageSize?: number;
  }
  
  export interface TipoUnidadFiltradosResponse {
    paginationData: PaginacionAPI;
    data: TipoUnidadAPI[];
  }
  
  export interface TipoRecurso {
    codigo: number;
    nombre: string;
  }

  const dummy = () => {console.log('...')}; // dummy function for export default

  export default dummy  