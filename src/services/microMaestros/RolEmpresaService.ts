import { axiosMaestros } from "@/config/axios/axiosMaestros";
import {
  RolEmpresaAPI,
  RolEmpresaCreate,
  RolEmpresaFiltradoRequest,
  RolEmpresaFiltradosResponse,
  RolEmpresaUpdate,
} from "@/types/microMaestros/rolEmpresaTypes";

// Obtener lista de roles de empresa con filtros
export const fetchRolesEmpresas = async (
  query: RolEmpresaFiltradoRequest
): Promise<RolEmpresaFiltradosResponse> => {
  try {
    // Creo una copia del objeto query para no mutar el original
    const backendQuery: any = { ...query };

    // Si 'codigo' existe, mapeo a 'Id' y elimino 'codigo'
    if (backendQuery.codigo) {
      backendQuery.Id = backendQuery.codigo;
      delete backendQuery.codigo;
    }

    const res = await axiosMaestros.get("/roles-empresas", { params: backendQuery });
    return res.data;
  } catch (error) {
    console.error("Error al buscar roles de empresa", error);
    return {
      data: [],
      paginationData: {
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1,
      },
    };
  }
};

// Obtener detalle por ID
export const fetchRolEmpresaById = async (id: number): Promise<RolEmpresaAPI> => {
  try {
    const res = await axiosMaestros.get(`/roles-empresas/${id}`);
    return res.data.data;
  } catch (error) {
    console.error("Error al obtener rol de empresa por ID", error);
    throw error;
  }
};

// Crear nuevo rol de empresa
export const postRolEmpresa = async (body: RolEmpresaCreate) => {
  const res = await axiosMaestros.post("/roles-empresas", body);
  return res;
};

// Actualizar rol de empresa
export const patchRolEmpresa = async (body: RolEmpresaUpdate) => {
  try {
    const res = await axiosMaestros.patch(`/roles-empresas`, body);
    return res;
  } catch (error) {
    console.error("Error al actualizar rol de empresa", error);
    throw error;
  }
};

// Activar Rol Empresa
export const patchActivarRolEmpresa = async (id: number): Promise<void> => {
  try {
    await axiosMaestros.patch("/roles-empresas/activar", { id });
  } catch (error) {
    console.error("Error al activar el rol de empresa", error);
    throw error;
  }
};

// Desactivar Rol Empresa
export const patchDesactivarRolEmpresa = async (id: number): Promise<void> => {
  try {
    await axiosMaestros.patch("/roles-empresas/desactivar", { id });
  } catch (error) {
    console.error("Error al desactivar el rol de empresa", error);
    throw error;
  }
};



// Exportar roles de empresa
export const exportRolesEmpresas = async (
  query: RolEmpresaFiltradoRequest
): Promise<Blob> => {
  try {
    const response = await axiosMaestros.get("/roles-empresas/export", {
      params: query,
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error al exportar roles de empresa", error);
    throw error;
  }
};

const dummy = () => {console.log('...')}; // dummy function for export default

export default dummy