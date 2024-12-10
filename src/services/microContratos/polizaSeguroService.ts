import { NumberSchema } from "yup";
import {
  PolizaSeguroResponse, PolizaSeguroFiltradoRequest, PolizaSeguroFiltradoResponse, PolizaSeguroCreate, PolizaSeguroUpdate, PolizaSeguroByIdRequest,
  IdOptionCompaniaAseguradora
} from "../../types/microContratos/polizaSeguroTypes";
import { axiosContratos, axiosMaestros } from "@/config/axios/axiosContratos";

// Grilla de gremios consolidadores
export const fetchPolizaSeguro = async (
  query: PolizaSeguroFiltradoRequest
): Promise<PolizaSeguroFiltradoResponse> => {
  try {
    const res = await axiosContratos.get("/polizas-seguro", {
      params: query,
    });

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
    console.error("Error al buscar póliza de seguros", error);
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


// by id
export const fetchPolizaSeguroById = async (
  id: number
): Promise<PolizaSeguroResponse> => {
  try {
    const res = await axiosContratos.get(`/polizas-seguro/${id}`);

    if (res.status === 200) {
      return res.data.data;
    } else {
      return { //PolizaSeguroDTO 
        id: 0,
        numero: '',
        vigencia: new Date(),
        estado: false,
        edicionTotal: false,
        tipoSeguro: {
          id: 0,
          nombre: '',
          estado: false
        },
        companiaAseguradora: {
          id: 0,
          nombre: '',
          estado: false,
          observacion: '',
          cuit: 0
        },
        contratista: {
          id: 0,
          razonSocial: '',
          estado: false
        },
      }
    }
  } catch (error) {
    console.error("Error al buscar póliza de seguros", error);
    return { //PolizaSeguroDTO 
      id: 0,
      numero: '',
      vigencia: new Date(),
      estado: false,
      edicionTotal: false,
      tipoSeguro: {
        id: 0,
        nombre: '',
        estado: false
      },
      companiaAseguradora: {
        id: 0,
        nombre: '',
        estado: false,
        observacion: '',
        cuit: 0
      },
      contratista: {
        id: 0,
        razonSocial: '',
        estado: false
      },
    }
  }
};

export const fetchPolizaSeguroRecursosAfectadosById = async (
  id: number
): Promise<number> => {
  try {
    const res = await axiosContratos.get(`/polizas-seguro/recursos-afectados/${id}`);

    if (res.status === 200) {
      return res.data.data.cantidad;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error al buscar póliza de seguros", error);
    return 0
  }
};

// Desactivar PolizaSeguro  
export const desactivarPolizaSeguro = async (query: { id: number, motivo: string }) => {
  const res = await axiosContratos.patch("/polizas-seguro/desactivar", query);
  return res;
};

// Activar PolizaSeguro
export const activarPolizaSeguro = async (query: { id: number }) => {
  const res = await axiosContratos.patch("/polizas-seguro/activar", query);
  return res;
};


export const exportPolizaSeguro = async (
  query: PolizaSeguroFiltradoRequest
): Promise<Blob> => {
  try {
    const response = await axiosContratos.get("/polizas-seguro/exportar", {
      params: query,
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error al exportar las pólizas de seguro", error);
    throw error;
  }
};

export const exportPolizaSeguroRegistrosAsociados = async (
  id: number
): Promise<Blob> => {
  try {
    const response = await axiosContratos.get(`/polizas-seguro/recursos-afectados/exportar/${id}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error al exportar las pólizas de seguro", error);
    throw error;
  }
};

export const postPolizaSeguro = async (body: PolizaSeguroCreate) => {
  const res = await axiosContratos.post("/polizas-seguro", body);
  return res;
};

export const putPolizaSeguro = async (body: PolizaSeguroUpdate) => {
  const res = await axiosContratos.put("/polizas-seguro", body);
  return res;
};


/* 
---------------------------------------------------------------------------------------
--------------------------------------FILTROS------------------------------------------
---------------------------------------------------------------------------------------
*/


//ss ver como meter calendario o que
export const fetchVigencia = async () => {
  return [
    { id: 2, label: "Activo" },
    { id: 1, label: "Inactivo" },
  ];
};

/* 
---------------------------------------------------------------------------------------
----------------------------------CREATE UPDATE----------------------------------------
---------------------------------------------------------------------------------------
*/
export const fecthCompaniaAseguradoraByName = async (query: string): Promise<IdOptionCompaniaAseguradora[]> => {

  const res = await axiosMaestros.get("/companias-aseguradoras", {
    params: { nombre: query, estado: true, pageNumber: 1, pageSize: 9 },
  });
  return res.data.data.map((item: { id: number; nombre: string; cuit: string; observacion: string }) => ({
    id: item.id, nombre: item.nombre, cuit: item.cuit, observacion: item.observacion
  }));
}


export const fecthCompaniaAseguradoraByCuit = async (query: string): Promise<IdOptionCompaniaAseguradora[]> => {

  const res = await axiosMaestros.get("/companias-aseguradoras", {
    params: { cuit: query, estado: true, pageNumber: 1, pageSize: 9 },
  });
  return res.data.data.map((item: { id: number; nombre: string; cuit: string; observacion: string }) => ({
    id: item.id, nombre: item.nombre, cuit: item.cuit, observacion: item.observacion
  }));
}

export const fecthTiposSeguros = async (id: number) => {

  const res = await axiosMaestros.get(`/companias-aseguradoras/${id}`);

  return [
    ...res.data.data.tiposSeguros,
    ...res.data.data.excepcionesSeguros.map((ex: any) => ex.tipoSeguro)
  ].filter((tipo: any) => tipo.estado)
};




const dummy = () => { console.log('...') }; // dummy function for export default

export default dummy