import {axiosMaestros} from "@/config/axios/axiosMaestros";
import { ReferenteChange } from "@/types/microMaestros/ReferentesTypes";
import { SedeDetalleResponse, SedeUpdateRequest, SedeFiltradoRequest, SedeCreateRequest, SedeCreateResponse, SedeFiltradoResponse } from "@/types/microMaestros/SedesTypes";

const SedesServices = () => {
    return (
        null
    )
}

export default SedesServices

export const fetchSedeById = async (id: number): Promise<SedeDetalleResponse> => {
    try {
        const res = await axiosMaestros.get(`/estudios-auditores/sedes/${id}`);
        if (res.status === 200 && res.data.isSuccess) {
            return res.data.data;
        } else {
            const sedeNull: SedeDetalleResponse = {
                id: 0,
                estudioID: 0,
                nombre: "",
                provinciaId: 0,
                localidadId: 0,
                codigoPostalId: 0,
                calle: "",
                nroCalle: 0,
                piso: "",
                departamento: "",
                telefonoPrincipal: null,
                telefonoAlternativo: "",
                email: "",
                diaYHorario: "",
                estado: false,
                referentes: []
            };
            return sedeNull;
        }
    } catch (error) {
        const sedeNull: SedeDetalleResponse = {
            id: 0,
            estudioID: 0,
            nombre: "",
            provinciaId: 0,
            localidadId: 0,
            codigoPostalId: 0,
            calle: "",
            nroCalle: 0,
            piso: "",
            departamento: "",
            telefonoPrincipal: null,
            telefonoAlternativo: "",
            email: "",
            diaYHorario: "",
            estado: false,
            referentes: []
        };
        return sedeNull;
    }
};

export const putSede = async (
    query: SedeUpdateRequest
): Promise<void> => {
    try {
        const response = await axiosMaestros.put<void>(
            `/estudios-auditores/sedes`,
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

export const desactivarSede = async (query: ReferenteChange) => {
    const res = await axiosMaestros.patch("/estudios-auditores/sedes/desactivar", query);
    return res;
};

export const activarSede = async (query: ReferenteChange) => {
    const res = await axiosMaestros.patch("/estudios-auditores/sedes/activar", query);
    return res;
};

export const exportSedes = async (
    query: SedeFiltradoRequest
): Promise<Blob> => {
    try {
        if (query.pageNumber !== undefined && !isNaN(query.pageNumber)) {
            query.pageNumber = 1;
        }
        if (query.pageSize !== undefined && !isNaN(query.pageSize)) {
            query.pageSize = 10;
        }

        const response = await axiosMaestros.get("/estudios-auditores/sedes/exportar", {
            params: query,
            responseType: "blob",
        });

        return response.data;
    } catch (error) {
        console.error("Error al exportar los contratos", error);
        throw error;
    }
};


export const postSede = async (query: SedeCreateRequest) => {
    const res = await axiosMaestros.post<SedeCreateResponse>(
        '/estudios-auditores/sedes',
        query,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    return res;
};

export const fetchSedes = async (
    query: SedeFiltradoRequest
): Promise<SedeFiltradoResponse> => {
    try {
        const res = await axiosMaestros.get("/estudios-auditores/sedes", { params: query });

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
        console.error("Error al buscar referentes", error);
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