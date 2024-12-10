import { axiosMaestros } from "@/config/axios/axiosMaestros";
import { TitulosAcademicosFiltradoRequest, TitulosAcademicosFiltradoResponse, TitulosAcademicosCreateRequest, TitulosAcademicosCreateResponse, TitulosAcademicosDetalleResponse, TitulosAcademicosDesactivar, TitulosAcademicosActivar, TitulosAcademicosUpdateRequest } from "../../types/microMaestros/TitulosAcademicosTypes";

const TitulosAcademicosService = () => {
  return (
    null
  )
}

export default TitulosAcademicosService

export const fetchTitulosAcademicos = async (
  query: TitulosAcademicosFiltradoRequest
): Promise<TitulosAcademicosFiltradoResponse> => {
  try {
    const res = await axiosMaestros.get("/titulos-academicos", { params: query });
    console.log(res)

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
    console.error("Error al buscar diagrama", error);
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

export const fetchLocalidadesTitulosAcademicos = async (query: string = "") => {
  const res = await axiosMaestros.get("/ubicaciones/localidades", {
    params: { Nombre: query },
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};


export const postTitulosAcademicos = async (query: TitulosAcademicosCreateRequest) => {
  const res = await axiosMaestros.post<TitulosAcademicosCreateResponse>(
  '/titulos-academicos',
  query,
  {
    headers: {
      'Content-Type': 'application/json',
    },
  }
);
  return res;
};

export const exportTitulosAcademicos = async (
  query: TitulosAcademicosFiltradoRequest
): Promise<Blob> => {
  try {
    if (query.pageNumber !== undefined && !isNaN(query.pageNumber)) {
      query.pageNumber = 1;
    }
    if (query.pageSize !== undefined && !isNaN(query.pageSize)) {
      query.pageSize = 10;
    }

    const response = await axiosMaestros.get("/titulos-academicos/descargar", {
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

export const fetchTitulosAcademicosById = async (id: number): Promise<TitulosAcademicosDetalleResponse> => {
  try {
    const res = await axiosMaestros.get(`/titulos-academicos/${id}`);
    if (res.status === 200) {
      return res.data.data;
    } else {
      const funcionNull: TitulosAcademicosDetalleResponse = { 
        id: 0, 
        nombre: "", 
        estado: false
      };
      return funcionNull;
    }
  } catch (error) {
    const funcionNull: TitulosAcademicosDetalleResponse = { 
      id: 0, 
      nombre: "",
      estado: false
    };
    return funcionNull;
  }
};


export const desactivarTitulosAcademicos = async (query: TitulosAcademicosDesactivar) => {
  const res = await axiosMaestros.patch(  "/titulos-academicos/desactivar", query );
  return res;
};

export const activarTitulosAcademicos = async ( query: TitulosAcademicosActivar) => {
  const res = await axiosMaestros.patch( "/titulos-academicos/activar",query);
  return res;
};

export const putTitulosAcademicos = async ( query: TitulosAcademicosUpdateRequest) => {
  const res = await axiosMaestros.patch( "/titulos-academicos/",query);
  return res;
}