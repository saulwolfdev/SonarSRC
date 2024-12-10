import { PaginacionAPI } from "./GenericTypes";
const MotivoDelegacionTypes = () => {
    return null;
  }
  
export default MotivoDelegacionTypes

export const URLBaseClasificacionMotivoDelegacion = 'https://localhost:7052/api/v1'
  
export interface MotivoDelegacionGridData {
    id: number
    nombreMotivo: string
    observacionObligatoria: boolean
    tiempoLimite: number
    estado: boolean;
}




// GET BY ID

// sirve tambien para hacer cambio de estado
export interface MotivoDelegacionByIdRequest{ 
    id:number
}

export interface MotivoDelegacionDetalleResponce {
    id: number
    nombreMotivo: string
    observacionObligatoria: boolean
    tiempoLimite: number  
    estado: boolean
    cantidadRecursosAfectados: number;
}



// GET ALL 

export interface MotivoDelegacionFiltradasRequest { 
    codigo?: number
    nombreMotivo?: string
    observacionObligatoria?: boolean
    tiempoLimite?: number
    estado?: boolean
    pageNumber?:number
    pageSize?:number
    sortBy?: string 
    orderAsc?: boolean | null
}

export interface MotivoDelegacionAPI {
    id: number
    nombreMotivo: string
    observacionObligatoria: boolean
    tiempoLimite: number
    estado: boolean

  }

export interface MotivoDelegacionFiltradasResponse {
    paginationData: PaginacionAPI
    data: MotivoDelegacionAPI[]
}

// PUT

export interface MotivoDelegacionUpdate{
    id: number
    nombreMotivo: string
    observacionObligatoria: boolean
    tiempoLimite: number
  }


// POST

export interface MotivoDelegacionCreate{
    nombreMotivo: string
    observacionObligatoria?: boolean
    tiempoLimite: number
}


export interface MotivoDelegacionCreateUpdateFormik{
    nombreMotivo: string
    observacionObligatoria?: boolean
    tiempoLimite: number
}