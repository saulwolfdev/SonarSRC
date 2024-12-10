import { PaginacionAPI } from "./GenericTypes";

const CompaniasAseguradorasTypes = () => {
    return null;
  }
  
export default CompaniasAseguradorasTypes

export const URLBaseClasificacionCompaniasAseguradoras = 'https://localhost:7052/api/v1'

  
export interface CompaniasAseguradorasGridData {
    id: string;
    nombre: string;
    cuit: string;
    tipoDeSeguro: string;
    tiposDeSegurosExceptuados: string;
    contratistas: string;
    estado: boolean;
}

// GET BY ID

// sirve tambien para hacer cambio de estado
export interface CompaniasAseguradorasByIdDTO{ 
    id:number
}

export interface CompaniasAseguradorasDetalleDTO {
    id: number;
    nombre: string;
    cuit: string;
    estado: boolean;
    observacion: string,
    tiposSeguros: TipoSeguro[],
    excepcionesSeguros: ExcepcionSeguro[],
    cantidadRecursosAfectados: number;

}

// GET ALL 

export interface CompaniasAseguradorasFiltradasRequest { // filtros 
    codigo?: string;
    nombre?: string;
    cuit?: string;
    tipoSeguroId?: number;
    tipoSeguroExceptuadoId?: number;
    contratistaId?: number;
    estado?: boolean;
    pageNumber?:number
    pageSize?:number
    sortBy?: string 
    orderAsc?: boolean | null
}


export interface CompaniasAseguradorasAPI {
    id: number
    nombre: string
    estado: boolean
    cuit: string
    observacion: string
    tiposSeguros: TiposSeguro[]
    excepcionesSeguros: ExcepcionSeguro[]
  }
   
  export interface TiposSeguro {
    id: number
    nombre: string
    estado: boolean
  }
   
  export interface ExcepcionSeguro {
    id: number
    tipoSeguro: TipoSeguro
    contratistas: Contratista[]
  }
   
  export interface TipoSeguro {
    id: number
    nombre: string
    estado: boolean
  }
   
  export interface Contratista {
    id: number
    razonSocial: string
    bdOrigenId: number
  }
   
export interface CompaniasAseguradorasFiltradasResponse {
    paginationData: PaginacionAPI
    data: CompaniasAseguradorasAPI[]
}

// PUT
export interface ExcepcionSeguroUpdateRequest {
  tipoSeguroId: number,
  contratistasIds: number[],
}

export interface CompaniasAseguradorasUpdate{
  id: number,
  nombre: string,
  cuit: string,
  estado: boolean,
  tiposSegurosIds: number[],
  observacion: string,
  excepcionesSeguros: ExcepcionSeguroUpdateRequest[]
}

// POST

// Ejemplo de CREATE
export interface ExcepcionSeguroCreateRequest {
  tipoSeguroId: number,
  contratistasIds: number[],
}

export interface CompaniaAseguradoraCreateRequest {
    nombre: string,
    cuit: string,
    estado?: boolean,
    tiposSegurosIds: number[],
    observacion?: string,
    excepcionesSeguros: ExcepcionSeguroCreateRequest []
}

//Form Formik Create / Update
export interface FormikCompaniaAseguradoraCreateOrUpdateRequest {
  nombre: string;
  cuit: string;
  tiposSegurosIds: number[];
  observacion: string;
  excepcionesSeguros: ExcepcionSeguroUpdateRequest[];
}

export interface CompAseguradorasCargaMasivaRequest {
  FileContent: File;
}

export interface CompAseguradorasCargaMasivaResponse {
  id: number
  cantidadCreados: number
  cantidadErrores: number
  errores: ErroresCargaMasivaCompaniasAseguradoras[]
}

export interface ErroresCargaMasivaCompaniasAseguradoras {
  mensajeError: string
  nombre: string
  cuit: string
  observacion: string
  tiposSeguros: string
}
