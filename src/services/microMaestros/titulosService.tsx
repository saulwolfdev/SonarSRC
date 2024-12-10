const titulosServies = () => {
  return (
    null
  )
}

export default titulosServies

import { axiosMaestros } from "@/config/axios/axiosMaestros"
import {
  TitulosFiltradasRequest,
  TitulosFiltradasResponse,
  TituloByIdRequest,
  TituloCreate,
  TituloDetalleResponce,
} from "@/types/microMaestros/titulosTypes"

// Grilla de asociacion gremial
export const fetchTitulos = async (
  query: TitulosFiltradasRequest
): Promise<TitulosFiltradasResponse> => {
  try {
  
    const res = await axiosMaestros.get("/gremios/convenios-colectivos/titulos", {
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
export const fetchTituloById = async ({
  id,
}: TituloByIdRequest): Promise<TituloDetalleResponce> => {
  try {
    const res = await axiosMaestros.get(`/gremios/convenios-colectivos/titulos/${id}`);
    return res.data.data;
  } catch (e) {
    return {
      codigo: 0,
      nombre: "",
      estado: false,
    };
  }
};


export const postTitulo = async (body: TituloCreate) => {
  const res = await axiosMaestros.post("/gremios/convenios-colectivos/titulos ", body);
  return res;
};





