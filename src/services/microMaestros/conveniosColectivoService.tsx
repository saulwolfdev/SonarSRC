import { axiosMaestros } from "@/config/axios/axiosMaestros";
import { ConvenioByIdRequest, ConvenioCreate, ConvenioDetalleResponce, ConveniosFiltradasRequest, ConveniosFiltradasResponse } from "@/types/microMaestros/convenioColectivoTypes";


// Grilla de asociacion gremial
export const fetchConvenios = async (
  query: ConveniosFiltradasRequest
): Promise<ConveniosFiltradasResponse> => {
  try {
  
    const res = await axiosMaestros.get("/gremios/convenios-colectivos", {
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
export const fetchConvenioById = async ({
  id,
}: ConvenioByIdRequest): Promise<ConvenioDetalleResponce> => {
  try {
    const res = await axiosMaestros.get(`/gremios/convenios-colectivos/${id}`);
    return res.data.data;
  } catch (e) {
    return {
      codigo: 0,
      nombre: "",
      horasDiariasDeTrabajo: "",
      asociacionesGremiales: "",
      estado: false,
    };
  }
};

export const exportConvenios = async (
  query: ConveniosFiltradasRequest
): Promise<Blob> => {
  try {
    const response = await axiosMaestros.get("/gremios/convenios-colectivos/exportar", {
      params: query,
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    console.error("Error al exportar las asociaciones gremiales", error);
    throw error;
  }
};

export const postConvenio = async (body: ConvenioCreate) => {
  const res = await axiosMaestros.post("/gremios/convenios-colectivos ", body);
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


export const fetchPAsociacionesArgentinasHabilitadas = async (query: string = "") => {
  const res = await axiosMaestros.get("/gremios/asociaciones-gremiales", { 
    params: { Nombre: query , Estado: true , SoloArgentinas: true},
  });
  return res.data.data.map((item: { codigo: number; nombre: string }) => ({ id: item.codigo, label: item.nombre }));
};



const dummy = () => {console.log('...')}; // dummy function for export default

export default dummy