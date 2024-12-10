import { PaginacionAPI } from "./GenericTypes";
import { SedeConReferentesAPI } from "./SedesTypes";

export const URLBaseEstudiosAuditores = 'https://localhost:7052/api/v1'

const estudiosAuditoresTypes = () => {
  return (
    null
  )
}

export default estudiosAuditoresTypes





export interface EstudiosAuditoresGridData {
    id?: number
    nombreEstudioAuditor?: string
    cuit?: string
    estado?: boolean
}

export interface EstudioAuditorFiltradoRequest {
  id?: number 
  nombre?: string 
  estado?: boolean
  cuit?: string
  nombreSede? : string 
  nombreReferente?: string 
  sortBy?: string 
  orderAsc?: boolean | null
  pageNumber?:number
  pageSize?:number
}

export interface EstudioAuditorAPI {
  id?: number 
  nombre?: string 
  estado?: boolean
  cuit?: string
}

export interface EstudioAuditorFiltradoResponse {
  paginationData: PaginacionAPI
  data: EstudioAuditorAPI[]
}

export interface EstudioAuditorCreate {
  id: number;
  nombre: string;
  estado: boolean;
  cuit: string;
  nombreSede: string;
  nombreReferente: string;
}

export interface EstudioAuditorCreateRequest {
  nombreEstudioAuditor: string;
  cuit: string;
  nombreSede: string;
  codigoPostalId: number;
  calle: string;
  nroCalle: number;
  piso: string;
  departamento: string;
  telefonoPrincipal: string;
  telefonoAlternativo?: string;
  emailSede?: string;
  diayhorario?: string;
  nombreReferente: string;
  usuarioEPID?: number | null;
  emailReferente: string;
  rolEspecialidad: string;
}

export interface EstudioAuditorCreateResponse {
  body: string
}

export interface EstudioAuditorDetalleResponse {
  id: number;
  nombre: string;
  estado: boolean;
  cuit: string;
  sedes: SedeConReferentesAPI[];
}

export interface EstudioAuditorUpdateRequest {
  id: number;
  nombre: string;
  cuit: string;
}