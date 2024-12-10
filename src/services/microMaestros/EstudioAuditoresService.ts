import { EstudioAuditorCreateRequest, EstudioAuditorCreateResponse, EstudioAuditorDetalleResponse, EstudioAuditorFiltradoRequest, EstudioAuditorFiltradoResponse, EstudioAuditorUpdateRequest} from "@/types/microMaestros/estudiosAuditoresTypes";
import {axiosMaestros} from "@/config/axios/axiosMaestros";
import { ReferenteChange } from "@/types/microMaestros/ReferentesTypes";

const EstudiosAuditoresService = () => {
  return (
    null
  )
}

export default EstudiosAuditoresService

export const fetchEstudiosAuditores = async (
  query: EstudioAuditorFiltradoRequest
): Promise<EstudioAuditorFiltradoResponse> => {
  try {
    const res = await axiosMaestros.get("/estudios-auditores", { params: query });
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
    console.error("Error al buscar estudios auditores", error);
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

export const fetchLocalidadesEstudioAuditor = async (query: string = "") => {
  const res = await axiosMaestros.get("/ubicaciones/localidades", {
    params: { Nombre: query },
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};


export const postEstudioAuditor = async (query: EstudioAuditorCreateRequest) => {
  const res = await axiosMaestros.post<EstudioAuditorCreateResponse>(
  '/estudios-auditores',
  query,
  {
    headers: {
      'Content-Type': 'application/json',
    },
  }
);
  return res;
};

export const exportEstudioAuditor = async (
  query: EstudioAuditorFiltradoRequest
): Promise<Blob> => {
  try {
    if (query.pageNumber !== undefined && !isNaN(query.pageNumber)) {
      query.pageNumber = 1;
    }
    if (query.pageSize !== undefined && !isNaN(query.pageSize)) {
      query.pageSize = 10;
    }

    const response = await axiosMaestros.get("/estudios-auditores/exportar", {
      params: query,
      responseType: "blob", 
    });

    return response.data; 
  } catch (error) {
    console.error("Error al exportar los contratos", error);
    throw error;
  }
};

export const exportEstudioAuditorMasivo = async (
  query: EstudioAuditorFiltradoRequest
): Promise<Blob> => {
  try {
    if (query.pageNumber !== undefined && !isNaN(query.pageNumber)) {
      query.pageNumber = 1;
    }
    if (query.pageSize !== undefined && !isNaN(query.pageSize)) {
      query.pageSize = 10;
    }

    const response = await axiosMaestros.get("/estudios-auditores/exportar-masivo", {
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


export const desactivarEstudioAuditor = async (query: ReferenteChange) => {
  const res = await axiosMaestros.patch(  "/estudios-auditores/desactivar", query );
  return res;
};

export const activarEstudioAuditor = async ( query: ReferenteChange) => {
  const res = await axiosMaestros.patch( "/estudios-auditores/activar",query);
  return res;
};

export const fetchEstudioAuditorById = async (id: number): Promise<EstudioAuditorDetalleResponse> => {
  try {
    const res = await axiosMaestros.get(`/estudios-auditores/${id}`);
    if (res.status === 200) {
      return res.data.data;
    } else {
      const funcionNull: EstudioAuditorDetalleResponse = { 
        id: 0, 
        nombre: "", 
        cuit: "", 
        estado: false,
        sedes: []
      };
      return funcionNull;
    }
  } catch (error) {
    const funcionNull: EstudioAuditorDetalleResponse = { 
      id: 0, 
      nombre: "", 
      cuit: "", 
      estado: false,
      sedes: [] 
    };
    return funcionNull;
  }
};


export const putEstudioAuditor = async (
  query: EstudioAuditorUpdateRequest
): Promise<void> => { 
  try {
    const response = await axiosMaestros.put<void>(
      `/estudios-auditores`, 
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