import {axiosMaestros} from "@/config/axios/axiosMaestros";
import {
  SociedadesByIdRequest,
  SociedadesFiltradasRequest,
  SociedadesFiltradasResponse,
  SociedadesDetalleResponse,
} from "@/types/microMaestros/sociedadesTypes";

// Grilla de ubicaciones
export const fetchSociedades = async (
  query: SociedadesFiltradasRequest
): Promise<SociedadesFiltradasResponse> => {
  try {
    const params: Record<string, string | number | boolean | undefined> = {
      PageNumber: query.pageNumber || 1,
      PageSize: query.pageSize || 10,
      Nombre: query.nombre,
      Estado: query.estado,
      Origen: query.origen,
      CodigoSap: query.codigoSap
    };

    const res = await axiosMaestros.get("/sociedades", { params });

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
    console.error("Error al buscar sociedades", error);
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


// Para obtener orígenes con ID
export const fetchOrigenes = async (query: string = "") => {
  const res = await axiosMaestros.get("/sociedades/origenes", {
    params: { Origen: query },
  });
  return res.data.data.map((item: { id: number; origen: string }) => ({ id: item.id, label: item.origen }));
};

export const fetchCodigoSap = async (query: string = "") => {
  const res = await axiosMaestros.get("/ubicaciones/codigoSap", {
    params: { CodigoSap: query },
  });
  return res.data.data.map((item: { id: number; codigoSap: string }) => ({ id: item.id, label: item.codigoSap }));
};



// Obtener detalles por ID
export const fetchSociedadesById = async (
  id: number
): Promise<SociedadesDetalleResponse> => {
  try {
    const res = await axiosMaestros.get(`/sociedades/${id}`);
    return res.data.data;
  } catch (e) {
    console.error('Error fetching sociedad by ID', e);
    return {
      id: 0,
      nombre: '',
      estado: false,
      cantidadRecursosAfectados: 0,
    };
  }
};




// Desactivar Sociedades
export const desactivarSociedades = async (query: { id: number, motivo: string }) => {
  const res = await axiosMaestros.patch("/sociedades/desactivar", query);
  return res;
};



// Activar Sociedades
export const activarSociedades = async (query: { id: number }) => {
  const res = await axiosMaestros.patch("/sociedades/activar", query);
  return res;
};



export const exportSociedades = async (
  nombre?: string,
  origen?: string,
  codigoSap?: string,
  estado?: boolean
): Promise<Blob> => {
  try {
    const params: Record<string, string | number | boolean | undefined> = {
      PageNumber: 1,
      PageSize: 10,
    };

    if (nombre) params.Nombre = nombre;
    if (origen) params.Origen = origen;
    if (codigoSap) params.CodigoSap = codigoSap;
    if (estado !== undefined) params.Estado = estado;

    const response = await axiosMaestros.get("/sociedades/export", {
      params,
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    console.error("Error al exportar las sociedades", error);
    throw error;
  }
};


// Obtener la cantidad de contratos asociados a una sociedad por ID
export const fetchCantidadContratosAsociados = async (id: number) => {
  try {
    const res = await axiosMaestros.get(`/sociedades/cantidadContratosAsociados?SociedadId=${id}`);
    return res.data.data.cantidadContratos;
  } catch (error) {
    console.error("Error fetching cantidadContratosAsociados", error);
    return 0; // Devuelve 0 en caso de error
  }
};

const dummy = () => {console.log('...')}; // dummy function for export default

export default dummy