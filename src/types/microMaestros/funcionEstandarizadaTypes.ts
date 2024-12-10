import { PaginacionAPI, PaginatedRequest } from "./GenericTypes";

export const URLBaseFuncionEstandarizada = 'https://localhost:7052/api/v1'

const funcionEstandarizadaTypes = () => {
    return null;
  }
  
  export default funcionEstandarizadaTypes

export interface NameGridData {
    id: number;
    codigo: number;
    nombre: string;
    estado: string;
  }



export interface FuncionesEstandarizadasAPI {
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
export interface FuncionesEstandarizadasFiltradasRequest extends PaginatedRequest {

    id?: number
    nombre?: string
    estado?: boolean
    pageNumber?:number
    pageSize?:number
    sortBy?: string 
    orderAsc?: boolean | null
}

export interface FuncionesEstandarizadasFiltradasResponse {
    paginationData: PaginacionAPI
    data: FuncionesEstandarizadasAPI[]
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



export interface FuncionEstandarizadaCreateRequest {
    nombre: string
}

export interface FuncionEstandarizadaCreateResponse {
        type: string,
        title: string,
        status: number,
        detail: string,
        traceid: string
}

export interface FuncionEstandarizadaUpdateRequest{
    id: number,
    nombre: string
}
export interface FuncionEstandarizadaUpdateResponse {
    type: string,
    title: string,
    status: number,
    detail: string,
    traceId: string
}

// GET BY ID

export interface FuncionEstandarizadaByIdRequest{ 
    id:number
}

export interface FuncionEstandarizadaResponse {
    id: number;
    nombre: string;
    estado: boolean;
  }

export interface FuncionEstandarizadaDetalleResponse {
    id: number;
    nombre: string;
    cantidadRegistros: number;
    estado: boolean;
}

export interface FuncionEstandarizadaCargaMasivaRequest {
    FileContent: File;
  }

export interface FuncionEstandarizadaCargaMasivaResponse {
    cargaMasivaId: number;
    cantFuncionesCreadas: number;
    cantErrores: number;
    funcionesCreadas: string[];
    errores: string[];
}
  