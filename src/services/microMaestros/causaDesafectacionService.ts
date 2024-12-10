import {axiosMaestros} from "@/config/axios/axiosMaestros";
import {
  CausaDesafectacionByIdRequest,
  CausasDesafectacionesFiltradasRequest,
  CausaDesafectacionFiltradasResponse,
  CausaDesafectacionDetalleResponce,
  CausaDesafectacionCreate,
  CausaDesafectacionUpdate,
  CausaDesafectacionDesactivarRequest,
} from "@/types/microMaestros/causaDesafectacionTypes";


const CausaDesafectacionService = () => {
  return null;
}

export default CausaDesafectacionService

// Grilla de causas desafectaciones
export const fetchCausasDesafectaciones = async (
  query: CausasDesafectacionesFiltradasRequest
): Promise<CausaDesafectacionFiltradasResponse> => {
  try {
    
    const res = await axiosMaestros.get("/causas-desafectacion", { params: query });

    if (res.status === 200) {
      return res.data;
    } else {
      return {
        data: [],
        paginationData: {
          pageNumber: 1,
          pageSize: 10,
          totalPages: 1,
          totalCount: 0,
        },
      };
    }
  } catch (error) {
    console.error("Error al buscar causas desafectaciones ", error);
    return {
      data: [],
      paginationData: {
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1,
        totalCount: 0,
      },
    };
  }
};

// Obtener detalles por ID
export const fetchCausaDesafectacionById = async (
  id: number
): Promise<CausaDesafectacionDetalleResponce> => {
  try {
    const res = await axiosMaestros.get(`/causas-desafectacion/${id}`);
    return res.data.data;
  } catch (e) {
    if (e instanceof Error && e.message.includes('404')) {
      return {
        codigo: 0,
        nombre: '',
        estado: false,
        descripcion: '',
        desafectaTodosLosContratos: false,
        reemplazoPersonal: false,
      };
    } else {
      // TODO: PENSAR LOS TIPOS DE ERRORES Y QUÉ DEVOLVER
      return  {
        codigo: 0,
        nombre: '',
        estado: false,
        descripcion: '',
        desafectaTodosLosContratos: false,
        reemplazoPersonal: false,
      }
    }
  }
};

// Desactivar causa
export const desactivarCausaDesafectacion = async (query: CausaDesafectacionDesactivarRequest) => {
  const res = await axiosMaestros.patch("/causas-desafectacion/desactivar", query);
  return res;
};

// Activar causa
export const activarCausaDesafectacion = async (query: CausaDesafectacionByIdRequest) => {
  const res = await axiosMaestros.patch("/causas-desafectacion/activar", query);
  return res;
};


export const exportCausasDesafectaciones = async (
  query:CausasDesafectacionesFiltradasRequest
): Promise<Blob> => {
  try {

    const response = await axiosMaestros.get("/causas-desafectacion/exportar", {
      params: query,
      responseType: "blob", 
    });

    return response.data; 
  } catch (error) {
    console.error("Error al exportar los causas desafectaciones ", error);
    throw error;
  }
};

export const postCausaDesafectacion = async (body: CausaDesafectacionCreate) => {
  const res = await axiosMaestros.post("/causas-desafectacion", body);
  return res;
};

export const putCausaDesafectacion = async (body: CausaDesafectacionUpdate) => {
  const res = await axiosMaestros.put("/causas-desafectacion", body);

  return res;
};


// desactivar export

export const exportCausaDesafectacionRegistrosAsociados = async (
  id: number
): Promise<Blob> => {
  try {
    const response = await axiosMaestros.get(`/causas-desafectacion/recursos-afectados/exportar/${id}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error al exportar los causa desafectacion", error);
    throw error;
  }
};

export const fetchCausaDesafectacionRecursosAfectadosById = async (
  id: number
): Promise<number> => {
  try {
    const res = await axiosMaestros.get(`/causas-desafectacion/recursos-afectados/${id}`);

    if (res.status === 200) {
      return res.data.data.recursosAfectados;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error al buscar causa desafectacion ", error);
    return 0
  }
};

// filtros


export const fetchDesafectaATodosLosContratos = async () => {
  return [
    { id: 1, label: "Si" },
    { id: 2, label: "No" },
  ];
};

export const fetchreemplazoPersonal = async () => {
  return [
    { id: 1, label: "Si" },
    { id: 2, label: "No" },
  ];
};