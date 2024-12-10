import {axiosMaestros} from "@/config/axios/axiosMaestros";
import {
  MotivoDelegacionByIdRequest,
  MotivoDelegacionFiltradasRequest,
  MotivoDelegacionFiltradasResponse,
  MotivoDelegacionDetalleResponce,
  MotivoDelegacionCreate,
  MotivoDelegacionUpdate,
} from "../../types/microMaestros/motivoDelegacionTypes";


const MotivoDelegacionService = () => {
  return null;
}

export default MotivoDelegacionService

// Grilla de motivos delegación
export const fetchMotivoDelegacion = async (
  query: MotivoDelegacionFiltradasRequest
): Promise<MotivoDelegacionFiltradasResponse> => {
  try {
    const res = await axiosMaestros.get("/motivos-delegacion", { params: query });
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
    console.error("Error al buscar motivos delegación", error);
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

// Para obtener TIEMPO LIMITE con ID
export const fetchTiempoLimite = async (query: string = "") => {
  const res = await axiosMaestros.get("/motivos-delegacion/tiempoLimite", {
    params: { Nombre: query },
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};

export const fetchTiempoLimiteNameById = async (id: number) => {
  const res = await axiosMaestros.get(`/motivos-delegacion/tiempoLimite/${id}`);
  return res.data.data.nombre;
};




// Obtener detalles por ID
export const fetchMotivoDelegacionById = async (
  id: number
): Promise<MotivoDelegacionDetalleResponce> => {
  try {
    const res = await axiosMaestros.get(`/motivos-delegacion/${id}`);
    return res.data.data;
  } catch (e) {
    if (e instanceof Error && e.message.includes('404')) {
      return {
        id: 0,
        nombreMotivo: '',
        observacionObligatoria: false,
        tiempoLimite:0,
        estado: false,
       
        cantidadRecursosAfectados: 0,
      };
    } else {
      // TODO: PENSAR LOS TIPOS DE ERRORES Y QUÉ DEVOLVER
      return {
        id: 0,
        nombreMotivo: '',
        observacionObligatoria: false,
        tiempoLimite:0,
        estado: false,
        cantidadRecursosAfectados: 0,
      };
    }
  }
};

// Desactivar
export const desactivarCentro = async (query: MotivoDelegacionByIdRequest) => {
  const res = await axiosMaestros.patch("/motivos-delegacion/desactivar", query);
  return res;
};

// Activar 
export const activarCentro = async (query: MotivoDelegacionByIdRequest) => {
  const res = await axiosMaestros.patch("/motivos-delegacion/activar", query);
  return res;
};


export const exportMotivoDelegacion = async (
  query:MotivoDelegacionFiltradasRequest
): Promise<Blob> => {
  try {

    const response = await axiosMaestros.get("/motivos-delegacion/descargar", {
      params: query,
      responseType: "blob", 
    });

    return response.data; 
  } catch (error) {
    console.error("Error al exportar los motivos delegación", error);
    throw error;
  }
};

export const postMotivoDelegacion = async (body: MotivoDelegacionCreate) => {
  console.log('body',body);
  
  const res = await axiosMaestros.post("/motivos-delegacion", body);
  return res;
};

export const putMotivoDelegacion = async (body: MotivoDelegacionUpdate) => {
  const res = await axiosMaestros.put("/motivos-delegacion", body);
  return res;
};
