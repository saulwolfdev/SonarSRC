import { typeAlert } from "@/components/shared/SnackbarAlert";
import {axiosMaestros} from "@/config/axios/axiosMaestros";
import {AreasFiltradasRequest, AreasFiltradasResponse, AreasCreateRequest, AreasCreateResponse, AreasUpdateRequest, AreasUpdateResponse,AreasDetalleResponse,AreasByIdRequest, AreasCargaMasivaResponse, ListaCodigoRequest, ListaNombreRequest, AreasResponse, ListaResponse } from "@/types/microMaestros/areasTypes";

const AreasService = () => {
  return null;
}

export default AreasService

export const fetchName = async (
  query: AreasFiltradasRequest
): Promise<AreasFiltradasResponse> => {
  const res = await axiosMaestros.get("/areas",{
    params: {
      nombre: query.nombre,
      codigo: query.id,
      estado: query.estado,
      pageSize: query.pageSize,
      pageNumber: query.pageNumber
    }
  });
  
  if (res.status == 200) {
    return res.data
  } else {
    const clasificacionNull: AreasFiltradasResponse = {
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

export const fetchAreasById = async (id: number): Promise<AreasDetalleResponse> => {
  const res = await axiosMaestros.get(`/areas/${id}`)
  if (res.status == 200) {
    return res.data.data
  } else {
    const funcionNull: AreasDetalleResponse = { id: 0, nombre: "", cantidadRegistros: 0, estado: false}
    return funcionNull
  }
};

export const desactivarAreas = async (query: AreasByIdRequest) => {
  const res = await axiosMaestros.patch(  "/areas/desactivar", query );
  return res;
};

export const activarAreas = async ( query: AreasByIdRequest) => {
  const res = await axiosMaestros.patch( "/areas/activar",query);
  return res;
};

export const exportAreas = async (query: AreasFiltradasRequest): Promise<Blob> => {
  try {
    const response = await axiosMaestros.get('/areas/descargar', {
      responseType: 'blob', // Esto es para recibir el archivo
      params: query,
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
    const res = await axiosMaestros.get('/areas/descargar-plantilla', {
      responseType: 'blob', // Asegura que la respuesta se maneje como un Blob
    });

    if (res.status === 200) {
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', 'Plantilla.xlsx'); // Nombre del archivo
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

export const getAreas = async (id: number): Promise<AreasResponse> => {
  try {
    const response = await axiosMaestros.get<AreasResponse>(`/areas/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const postAreas = async (
  query: AreasCreateRequest
): Promise<AreasCreateResponse | null> => {
  try {
    console.log("Request payload:", query);
    
    const res = await axiosMaestros.post<AreasCreateResponse>(
      '/areas',
      query,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Change this condition to check for 201
    if (res.status === 201) {
      console.log("Response received:", res.data);
      return res.data;
    } else {
      console.error("Unexpected response status:", res.status, res.data);
      throw new Error("Unexpected response status");
    }
  } catch (error: any) {
    console.error("Error occurred:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

  
  export const postAreasMasiva = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('FileContent', file); // Añadimos el archivo al FormData
  
      const res = await axiosMaestros.post<AreasCargaMasivaResponse>(
        '/areas/carga-masiva',
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

  export const patchAreas = async (
    query: AreasUpdateRequest
  ): Promise<void> => { 
    try {
      const response = await axiosMaestros.put<void>(
        `/areas`, 
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

  export const descargarErroresAreas = async (
    cargaMasivaId: number
  ): Promise<Blob> => {
    try {
      const response = await axiosMaestros.get<Blob>(
        `/areas/descargar-errores/${cargaMasivaId}`,
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
      const response = await axiosMaestros.get<ListaResponse>('/areas', {
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
      const response = await axiosMaestros.get<ListaResponse>('/areas', {
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
  
  export const fetchAreasNameById = async ( id: number ): Promise<string> => {
    const res = await axiosMaestros.get(`/areas/${id}`);
    return res.data.data.nombre
  };  

