import { PaginacionAPI } from "./GenericTypes";
const convenioType = () => {
    return (
      null
    )
  }
  
  export default convenioType

  export interface ConvenioGridData{
    id: number
    codigo: number
    convenio: string
    horasDiariasDeTrabajo: string
    asociacionesGremiales: string
    estado: boolean

  }





// GET BY ID

// sirve tambien para hacer cambio de estado
export interface ConvenioByIdRequest{ 
    id: number
}

export interface ConvenioDetalleResponce {
    codigo: number
    nombre: string
    estado: boolean
    horasDiariasDeTrabajo: string,
    asociacionesGremiales: string
}

// GET ALL 

export interface ConveniosFiltradasRequest { 
    codigo?: number 
    nombre?: string     
    estado?: boolean 
    horasDiariasDeTrabajo? : Date
    nombreAsociacionGremial?: string
    codigoAsociacionGremial?: number
    nombreTitulo?: string
    nombreZona?: string
    nombreTurno?: string
    pageNumber?:number
    pageSize?:number
    sortBy?: string  // Codigo  Nombre  Estado  Provincias
    orderAsc?: boolean | null
}

export interface ConvenioAPI {
    horasDiariasDeTrabajo: string
    asociacionesGremiales: string
    codigo: number // es el id
    nombre: string 
    estado: boolean
}


export interface ConveniosFiltradasResponse {
    paginationData: PaginacionAPI
    data: ConvenioAPI[]
}


// POST
export interface ConvenioCreate{
    nombre: string 
    horasDiariasDeTrabajo : string 
    asociacionesGremialesId: number[]
    nombreTitulo: string 
    nombreCategoriaTitulo: string 
    nombreZona: string 
    porcentajeAdicionalZona?: number // lo dejo con ? para que el valor inciial sea undefined y el yup tire un error
    nombreTurno: string 
    porcentajeAdicionalTurno?: number // lo dejo con ? para que el valor inciial sea undefined y el yup tire un error
    estado:boolean
    
}