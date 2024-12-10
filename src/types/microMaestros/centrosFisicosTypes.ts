import { PaginacionAPI } from "./GenericTypes";

const CentroFisicoTypes = () => {
    return null;
  }
  
export default CentroFisicoTypes

import { ClasificacionCentroFisicoAPI } from "./clasificacionCentrosFisicosTypes";
import { ProvinciaApiCentrosFisicos } from "./ubicacionGeograficaTypes";

export const URLBaseClasificacionCentroFisico = 'https://localhost:7052/api/v1'

  
export interface CentroFisicoGridData {
    id: number;
    nombre: string;
    clasificacion: string;
    provincia: string;
    estado: boolean;
}




// GET BY ID

// sirve tambien para hacer cambio de estado
export interface CentroFisicoByIdRequest{ 
    id:number
}

export interface CentroFisicoDetalleResponce {
    id: number;
    nombre: string;
    estado: boolean;
    clasificacion: ClasificacionCentroFisicoAPI;
    provincia: ProvinciaApiCentrosFisicos;
    cantidadRecursosAfectados: number;
}



// GET ALL 

export interface CentrosFisicosFiltradasRequest { // filtros que crea Facu
    nombre?: string
    estado?: boolean
    provinciaId?: number;
    clasificacionId?: number;
    pageNumber?:number
    pageSize?:number
    sortBy?: string 
    orderAsc?: boolean | null
}

export interface CentroFisicoAPI {
    id : number; 
    nombre: string; 
    estado : boolean; 
    clasificacionId : number; 
    clasificacionNombre : string; 
    clasificacionEstado : boolean; 
    provinciaId : number; 
    provinciaNombre : string; 
    provinciaEstado : boolean; 
}

export interface CentroFisicoFiltradasResponse {
    paginationData: PaginacionAPI
    data: CentroFisicoAPI[]
}

// PUT

export interface CentroFisicoUpdate{
    id: number;
    nombre?: string;
    provinciaId?: number;
    clasificacionId?: number;
}
// la response es un status


// POST

export interface CentroFisicoCreate{
    nombre?: string;
    provinciaId?: number;
    clasificacionId?: number;
    estado?	: boolean;
}

// la response es un status
