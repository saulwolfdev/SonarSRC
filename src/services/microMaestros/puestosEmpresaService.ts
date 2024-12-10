import { typeAlert } from "@/components/shared/SnackbarAlert";
import { axiosMaestros } from "@/config/axios/axiosMaestros";
import {
  PuestosEmpresaFiltradosRequest,
  PuestosEmpresaFiltradosResponse,
  PuestoEmpresaCreateRequest,
  PuestoEmpresaCreateResponse,
  PuestoEmpresaUpdateRequest,
  PuestoEmpresaUpdateResponse,
  PuestoEmpresaDetalleResponse,
  PuestoEmpresaByIdRequest,
  PuestoEmpresaCargaMasivaResponse,
  ListaNombreRequest,
  ListaResponse,
  EstadoOption,
} from "../../types/microMaestros/puestosEmpresaTypes";

const puestosEmpresaService = () => {
  return null;
};

export default puestosEmpresaService;

export const fetchPuestosEmpresa = async (
  query: PuestosEmpresaFiltradosRequest
): Promise<PuestosEmpresaFiltradosResponse> => {
  const res = await axiosMaestros.get("/puestos-empresas", {
    params: query,
  });

  if (res.status == 200) {
    return res.data;
  } else {
    const puestosNull: PuestosEmpresaFiltradosResponse = {
      data: [],
      paginationData: {
        pageNumber: 1,
        pageSize: 1,
        totalPages: 1,
        totalCount: 0,
      },
    };
    return puestosNull;
  }
};

// Puesto Empresa por Id
export const fetchPuestoEmpresaById = async (
  id: number
): Promise<PuestoEmpresaDetalleResponse> => {
  const res = await axiosMaestros.get(`/puestos-empresas/${id}`);
  console.log("API Response:", res.data);
  if (res.status == 200) {
    return res.data.data; // Cambia a res.data.data
  } else {
    const puestoNull: PuestoEmpresaDetalleResponse = {
      id: 0,
      nombre: "",
      codigoAfip: "",
      estado: false,
    };
    return puestoNull;
  }
};


export const desactivarPuestoEmpresa = async (
  query: PuestoEmpresaByIdRequest
) => {
  const res = await axiosMaestros.patch("/puestos-empresas/desactivar", query);
  return res;
};

export const activarPuestoEmpresa = async (
  query: PuestoEmpresaByIdRequest
) => {
  const res = await axiosMaestros.patch("/puestos-empresas/activar", query);
  return res;
};

export const exportPuestosEmpresa = async (
  query: PuestosEmpresaFiltradosRequest
): Promise<Blob> => {
  try {
    const response = await axiosMaestros.get("/puestos-empresas/export", {
      responseType: "blob", // Para recibir el archivo
      params: query,
    });
    return response.data;
  } catch (error) {
    console.error("Error al exportar el archivo", error);
    throw error;
  }
};

export const downloadPlantillaPuestosEmpresa = async (
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>,
  setAlertType: React.Dispatch<React.SetStateAction<typeAlert | undefined>>
): Promise<void> => {
  try {
    const res = await axiosMaestros.get(
      "/puestos-empresas/descargar-plantilla",
      {
        responseType: "blob",
      }
    );

    if (res.status === 200) {
      const blob = new Blob([res.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "PlantillaPuestosEmpresa.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setAlertMessage("Plantilla descargada con éxito");
      setAlertType(typeAlert.success);
    } else {
      throw new Error("Error inesperado al descargar la plantilla.");
    }
  } catch (error: any) {
      if(error.response.data.errors){
        setAlertMessage(error.response.data.errors[0].description);
      }
        else{
    setAlertMessage("Error al descargar la plantilla.");}
    setAlertType(typeAlert.error);
  }
};

export const getPuestoEmpresa = async (
  id: number
): Promise<PuestoEmpresaDetalleResponse> => {
  try {
    const response = await axiosMaestros.get(`/puestos-empresas/${id}`);
    console.log("API Response:", response.data); // Para verificar la estructura
    return response.data.data; // Ajuste: devolver data directamente
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const postPuestoEmpresa = async (
  body: PuestoEmpresaCreateRequest
) => {
  const res = await axiosMaestros.post("/puestos-empresas", body);
  return res;
};

export const postPuestosEmpresaMasiva = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("FileContent", file);

    const res = await axiosMaestros.post<PuestoEmpresaCargaMasivaResponse>(
      "/puestos-empresas/carga-masiva",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Unexpected response status");
    }
  } catch (error: any) {
    throw error.response?.data || error;
  }
};


export const patchPuestoEmpresa = async (
  query: PuestoEmpresaUpdateRequest
): Promise<PuestoEmpresaUpdateResponse> => {
  try {
    const response = await axiosMaestros.patch<PuestoEmpresaUpdateResponse>(
      "/puestos-empresas",
      query,
      {
        headers: {
          "Content-Type": "application/json",
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

export const descargarErroresPuestosEmpresa = async (
  cargaMasivaId: number
): Promise<Blob> => {
  try {
    const response = await axiosMaestros.get<Blob>(
      `/puestos-empresas/descargar-errores/${cargaMasivaId}`,
      {
        headers: {
          Accept: "*/*",
        },
        responseType: "blob",
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

export const fetchNombrePuestosEmpresa = async (
  query: ListaNombreRequest
): Promise<ListaResponse> => {
  try {
    const response = await axiosMaestros.get<ListaResponse>(
      "/puestos-empresas",
      {
        params: {
          nombre: query.nombre,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching nombre:", error);
    return {
      data: [],
      paginationData: {
        pageNumber: 1,
        pageSize: 1,
        totalPages: 1,
        totalCount: 0,
      },
    };
  }
};
