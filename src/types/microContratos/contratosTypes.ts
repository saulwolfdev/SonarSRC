import { PaginacionAPI } from "./GenericTypes"

const contratosTypes = () => {
  return (
    null
  )
}

export default contratosTypes

export interface ContratosGridData {
    id: number,
    contratista: string
    nroContrato: number
    origen: string // OrigenContratoDTO 
    codigoOrigen: string | undefined
    descripcionContrato: string
    inicio: Date
    finalizacion: Date
    estado: boolean
}
// GET BY ID

// sirve tambien para hacer cambio de estado
export interface ContratoByIdRequest{ 
    id:number
}

export interface ContratoResponce {
    id : number 
    numero: number 
    descripcion: string 
    estado : boolean 
    inicio: Date 
    finalizacion: Date 
    contratista: string // ContratistaDTO 
    rolEmpresa: string // RolEmpresaDTO 
    tipo: string // TipoContratoDTO 
    origen: string // OrigenContratoDTO 
    asociacionGremial: string // AsociacionGremialDTO 
    sociedad: string // SociedadDTO 
    referenteCompras: string // UsuarioDTO 
    usuariosSolicitantes: string // UsuarioDTO[] 
}



// GET ALL 

export interface ContratosFiltradoRequest {  // sirve para el excel
    contratistaId?: number 
    numero?: number 
    estado? : boolean 
    sortBy?: string 
    orderAsc?: boolean | null
    pageNumber?:number
    pageSize?:number
}

export interface ContratoAPI {
    id: number 
    numero: number 
    descripcion: string 
    estado : boolean 
    inicio: Date 
    finalizacion: Date 
    origen: string 
    codigoOrigen?: string
    contratistaId : number 
    contratistaRazonSocial: string 
    contratistaEstado : boolean 
     

}

export interface ContratosFiltradosResponse {
    paginationData: PaginacionAPI
    data: ContratoAPI[]
}

// PUT

export interface ContratoUpdate{

}
// la response es un status


// POST

export interface ContratoCreate{
    numero?: string //es obligatorio y lo pongo con ? para que visualmente desde el form se vea bien pero desde yup lo controlo
    origenId: number | null ,
    descripcion?: string 
    contratistaId: number 
    rolEmpresaId : number 
    tipoId : number 
    asociacionGremialId: number | null
    sociedadId: number 
    referenteDeComprasId?: number 
    usuariosSolicitantes: number[]
    usuariosANotificar: string
    inicio?: Date  // mismo que campo 'numero'
    finalizacion?: Date // mismo que campo 'numero'
    estado?: boolean 
}

// la response es un status
