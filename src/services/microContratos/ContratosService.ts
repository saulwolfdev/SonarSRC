import { NumberSchema } from "yup";
import{ axiosContratos, axiosMaestros } from "@/config/axios/axiosContratos";
import { ContratoAPI, ContratoCreate, ContratoResponce, ContratosFiltradoRequest, ContratosFiltradosResponse, ContratoUpdate } from "@/types/microContratos/contratosTypes";
import { IdOption } from "@/types/microContratos/GenericTypes";

const ContratosService = () => {
  return (
    null
  )
}

export default ContratosService


// Grilla de ubicaciones
export const fetchContratos = async (
  query: ContratosFiltradoRequest
): Promise<ContratosFiltradosResponse> => {
  try {
    const res = await axiosContratos.get("/contratos", { params: query });

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
    console.error("Error al buscar centros físicos", error);
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

// Obtener detalles por ID
export const fetchContratoById = async (
  id: number
): Promise<ContratoResponce> => {
  try {
    const res = await axiosContratos.get(`/contratos/${id}`);
    return res.data.data;
  } catch (e) { 
      return {
        id: 0,
        numero: 0,
        descripcion: '',
        estado: false,
        inicio: new Date(),
        finalizacion:new Date(),
        contratista: '',
        rolEmpresa: '',
        tipo: '',
        origen: '',
        asociacionGremial: '',
        sociedad: '',
        referenteCompras: '',
        usuariosSolicitantes: '',
      };
    
  }
};

// Desactivar centro físico TODO
export const desactivarContrato = async () => {
};


// Activar centro físico TODO
export const activarContrato = async () => {
};


export const exportContratos = async (
  query: ContratosFiltradoRequest
): Promise<Blob> => {
  try {
    if (query.pageNumber !== undefined && !isNaN(query.pageNumber)) {
      query.pageNumber = 1;
    }
    if (query.pageSize !== undefined && !isNaN(query.pageSize)) {
      query.pageSize = 10;
    }

    const response = await axiosContratos.get("/contratos/exportar", {
      params: query,
      responseType: "blob", 
    });

    return response.data; 
  } catch (error) {
    console.error("Error al exportar los contratos", error);
    throw error;
  }
};

export const postContrato = async (body: ContratoCreate) => {
  const res = await axiosContratos.post("/contratos", body);
  return res;
};

export const putContratos = async (body: ContratoUpdate) => {
  const res = await axiosContratos.put("/contratos", body);
  return res;
};


/* 
-----------------------------------------------------------------------------------
---------------------------FILTROS------- -----------------------------------------
-----------------------------------------------------------------------------------
*/

export const fetchContratistas = async ( contratista: string ): Promise<IdOption[]> => {
  const res = await axiosContratos.get("/contratistas", {
    params: { razonSocial: contratista, pageNumber: 1, pageSize: 9 },
  });
  return res.data.data.map((item: { id: number; razonSocial: string }) => ({ id: item.id, label: item.razonSocial }));
};

export const fetchContratistaNameById = async ( id: number ): Promise<string> => {
  const res = await axiosContratos.get(`/contratistas/${id}`);
  return res.data.data.razonSocial
};




/* 
-----------------------------------------------------------------------------------
---------------------------CONTRATISTA -----------------------------------------
-----------------------------------------------------------------------------------
*/

export const fetchNumeroContratistaById = async ( id:number): Promise<IdOption> => {
  const res = await axiosContratos.get(`/contratistas/${id}`);
  return {id: res.data.data.id, label: res.data.data.numeroIdentificacion.toString()} ;
};


export const fetchRazonSocialById = async ( id:number ): Promise<IdOption> => {
  const res = await axiosContratos.get(`/contratistas/${id}`);
  return {id: res.data.data.id, label: res.data.data.razonSocial} ;
};
/* 
-----------------------------------------------------------------------------------
---------------------------CREAR CONTRATO -----------------------------------------
-----------------------------------------------------------------------------------
*/

export const fetchContratistasCreateIdOption = async ( contratista: string ): Promise<IdOption[]> => {
  const res = await axiosContratos.get("/contratistas", {
    params: { razonSocial: contratista, estado: true, bloqueo:false, pageNumber: 1, pageSize: 9 },
  });
  return res.data.data.map((item: { id: number; razonSocial: string }) => ({ id: item.id, label: item.razonSocial }));
};


export const fetchNumeroContratistaIdOption = async ( contratista: string ): Promise<IdOption[]> => {
  const res = await axiosContratos.get("/contratistas", {
    params: { numeroIdentificacion: contratista, estado: true, bloqueo:false, pageNumber: 1, pageSize: 9 },
  });
  return res.data.data.map((item: { id: number; numeroIdentificacion: string }) => ({ id: item.id, label: item.numeroIdentificacion.toString() }));
};

export const fetchRolEmpresa = async ( rol: string ): Promise<IdOption[]> => {
  return [{id: 1, label: 'Rol Valen'}, {id:2, label: 'Rol Lu'}];
  const res = await axiosMaestros.get("/rol-empresa", {
    params: { nombre: rol, pageNumber: 1, pageSize: 9 },
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};

export const fetchTipoContrato = async (): Promise<IdOption[]> => {
  const res = await axiosContratos.get("/contratos/tipos");
  return res.data.data.tipos.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};

export const fetchAsociacionesGremiales = async ( asociacion: string ): Promise<IdOption[]> => {
  return [{id: 1, label: 'Asociacion Valen'}, {id:2, label: 'Asociacion Lu'}];
  const res = await axiosMaestros.get("/asociacion-gremial", {
    params: { nombre: asociacion, pageNumber: 1, pageSize: 9 },
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};

export const fetchSociedades = async ( sociedad: string ): Promise<IdOption[]> => {
  const res = await axiosMaestros.get("/sociedades", {
    params: { nombre: sociedad,estado: true, pageNumber: 1, pageSize: 9 }, //TODO DEPENDE EL TIPO DE USUARIO
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};


export const fetchReferente = async ( nombre: string ): Promise<IdOption[]> => {
  return [{id: 1, label: 'Valen ref'}, {id:2, label: 'Lu ref'}];
  //TODO
  /* Si el Rol es de Compras: Se cargará automáticamente con el Nombre y apellido del Usuario de Compras que está creando el Contrato, sin poder editarlo 
    Si el Rol es Administrador :Traerá todos los Usuarios con Rol de Compras que tengan asignado la Sociedad indicada más arriba */
  const res = await axiosMaestros.get("/usuario", {
    params: { nombre: nombre,rol: 'compras', pageNumber: 1, pageSize: 9 }, //TODO DEPENDE EL TIPO DE USUARIO
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};

export const  fetchUsuariosSolicitantes= async ( usuario: string ): Promise<IdOption[]> => {
  return [{id: 1, label: 'Valen'}, {id:2, label: 'Lu'}];
  //TODO
  /* completará con todos los usuarios que tengan ID de YPF  */
  const res = await axiosMaestros.get("/usuario", {
    params: { nombre: usuario , pageNumber: 1, pageSize: 9 }, 
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};

export const fetchUsuariosANotificar = async ( usuario: string ): Promise<IdOption[]> => {
  return [{id: 1, label: 'Valen not'}, {id:2, label: 'Lu not'}];
  //TODO
  /* completará con todos los usuarios que tengan ID de YPF  */
  const res = await axiosMaestros.get("/usuario", {
    params: {nombre:usuario , pageNumber: 1, pageSize: 9 }, 
  });
  return res.data.data.map((item: { id: number; nombre: string }) => ({ id: item.id, label: item.nombre }));
};

