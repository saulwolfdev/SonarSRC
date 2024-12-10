import { ReferenteAPI } from "./ReferentesTypes";
import { PaginacionAPI } from "./GenericTypes";

const SedesTypes = () => {
  return (
    null
  )
}

export default SedesTypes

export interface SedeConReferentesAPI {
    id: number;
    estudioID: number;
    nombre: string;
    provinciaId: number;
    localidadId: number;
    codigoPostalId: number;
    calle: string;
    nroCalle: number;
    piso: string;
    departamento: string;
    telefonoPrincipal: string;
    telefonoAlternativo: string;
    email: string;
    diaYHorario: string;
    estado: boolean;
    referentes: ReferenteAPI[];
  }
  
  
  export interface SedesGridData {
      id?: number
      codigoEstudioAuditor?: number
      codigoSede?: number
      nombreSede: string
      telefono?: string
      provincia?: string
      localidad?: string
      calle?: string
      numbero?: number
      pisodepto?: string
      estado?: boolean
  }
  
  export interface SedeFiltradoRequest {
    id?: number
    codigoEstudioAuditor?: number
    codigoSede?: number
    nombreSede?: string
    nombreEstudioAuditor?: string
    telefono?: number
    provincia?: string
    localidad?: string
    calle?: string
    numbero?: number
    pisodepto?: string
    estado?: boolean
    sortBy?: string 
    orderAsc?: boolean | null
    pageNumber?:number
    pageSize?:number
  }
  
  export interface SedeUpdateRequest {
    id: number;
    nombre: string;
    provinciaId: number;
    localidadId: number;
    codigoPostalId: number;
    calle: string;
    nroCalle: number;
    piso?: string;
    departamento?: string;
    telefonoPrincipal: string;
    telefonoAlternativo?: string;
    email: string;
    diaYHorario: string;
  }
  export interface SedeDetalleResponse {
    id: number;
    estudioID: number;
    nombre: string;
    provinciaId: number;
    localidadId: number;
    codigoPostalId: number;
    calle: string;
    nroCalle: number;
    piso?: string;
    departamento?: string;
    telefonoPrincipal?: string | null;
    telefonoAlternativo?: string;
    email: string;
    diaYHorario: string;
    estado: boolean;
    referentes: ReferenteAPI[];
  }
  
  export interface SedeAPI {
    id?: number
    estudioID: number
    nombre?: string
    provinciaId?: string
    localidadId?: string
    codigoPostalId?: number
    calle?: string
    nroCalle?: number
    piso?: string
    departamento?: string
    telefonoPrincipal?: string
    telefonoAlternativo?: string
    email?: string
    diaYHorario?: string
    estado?: boolean
  }
  
  export interface SedeFiltradoResponse {
    paginationData: PaginacionAPI
    data: SedeAPI[]
  }
  
  export interface SedeCreateRequest {
    estudioAuditorId: number;
    nombreSede: string;
    codigoPostalId: number;
    calle: string;
    nroCalle: number;
    piso: string;
    departamento: string;
    telefonoPrincipal: string;
    telefonoAlternativo?: string;
    emailSede?: string;
    diaYHorario?: string;
    nombreReferente: string;
    usuarioEPID?: number | null;
    emailReferente: string;
    rolEspecialidad: string;
  }
  
  export interface SedeCreateResponse {
    body: string
  }
  
  