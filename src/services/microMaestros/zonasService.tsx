const zonasServices = () => {
  return (
    null
  )
}

export default zonasServices

import { axiosMaestros } from "@/config/axios/axiosMaestros"
import {
  ZonasFiltradasRequest,
  ZonasFiltradasResponse,
  ZonaByIdRequest,
  ZonaCreate,
  ZonaDetalleResponce,
} from "@/types/microMaestros/zonasTypes"

// Grilla de asociacion gremial
export const fetchZonas = async (
  query: ZonasFiltradasRequest
): Promise<ZonasFiltradasResponse> => {
  try {
  
    const res = await axiosMaestros.get("/gremios/convenios-colectivos/zonas", {
      params: query,
    });

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
    console.error("Error al buscar asociaciones gremiales", error);
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

// Obtener detalles por ID
export const fetchZonaById = async ({
  id,
}: ZonaByIdRequest): Promise<ZonaDetalleResponce> => {
  try {
    const res = await axiosMaestros.get(`/gremios/convenios-colectivos/zonas/${id}`);
    return res.data.data;
  } catch (e) {
    return {
      codigo: 0,
      nombre: "",
      porcentajeAdicional: 0,
      estado: false,
    };
  }
};


export const postZona = async (body: ZonaCreate) => {
  const res = await axiosMaestros.post("/gremios/convenios-colectivos/zonas ", body);
  return res;
};





