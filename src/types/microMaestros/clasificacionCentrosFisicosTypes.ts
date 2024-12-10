export const URLBaseClasificacionCentroFisico = 'https://localhost:7052/api/v1'
import { PaginacionAPI } from "./GenericTypes";

const clasificacionCentrosFisicosTypes = () => {
    return null;
  }
  
  export default clasificacionCentrosFisicosTypes
  

export interface ClasificacionCentroFisicoGridData {
    id: number;
    nombre: string;
    estado: boolean;
}




// GET BY ID

// sirve tambien para hacer cambio de estado
export interface ClasificacionCentroFisicoByIdRequest{ 
    id:number
}

export interface ClasificacionCentroFisicoDetalleResponce {
    id: number;
    nombre: string;
    cantidadCentrosFisicos: number;
    estado: boolean;
}


// GET ALL 

export interface ClasificacionesCentrosFisicosFiltradasRequest { // filtros que crea Facu
    nombre?: string
    estado?: boolean
    pageNumber?:number
    pageSize?:number
    sortBy?: string 
    orderAsc?: boolean | null
}

export interface ClasificacionCentroFisicoAPI {
    id: number;
    nombre: string;
    estado: boolean;
}

export interface ClasificacionCentroFisicoFiltradasResponse {
    paginationData: PaginacionAPI
    data: ClasificacionCentroFisicoAPI[]
}

// PUT

export interface ClasificacionCentroFisicoUpdate{
    id: number;
    nombre: string;
   
}
// la response es un status


// POST

export interface ClasificacionCentroFisicoCreate{
    nombre: string;
    estado?	: boolean;
}

// la response es un status
