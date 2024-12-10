import {axiosMaestros} from "@/config/axios/axiosMaestros";
import {
  GrupoArticulosByIdRequest,
  GrupoArticulosFiltradasRequest,
  GrupoArticulosFiltradasResponse,
  GrupoArticulosDetalleResponce,
  GrupoArticulosUpdate,
} from "../../types/microMaestros/grupoArticulosTypes";


const GrupoArticulosService = () => {
  return null;
}

export default GrupoArticulosService

// Grilla de centros
export const fetchGrupoArticulos = async (
  query: GrupoArticulosFiltradasRequest
): Promise<GrupoArticulosFiltradasResponse> => {
  try {
    
    const res = await axiosMaestros.get("/grupos-articulo", { params: query });

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
    console.error("Error al buscar grupos articulos", error);
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

// Para obtener Incidencia con ID
export const fetchIncidencia = async (query: string = "") => {
  const res = await axiosMaestros.get("/incidencias", {
    params: { Nombre: query },
  });
  return res.data.data.map((item: { codigo: number; nombre: string }) => ({ id: item.codigo, label: item.nombre }));
};

export const fetchIncidenciaNameById = async (id: number) => {
  const res = await axiosMaestros.get(`/grupos-articulo/incidencia/${id}`);
  return res.data.data.nombre;
};



// Obtener detalles por ID
export const fetchGrupoArticulosById = async (
  id: number
): Promise<GrupoArticulosDetalleResponce> => {
  try {
    const res = await axiosMaestros.get(`/grupos-articulo/${id}`);
    return res.data.data;
  } catch (e) {
    if (e instanceof Error && e.message.includes('404')) {
      return {
        id: 0,
        grupoArticulo: '',
        descripcion: '',
        incidenciaId:0,
        incidencia: '',
        // estado: false,
       
        cantidadRecursosAfectados: 0,
      };
    } else {
      // TODO: PENSAR LOS TIPOS DE ERRORES Y QUÉ DEVOLVER
      return {
        id: 0,
        grupoArticulo: '',
        descripcion: '',
        incidenciaId:0,
        incidencia: '',        // estado: false,
      
        cantidadRecursosAfectados: 0,
      };
    }
  }
};

// // Desactivar centro físico
// export const desactivarCentro = async (query: GrupoArticulosByIdRequest) => {
//   const res = await axiosMaestros.patch("/grupos-articulo/desactivar", query);
//   return res;
// };

// // Activar centro físico
// export const activarCentro = async (query: GrupoArticulosByIdRequest) => {
//   const res = await axiosMaestros.patch("/grupos-articulo/activar", query);
//   return res;
// };


export const exportGrupoArticulos = async (
  query:GrupoArticulosFiltradasRequest
): Promise<Blob> => {
  try {

    const response = await axiosMaestros.get("/grupos-articulo/descargar", {
      params: query,
      responseType: "blob", 
    });

    return response.data; 
  } catch (error) {
    console.error("Error al exportar los grupos artículos", error);
    throw error;
  }
};

export const putGrupoArticulos = async (body: GrupoArticulosUpdate) => {
  const res = await axiosMaestros.put("/grupos-articulo", body);
  return res;
};
