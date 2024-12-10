import { axiosMaestros } from "@/config/axios/axiosMaestros";
import { MotivoAfectacionFiltradoRequest, MotivoAfectacionFiltradoResponse, MotivoAfectacionCreateRequest, MotivoAfectacionCreateResponse, MotivoAfectacionDetalleResponse, MotivoAfectacionDesactivar, MotivoAfectacionActivar, MotivoAfectacionUpdateRequest } from "@/types/microMaestros/motivoAfectacionTypes";
const motivoAfectacionService = () => {
  return (
    null
  )
}

export default motivoAfectacionService

export const fetchMotivoAfectacion = async (
  query: MotivoAfectacionFiltradoRequest
): Promise<MotivoAfectacionFiltradoResponse> => {
  try {
    const transformedQuery = {
      ...query,
      relacionesServicio: query.relacionesServicio?.join(","),
    };

    const res = await axiosMaestros.get("/motivo-afectacion", {
      params: transformedQuery,
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
    console.error("Error al buscar motivo de afectación", error);
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


export const postMotivoAfectacion = async (query: MotivoAfectacionCreateRequest) => {
  const res = await axiosMaestros.post<MotivoAfectacionCreateResponse>(
  '/motivo-afectacion',
  query,
  {
    headers: {
      'Content-Type': 'application/json',
    },
  }
);
  return res;
};

export const exportMotivoAfectacion = async (
  query: MotivoAfectacionFiltradoRequest
): Promise<Blob> => {
  try {
    if (query.pageNumber !== undefined && !isNaN(query.pageNumber)) {
      query.pageNumber = 1;
    }
    if (query.pageSize !== undefined && !isNaN(query.pageSize)) {
      query.pageSize = 10;
    }

    const response = await axiosMaestros.get("/motivo-afectacion/descargar", {
      params: query,
      responseType: "blob", 
    });

    return response.data; 
  } catch (error) {
    console.error("Error al exportar los contratos", error);
    throw error;
  }
};

export const setEstados = async () => {
  return [
    { id: 1, label: "Activo" },
    { id: 2, label: "Inactivo" },
  ]
}
export const setEstadosMotivos = async () => {
  return [
    { id: 1, label: "Si" },
    { id: 2, label: "No" },
  ]
}

export const fetchMotivoAfectacionById = async (id: number): Promise<MotivoAfectacionDetalleResponse> => {
  try {
    const res = await axiosMaestros.get(`/motivo-afectacion/${id}`);
    if (res.status === 200) {
      return res.data.data;
    } else {
      const funcionNull: MotivoAfectacionDetalleResponse = { 
        id: 0, 
        motivoDeAfectacion: "", 
        relacionServicio: [],
        fechaIncorporacion: false,
        bajaPorCesion: false,
        afectacionTemporal: false,
        estado: false
      };
      return funcionNull;
    }
  } catch (error) {
    const funcionNull: MotivoAfectacionDetalleResponse = { 
      id: 0, 
      motivoDeAfectacion: "", 
      relacionServicio: [],
      fechaIncorporacion: false,
      bajaPorCesion: false,
      afectacionTemporal: false,
      estado: false
    };
    return funcionNull;
  }
};

export const buscarRelacionServicio = async (query: string = "") => {
  const res = await axiosMaestros.get("/motivo-afectacion/relacion-servicios");
  return res.data.data.map((item: { id: number; descripcion: string }) => ({ id: item.id, label: item.descripcion }));
};


export const desactivarMotivoAfectacion = async (query: MotivoAfectacionDesactivar) => {
  const res = await axiosMaestros.patch(  "/motivo-afectacion/desactivar", query );
  return res;
};

export const activarMotivoAfectacion = async ( query: MotivoAfectacionActivar) => {
  const res = await axiosMaestros.patch( "/motivo-afectacion/activar",query);
  return res;
};

export const putMotivoAfectacion = async ( query: MotivoAfectacionUpdateRequest) => {
  const res = await axiosMaestros.patch( "/motivo-afectacion/",query);
  return res;
}