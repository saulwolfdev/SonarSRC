import { PaginacionAPI } from "./GenericTypes";

const CausaDesafectacionTypes = () => {
    return null;
  }
  
export default CausaDesafectacionTypes

  
export interface CausaDesafectacionGridData {
    id: number;
    nombre: string;
    descripcion: string;
    desafectaTodosLosContratos: boolean;
    reemplazoPersonal: boolean;
    estado: boolean;
}




// GET BY ID

// sirve tambien para hacer cambio de estado
export interface CausaDesafectacionByIdRequest{ 
    id:number
}

export interface CausaDesafectacionDetalleResponce {
    codigo: number;
    nombre: string;
    descripcion: string;
    desafectaTodosLosContratos: boolean;
    reemplazoPersonal: boolean;
    estado: boolean,
}



// GET ALL 

export interface CausasDesafectacionesFiltradasRequest { // filtros que crea Facu
    nombre?: string
    estado?: boolean
    codigo?: number;
    desafectaTodosLosContratos?: boolean;
    reemplazoPersonal?: boolean;
    pageNumber?:number
    pageSize?:number
    sortBy?: string 
    orderAsc?: boolean | null
}

export interface CausaDesafectacionAPI {
    codigo: number;
    nombre: string;
    descripcion: string;
    desafectaTodosLosContratos: boolean;
    reemplazoPersonal: boolean;
    estado: boolean;
}

export interface CausaDesafectacionFiltradasResponse {
    paginationData: PaginacionAPI
    data: CausaDesafectacionAPI[]
}

// PUT

export interface CausaDesafectacionUpdate{
    id: number;
    nombre?: string;
    descripcion?: string;
    desafectaTodosLosContratos?: boolean;
    reemplazoPersonal?: boolean;
    estado: boolean
}


// POST

export interface CausaDesafectacionCreate{
    nombre: string;
    descripcion: string;
    desafectaTodosLosContratos: boolean;
    reemplazoPersonal: boolean;
}

// desactivar
export interface CausaDesafectacionDesactivarRequest{ 
    id:number
    motivo: string
}