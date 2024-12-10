import { axiosMaestros } from "@/config/axios/axiosMaestros";
import { axiosContratos } from "@/config/axios/axiosContratos";
import {
  ContratistaCreate,
  ContratistasFiltradosRequest,
  ContratistasFiltradosResponse,
  ContratistaUpdate,
  ContratistaDetalleResponse,
  ContratistasCargaMasivaResponse,
  EstadoBloqueoResponse,
  EstadosBloqueosRequest,
  EstadosBloqueosResponse,
  ContratistasHistorialRequest,
  ContratistasHistorialResponse,
  ContratistaHistorialAPI,
} from "@/types/microContratos/contratistasTypes";
import { typeAlert } from "@/components/shared/SnackbarAlert";
import { IdOption } from "@/types/microContratos/GenericTypes";

const ContratistasService = () => {
  return null;
};

export default ContratistasService;

// Grilla
export const fetchContratistas = async (
  query: ContratistasFiltradosRequest
): Promise<ContratistasFiltradosResponse> => {
  try {
    const res = await axiosContratos.get("/contratistas", { params: query });
    if (res.status === 200) {
      return res.data;
    } else {
      console.error("Unexpected response status:", res.status);
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
    console.error("Error al buscar contratistas", error);
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

export const exportContratistas = async (
  query: ContratistasFiltradosRequest
): Promise<Blob> => {
  try {
    if (query.pageNumber !== undefined && !isNaN(query.pageNumber)) {
      query.pageNumber = 1;
    }
    if (query.pageSize !== undefined && !isNaN(query.pageSize)) {
      query.pageSize = 10;
    }

    const response = await axiosContratos.get("/contratistas/exportar", {
      params: query,
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    console.error("Error al exportar los contratos", error);
    throw error;
  }
};

/* 
---------------------------------------------------------------------------------------
--------------------------------------FILTROS------------------------------------------
---------------------------------------------------------------------------------------
*/
export const fetchEstadosContratistas = async () => {
  return [
    { id: 1, label: "Activo" },
    { id: 2, label: "Inactivo" },
  ];
};

export const fetchOrigen = async (origen: string) => {
  const res = await axiosContratos.get("/origenes-informacion", {
    params: { nombre: origen, pageNumber: 1, pageSize: 9 },
  });
  return res.data.data.origenes.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));

};
export const fetchOrigenById = async (id:number) => {
  const res = await axiosContratos.get(`/origenes-informacion/${id}`);
  return res.data.data.nombre
};

export const postContratista = async (body: ContratistaCreate) => {
  const res = await axiosContratos.post("/contratistas", body);
  return res;
};

export const putContratista = async (body: ContratistaUpdate) => {
  const res = await axiosContratos.put("/contratistas", body);
  return res;
};

/* 
------------------------------------------------------------------------------------------------
-------------------------------------EDITAR-----------------------------------------------------
------------------------------------------------------------------------------------------------

*/

export const fetchLocalidadesContratistas = async (query: string = "") => {
  const res = await axiosMaestros.get("/ubicaciones/localidades", {
    params: { Nombre: query },
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({
    id: item.id,
    label: item.nombre,
  }));
};
export const fetchEstudiosContratistas = async (query: string = "") => {
  const res = await axiosMaestros.get("/estudios-auditores", {
    params: { Nombre: query },
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({
    id: item.id,
    label: item.nombre,
  }));
};

export const fetchSedesContratistas = async (query: string = "", estudioId: number) => {
  const res = await axiosMaestros.get("/estudios-auditores/sedes", {
    params: { Nombre: query, estudioId:estudioId  },
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({
    id: item.id,
    label: item.nombre,
  }));
};

export const fetchBloqueoContratistas = async (
  query: string
): Promise<IdOption[]> => {
  try {
    const res = await axiosContratos.get(`/contratistas/estados-bloqueo`, {
      params: { nombre: query },
    });
    if (res.status === 200) {
      return res.data.data.estadosBloqueo.map(
        (item: { id: number; nombre: string }) => ({
          id: item.id,
          label: item.nombre,
        })
      );
    } else {
      return [{ id: 0, label: "" }];
    }
  } catch (error) {
    console.error("Error al buscar contratista", error);
    return [{ id: 0, label: "" }];
  }
};

export const fetchMotivoBloqueoContratistas = async (query: string = "") => {
  return [
    {
      id: 1,
      label: "aaa",
    },
  ];
  const res = await axiosMaestros.get("/bloqueos/motivos", {
    params: { Nombre: query },
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({
    id: item.id,
    label: item.nombre,
  }));
};

//by id
export const fetchContratistaById = async (
  id: number
): Promise<ContratistaDetalleResponse> => {
  try {
    const res = await axiosContratos.get(`/contratistas/${id}`);
    if (res.status === 200) {
      return res.data.data;
    } else {
      return {
        id: 0,
        razonSocial: "",
        numeroIdentificacion: 0,
        ubicacionId: 0,
        ubicacion: {
          codigoPostalNombre: "",
          codigoPostalId: 0,
          localidadNombre: "",
          localidadId: 0,
          provinciaNombre: "",
          provinciaId: 0,
          paisNombre: "",
          paisId: 0,
        },
        calle: "",
        nroCalle: 0,
        piso: 0,
        departamento: 0,
        telefono: 0,
        emailContactoComercial: "",
        nombreContactoComercial: "",
        empresaConstruccion: false,
        nroIERIC: "",
        empresaEventual: false,
        estado: false,
        bloqueado: false,
        origen: {
          id: 1,
          nombre: "Manual",
          codigo: null,
        },
        empresaPromovida: false,
        motivoEmpresaPromovida: "",
        codigoProveedorSAP: 0,
        politicaDiversidad: false,
        linkPoliticaDiversidad: "",
        estudioContratistaId: 0,
        estudioAuditor: {
          id: 0,
          nombre: "",
        },
        sede: {
          id: 0,
          nombre: "",
        },
        estadoBloqueo: {
          id: 0,
          nombre: "",
        },
        motivoDesbloqueo: "",

        motivosBloqueo: [
          {
            motivoBloqueo: {
              id: 0,
              nombre: "",
            },
            contratistaId: 0,
            activo: true,
          },
        ],
        fechaCreacion: new Date(),
        fechaInicioDesbloqueo: new Date(),
        fechaFinalizacionDesbloqueo: new Date(),
      };
    }
  } catch (error) {
    console.error("Error al buscar contratista", error);
    return {
      id: 0,
      razonSocial: "",
      numeroIdentificacion: 0,
      ubicacionId: 0,
      ubicacion: {
        codigoPostalNombre: "",
        codigoPostalId: 0,
        localidadNombre: "",
        localidadId: 0,
        provinciaNombre: "",
        provinciaId: 0,
        paisNombre: "",
        paisId: 0,
      },
      calle: "",
      nroCalle: 0,
      piso: 0,
      departamento: 0,
      telefono: 0,
      emailContactoComercial: "",
      nombreContactoComercial: "",
      empresaConstruccion: false,
      nroIERIC: "",
      empresaEventual: false,
      estado: false,
      bloqueado: false,
      origen: {
        id: 1,
        nombre: "Manual",
        codigo: null,
      },
      empresaPromovida: false,
      motivoEmpresaPromovida: "",
      codigoProveedorSAP: 0,
      politicaDiversidad: false,
      linkPoliticaDiversidad: "",
      estudioContratistaId: 0,
      estudioAuditor: {
        id: 0,
        nombre: "",
      },
      sede: {
        id: 0,
        nombre: "",
      },
      estadoBloqueo: {
        id: 0,
        nombre: "",
      },
      motivoDesbloqueo: "",
      motivosBloqueo: [
        {
          motivoBloqueo: {
            id: 0,
            nombre: "",
          },
          contratistaId: 0,
          activo: true,
        },
      ],
      fechaCreacion: new Date(),
      fechaInicioDesbloqueo: new Date(),
      fechaFinalizacionDesbloqueo: new Date(),
    };
  }
};

// Activar Contratista
export const activarContratista = async (query: { id: number }) => {
  const res = await axiosContratos.patch("/contratistas/activar", query);
  return res;
};
// Desactivar Contratista
export const desactivarContratista = async (query: {
  id: number;
  motivo: string;
}) => {
  const res = await axiosContratos.patch("/contratistas/desactivar", query);
  return res;
};


export const fetchContratistasRecursosAfectadosById = async (
  id: number
): Promise<number> => {
  try {
    const res = await axiosContratos.get(`/contratistas/recursos-afectados/${id}`);

    if (res.status === 200) {
      return res.data.data.cantidad;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error al buscar contratista", error); //ss es ok el mensaje?
    return 0
  }
};

export const exportContratistasRegistrosAsociados = async (
  id: number
): Promise<Blob> => {
  try {
    const response = await axiosContratos.get(`/contratistas/recursos-afectados/exportar/${id}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error al exportar los contratistas", error);
    throw error;
  }
};



// editar masiva
export const downloadPlantillaContratistaEditarMasiva = async (
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>,
  setAlertType: React.Dispatch<React.SetStateAction<typeAlert | undefined>>
): Promise<void> => {
  try {
    const res = await axiosContratos.get("/contratistas/descargar-plantilla-edicion", {
      responseType: "blob",
    });

    if (res.status === 200) {
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "PlantillaContratistas.xlsx");
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

export const descargarErroresContratistaEditarMasiva = async (
  cargaMasivaId: number
): Promise<Blob> => {
  try {
    const response = await axiosContratos.get<Blob>(
      `/contratistas/descargar-errores-edicion/${cargaMasivaId}`,
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

export const putContratistaMasiva = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("FileContent", file);

    const res = await axiosContratos.put<ContratistasCargaMasivaResponse>(
      "/contratistas/edicion-masiva",
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

// bloqueo
export const fetchEstadoBloqueoById = async (
  id: number
): Promise<EstadoBloqueoResponse> => {
  try {
    const res = await axiosContratos.get(`/contratistas/estados-bloqueo/${id}`);
    if (res.status === 200) {
      return res.data.data;
    } else {
      return {
        id: 0,
        nombre: "",
      };
    }
  } catch (error) {
    console.error("Error al buscar contratista", error);
    return {
      id: 0,
      nombre: "",
    };
  }
};

export const fetchEstadoBloqueoNombreById = async (id: number) => {
  try {
    const res = await axiosContratos.get(`/contratistas/estados-bloqueo/${id}`);
    if (res.status === 200) {
      return res.data.data.nombre;
    } else {
      return "";
    }
  } catch (error) {
    console.error("Error al buscar contratista", error);
    return "";
  }
};

export const fetchEstadosBloqueosFiltos = async (
  query: string = ""
): Promise<IdOption[]> => {
  const res = await axiosContratos.get(`/contratistas/estados-bloqueo`, {
    params: { nombre: query },
  });
  return res.data.data.estadosBloqueo.map(
    (item: { id: number; nombre: string }) => ({
      id: item.id,
      label: item.nombre,
    })
  );
};

export const fetchContratistasHistorialById = async (
  query: ContratistasHistorialRequest
): Promise<ContratistaHistorialAPI[]> => {
  try {
    const res = await axiosContratos.get("/contratistas/historial-novedades", { params: query });
    if (res.status === 200) {
      return res.data.data;
    } else {
      console.error("Unexpected response status:", res.status);
      return []
    }
  } catch (error) {
    console.error("Error al buscar contratistas", error);
    return []
  }
};
