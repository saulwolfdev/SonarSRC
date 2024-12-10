import { typeAlert } from "@/components/shared/SnackbarAlert";
import { axiosMaestros } from "@/config/axios/axiosMaestros";
import {
  CompaniasAseguradorasByIdDTO,
  CompaniasAseguradorasFiltradasRequest,
  CompaniasAseguradorasFiltradasResponse,
  CompaniaAseguradoraCreateRequest,
  CompaniasAseguradorasUpdate,
  CompAseguradorasCargaMasivaResponse,
  CompaniasAseguradorasDetalleDTO,
} from "@/types/microMaestros/companiasAseguradorasTypes";


const CompaniasAseguradorasService = () => {
  return null;
}

export default CompaniasAseguradorasService

// Grilla
export const fetchCompaniasAseguradoras = async (
  query: CompaniasAseguradorasFiltradasRequest
): Promise<CompaniasAseguradorasFiltradasResponse> => {
  try {
    
    const res = await axiosMaestros.get("/companias-aseguradoras", { params: query });

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
    console.error("Error al buscar compañias aseguradoras", error);
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
import axios from "axios";
import { axiosContratos } from "@/pages/microContratos/config/axiosConfig";
import { IdOption } from "@/types/microMaestros/GenericTypes";

// fetch CONTRATISTAS

export const fetchContratista = async (query: string = ""): Promise<IdOption[]> => {
  const res = await axiosContratos.get("/contratistas", {
    params: { Nombre: query },
  });
  return res.data.data.map((item: { id: number; razonSocial: string }) => ({ id: item.id, label: item.razonSocial }));
};

// Fetch Contratista Name by ID
export const fetchContratistaNameById = async (id: number): Promise<string> => {
  const res = await axiosContratos.get(`/contratistas/${id}`);
  return res.data.data.razonSocial;
};



// Fetch Tipo de Seguro
export const fetchTipoDeSeguro = async (query: string = "", pageSize: number = 10): Promise<IdOption[]> => {
  const res = await axiosMaestros.get("/tipos-seguros", {
    params: { Nombre: query, pageSize: pageSize },
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};

// Fetch Tipo de Seguro Name by ID
export const fetchTipoDeSeguroNameById = async (id: number): Promise<string> => {
  const res = await axiosMaestros.get(`/tipos-seguros/${id}`);
  return res.data.data.nombre;
};



// // fetch TIPO SEGURO EXEPTUADO

export const fetchTipoDeSeguroExceptuado = async (query: string = "") => {
  const res = await axiosMaestros.get("/tipos-seguros", {
    params: { Nombre: query },
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};

export const fetchTipoDeSeguroExceptuadoNameById = async (id: number) => {
  const res = await axiosMaestros.get(`/tipos-seguros/${id}`);
  return res.data.data.nombre;
};

// Obtener detalles por ID
export const fetchCompaniasAseguradorasById = async (
  id: number
): Promise<CompaniasAseguradorasDetalleDTO> => {
  try {
    const res = await axiosMaestros.get(`/companias-aseguradoras/${id}`);
    return res.data.data;
  } catch (e) {
    if (e instanceof Error && e.message.includes('404')) {
      return {
        id: 0,
        nombre: '',
        estado: false,
        cuit: '',
        observacion: '',
        tiposSeguros: [],
        excepcionesSeguros:[
        {
          id: 0,
          tipoSeguro: {id: 0, nombre: '', estado: true},  
          contratistas: [],
        }], 
        cantidadRecursosAfectados: 0,
     
      };
    } else {
      // TODO: PENSAR LOS TIPOS DE ERRORES Y QUÉ DEVOLVER
      return {
        id: 0,
        nombre: '',
        estado: false,
        cuit: '',
        observacion: '',
        tiposSeguros: [],
        excepcionesSeguros:[
          {
            id: 0,
            tipoSeguro: {id: 0, nombre: '', estado: true},  
            contratistas: [],
          }], 
        cantidadRecursosAfectados: 0,
    
      };
    }
  }
};

// Desactivar 
export const desactivarCentro = async (query: CompaniasAseguradorasByIdDTO) => {
  const res = await axiosMaestros.patch("/companias-aseguradoras/desactivar", query);
  return res;
};

// Activar 
export const activarCentro = async (query: CompaniasAseguradorasByIdDTO) => {
  const res = await axiosMaestros.patch("/companias-aseguradoras/activar", query);
  return res;
};


export const exportCompaniasAseguradoras = async (
  query:CompaniasAseguradorasFiltradasRequest
): Promise<Blob> => {
  try {

    const response = await axiosMaestros.get("/companias-aseguradoras/descargar", {
      params: query,
      responseType: "blob", 
    });

    return response.data; 
  } catch (error) {
    console.error("Error al exportar las compañias aseguradas", error);
    throw error;
  }
};

export const postCompaniasAseguradoras = async (body: CompaniaAseguradoraCreateRequest) => {
  const res = await axiosMaestros.post("/companias-aseguradoras", body);
  return res;
};

export const putCompaniasAseguradoras = async (body: CompaniasAseguradorasUpdate) => {
  const res = await axiosMaestros.put("/companias-aseguradoras", body);
  return res;
};

export const downloadPlantilla = async (
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>,
  setAlertType: React.Dispatch<React.SetStateAction<typeAlert | undefined>>
): Promise<void> => {
  try {
    const res = await axiosMaestros.get('/companias-aseguradoras/descargar-plantilla', {
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
    setAlertMessage('Error al descargar la plantilla.');}
    setAlertType(typeAlert.error);
  }
};

export const postCompAseguradorasMasiva = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('FileContent', file); // Añadimos el archivo al FormData

    const res = await axiosMaestros.post<CompAseguradorasCargaMasivaResponse>(
      '/companias-aseguradoras/carga-masiva',
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


export const descargarErroresCompAseguradoras = async (
  cargaMasivaId: number
): Promise<Blob> => {
  try {
    const response = await axiosMaestros.get<Blob>(
      `/companias-aseguradoras/descargar-errores/${cargaMasivaId}`,
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