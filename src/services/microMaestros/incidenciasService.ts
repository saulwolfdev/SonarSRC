import { axiosMaestros } from "@/config/axios/axiosMaestros";
import {
  IncidenciasFiltradasRequest,
  IncidenciasFiltradasResponse,
  IncidenciaByIdRequest,
  IncidenciaDetalleResponse,
  IncidenciaCreate,
  IncidenciaUpdate,
} from "@/types/microMaestros/incidenciasTypes";

export const fetchIncidencias = async (
  query: IncidenciasFiltradasRequest
): Promise<IncidenciasFiltradasResponse> => {
  try {
    const res = await axiosMaestros.get("/incidencias", { params: query });
    if (res.status === 200) {
      return res.data;
    } else {
      return {
        data: [],
        paginationData: {
          pageNumber: 1,
          pageSize: 9,
          totalPages: 1,
          totalCount: 0,
        },
      };
    }
  } catch (error) {
    console.error("Error al buscar centros físicos", error);
    return {
      data: [],
      paginationData: {
        pageNumber: 1,
        pageSize: 9,
        totalPages: 1,
        totalCount: 0,
      },
    };
  }
};

// Obtener detalles de una incidencia por ID
export const fetchIncidenciaById = async ({ id }: IncidenciaByIdRequest): Promise<IncidenciaDetalleResponse> => {
  try {
    const res = await axiosMaestros.get(`/incidencias/${id}`);
    return res.data.data as IncidenciaDetalleResponse;
  } catch (error) {
    console.error("Error al obtener detalles de la incidencia:", error);
    return { id: 0, nombre: "", tipoIncidencia: "Default", estado: false };
  }
};

// Crear una nueva incidencia
export const postIncidencia = async (body: IncidenciaCreate) => {
  try {
    const formattedBody = {
      ...body,
      tipoIncidencia: body.tipo === "Default" ? "Default" : "MOP",
    };
    const res = await axiosMaestros.post("/incidencias", formattedBody);
    return res;
  } catch (error) {
    console.error("Error al crear una incidencia:", error);
    throw error;
  }
};

export const patchIncidencia = async (body: IncidenciaUpdate) => {
  try {
    const formattedBody = {
      id: body.id,
      nombre: body.nombre,
      tipoIncidencia: body.tipo, 
    };
    const res = await axiosMaestros.patch("/incidencias", formattedBody);
    return res;
  } catch (error) {
    console.error("Error al actualizar la incidencia:", error);
    throw error;
  }
};