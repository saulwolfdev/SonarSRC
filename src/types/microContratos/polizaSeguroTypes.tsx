import { DateView } from "@mui/x-date-pickers/models"
import internal from "stream"
import { PaginacionAPI } from "./GenericTypes"

const polizaSeguroType = () => {
    return (
        null
    )
}

export default polizaSeguroType

// GRILLA
//ss sortby listo
export interface PolizaSeguroGridData { //lo que necesito para la grilla
    id: number,
    //VALEN: aca cuando es una tabla , no se usa dtos
    contratista: string // ContratistaAcotadoAPI 
    numero: string
    tipoSeguro: string // TipoSeguroAPI 
    companiaAseguradora: string //  CompaniaAseguradoraAPI 
    cuitCompaniaAseguradora: number
    vigencia: Date
    estado: boolean
    //cantidadRecursosAfectados: number // chequear con lu ss
}

export interface IdOptionCompaniaAseguradora {
    id: number;
    nombre: string;
    cuit: string;
    observacion: string
}
// GET BY ID

// sirve tambien para hacer cambio de estado
export interface PolizaSeguroByIdRequest {
    id: number
}

export interface PolizaSeguroResponse { //PolizaSeguroDTO 
    id: number
    numero: string
    vigencia: Date
    estado: boolean
    tipoSeguro: TipoSeguroAPI
    companiaAseguradora: CompaniaAseguradoraAPI
    contratista: ContratistaAcotadoAPI
    edicionTotal: boolean
}

export interface TipoSeguroAPI {
    id: number,
    nombre: string,
    estado: boolean
}
export interface CompaniaAseguradoraAPI {
    id: number,
    nombre: string,
    estado: boolean
    observacion: string,
    cuit: number
}
export interface ContratistaAcotadoAPI {
    id: number,
    razonSocial: string,
    estado: boolean
}

// GET ALL 
//request
export interface PolizaSeguroFiltradoRequest {  // sirve para el excel //lo que necesito para filtros //okokss GetPaginatedPolizasSeguroDTO 
    //contratistaId?: string //ContratistaDTO 
    numero?: string
    vencido?: boolean
    estado?: boolean
    razonSocialContratista?: string
    nombreTipoSeguro?: string
    nombreCompaniaAseguradora?: string
    contratistaId?: number
    sortBy?: string
    orderAsc?: boolean | null
    pageNumber?: number
    pageSize?: number
}

//response
export interface PolizaSeguroAPI { //lo que dice el DTO //okokss ////PolizasSeguroResponseDTO : PaginatedResponse 
    id: number
    numero: string
    vigencia: Date
    estado: boolean
    razonSocialContratista?: string
    nombreTipoSeguro: string
    nombreCompaniaAseguradora: string
    cuitCompaniaAseguradora: string
}

export interface PolizaSeguroFiltradoResponse {
    paginationData: PaginacionAPI
    data: PolizaSeguroAPI[]
}

export interface CantidadRecursosAfectados {
    cantidad: number
}

/*desactivar con motivo*/
export interface DesactivarPolizaSeguro {
    id: number;
    motivo: string;
}

/*activar*/
export interface ActivarPolizaSeguro {
    id: number;
}

// PUT
export interface PolizaSeguroUpdate {
    id: number
    numero?: string
    vigencia?: Date
    companiaAseguradoraId?: number
    tipoSeguroId?: number
}

// POST
export interface PolizaSeguroCreate {
    numero: string
    vigencia?: Date // pongo el ? para que arranque como undefined para que el yup obligue a cargar una fecha
    tipoSeguroId: number
    companiaAseguradoraId: number
    contratistaId?: number
}

