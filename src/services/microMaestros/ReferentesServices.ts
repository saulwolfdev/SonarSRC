import {axiosMaestros} from "@/config/axios/axiosMaestros";
import { ReferenteUpdateRequest, ReferenteDetalleResponse, ReferenteChange, ReferenteFiltradoRequest, ReferenteCreateRequest, ReferenteCreateResponse, ReferenteFiltradoResponse } from "@/types/microMaestros/ReferentesTypes";

const ReferentesServices = () => {
  return (
    null
  )
}

export default ReferentesServices


export const putReferente = async (
  query: ReferenteUpdateRequest
): Promise<void> => {
  try {
    const response = await axiosMaestros.put<void>(
      `/estudios-auditores/referentes`,
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


export const fetchReferenteById = async (id: number): Promise<ReferenteDetalleResponse> => {
  try {
    const res = await axiosMaestros.get(`/estudios-auditores/referentes/${id}`);
    if (res.status === 200 && res.data.isSuccess) {
      return res.data.data;
    } else {
      const referenteNull: ReferenteDetalleResponse = {
        id: 0,
        sedeId: 0,
        usuarioEPId: 0,
        nombre: "",
        email: "",
        rolEspecialidad: "",
        estado: false,
      };
      return referenteNull;
    }
  } catch (error) {
    const referenteNull: ReferenteDetalleResponse = {
      id: 0,
      sedeId: 0,
      usuarioEPId: 0,
      nombre: "",
      email: "",
      rolEspecialidad: "",
      estado: false,
    };
    return referenteNull;
  }
};

export const desactivarReferente = async (query: ReferenteChange) => {
  const res = await axiosMaestros.patch("/estudios-auditores/referentes/desactivar", query);
  return res;
};

export const activarReferente = async (query: ReferenteChange) => {
  const res = await axiosMaestros.patch("/estudios-auditores/referentes/activar", query);
  return res;
};



export const exportReferentes = async (
  query: ReferenteFiltradoRequest
): Promise<Blob> => {
  try {
    if (query.pageNumber !== undefined && !isNaN(query.pageNumber)) {
      query.pageNumber = 1;
    }
    if (query.pageSize !== undefined && !isNaN(query.pageSize)) {
      query.pageSize = 10;
    }

    const response = await axiosMaestros.get("/estudios-auditores/referentes/exportar", {
      params: query,
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    console.error("Error al exportar los contratos", error);
    throw error;
  }
};


export const postReferente = async (query: ReferenteCreateRequest) => {
  const res = await axiosMaestros.post<ReferenteCreateResponse>(
    '/estudios-auditores/referente',
    query,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return res;
};


export const fetchReferentes = async (
  query: ReferenteFiltradoRequest
): Promise<ReferenteFiltradoResponse> => {
  try {
    const res = await axiosMaestros.get("/estudios-auditores/referentes", { params: query });

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
    console.error("Error al buscar sedes", error);
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