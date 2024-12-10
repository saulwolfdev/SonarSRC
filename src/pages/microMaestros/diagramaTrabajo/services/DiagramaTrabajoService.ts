import { DiagramaTrabajoChange, DiagramaTrabajoCreateRequest, DiagramaTrabajoCreateResponse, DiagramaTrabajoDetalleResponse, DiagramaTrabajoFiltradoRequest, DiagramaTrabajoFiltradoResponse, DiagramaTrabajoUpdateRequest} from "../types/diagramaTrabajoTypes";
import { axiosMaestros } from "@/config/axios/axiosMaestros";

const DiagramaTrabajoService = () => {
  return (
    null
  )
}

export default DiagramaTrabajoService

export const fetchDiagramaTrabajo = async (
  query: DiagramaTrabajoFiltradoRequest
): Promise<DiagramaTrabajoFiltradoResponse> => {
  try {
    const res = await axiosMaestros.get("/diagramas-trabajo", { params: query });
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

export const fetchLocalidadesDiagramaTrabajo = async (query: string = "") => {
  const res = await axiosMaestros.get("/ubicaciones/localidades", {
    params: { Nombre: query },
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};


export const postDiagramaTrabajo = async (query: DiagramaTrabajoCreateRequest) => {
  const res = await axiosMaestros.post<DiagramaTrabajoCreateResponse>(
  '/diagramas-trabajo',
  query,
  {
    headers: {
      'Content-Type': 'application/json',
    },
  }
);
  return res;
};

export const exportDiagramaTrabajo = async (
  query: DiagramaTrabajoFiltradoRequest
): Promise<Blob> => {
  try {
    if (query.pageNumber !== undefined && !isNaN(query.pageNumber)) {
      query.pageNumber = 1;
    }
    if (query.pageSize !== undefined && !isNaN(query.pageSize)) {
      query.pageSize = 10;
    }

    const response = await axiosMaestros.get("/diagramas-trabajo/exportar", {
      params: query,
      responseType: "blob", 
    });

    return response.data; 
  } catch (error) {
    console.error("Error al exportar los contratos", error);
    throw error;
  }
};

export const exportDiagramaTrabajoMasivo = async (
  query: DiagramaTrabajoFiltradoRequest
): Promise<Blob> => {
  try {
    if (query.pageNumber !== undefined && !isNaN(query.pageNumber)) {
      query.pageNumber = 1;
    }
    if (query.pageSize !== undefined && !isNaN(query.pageSize)) {
      query.pageSize = 10;
    }

    const response = await axiosMaestros.get("/diagramas-trabajo/exportar-masivo", {
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


export const fetchDiagramaTrabajoById = async (id: number): Promise<DiagramaTrabajoDetalleResponse> => {
  try {
    const res = await axiosMaestros.get(`/diagramas-trabajo/${id}`);
    if (res.status === 200) {
      return res.data.data;
    } else {
      const funcionNull: DiagramaTrabajoDetalleResponse = { 
        id: 0, 
        nombre: "", 
        cuit: "", 
        estado: false
      };
      return funcionNull;
    }
  } catch (error) {
    const funcionNull: DiagramaTrabajoDetalleResponse = { 
      id: 0, 
      nombre: "", 
      cuit: "", 
      estado: false
    };
    return funcionNull;
  }
};


export const putDiagramaTrabajo = async (
  query: DiagramaTrabajoUpdateRequest
): Promise<void> => { 
  try {
    const response = await axiosMaestros.put<void>(
      `/diagramas-trabajo`, 
      query,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Unexpected response status");
    }
  } catch (error: any) {
    throw error.response?.data || error;
  }

};

export const desactivarDiagramaTrabajo = async (query: DiagramaTrabajoChange) => {
  const res = await axiosMaestros.patch(  "/diagramas-trabajo/desactivar", query );
  return res;
};

export const activarDiagramaTrabajo = async ( query: DiagramaTrabajoChange) => {
  const res = await axiosMaestros.patch( "/diagramas-trabajo/activar",query);
  return res;
};