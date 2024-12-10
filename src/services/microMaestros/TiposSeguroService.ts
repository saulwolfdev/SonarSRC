import { axiosMaestros } from "@/config/axios/axiosMaestros";
import {
  TiposSeguroAPI,
  TiposSeguroCreate,
  TiposSeguroFiltradoRequest,
  TiposSeguroFiltradosResponse,
  TiposSeguroUpdate,
} from "@/types/microMaestros/tiposSeguroTypes";

// Obtener lista de tipos de seguros con filtros
export const fetchTiposSeguro = async (
  query: TiposSeguroFiltradoRequest
): Promise<TiposSeguroFiltradosResponse> => {
  try {
    // Creo una copia del objeto query para no mutar el original
    const backendQuery: any = { ...query };

    // Si 'codigo' existe, mapeo a 'Id' y elimino 'codigo'
    if (backendQuery.codigo) {
      backendQuery.Id = backendQuery.codigo;
      delete backendQuery.codigo;
    }

    const res = await axiosMaestros.get("/tipos-seguros", { params: backendQuery });
    return res.data;
  } catch (error) {
    console.error("Error al buscar tipos de seguro", error);
    return {
      data: [],
      paginationData: {
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1,
      },
    };
  }
};
// Obtener detalle por ID
export const fetchTiposSeguroById = async (id: number): Promise<TiposSeguroAPI> => {
  try {
    const res = await axiosMaestros.get(`/tipos-seguros/${id}`);
    return res.data.data;
  } catch (error) {
    console.error("Error al obtener tipo de seguro por ID", error);
    throw error;
  }
};

// Crear nuevo tipo de seguro
export const postTiposSeguro = async (body: TiposSeguroCreate) => {
  const res = await axiosMaestros.post("/tipos-seguros", body);
  return res;
};

// Actualizar tipo de seguro
export const patchTiposSeguro = async (body: TiposSeguroUpdate) => {
  try {
    const res = await axiosMaestros.patch(`/tipos-seguros`, body);
    return res;
  } catch (error) {
    console.error("Error al actualizar tipo de seguro", error);
    throw error;
  }
};

// Activar tipo de seguro
export const patchActivarTipoSeguro = async (id: number): Promise<void> => {
  try {
    await axiosMaestros.patch("/tipos-seguros/activar", { id });
  } catch (error) {
    console.error("Error al activar el tipo de seguro", error);
    throw error;
  }
};

// Desactivar tipo de seguro
export const patchDesactivarTipoSeguro = async (id: number): Promise<void> => {
  try {
    await axiosMaestros.patch("/tipos-seguros/desactivar", { id });
  } catch (error) {
    console.error("Error al desactivar el tipo de seguro", error);
    throw error;
  }
};

// Exportar tipos de seguro
export const exportTiposSeguro = async (
  query: TiposSeguroFiltradoRequest
): Promise<Blob> => {
  try {
    const response = await axiosMaestros.get("/tipos-seguros/export", {
      params: query,
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error al exportar los tipos de seguro", error);
    throw error;
  }
};

// Obtener estados (activo/inactivo)


const dummy = () => {console.log('...')}; // dummy function for export default

export default dummy