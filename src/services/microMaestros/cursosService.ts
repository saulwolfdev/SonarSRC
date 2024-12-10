import {axiosMaestros} from "@/config/axios/axiosMaestros";
import {
  CursosByIdRequest,
  CursosFiltradasRequest,
  CursosFiltradasResponse,
  CursosDetalleResponce,
  CursosCreate,
  CursosUpdate,
  DesactivarConMotivoRequest,
  ListaModalidadRequest,
  ListaModalidadResponse,
} from "../../types/microMaestros/cursosTypes";


const CursosService = () => {
  return null;
}

export default CursosService

export const fetchCursos = async (
  query: CursosFiltradasRequest
): Promise<CursosFiltradasResponse> => {
  try {
    console.log('query', query);
    const res = await axiosMaestros.get("/cursos", { params: query });
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
    console.error("Error al buscar cursos", error);
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

export const fetchEstados = async () => {
  return [
    { id: 1, label: "Activo" },
    { id: 2, label: "Inactivo" },
  ];
};


// Obtener detalles por ID
export const fetchCursosById = async (
  id: number
): Promise<CursosDetalleResponce> => {
  try {
    const res = await axiosMaestros.get(`/cursos/${id}`);
    return res.data.data;
  } catch (e) {
    if (e instanceof Error && e.message.includes('404')) {
      return {
        id: 0,
        nombre: "",
        especialidad: "",
        institucion: "",
        areaSolicitante:"",
        modalidad:{
          id: 0,
          nombre: "",
        },
        horas: 0,
        estado: false,
        cantidadRecursosAfectados: 0,
      };
    } else {
      // TODO: PENSAR LOS TIPOS DE ERRORES Y QUÉ DEVOLVER
      return {
        id: 0,
        nombre: "",
        especialidad: "",
        institucion: "",
        areaSolicitante:"",
        modalidad:{
          id: 0,
          nombre: "",
        },        horas: 0,
        estado: false,
        cantidadRecursosAfectados: 0,
      };
    }
  }
};

// Desactivar
export const desactivarCurso = async (body: DesactivarConMotivoRequest) => {
  const res = await axiosMaestros.patch("/cursos/desactivar", body);
  return res;
};

// Activar 
export const activarCurso = async (query: CursosByIdRequest) => {
  const res = await axiosMaestros.patch("/cursos/activar", query);
  return res;
};

// Listado de MODALIDAD
// export const fetchModalidades = async (query: ListaModalidadRequest): Promise<ListaModalidadResponse> => {
//   const res = await axiosMaestros.get('/cursos/modalidades', {
//     params: {
//       nombre: query.nombre
//     }
//   })
//   if (res.status == 200) {
//     return res.data
//   } else {
//     const modalidadesNull: ListaModalidadResponse = { data: [], paginationData: { pageNumber: 1, pageSize: 1, totalPages: 1, totalCount: 0 } }
//     return modalidadesNull
//   }
// };

export const fetchModalidades = async (query: string = "") => {
  const res = await axiosMaestros.get("/cursos/modalidades", {
    params: { Nombre: query },
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};

export const exportCursos = async (
  query:CursosFiltradasRequest
): Promise<Blob> => {
  try {

    const response = await axiosMaestros.get("/cursos/descargar", {
      params: query,
      responseType: "blob", 
    });

    return response.data; 
  } catch (error) {
    console.error("Error al exportar los cursos", error);
    throw error;
  }
};

export const postCursos = async (body: CursosCreate) => {
  console.log('body',body);
  
  const res = await axiosMaestros.post("/cursos", body);
  return res;
};

export const putCursos = async (body: CursosUpdate) => {
  const res = await axiosMaestros.put("/cursos", body);
  return res;
};
