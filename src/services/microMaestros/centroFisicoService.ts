import {axiosMaestros} from "@/config/axios/axiosMaestros";
import {
  CentroFisicoByIdRequest,
  CentrosFisicosFiltradasRequest,
  CentroFisicoFiltradasResponse,
  CentroFisicoDetalleResponce,
  CentroFisicoCreate,
  CentroFisicoUpdate,
} from "@/types/microMaestros/centrosFisicosTypes";


const CentroFisicoService = () => {
  return null;
}

export default CentroFisicoService

// Grilla de centros
export const fetchCentrosFisicos = async (
  query: CentrosFisicosFiltradasRequest
): Promise<CentroFisicoFiltradasResponse> => {
  try {
    
    const res = await axiosMaestros.get("/centros-fisicos", { params: query });

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
    console.error("Error al buscar centros físicos", error);
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

// Para obtener clasificaciones con ID
export const fetchClasificaciones = async (query: string = "") => {
  const res = await axiosMaestros.get("/centros-fisicos/clasificacion", {
    params: { Nombre: query },
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};

export const fetchClasificacionNameById = async (id: number) => {
  const res = await axiosMaestros.get(`/centros-fisicos/clasificacion/${id}`);
  return res.data.data.nombre;
};
export const fetchProvincias = async (query: string = "") => {
  const res = await axiosMaestros.get("/ubicaciones/provincias", {
    params: { Nombre: query },
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};

export const fetchProvinciaNameById = async (id: number) => {
  const res = await axiosMaestros.get(`/ubicaciones/provincias/${id}`);
  return res.data.isoName;
};

export const fetchProvinciasArgentinasHabilitadas = async (query: string = "") => {
  const res = await axiosMaestros.get("/ubicaciones/provincias-argentinas", {
    params: { Nombre: query , Estado: true },
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};



// Obtener detalles por ID
export const fetchCentroFisicoById = async (
  id: number
): Promise<CentroFisicoDetalleResponce> => {
  try {
    const res = await axiosMaestros.get(`/centros-fisicos/${id}`);
    return res.data.data;
  } catch (e) {
    if (e instanceof Error && e.message.includes('404')) {
      return {
        id: 0,
        nombre: '',
        estado: false,
        clasificacion: {
          id: 0,
          nombre: '',
          estado: false,
        },
        provincia: {
          id: 0,
          isoName: '',
          isoCode: '',
          paisId: 0,
          estado: false,
          cantidadLocalidades: 0,
        },
        cantidadRecursosAfectados: 0,
      };
    } else {
      // TODO: PENSAR LOS TIPOS DE ERRORES Y QUÉ DEVOLVER
      return {
        id: 0,
        nombre: '',
        estado: false,
        clasificacion: {
          id: 0,
          nombre: '',
          estado: false,
        },
        provincia: {
          id: 0,
          isoName: '',
          isoCode: '',
          paisId: 0,
          estado: false,
          cantidadLocalidades: 0,
        },
        cantidadRecursosAfectados: 0,
      };
    }
  }
};

// Desactivar centro físico
export const desactivarCentro = async (query: CentroFisicoByIdRequest) => {
  const res = await axiosMaestros.patch("/centros-fisicos/desactivar", query);
  return res;
};

// Activar centro físico
export const activarCentro = async (query: CentroFisicoByIdRequest) => {
  const res = await axiosMaestros.patch("/centros-fisicos/activar", query);
  return res;
};


export const exportCentrosFisicos = async (
  query:CentrosFisicosFiltradasRequest
): Promise<Blob> => {
  try {

    const response = await axiosMaestros.get("/centros-fisicos/exportar", {
      params: query,
      responseType: "blob", 
    });

    return response.data; 
  } catch (error) {
    console.error("Error al exportar los centros físicos", error);
    throw error;
  }
};

export const postCentroFisico = async (body: CentroFisicoCreate) => {
  const res = await axiosMaestros.post("/centros-fisicos", body);
  return res;
};

export const putCentroFisico = async (body: CentroFisicoUpdate) => {
  const res = await axiosMaestros.put("/centros-fisicos", body);

  return res;
};
