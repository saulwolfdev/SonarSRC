import {axiosMaestros} from "@/config/axios/axiosMaestros";
import {
  TipoLicenciasProlongadasByIdRequest,
  TipoLicenciasProlongadasFiltradasRequest,
  TipoLicenciasProlongadasFiltradasResponse,
  TipoLicenciasProlongadasDetalleResponce,
  TipoLicenciasProlongadasCreate,
  TipoLicenciasProlongadasUpdate,
  DesactivarConMotivoRequest,
} from "../../types/microMaestros/tipoLicenciasProlongadasTypes";


const TipoLicenciasProlongadasService = () => {
  return null;
}

export default TipoLicenciasProlongadasService

// Grilla de  tipos de licencias prolongadas
export const fetchTipoLicenciasProlongadas = async (
  query: TipoLicenciasProlongadasFiltradasRequest
): Promise<TipoLicenciasProlongadasFiltradasResponse> => {
  try {
    const res = await axiosMaestros.get("/tipos-licencias-prolongadas", { params: query });
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
    console.error("Error al buscar tipos de licencias prolongadas", error);
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
export const fetchTipoLicenciasProlongadasById = async (
  id: number
): Promise<TipoLicenciasProlongadasDetalleResponce> => {
  try {
    const res = await axiosMaestros.get(`/tipos-licencias-prolongadas/${id}`);
    return res.data.data;
  } catch (e) {
    if (e instanceof Error && e.message.includes('404')) {
      return {
        id: 0,
        nombre: '',
        estado: false,
       
        cantidadRecursosAfectados: 0,
      };
    } else {
      // TODO: PENSAR LOS TIPOS DE ERRORES Y QUÉ DEVOLVER
      return {
        id: 0,
        nombre: '',
        estado: false,
        cantidadRecursosAfectados: 0,
      };
    }
  }
};

// Desactivar
export const desactivarTipoLicenciaProlongada = async (body: DesactivarConMotivoRequest) => {
  const res = await axiosMaestros.patch("/tipos-licencias-prolongadas/desactivar", body);
  return res;
};

// Activar 
export const activarTipoLicenciaProlongada = async (query: TipoLicenciasProlongadasByIdRequest) => {
  const res = await axiosMaestros.patch("/tipos-licencias-prolongadas/activar", query);
  return res;
};


export const exportTipoLicenciasProlongadas = async (
  query:TipoLicenciasProlongadasFiltradasRequest
): Promise<Blob> => {
  try {

    const response = await axiosMaestros.get("/tipos-licencias-prolongadas/descargar", {
      params: query,
      responseType: "blob", 
    });

    return response.data; 
  } catch (error) {
    console.error("Error al exportar los motivos delegación", error);
    throw error;
  }
};

export const postTipoLicenciasProlongadas = async (body: TipoLicenciasProlongadasCreate) => {
  console.log('body',body);
  
  const res = await axiosMaestros.post("/tipos-licencias-prolongadas", body);
  return res;
};

export const putTipoLicenciasProlongadas = async (body: TipoLicenciasProlongadasUpdate) => {
  const res = await axiosMaestros.put("/tipos-licencias-prolongadas", body);
  return res;
};
