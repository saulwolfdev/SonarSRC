import { PaginacionAPI } from "./GenericTypes";

export const URLPersonaEventual = 'https://www.argentina.gob.ar/trabajo/fiscalizacion/diplomas?';
export const URLEmpresaConstruccion = 'https://www.ieric.org.ar:7443/consultaC.aspx';

const contratistasTypes = () => {
  return (
    null
  )
}

export default contratistasTypes

//grid
export interface ContratistasGridData {
  id: number,
  numeroIdentificacion: number,
  razonSocial: string,
  paisNombre: string,
  emailContactoComercial: string,
  origen: string,
  estudioNombre: string,
  sedeNombre: string,
  estado: boolean,
  fechaCreacion: Date
}


//get all
export interface ContratistasFiltradosRequest {
  pageNumber?: number;
  pageSize?: number;
  numeroIdentificacion?: number;
  razonSocial?: string;
  paisId?: number;
  emailContactoComercial?: string;
  origenId?: number;
  estadoBloqueoId?: number; 
  estado?: boolean; 
  fechaCreacion?: Date;
  sortBy?: string;
  orderAsc?: boolean;
}


export interface ContratistaAPI {
  id: number,
  numeroIdentificacion: string,
  razonSocial: string,
  paisId: number,
  paisNombre: string,
  emailContactoComercial: string,
  origen: string,
  estudioAuditorId: number,
  estudioNombre: string,
  sedeId: number,
  sedeNombre: string,
  estado: true,
  fechaCreacion: Date 
}

export interface ContratistasFiltradosResponse {
  paginationData: PaginacionAPI;
  data: ContratistaAPI[];
}

// get by id
export interface ContratistasByIdRequest {
  id: number
}
export interface ContratistaDetalleResponse { 
  id: number,
  razonSocial: string,
  numeroIdentificacion: number,
  ubicacionId: number,
  ubicacion: {
    codigoPostalNombre: string,
    codigoPostalId: number,
    localidadNombre: string,
    localidadId: number,
    provinciaNombre: string,
    provinciaId: number,
    paisNombre: string,
    paisId: number

  },
  nroCalle: number,
  calle: string,
  piso: number,
  departamento: number,
  telefono: number,
  emailContactoComercial: string,
  nombreContactoComercial: string,
  empresaConstruccion: boolean,
  nroIERIC: string,
  empresaEventual: boolean,
  estado: boolean,
  bloqueado: boolean,
  origen: {
      id: number,
      nombre: string,
      codigo: null
    },
  empresaPromovida: boolean,
  motivoEmpresaPromovida: string,
  codigoProveedorSAP: number,
  politicaDiversidad: boolean,
  linkPoliticaDiversidad: string,
  estudioContratistaId: number, 
  estudioAuditor: {
    id: number,
    nombre: string
  },
  sede: {
    id: number,
    nombre: string
  },
  estadoBloqueo: {
    id: number,
    nombre: string
  },
  motivoDesbloqueo: string,
  motivosBloqueo: [
    {
      motivoBloqueo: {
        id: number,
        nombre: string
      },
      contratistaId: number,
      activo: true
    }
  ],
  fechaCreacion: Date
  fechaInicioDesbloqueo: Date,
  fechaFinalizacionDesbloqueo: Date,

}

// post

export interface ContratistaCreate {
  razonSocial: string;
  numeroIdentificacion: string | null;
  telefono: number | null;
  codigoPostalId: number | null;
  localidadId: number | null;
  provinciaId: number | null;
  paisId: number | null;
  calle: string;
  nroCalle: number | null;
  piso: number | null;
  departamento: number | null;
  nombreContactoComercial: string;
  emailContactoComercial: string;
  empresaEventual: boolean;
  empresaPromovida: boolean;
  empresaConstruccion: boolean;
  nroIERIC: string;
  codigoSAP: number | null;
}

// put

export interface ContratistaUpdate {
  id: number,
  razonSocial: string; 
  numeroIdentificacion: number | null;  // todo
  telefono: number | null;
  codigoPostalId: number | null; 
  codigoPostalNombre: string | null;  // todo
  localidadId: number | null; 
  localidadNombre: string; 
  provinciaId: number | null; 
  provinciaNombre: string; 
  paisId: number | null; 
  paisNombre: string; 
  calle: string; 
  nroCalle: number | null; 
  piso: number | null; 
  departamento: number | null; 
  nombreContactoComercial: string; 
  emailContactoComercial: string; 
  empresaEventual: boolean;
  empresaConstruccion: boolean;
  nroIERIC: string | null;
  codigoSAP: number | null; 
  politicaDiversidad: boolean;
  linkPoliticaDiversidad: string;
  empresaPromovida: boolean;
  motivoEmpresaPromovida: string | null;
  estudioAuditorId: number | null;
  sedeId: number | null;
  estadoBloqueoId: number; // Bloqueado -- Desbloqueado -- Desbloqueado exceptuado -- Desbloqueado transitorio
  fechaInicioDesbloqueo: Date | null;
  fechaFinalizacionDesbloqueo: Date | null;
  motivoBloqueoIds?: number[]
  motivoDesbloqueo?: string

}

/*activar*/
export interface ActivarContratista {
  id: number;
}

/*desactivar con motivo*/
export interface DesactivarContratista {
  id: number;
  motivo: string;
}

// carga masiva
export interface ContratistasCargaMasivaResponse {
  id: number;
  cantidadCreados: number;
  cantidadErrores: number;
  errores: ErroresCarga[];
}

interface ErroresCarga{ 
    mensajeError: string,
    nombre: string,
    codigoAfip: string // todo cambiar 
}

// bloqueos

export interface EstadoBloqueoResponse{

  id: number
  nombre: string

}

export interface  EstadosBloqueosRequest{
  id?: number
  nombre?: string
}
export interface  EstadosBloqueosResponse{
  estadosBloqueo : EstadoBloqueoResponse[]
}

export const EstadoBloqueo = {
	'Bloqueado' : 1,
	'Desbloqueado' : 2,
	'DesbloqueadoExceptuado' : 3,
	'DesbloqueadoTransitorio' : 4,
}

//get historial
export interface ContratistasHistorialRequest {
  id:number
  palabraClave?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  orderAsc?: boolean;
}

export interface ContratistaHistorialAPI {
  descripcion: string,
  detalle: string,
  nombreUsuario: string,
  usuarioId: number,
  fecha: Date
}

export interface ContratistasHistorialResponse {
  paginationData: PaginacionAPI;
  data: ContratistaHistorialAPI[];
}