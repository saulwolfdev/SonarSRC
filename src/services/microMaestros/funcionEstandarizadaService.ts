import { typeAlert } from "@/components/shared/SnackbarAlert";
import {axiosMaestros} from  "@/config/axios/axiosMaestros";
import {FuncionesEstandarizadasFiltradasRequest, FuncionesEstandarizadasFiltradasResponse, FuncionEstandarizadaCreateRequest, FuncionEstandarizadaCreateResponse, FuncionEstandarizadaUpdateRequest, FuncionEstandarizadaUpdateResponse,FuncionEstandarizadaDetalleResponse,FuncionEstandarizadaByIdRequest, FuncionEstandarizadaCargaMasivaResponse, ListaCodigoRequest, ListaNombreRequest, FuncionEstandarizadaResponse, ListaResponse } from "@/types/microMaestros/funcionEstandarizadaTypes";

const funcionEstandarizadaService = () => {
  return null;
}

export default funcionEstandarizadaService

export const fetchName = async (
  query: FuncionesEstandarizadasFiltradasRequest
): Promise<FuncionesEstandarizadasFiltradasResponse> => {

  const res = await axiosMaestros.get("/funciones-estandarizadas",{
    params: query
  });
  
  if (res.status == 200) {
    return res.data
  } else {
    const clasificacionNull: FuncionesEstandarizadasFiltradasResponse = {
      data: [],
      paginationData: {
        pageNumber: 1,
        pageSize: 1,
        totalPages: 1,
        totalCount: 0,
      },
    };
    return clasificacionNull;
  }
};

// Provincia por Id 
export const fetchFuncionEstandarizadaById = async (id: number): Promise<FuncionEstandarizadaDetalleResponse> => {
  const res = await axiosMaestros.get(`/funciones-estandarizadas/${id}`)
  if (res.status == 200) {
    return res.data
  } else {
    const funcionNull: FuncionEstandarizadaDetalleResponse = { id: 0, nombre: "", cantidadRegistros: 0, estado: false}
    return funcionNull
  }
};

export const desactivarFuncionEstandarizada = async (query: FuncionEstandarizadaByIdRequest) => {
  const res = await axiosMaestros.patch(  "/funciones-estandarizadas/desactivar", query );
  return res;
};

export const activarFuncionEstandarizada = async ( query: FuncionEstandarizadaByIdRequest) => {
  const res = await axiosMaestros.patch( "/funciones-estandarizadas/activar",query);
  return res;
};

export const exportFuncionstandarizadaFisico = async (): Promise<Blob> => {
  try {
    const response = await axiosMaestros.get('/funciones-estandarizadas/export', {
      responseType: 'blob', // Esto es para recibir el archivo
    });
    return response.data;
  } catch (error) {
    console.error('Error al exportar el archivo', error);
    throw error;
  }
};

export const downloadPlantilla = async (
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>,
  setAlertType: React.Dispatch<React.SetStateAction<typeAlert | undefined>>
): Promise<void> => {
  try {
    const res = await axiosMaestros.get('/funciones-estandarizadas/descargar-plantilla', {
      responseType: 'blob', // Asegura que la respuesta se maneje como un Blob
    });

    if (res.status === 200) {
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', 'Funcion Estandarizada Masiva.xlsx'); // Nombre del archivo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setAlertMessage('Plantilla descargada con éxito');
      setAlertType(typeAlert.success);
    } else {
      throw new Error('Error inesperado al descargar la plantilla.');
    }
  } catch (error: any) {
      if(error.response.data.errors){
        setAlertMessage(error.response.data.errors[0].description);
      }
        else{
    setAlertMessage('Error al descargar la plantilla.');
        }
    setAlertType(typeAlert.error);
  }
};

export const getFuncionEstandarizada = async (id: number): Promise<FuncionEstandarizadaResponse> => {
  try {
    const response = await axiosMaestros.get<FuncionEstandarizadaResponse>(`/funciones-estandarizadas/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

  export const postFuncionEstandarizada = async (
    body: FuncionEstandarizadaCreateRequest
  )=> {
    const res = await axiosMaestros.post('/funciones-estandarizadas', body);
    return res;
  };
  
  export const postFuncionEstandarizadaMasiva = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('FileContent', file); // Añadimos el archivo al FormData
  
      const res = await axiosMaestros.post<FuncionEstandarizadaCargaMasivaResponse>(
        '/funciones-estandarizadas/carga-masiva',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (res.status === 200) {
        return res.data;
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error: any) {
      throw error.response?.data || error;
    }
  };

  export const patchFuncionEstandarizada = async (
    query: FuncionEstandarizadaUpdateRequest
  ): Promise<FuncionEstandarizadaUpdateResponse> => {
    try {
      const response = await axiosMaestros.patch<FuncionEstandarizadaUpdateResponse>(
        '/funciones-estandarizadas',
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

  export const descargarErroresFuncionEstandarizada = async (
    cargaMasivaId: number
  ): Promise<Blob> => {
    try {
      const response = await axiosMaestros.get<Blob>(
        `/funciones-estandarizadas/descargar-errores/${cargaMasivaId}`,
        {
          headers: {
            'Accept': '*/*',
          },
          responseType: 'blob', 
        }
      );
  
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error: any) {
      throw error.response?.data || error;
    }
  };

  export const fetchCodigo = async (query: ListaCodigoRequest): Promise<ListaResponse> => {
    try {
      const response = await axiosMaestros.get<ListaResponse>('/funciones-estandarizadas', {
        params: {
          codigo: query.codigo,
        },
      });
      return response.data;
    } catch (error: any) {
      return { data: [], paginationData: { pageNumber: 1, pageSize: 1, totalPages: 1, totalCount: 0 } };
    }
  };
  

  export const fetchNombre = async (query: ListaNombreRequest): Promise<ListaResponse> => {
    try {
      const response = await axiosMaestros.get<ListaResponse>('/funciones-estandarizadas', {
        params: {
          nombre: query.nombre,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching nombre:", error);
      return { data: [], paginationData: { pageNumber: 1, pageSize: 1, totalPages: 1, totalCount: 0 } };
    }
  };
  
  

