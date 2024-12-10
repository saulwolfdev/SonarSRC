import { axiosMaestros } from "@/config/axios/axiosMaestros";
import { TipoUnidadAPI, TipoUnidadCreate, TipoUnidadFiltradoRequest, TipoUnidadFiltradosResponse, TipoUnidadUpdate } from "@/types/microMaestros/tiposUnidadesTypes";

// Obtener lista de tipos de unidades con filtros
export const fetchTiposUnidades = async (
  query: TipoUnidadFiltradoRequest
): Promise<TipoUnidadFiltradosResponse> => {
  try {
    const res = await axiosMaestros.get("/tipos-unidades", { params: query });
    return res.data;
  } catch (error) {
    console.error("Error al buscar tipos de unidades", error);
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
export const fetchTipoUnidadById = async (id: number): Promise<TipoUnidadAPI> => {
  try {
    const res = await axiosMaestros.get(`/tipos-unidades/${id}`);
    return res.data.data;
  } catch (error) {
    console.error("Error al obtener tipo de unidad por ID", error);
    throw error;
  }
};

// Crear nuevo tipo de unidad
export const postTipoUnidad = async (body: TipoUnidadCreate) => {
  const res = await axiosMaestros.post("/tipos-unidades", body);
  return res;
};

// Actualizar tipo de unidad
export const patchTipoUnidad = async (body: TipoUnidadUpdate) => {
  try {
    const res = await axiosMaestros.patch("/tipos-unidades", body);
    return res;
  } catch (error) {
    console.error("Error al actualizar tipo de unidad", error);
    throw error;
  }
};

// Activar Tipo de Unidad
export const patchActivarTipoUnidad = async (id: number): Promise<void> => {
  try {
    await axiosMaestros.patch("/tipos-unidades/activar", { id });
  } catch (error) {
    console.error("Error al activar el tipo de unidad", error);
    throw error;
  }
};

// Desactivar Tipo de Unidad
export const patchDesactivarTipoUnidad = async (id: number, comentario: string): Promise<void> => {
  try {
    await axiosMaestros.patch("/tipos-unidades/desactivar", { id, comentario });
  } catch (error) {
    console.error("Error al desactivar el tipo de unidad", error);
    throw error;
  }
};

// Exportar tipos de unidades
export const exportTiposUnidades = async (
  query: TipoUnidadFiltradoRequest
): Promise<Blob> => {
  try {
    const response = await axiosMaestros.get("/tipos-unidades/export", {
      params: query,
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error al exportar tipos de unidades", error);
    throw error;
  }
};


export const fetchTiposRecursos = async () => {
  try {
    const res = await axiosMaestros.get("/tipos-unidades/TiposRecursos");
    return res.data.data; // Devuelve solo los datos de tipos de recursos
  } catch (error) {
    console.error("Error al obtener tipos de recursos", error);
    return [];
  }
};

const dummy = () => {console.log('...')}; // dummy function for export default

export default dummy