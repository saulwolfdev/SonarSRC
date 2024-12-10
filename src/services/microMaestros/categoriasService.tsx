const CatType = () => {
  return (
    null
  )
}

export default CatType

import { axiosMaestros } from "@/config/axios/axiosMaestros"
import {
  CategoriasFiltradasRequest,
  CategoriasFiltradasResponse,
  CategoriaByIdRequest,
  CategoriaCreate,
  CategoriaDetalleResponce,
} from "@/types/microMaestros/categoriasTypes"

// Grilla de asociacion gremial
export const fetchCategorias = async (
  query: CategoriasFiltradasRequest
): Promise<CategoriasFiltradasResponse> => {
  try {
  
    const res = await axiosMaestros.get("/gremios/convenios-colectivos/titulos/categorias", {
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
export const fetchCategoriaById = async ({
  id,
}: CategoriaByIdRequest): Promise<CategoriaDetalleResponce> => {
  try {
    const res = await axiosMaestros.get(`/gremios/convenios-colectivos/titulos/categorias/${id}`);
    return res.data.data;
  } catch (e) {
    return {
      codigo: 0,
      nombre: "",
      estado: false,
    };
  }
};


export const postCategoria = async (body: CategoriaCreate) => {
  const res = await axiosMaestros.post("/gremios/convenios-colectivos/titulos/categorias ", body);
  return res;
};





