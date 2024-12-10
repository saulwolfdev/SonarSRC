import {axiosMaestros} from "@/config/axios/axiosMaestros";
import { IdOption } from "@/types/microContratos/GenericTypes";
import {
  ClasificacionCentroFisicoByIdRequest,
  ClasificacionCentroFisicoDetalleResponce,
  ClasificacionesCentrosFisicosFiltradasRequest,
  ClasificacionCentroFisicoCreate,
  ClasificacionCentroFisicoUpdate,
} from "@/types/microMaestros/clasificacionCentrosFisicosTypes";

export const clasificacionCentrosFisicosTypes = () => {
  return null;
}

export default clasificacionCentrosFisicosTypes

// Grilla de ubicaciones
export const fetchClasificacionCentroFisico = async (
  query: ClasificacionesCentrosFisicosFiltradasRequest,
  onlyNames: boolean = false // Parámetro para controlar si se devuelven solo los nombres
): Promise<any> => {
  try {
    const res = await axiosMaestros.get("/centros-fisicos/clasificacion", {
      params: query
    });

    if (res.status === 200) {
      // Si el flag `onlyNames` está activado, devolver solo los nombres
      if (onlyNames) {
        return res.data.data.map((c: any) => c.nombre);
      } else {
        // Si no, devolver toda la estructura de la respuesta
        return res.data;
      }
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
    console.error("Error al buscar clasificaciones", error);
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
export const fetchClasificacionCentroFisicoById = async (
  id: number
): Promise<ClasificacionCentroFisicoDetalleResponce> => {
  try {
    const res = await axiosMaestros.get(`/centros-fisicos/clasificacion/${id}`);
    if (res.status == 200) {
      return res.data.data;
    }
  } catch (e) {
    if ((e as any).status == 404) {
      return {
        id: 0,
        nombre: "",
        cantidadCentrosFisicos: 0,
        estado: false,
      };
    }
  }
  
  return {
    id: 0,
    nombre: "",
    cantidadCentrosFisicos: 0,
    estado: false,
  };
};

export const desactivarCentro = async (
  query: ClasificacionCentroFisicoByIdRequest
) => {
  const res = await axiosMaestros.patch(
    "/centros-fisicos/clasificacion/desactivar",
    query
  );
  return res;
};

export const activarCentro = async (
  query: ClasificacionCentroFisicoByIdRequest
) => {
  const res = await axiosMaestros.patch(
    "/centros-fisicos/clasificacion/activar",
    query
  );
  return res;
};

export const exportClasificacionCentroFisico = async (
query: ClasificacionesCentrosFisicosFiltradasRequest
): Promise<Blob> => {
  try {
    const response = await axiosMaestros.get(
      "/centros-fisicos/clasificacion/descargar-clasificaciones",
      {
        params: query,
        responseType: "blob", // Para descargar el archivo como blob
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al exportar el archivo", error);
    throw error;
  }
};



export const fetchClasificaciones = async (): Promise<IdOption[]> => {
  const res = await axiosMaestros.get("/centros-fisicos/clasificacion");
  return res.data.data.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};

// Fetch all estados

export const postClasificacionCentroFisico = async (
  clasificacion: ClasificacionCentroFisicoCreate
) => {
  const res = await axiosMaestros.post(`/centros-fisicos/clasificacion`, clasificacion);
  
  return res;  
};


export const putClasificacionCentroFisico = async (
  clasificacion: ClasificacionCentroFisicoUpdate
 ) => {
  const res = await axiosMaestros.put(`/centros-fisicos/clasificacion`, clasificacion);
  
  return res;  
};

