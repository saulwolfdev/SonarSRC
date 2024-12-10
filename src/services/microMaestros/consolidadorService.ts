import { axiosMaestros } from "@/config/axios/axiosMaestros";
import { //s
  GremiosConsolidadoresFiltradasRequest, GremiosConsolidadoresFiltradasResponse, GremioConsolidadorByIdRequest,
  GremioConsolidadorDetalleResponse, GremioConsolidadorCreate, GremioConsolidadorUpdate
}
  from "@/types/microMaestros/gremiosConsolidadoresTypes";

// Grilla de gremios consolidadores
export const fetchGremiosConsolidadores = async (
  query: GremiosConsolidadoresFiltradasRequest
): Promise<GremiosConsolidadoresFiltradasResponse> => {
  try {
    const res = await axiosMaestros.get("/gremios/gremios-consolidadores", {
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
    console.error("Error al buscar gremios consolidadores", error);
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
export const fetchGremioConsolidadorById = async ({ id }: GremioConsolidadorByIdRequest): Promise<GremioConsolidadorDetalleResponse> => {
  try {
    const res = await axiosMaestros.get(`/gremios/gremios-consolidadores/${id}`);
    return res.data.data;
  } catch (e) {
    return {
      codigo: 0,
      nombre: "",
      estado: false,
    };
  }
};


export const exportGremiosConsolidadores = async (
  query: GremiosConsolidadoresFiltradasRequest
): Promise<Blob> => {
  try {
    const response = await axiosMaestros.get("/gremios/gremios-consolidadores/exportar", {
      params: query,
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error al exportar los gremios consolidadores", error);
    throw error;
  }
};

export const exportGremiosConsolidadoresAnidados = async (
  query: GremiosConsolidadoresFiltradasRequest
): Promise<Blob> => {
  try {

    const response = await axiosMaestros.get("/gremios/gremios-consolidadores/exportar-anidado", {
      params: query,
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    console.error("Error al exportar los gremios consolidadores", error);
    throw error;
  }
};
export const postGremioConsolidador = async (body: GremioConsolidadorCreate) => {
  const res = await axiosMaestros.post("/gremios/gremios-consolidadores", body);
  return res;
};

export const putGremioConsolidador = async (body: GremioConsolidadorUpdate) => {
  const res = await axiosMaestros.put("/gremios/gremios-consolidadores", body);
  return res;
};
/* 
---------------------------------------------------------------------------------------
--------------------------------------FILTROS------------------------------------------
---------------------------------------------------------------------------------------
*/

// 03 Estados

//06 Listado de Provincias
export const fetchProvincias = async (query: string = "") => {
  const res = await axiosMaestros.get("/ubicaciones/provincias", {
    params: { Nombre: query },
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};

const dummy = () => { console.log('...') }; // dummy function for export default

export default dummy