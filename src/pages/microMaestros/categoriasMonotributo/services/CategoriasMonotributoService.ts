import { axiosMaestros } from "@/config/axios/axiosMaestros";
import { CategoriasMonotributoActivar, CategoriasMonotributoCreateRequest, CategoriasMonotributoCreateResponse, CategoriasMonotributoDesactivar, CategoriasMonotributoDetalleResponse, CategoriasMonotributoFiltradoRequest, CategoriasMonotributoFiltradoResponse, CategoriasMonotributoUpdateRequest} from "../types/CategoriasMonotributoTypes";

const CategoriasMonotributoService = () => {
  return (
    null
  )
}

export default CategoriasMonotributoService

export const fetchCategoriasMonotributo = async (
  query: CategoriasMonotributoFiltradoRequest
): Promise<CategoriasMonotributoFiltradoResponse> => {
  try {
    const res = await axiosMaestros.get("/categorias-monotributos", { params: query });
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

export const fetchLocalidadesCategoriasMonotributo = async (query: string = "") => {
  const res = await axiosMaestros.get("/ubicaciones/localidades", {
    params: { Nombre: query },
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};


export const postCategoriasMonotributo = async (query: CategoriasMonotributoCreateRequest) => {
  const res = await axiosMaestros.post<CategoriasMonotributoCreateResponse>(
  '/categorias-monotributos',
  query,
  {
    headers: {
      'Content-Type': 'application/json',
    },
  }
);
  return res;
};

export const exportCategoriasMonotributo = async (
  query: CategoriasMonotributoFiltradoRequest
): Promise<Blob> => {
  try {
    if (query.pageNumber !== undefined && !isNaN(query.pageNumber)) {
      query.pageNumber = 1;
    }
    if (query.pageSize !== undefined && !isNaN(query.pageSize)) {
      query.pageSize = 10;
    }

    const response = await axiosMaestros.get("/categorias-monotributos/descargar", {
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

export const fetchCategoriasMonotributoById = async (id: number): Promise<CategoriasMonotributoDetalleResponse> => {
  try {
    const res = await axiosMaestros.get(`/categorias-monotributos/${id}`);
    if (res.status === 200) {
      return res.data.data;
    } else {
      const funcionNull: CategoriasMonotributoDetalleResponse = { 
        id: 0, 
        nombre: "", 
        estado: false
      };
      return funcionNull;
    }
  } catch (error) {
    const funcionNull: CategoriasMonotributoDetalleResponse = { 
      id: 0, 
      nombre: "",
      estado: false
    };
    return funcionNull;
  }
};


export const desactivarCategoriasMonotributo = async (query: CategoriasMonotributoDesactivar) => {
  const res = await axiosMaestros.patch(  "/categorias-monotributos/desactivar", query );
  return res;
};

export const activarCategoriasMonotributo = async ( query: CategoriasMonotributoActivar) => {
  const res = await axiosMaestros.patch( "/categorias-monotributos/activar",query);
  return res;
};

export const putCategoriasMonotributo = async ( query: CategoriasMonotributoUpdateRequest) => {
  const res = await axiosMaestros.patch( "/categorias-monotributos/",query);
  return res;
}