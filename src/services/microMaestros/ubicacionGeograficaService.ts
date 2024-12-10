import { axiosMaestros } from "@/config/axios/axiosMaestros";
import { CodigoPostalPorIdRequest, CodigoPostalPorIdResponse, ListaCodigosPostalesRequest, ListaCodigosPostalesResponse, ListaLocalidadesRequest, ListaLocalidadesResponse, ListaPaisesRequest, ListaPaisesResponse, ListaProvinciasRequest, ListaProvinciasResponse, LocalidadPorIdRequest, LocalidadPorIdResponse, PaisPorIdRequest, PaisPorIdResponse, ProvinciaPorIdRequest, ProvinciaPorIdResponse, ToggleActivacionRequest, 
  ToggleActivacionResponse, UbicacionesGeograficasFiltradasRequest, 
  UbicacionesGeograficasFiltradasResponse} from "@/types/microMaestros/ubicacionGeograficaTypes";

const ubicacionGeograficaService = () => {
  return null;
}

export default ubicacionGeograficaService


// Grilla de ubicaciones
export const fetchUbicaciones = async (query: UbicacionesGeograficasFiltradasRequest): Promise<UbicacionesGeograficasFiltradasResponse> => {
  
  const res = await axiosMaestros.get('/ubicaciones', {
    params: {
      paisId: query.paisId,
      provinciaId: query.provinciaId,
      localidadId: query.localidadId,
      codigoPostalId: query.codigoPostalId,
      estado: query.estado,
      pageNumber: query.pageNumber,
      pageSize: query.pageSize
    }
  })
  if (res.status == 200) {
    return res.data
  } else {
    const ubicacionesNull: UbicacionesGeograficasFiltradasResponse = { data: [], paginationData: { pageNumber: 1, pageSize: 1, totalPages: 1, totalCount: 0 } }
    return ubicacionesNull
  }
};

// Listado de Paises
export const fetchPaises = async (query: ListaPaisesRequest): Promise<ListaPaisesResponse> => {
  const res = await axiosMaestros.get('/ubicaciones/paises', {
    params: {
      nombre: query.nombre
    }
  })
  if (res.status == 200) {
    return res.data
  } else {
    const paisesNull: ListaPaisesResponse = { data: [], paginationData: { pageNumber: 1, pageSize: 1, totalPages: 1, totalCount: 0 } }
    return paisesNull
  }
};

// Listado de Provincias
export const fetchProvincias = async (query: ListaProvinciasRequest): Promise<ListaProvinciasResponse> => {
  const res = await axiosMaestros.get('/ubicaciones/provincias', {
    params: {
      nombre: query.nombre
    }
  })
  if (res.status == 200) {
    return res.data
  } else {
    const provinciasNull: ListaProvinciasResponse = { data: [], paginationData: { pageNumber: 1, pageSize: 1, totalPages: 1, totalCount: 0 } }
    return provinciasNull
  }
};

// Listado de Localidades
export const fetchLocalidades = async (query: ListaLocalidadesRequest): Promise<ListaLocalidadesResponse> => {
  const res = await axiosMaestros.get('/ubicaciones/localidades', {
    params: {
      nombre: query.nombre
    }
  })
  if (res.status == 200) {
    return res.data
  } else {
    const localidadesNull: ListaLocalidadesResponse = { data: [], paginationData: { pageNumber: 1, pageSize: 1, totalPages: 1, totalCount: 0 } }
    return localidadesNull
  }
};

// Listado de Localidades
export const fetchCodigosPostales = async (query: ListaCodigosPostalesRequest): Promise<ListaCodigosPostalesResponse> => {
  const res = await axiosMaestros.get('/ubicaciones/codigos-postales', {
    params: {
      codigo: query.nombre
    }
  })
  if (res.status == 200) {
    return res.data
  } else {
    const codigosPostalesNull: ListaCodigosPostalesResponse = { data: [], paginationData: { pageNumber: 1, pageSize: 1, totalPages: 1, totalCount: 0 } }
    return codigosPostalesNull
  }
};

// Pais por Id 
export const fetchPaisPorId = async (query: PaisPorIdRequest): Promise<PaisPorIdResponse> => {
  const res = await axiosMaestros.get('/ubicaciones/paises/' + query.id)
  if (res.status == 200) {
    return res.data
  } else {
    const paisNull: PaisPorIdResponse = { id: 0, isoName: "", isoAlpha2: "", isoAlpha3: "", estado: false, cantidadProvincias: 0 }
    return paisNull
  }
};

// Provincia por Id 
export const fetchProvinciaPorId = async (query: ProvinciaPorIdRequest): Promise<ProvinciaPorIdResponse> => {
  const res = await axiosMaestros.get('/ubicaciones/provincias/' + query.id)
  if (res.status == 200) {
    return res.data
  } else {
    const provinciaNull: ProvinciaPorIdResponse = { id: 0, isoName: "", isoCode: "", paisId: 0, estado: false, cantidadLocalidades: 0 }
    return provinciaNull
  }
};

// Localidad por Id 
export const fetchLocalidadPorId = async (query: LocalidadPorIdRequest): Promise<LocalidadPorIdResponse> => {
  const res = await axiosMaestros.get('/ubicaciones/localidades/' + query.id)
  if (res.status == 200) {
    return res.data
  } else {
    const localidadNull: LocalidadPorIdResponse = { id: 0, nombre: "", provinciaId: 0, estado: false, cantidadCodigosPostales: 0 }
    return localidadNull
  }
};

// Localidad por Id 
export const fetchCodigoPostalPorId = async (query: CodigoPostalPorIdRequest): Promise<CodigoPostalPorIdResponse> => {
  const res = await axiosMaestros.get('/ubicaciones/codigos-postales/' + query.id)
  if (res.status == 200) {
    return res.data
  } else {
    const codigoPostalNull: CodigoPostalPorIdResponse = { id: 0, codigo: "", localidadId: "" }
    return codigoPostalNull
  }
};

// Activar Ubicacion
export const fetchActivarUbicacion = async (req: ToggleActivacionRequest): Promise<ToggleActivacionResponse> => {
  const res = await axiosMaestros.patch('ubicaciones/activar', req)
  if (res.status == 200) {
    return res.data
  } else {
    const activacionNull: ToggleActivacionResponse = { status: res.status }
    return activacionNull
  }
};

// Desactivar Ubicacion
export const fetchDesactivarUbicacion = async (req: ToggleActivacionRequest): Promise<ToggleActivacionResponse> => {
  const res = await axiosMaestros.patch('ubicaciones/desactivar', req)
  if (res.status == 200) {
    return res.data
  } else {
    const activacionNull: ToggleActivacionResponse = { status: res.status }
    return activacionNull
  }
};

export const fetchProvinciaNameById = async (id: number) => {
  const res = await axiosMaestros.get(`/ubicaciones/provincias/${id}`);
  return res.data.isoName;
};

export const fetchLocalidadNameById = async (id: number) => {
  const res = await axiosMaestros.get(`/ubicaciones/localidades/${id}`);
  return res.data.nombre;
};

export const fetchCodigoPostalNameById = async (id: number) => {
  const res = await axiosMaestros.get(`/ubicaciones/codigos-postales/${id}`);
  return res.data.codigo;
};

