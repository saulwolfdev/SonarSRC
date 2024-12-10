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

// PUT

export interface ConvenioUpdate{
    
}
// la response es un status


// POST
export interface ConvenioCreate{
    
}