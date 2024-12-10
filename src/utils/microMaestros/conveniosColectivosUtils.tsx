const utilsConvenios = () => {
  return (
    null
  )
}

export default utilsConvenios

import { useSearchParams } from "next/navigation";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { fetchConvenios } from "@/services/microMaestros/conveniosColectivoService";
import { ConveniosFiltradasRequest, ConveniosFiltradasResponse } from "@/types/microMaestros/convenioColectivoTypes";


// sort by
export const handleApplySort = (
  appliedFilters: ConveniosFiltradasRequest,
  modifyQueries: any
) => {
  const queries: IQuery[] = [];
  appliedFilters.sortBy
    ? queries.push({
        name: "sortBy",
        value: appliedFilters.sortBy.toString(),
      })
    : null;
  appliedFilters.orderAsc
    ? queries.push({
        name: "orderAsc",
        value: (appliedFilters.orderAsc.toString() == "asc").toString(),
      })
    : null;
  modifyQueries(queries);
};

export const handleModalOpenEstado = (
  id: number,
  setRowId: any,
  setModalOpen: any
) => {
  setRowId(id);
  setModalOpen(true);
};

export const handleModalCloseEstado = (setRowId: any, setModalOpen: any) => {
  setModalOpen(false);
  setRowId(0);
};

export const getSerchParams = (
  searchParams: any
): ConveniosFiltradasRequest => {
  return {
    codigo: Number(searchParams.get("codigo")) || undefined,
    nombre: searchParams.get("nombre") || undefined,
    horasDiariasDeTrabajo: searchParams.get("horasDiariasDeTrabajo") || undefined,
    nombreAsociacionGremial: searchParams.get("nombreAsociacionGremial") || undefined,
    nombreTitulo: searchParams.get("nombreTitulo") || undefined,
    nombreZona: searchParams.get("nombreZona") || undefined,
    nombreTurno: searchParams.get("nombreTurno") || undefined,
    estado: searchParams.get("estado")
      ? Boolean(searchParams.get("estado") === "1")
      : undefined,
    pageNumber: Number(searchParams.get("pageNumber")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 9,
    sortBy: searchParams.get("sortBy") || undefined,
    orderAsc: searchParams.get("orderAsc")
      ? Boolean(searchParams.get("orderAsc") === "true")
      : null,
  };
};

export const setQueryParamsInicial = (
  totalCount: number,
  pageNumber: number,
  pageSize: number,
  totalPages: number,
  modifyQueries: any
) => {
  const queries: IQuery[] = [];
  queries.push({ name: "pageNumber", value: pageNumber.toString() });
  queries.push({ name: "pageSize", value: pageSize.toString() });
  queries.push({ name: "totalPages", value: totalPages.toString() });
  queries.push({ name: "totalCount", value: totalCount.toString() });
  modifyQueries(queries);
};

export const buscarConvenios = (
  setPagination: any,
  setConvenios: any,
  setLoading: any,
  modifyQueries: any,
  searchParams: any,
) => {
  const filtros: ConveniosFiltradasRequest = getSerchParams(searchParams);

  fetchConvenios(filtros)
    .then((response: ConveniosFiltradasResponse) => {
      const conveniosAPI = response.data.map((c) => ({
        id : c.codigo,
        nombre : c.nombre,
        horasDiariasDeTrabajo : c.horasDiariasDeTrabajo,
        asociacionesGremiales: c.asociacionesGremiales,
        estado : c.estado,
      }));
      setPagination(response.paginationData);
      const pag = response.paginationData;
      setQueryParamsInicial(
        pag.totalCount,
        pag.pageNumber,
        pag.pageSize,
        pag.totalCount,
        modifyQueries
      );
      setConvenios(conveniosAPI);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      setLoading(false);
    });
};

export const handleDeleteFilter = (
  key: keyof ConveniosFiltradasRequest,
  removeQueries: any
) => {
  removeQueries([key]);
};

export const getFilters = async (setFilters: any, searchParams: any) => { //TODO
 // codigo  nombre  estado  horasDiariasDeTrabajo  nombreTitulo  nombreZona  nombreTurno
  const array: [string, string, string][] = [];
  const appliedFilters = new URLSearchParams(searchParams.toString());
  const filtersObject: { [key: string]: string } = {};
  appliedFilters.forEach((value, key) => {
    filtersObject[key] = value;
  });

  filtersObject.codigo
    ? array.push(["Código", filtersObject.codigo, "codigo"])
    : null;
    filtersObject.nombre
    ? array.push(["Convenio", filtersObject.nombre, "nombre"])
    : null;
    filtersObject.horasDiariasDeTrabajo
    ? array.push(["Horas Diarias De Trabajo", filtersObject.horasDiariasDeTrabajo, "horasDiariasDeTrabajo"])
    : null;
    filtersObject.nombreTitulo
    ? array.push(["Titulos", filtersObject.nombreTitulo, "nombreTitulo"])
    : null;
    filtersObject.nombreZonas
    ? array.push(["Zonas", filtersObject.nombreZonas, "nombreZonas"])
    : null;
    filtersObject.nombreTurnos
    ? array.push(["Turnos", filtersObject.nombreTurnos, "nombreTurnos"])
    : null;
   
  filtersObject.estado
    ? array.push([
        "Estado",
        filtersObject.estado == "1" ? "Activo" : "Inactivo",
        "estado",
      ])
    : null;
  setFilters(array);
};


export const setQueryParamasDeFiltros = (
  codigo: any,
  nombre: any,
  horasDiariasDeTrabajo: any,
  nombreTitulo: any,
  nombreZona: any,
  nombreTurno: any,
  estado: any,
  modifyQueries: any,
) => {

  const queries: IQuery[] = []; 
  codigo && queries.push({ name: "codigo", value: codigo.toString() });
  nombre && queries.push({ name: "nombre", value: nombre.toString() });
  horasDiariasDeTrabajo && queries.push({ name: "horasDiariasDeTrabajo", value: horasDiariasDeTrabajo.toString()});
  nombreTitulo && queries.push({ name: "nombreTitulo", value: nombreTitulo.toString() });
  nombreZona && queries.push({ name: "nombreZona", value: nombreZona.toString() });
  nombreTurno && queries.push({ name: "nombreTurno", value: nombreTurno.toString() });
  estado && queries.push({ name: "estado", value: estado  ? '1' : '0' });
  modifyQueries(queries);
};

