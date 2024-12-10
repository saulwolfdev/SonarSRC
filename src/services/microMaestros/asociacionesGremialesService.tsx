
const AsoGreService = () => {
  return (
    null
  )
}

export default AsoGreService
import { axiosMaestros } from "@/config/axios/axiosMaestros"
import {
  AsociacionesGremialesFiltradasRequest,
  AsociacionesGremialesFiltradasResponse,
  AsociacionGremialByIdRequest,
  AsociacionGremialCreate,
  AsociacionGremialDetalleResponce,
  AsociacionGremialUpdate,
} from "@/types/microMaestros/asociacionGremialTypes"

// Grilla de asociacion gremial
export const fetchAsociacionesGremiales = async (
  query: AsociacionesGremialesFiltradasRequest
): Promise<AsociacionesGremialesFiltradasResponse> => {
  try {
  
    const res = await axiosMaestros.get("/gremios/asociaciones-gremiales", {
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
export const fetchAsociacionGremialById = async ({
  id,
}: AsociacionGremialByIdRequest): Promise<AsociacionGremialDetalleResponce> => {
  try {
    const res = await axiosMaestros.get(`/gremios/asociaciones-gremiales/${id}`);
    return res.data.data;
  } catch (e) {
    return {
      codigo: 0,
      nombre: "",
      provincias: "",
      estado: false,
    };
  }
};

export const exportAsociacionesGremiales = async (
  query: AsociacionesGremialesFiltradasRequest
): Promise<Blob> => {
  try {
    const response = await axiosMaestros.get("/gremios/asociaciones-gremiales/exportar", {
      params: query,
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    console.error("Error al exportar las asociaciones gremiales", error);
    throw error;
  }
};

export const exportAsociacionesGremialesAnidados = async (
  query: AsociacionesGremialesFiltradasRequest
): Promise<Blob> => {
  try {
    const response = await axiosMaestros.get(
      "/gremios/asociaciones-gremiales/exportar-anidado",
      {
        params: query,
        responseType: "blob",
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al exportar las asociaciones gremiales", error);
    throw error;
  }
};
export const postAsociacionGremial = async (body: AsociacionGremialCreate) => {
  const res = await axiosMaestros.post("/gremios/asociaciones-gremiales ", body);
  return res;
};

export const putAsociacionGremial = async (body: AsociacionGremialUpdate) => {
  const res = await axiosMaestros.put("/gremios/asociaciones-gremiales ", body);
  return res;
};

/* 
---------------------------------------------------------------------------------------
--------------------------------------FILTROS------------------------------------------
---------------------------------------------------------------------------------------

*/




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



/* 
---------------------------------------------------------------------------------------
-----------------------------FORMULARIO CREAR------------------------------------------
---------------------------------------------------------------------------------------
*/


export const fetchProvinciasArgentinasHabilitadas = async (query: string = "") => {
  const res = await axiosMaestros.get("/ubicaciones/provincias-argentinas", {
    params: { Nombre: query , Estado: true },
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};


export const fetchConveniosColectivos = async (query: string = "") => {

  const res = await axiosMaestros.get("/gremios/convenios-colectivos", {
    params: { Nombre: query , Estado: true },
  });
  return res.data.data.map((item: { codigo: number; nombre: string }) => ({ id: item.codigo, label: item.nombre }));
};
