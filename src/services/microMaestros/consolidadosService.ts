

import {axiosMaestros} from "@/config/axios/axiosMaestros";
import { GremiosConsolidadosFiltradasResponse, GremiosConsolidadosFiltradasRequest, GremioConsolidadoDetalleResponce, GremioConsolidadoByIdRequest, GremioConsolidadoCreate, GremioConsolidadoUpdate } from "@/types/microMaestros/gremiosConsolidadosTypes";


// Grilla de gremios consolidados
export const fetchGremiosConsolidados = async (
  query: GremiosConsolidadosFiltradasRequest
): Promise<GremiosConsolidadosFiltradasResponse> => {
  try {
    const res = await axiosMaestros.get("/gremios/gremios-consolidados", {
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
    console.error("Error al buscar gremios consolidados", error);
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
export const fetchGremioConsolidadoById = async ({
  id,
}: GremioConsolidadoByIdRequest): Promise<GremioConsolidadoDetalleResponce> => {
  try {
    const res = await axiosMaestros.get(`/gremios/gremios-consolidados/${id}`);
    return res.data.data;
  } catch (e) {
    return {
      codigo: 0,
      nombre: "",
      estado: false,
    };
  }
};

export const exportGremiosConsolidados = async (
  query: GremiosConsolidadosFiltradasRequest
): Promise<Blob> => {
  try {
    const response = await axiosMaestros.get("/gremios/gremios-consolidados/exportar", {
      params: query,
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    console.error("Error al exportar los gremios consolidados", error);
    throw error;
  }
};

export const exportGremiosConsolidadosAnidados = async (
  query: GremiosConsolidadosFiltradasRequest
): Promise<Blob> => {
  try {
    const response = await axiosMaestros.get(
      "/gremios/gremios-consolidados/exportar-anidado",
      {
        params: query,
        responseType: "blob",
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al exportar los gremios consolidados", error);
    throw error;
  }
};
export const postGremioConsolidado = async (body: GremioConsolidadoCreate) => {
  const res = await axiosMaestros.post("/gremios/gremios-consolidados ", body);
  return res;
};

export const putGremioConsolidado = async (body: GremioConsolidadoUpdate) => {
  const res = await axiosMaestros.put("/gremios/gremios-consolidados ", body);
  return res;
};

// filtros



const dummy = () => {console.log('...')}; // dummy function for export default

export default dummy
