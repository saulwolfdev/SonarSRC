import { PaginacionAPI, PaginatedRequest } from "./GenericTypes";

export const URLBaseAreas = 'https://localhost:7052/api/v1'

const AreasTypes = () => {
    return null;
  }
  
  export default AreasTypes

  export interface NameGridData {
    id: number;
    codigo: number;
    nombre: string;
    estado: string;
  }

export interface AreasAPI {
    id: number;
    codigo: number;
    nombre: string;
    estado: string;
}

export interface CodigoAPI{
    id:number
    codigo:string
}

export interface NombreAPI{
    id:number
    nombre:string
}


// REQUESTS Y RESPONSES
export interface AreasFiltradasRequest extends PaginatedRequest {
    id?: number | null
    nombre?: string | null
    estado?: boolean | null
    sortBy?: string 
    orderAsc?: boolean | null

}

export interface AreasFiltradasResponse {
    paginationData: PaginacionAPI
    data: AreasAPI[]
}

export interface ListaCodigoRequest extends PaginatedRequest {
    codigo?:number,
}

export interface ListaNombreRequest extends PaginatedRequest {
    nombre?:string
}


export interface ListaResponse {
    paginationData: PaginacionAPI
    data: NombreAPI[]
}



export interface AreasCreateRequest {
    nombre: string
}
export interface ExpSeguros {
    nombre: string
}

export interface AreasCreateResponse {
        type: string,
        title: string,
        status: number,
        detail: string,
        traceid: string
}

export interface AreasUpdateRequest{
    id: number,
    nombre: string
}
export interface AreasUpdateResponse {
    type: string,
    title: string,
    status: number,
    detail: string,
    traceId: string
}

// GET BY ID

export interface AreasByIdRequest{ 
    id:number
}

export interface AreasResponse {
    id: number;
    nombre: string;
    estado: boolean;
  }

export interface AreasDetalleResponse {
    id: number;
    nombre: string;
    cantidadRegistros: number;
    estado: boolean;
}

export interface AreasCargaMasivaRequest {
    FileContent: File;
  }

export interface AreasCargaMasivaResponse {
    cargaMasivaId: number;
    cantFuncionesCreadas: number;
    cantErrores: number;
    funcionesCreadas: string[];
    errores: string[];
}
  