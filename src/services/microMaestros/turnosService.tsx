const turnosServices = () => {
  return (
    null
  )
}

export default turnosServices

import { axiosMaestros } from "@/config/axios/axiosMaestros"
import {
  TurnosFiltradasRequest,
  TurnosFiltradasResponse,
  TurnoByIdRequest,
  TurnoCreate,
  TurnoDetalleResponce,
} from "@/types/microMaestros/turnosTypes"

// Grilla de asociacion gremial
export const fetchTurnos = async (
  query: TurnosFiltradasRequest
): Promise<TurnosFiltradasResponse> => {
  try {
  
    const res = await axiosMaestros.get("/gremios/convenios-colectivos/turnos", {
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
export const fetchTurnoById = async ({
  id,
}: TurnoByIdRequest): Promise<TurnoDetalleResponce> => {
  try {
    const res = await axiosMaestros.get(`/gremios/convenios-colectivos/turnos/${id}`);
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


export const postTurno = async (body: TurnoCreate) => {
  const res = await axiosMaestros.post("/gremios/convenios-colectivos/turnos ", body);
  return res;
};





