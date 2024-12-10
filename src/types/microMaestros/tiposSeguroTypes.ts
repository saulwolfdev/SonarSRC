import { PaginacionAPI } from "./GenericTypes";
export interface TiposSeguroGridData {
    id: number;
    codigo: string;
    nombre: string;
    estado: boolean;
  }
  

  export interface TiposSeguroFiltradoRequest {
    codigo?: string;
    nombre?: string;
    estado?: boolean;
    sortBy?: string;
    orderAsc?: boolean | null;
    pageNumber?: number;
    pageSize?: number;
  }
  
  export interface TiposSeguroAPI {
    id: number;
    codigo: string;
    nombre: string;
    estado: boolean;
  }
  
  export interface TiposSeguroFiltradosResponse {
    paginationData: PaginacionAPI;
    data: TiposSeguroAPI[];
  }


  
  export interface TiposSeguroCreate {
    nombre: string;
    estado: boolean;
  }
  
  export interface TiposSeguroUpdate extends TiposSeguroCreate {
    id: number;
  }
   
  const dummy = () => {console.log('...')}; // dummy function for export default

export default dummy