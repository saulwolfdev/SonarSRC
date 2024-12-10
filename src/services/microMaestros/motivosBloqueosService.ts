import { axiosMaestros } from "@/config/axios/axiosMaestros";
import { MotivoBloqueoFiltradoRequest, MotivoBloqueoGridData, PaginacionAPI } from "@/types/microMaestros/motivosBloqueosTypes";

// Obtener lista de motivos de bloqueos con filtros
export const fetchMotivosBloqueos = async (
  query: MotivoBloqueoFiltradoRequest
): Promise<{ data: MotivoBloqueoGridData[]; paginationData: PaginacionAPI }> => {
  const response = await axiosMaestros.get("/motivos-bloqueo", { params: query });
  return response.data;
};


// Obtener detalle de un motivo de bloqueo por ID
export const fetchMotivoBloqueoById = async (id: number) => {
  try {
    const response = await axiosMaestros.get(`/motivos-bloqueo/${id}`);
    return response.data; // Cambiado de response.data.data a response.data
  } catch (error) {
    console.error("Error al obtener el motivo de bloqueo:", error);
    throw new Error("No se pudo obtener el motivo de bloqueo.");
  }
};


// Actualizar motivo de bloqueo
// Actualizar motivo de bloqueo
export const patchMotivoBloqueo = async (data: { id: number; enviaNotificacion: boolean; enviaComunicacionFormal: boolean; }) => {
  await axiosMaestros.patch(`/motivos-bloqueo`, data);
};


// Exportar motivos de bloqueos
export const exportMotivosBloqueos = async (query: MotivoBloqueoFiltradoRequest) => {
  const response = await axiosMaestros.get("/motivos-bloqueo/export", {
    params: query,
    responseType: "blob",
  });
  return response.data;
};

// Obtener lista de orígenes
export const fetchOrigenes = async () => {
  const response = await axiosMaestros.get("/origenes-informacion");
  return response.data.data.origenes;
};
