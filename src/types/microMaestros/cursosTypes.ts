
const CursosTypes = () => {
    return null;
  }
  
export default CursosTypes

export const URLBaseClasificacionCursos = 'https://localhost:7052/api/v1'
  
export interface CursosGridData {
    id: number
    nombre: string;
    especialidad: string;
    institucion: string;
    areaSolicitante:string;
    modalidad:string;
    horas: number;
    estado: boolean;
}

export interface PaginacionAPI {
    totalCount: number
    pageNumber: number
    pageSize: number
    totalPages: number
}


// GET BY ID

// sirve tambien para hacer cambio de estado
export interface CursosByIdRequest{ 
    id:number
}

export interface CursosDetalleResponce {
    id: number
    nombre: string;
    especialidad: string;
    institucion: string;
    areaSolicitante:string;
    modalidad: ModalidadAPI;
    horas: number;
    estado: boolean
    cantidadRecursosAfectados: number;
}

export interface IdOption {
    id: number;
    label: string;
}

// GET ALL 

export interface CursosFiltradasRequest { 
    codigo?: number;
    nombre?: string;
    especialidad?: string;
    institucion?: string;
    areaSolicitante?:string;
    modalidad?:string;
    horas?: number;
    estado?: boolean
    pageNumber?:number
    pageSize?:number
    sortBy?: string 
    orderAsc?: boolean | null
}

export interface CursosAPI {
    id: number
    nombre: string;
    especialidad: string;
    institucion: string;
    areaSolicitante:string;
    modalidad:string;
    horas: number;
    estado: boolean

  }

export interface CursosFiltradasResponse {
    paginationData: PaginacionAPI
    data: CursosAPI[]
}

// PUT

export interface CursosUpdate{
    id: number
    nombre: string;
    especialidad: string;
    institucion: string;
    areaSolicitante:string;
    modalidadId:number;
    horas: number;
  }


// POST

export interface CursosCreate{
    nombre: string;
    especialidad: string;
    institucion: string;
    areaSolicitante:string;
    modalidadId:number;
    horas: number;
}


export interface CursosCreateUpdateFormik{
    nombre: string;
    especialidad: string;
    institucion: string;
    areaSolicitante:string;
    modalidadId:number;
    horas: number;
}

export interface DesactivarConMotivoRequest {
    id: number
    motivo: string
}

export interface PaginatedRequest {
    pageNumber?: number
    pageSize?: number
}

export interface ListaModalidadRequest extends PaginatedRequest {
    nombre?: string
    estado?: boolean
}

export interface ListaModalidadResponse {
    paginationData: PaginacionAPI
    data: ModalidadAPI[]
}

export interface ModalidadAPI {
    id:number,
    nombre: string
}