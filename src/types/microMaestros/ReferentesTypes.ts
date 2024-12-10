import { PaginacionAPI } from "./GenericTypes";

const ReferentesTypes = () => {
  return (
    null
  )
}

export default ReferentesTypes


export interface ReferenteCreateRequest {
    sedeId: number;
    nombre: string;
    usuarioEPID: number;
    email: string;
    rolEspecialidad: string;
  }
  
  export interface ReferenteCreateResponse {
    body: string
  }
  
  
  export interface ReferenteChange {
    id: number
  }
  export interface ReferenteDetalleResponse {
    id: number;
    sedeId: number;
    usuarioEPId: number;
    nombre: string;
    email: string;
    rolEspecialidad: string;
    estado: boolean;
  }
  

export interface ReferenteUpdateRequest {
    id: number;
    usuarioEPId: number;
    nombre: string;
    email: string;
    rolEspecialidad: string;
  }
  
  
  export interface ReferentesGridData {
    id?: number
    usuarioEPID?: number
    nombreReferente?: string
    emailReferente?: string
    rolReferente?: string
    estado?: boolean
  }
  
  export interface ReferenteFiltradoRequest {
    id?: number
    nombreSede?: string
    nombreEstudioAuditor?: string
    codigoReferente?: number
    codigoSede?: number
    usuarioEPID?: number
    nombreReferente?: string
    emailReferente?: string
    rolReferente?: string
    estado?: boolean
    sortBy?: string 
    orderAsc?: boolean | null
    pageNumber?:number
    pageSize?:number
  }
  
  export interface ReferenteAPI {
    id?: number
    usuarioEPId?: number
    nombre?: string
    email?: string
    rolEspecialidad?: string
    estado?: boolean
  }
  
  export interface ReferenteFiltradoResponse {
    paginationData: PaginacionAPI
    data: ReferenteAPI[]
  }
  