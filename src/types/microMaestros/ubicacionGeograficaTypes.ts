import { PaginacionAPI } from "./GenericTypes";
const ubicacionGeograficaTypes = () => {
    return null;
}

export default ubicacionGeograficaTypes

// MODELO GENERAL
export interface PaginatedRequest {
    pageNumber?: number
    pageSize?: number
}



export interface UbicacionesGridData {
    id: number
    pais: string
    paisId: number | null
    provincia: string
    provinciaId: number | null
    localidad: string
    localidadId: number | null
    codigoPostalCodigo: string
    estado: string
}

export interface UbicacionEditar {
    pais: string
    paisId: number
    paisEstado: boolean
    provincia?: string
    provinciaId?: number
    provinciaEstado?: boolean
    cantidadProvincias?: number
    localidad?: string
    localidadId?: number
    localidadEstado?: boolean
    cantidadLocalidades?: number
}



export interface UbicacionGeograficaAPI {
    paisId: number,
    paisNombre: string,
    paisEstado: boolean,
    provinciaId: number,
    provinciaNombre: string,
    provinciaEstado: boolean,
    localidadId: number,
    localidadNombre: string,
    localidadEstado: boolean,
    codigoPostalId: number,
    codigoPostalCodigo: string
}

export interface ProvinciaApiCentrosFisicos {
    id: number;
    isoName: string;
    isoCode: string;
    paisId: number;
    estado: boolean;
    cantidadLocalidades?: number;
}


export interface PaisAPI {
    id: number
    nombre: string
}

export interface ProvinciaAPI {
    id: number
    nombre: string
}

export interface LocalidadAPI {
    id: number
    nombre: string
}
export interface CodigoPostalAPI {
    id: number
    codigo: string
    localidadId: number
}

// REQUESTS Y RESPONSES
export interface UbicacionesGeograficasFiltradasRequest extends PaginatedRequest {
    paisId?: number | null
    provinciaId?: number | null
    localidadId?: number | null
    codigoPostalId?: number | null
    estado?: boolean | null
    sortBy?: string 
    orderAsc?: boolean | null
}

export interface UbicacionesGeograficasFiltradasResponse {
    paginationData: PaginacionAPI
    data: UbicacionGeograficaAPI[]
}

export interface ListaPaisesRequest extends PaginatedRequest {
    nombre?: string
    estado?: boolean
}

export interface ListaPaisesResponse {
    paginationData: PaginacionAPI
    data: PaisAPI[]
}

export interface ListaProvinciasRequest extends PaginatedRequest {
    nombre?: string
    estado?: boolean
}

export interface ListaProvinciasResponse {
    paginationData: PaginacionAPI
    data: ProvinciaAPI[]
}

export interface ListaLocalidadesRequest extends PaginatedRequest {
    nombre?: string
    estado?: boolean
}

export interface ListaCodigosPostalesRequest extends PaginatedRequest {
    nombre?: string
    estado?: boolean
}


export interface ListaLocalidadesResponse {
    paginationData: PaginacionAPI
    data: LocalidadAPI[]
}

export interface ListaCodigosPostalesResponse {
    paginationData: PaginacionAPI
    data: CodigoPostalAPI[]
}


export interface PaisPorIdRequest {
    id: number
}

export interface PaisPorIdResponse {
    id: number
    isoName: string
    isoAlpha2: string
    isoAlpha3: string
    estado: boolean
    cantidadProvincias: number
}

export interface ProvinciaPorIdRequest {
    id: number
}

export interface ProvinciaPorIdResponse {
    id: number
    isoName: string
    isoCode: string
    paisId: number
    estado: boolean
    cantidadLocalidades: number
}

export interface LocalidadPorIdRequest {
    id: number
}

export interface LocalidadPorIdResponse {
    id: number
    nombre: string
    provinciaId: number
    estado: boolean
    cantidadCodigosPostales: number
}

export interface CodigoPostalPorIdRequest {
    id: number
}

export interface CodigoPostalPorIdResponse {
    id: number
    codigo: string
    localidadId: string
}


export interface ToggleActivacionRequest {
    paisId?: number
    localidadId?: number
    provinciaId?: number
}

export interface ToggleActivacionResponse {
    error?: string
    isSuccess?: boolean
    status?: number
    type?: string
    title?: string
}
