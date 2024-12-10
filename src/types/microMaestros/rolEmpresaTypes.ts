import { PaginacionAPI } from "./GenericTypes";
export interface RolEmpresaGridData {
  id: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

export interface RolEmpresaCreate {
  nombre: string;
  descripcion: string;
  estado: boolean;
}

export interface RolEmpresaUpdate extends RolEmpresaCreate {
  id: number;
}

export interface RolEmpresaAPI {
  id: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

export interface RolEmpresaFiltradoRequest {
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  estado?: boolean;
  sortBy?: string;
  orderAsc?: boolean | null;
  pageNumber?: number;
  pageSize?: number;
}

export interface RolEmpresaFiltradosResponse {
  paginationData: PaginacionAPI;
  data: RolEmpresaAPI[];
}



const dummy = () => {console.log('...')}; // dummy function for export default

export default dummy