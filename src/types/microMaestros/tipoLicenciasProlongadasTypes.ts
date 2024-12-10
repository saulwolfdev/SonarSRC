import { PaginacionAPI } from "./GenericTypes";
const TipoLicenciasProlongadasTypes = () => {
    return null;
  }
  
export default TipoLicenciasProlongadasTypes

export const URLBaseClasificacionTipoLicenciasProlongadas = 'https://localhost:7052/api/v1'
  
export interface TipoLicenciasProlongadasGridData {
    id: number
    nombre: string
    estado: boolean;
}




// GET BY ID

// sirve tambien para hacer cambio de estado
export interface TipoLicenciasProlongadasByIdRequest{ 
    id:number
}

export interface TipoLicenciasProlongadasDetalleResponce {
    id: number
    nombre: string
    estado: boolean
    cantidadRecursosAfectados: number;
}



// GET ALL 

export interface TipoLicenciasProlongadasFiltradasRequest { 
    codigo?: number
    nombre?: string
    estado?: boolean
    pageNumber?:number
    pageSize?:number
    sortBy?: string 
    orderAsc?: boolean | null
}

export interface TipoLicenciasProlongadasAPI {
    id: number
    nombre: string
    estado: boolean

  }

export interface TipoLicenciasProlongadasFiltradasResponse {
    paginationData: PaginacionAPI
    data: TipoLicenciasProlongadasAPI[]
}

// PUT

export interface TipoLicenciasProlongadasUpdate{
    id: number
    nombre: string
  }


// POST

export interface TipoLicenciasProlongadasCreate{
    nombre: string
}


export interface TipoLicenciasProlongadasCreateUpdateFormik{
    nombre: string
}

export interface DesactivarConMotivoRequest {
    id: number
    motivo: string
}