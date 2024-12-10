import { axiosMaestros } from "@/config/axios/axiosMaestros";
import {
  MotivoRechazoObjecionAfectacionByIdRequest,
  MotivoRechazoObjecionAfectacionFiltradasRequest,
  MotivoRechazoObjecionAfectacionFiltradasResponse,
  MotivoRechazoObjecionAfectacionDetalleResponse,
  MotivoRechazoObjecionAfectacionCreate,
  MotivoRechazoObjecionAfectacionUpdate,
  DesactivarMotivoRechazoObjecionAfectacionRequest,
} from "@/types/microMaestros/motivosRechazoAfectacionTypes";

const MotivoRechazoObjecionAfectacionService = () => {
  return null;
};

export default MotivoRechazoObjecionAfectacionService;

// Grilla de MotivoRechazoObjecionAfectacion
export const fetchMotivosRechazoObjecionAfectacion = async (
  query: MotivoRechazoObjecionAfectacionFiltradasRequest
): Promise<MotivoRechazoObjecionAfectacionFiltradasResponse> => {
  try {
    const res = await axiosMaestros.get(
      "/motivos-rechazo-objecion-afectacion",
      { params: query }
    );

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
    console.error(
      "Error al buscar motivos de rechazos y objeciones de afectación",
      error
    );
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
export const fetchMotivoRechazoObjecionAfectacionById = async (
  id: number
): Promise<MotivoRechazoObjecionAfectacionDetalleResponse> => {
  try {
    const res = await axiosMaestros.get(
      `/motivos-rechazo-objecion-afectacion/${id}`
    );
    return res.data.data;
  } catch (e) {
    if (e instanceof Error && e.message.includes("404")) {
      return {
        //ss DTO
        codigo: 0,
        nombre: "",
        descripcion: "",
        estado: false,
        objecion: false,
        rechazo: false,
      };
    } else {
      // TODO: PENSAR LOS TIPOS DE ERRORES Y QUÉ DEVOLVER
      return {
        codigo: 0,
        nombre: "",
        descripcion: "",
        estado: false,
        objecion: false,
        rechazo: false,
      };
    }
  }
};

// Desactivar motivo
export const desactivarMotivoRechazoObjecionAfectacion = async (
  query: DesactivarMotivoRechazoObjecionAfectacionRequest
) => {
  const res = await axiosMaestros.patch(
    "/motivos-rechazo-objecion-afectacion/desactivar",
    query
  );
  return res;
};

// Activar motivo
export const activarMotivoRechazoObjecionAfectacion = async (
  query: MotivoRechazoObjecionAfectacionByIdRequest
) => {
  const res = await axiosMaestros.patch(
    "/motivos-rechazo-objecion-afectacion/activar",
    query
  );
  return res;
};

export const exportMotivoRechazoObjecionAfectacion = async (
  query: MotivoRechazoObjecionAfectacionFiltradasRequest
): Promise<Blob> => {
  try {
    const response = await axiosMaestros.get(
      "/motivos-rechazo-objecion-afectacion/exportar",
      {
        params: query,
        responseType: "blob",
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error al exportar los motivos de rechazos y objeciones de afectación",
      error
    );
    throw error;
  }
};

export const postMotivoRechazoObjecionAfectacion = async (
  body: MotivoRechazoObjecionAfectacionCreate
) => {
  const res = await axiosMaestros.post(
    "/motivos-rechazo-objecion-afectacion",
    body
  );
  return res;
};

export const putMotivoRechazoObjecionAfectacion = async (
  body: MotivoRechazoObjecionAfectacionUpdate
) => {
  const res = await axiosMaestros.put(
    "/motivos-rechazo-objecion-afectacion",
    body
  );

  return res;
};
/* 
---------------------------------------------------------------------------------------
--------------------------------------FILTROS------------------------------------------
---------------------------------------------------------------------------------------
*/
export const fetchObjecion = async () => {
  return [
    { id: 1, label: "Si" },
    { id: 2, label: "No" },
  ];
};

export const fetchRechazo = async () => {
  return [
    { id: 1, label: "Si" },
    { id: 2, label: "No" },
  ];
};

