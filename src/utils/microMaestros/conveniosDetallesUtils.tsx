const convenioDetallesUtils = () => {
  return (
    null
  )
}

export default convenioDetallesUtils

import { useSearchParams } from "next/navigation";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { ConveniosFiltradasRequest } from "@/types/microMaestros/convenioGremioTypes";

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

export const getSerchParams = (
  searchParams: any, codigo: any, nombre: any, estado: any
)/*: TodoFiltradasRequest */=> {
  return {
    codigo: codigo || undefined,
    nombre: nombre|| undefined,
    estado: estado, 
    codigoConvenioColectivo: searchParams.get("codigoConvenioColectivo") || undefined,

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


export const getFilters = async (setFilters: any, codigo: any, nombre: any, estado: any) => {
  const array: [string, string, string][] = [];
  codigo
    ? array.push(["Código", codigo, "codigo"])
    : null;
   nombre
    ? array.push(["Nombre", nombre, "nombre"])
    : null;
 estado
    ? array.push([
        "Estado",
        estado == "1" ? "Activo" : "Inactivo",
        "estado",
      ])
    : null;
  setFilters(array);
};


  
  export  const setQueryParamasDeFiltros = async (
    codigo: any,
    nombre: any,
    estado: any,
    modifyQueries: any,
    setOk: any
  ) => {
    const queries: IQuery[] = []; 
     queries.push({ name: "codigo", value: codigo !== undefined ? codigo.toString() : '' });
     queries.push({ name: "nombre", value: nombre !== undefined ? nombre.toString() : '' });
     queries.push({ name: "estado", value: estado == undefined ? '' : estado ? '1' : '0'});
    await modifyQueries(queries);
    setOk(true)
  };


  export const chageOnePage = (
    pageName: "titulo" | "zona" | "turno" | "categoria",
    codigo: number | undefined,
    nombre: string | undefined,
    estado: boolean | undefined,
    url: string,
    setPage: (page: "titulo" | "zona" | "turno" | "categoria") => void,
    updateBreadcrumbs: any,
    setFilters: (array: any[]) => void,
    setUrlCreate: (url : string) => void
  ) => {
    setPage(pageName);
    updateBreadcrumbs(pageName);
    getFilters(setFilters, codigo, nombre, estado);
    setUrlCreate(url);
  };

 export  const handleDeleteFilter = (key: any, updateCodigo: any,    updateNombre: any,   updateEstado: any , filters: any[] , setFilters: (array: any[]) => void,) =>{
    if(key == 'codigo') { updateCodigo(undefined) ;  deleteFilterByKey('codigo', filters, setFilters)} 
    else if(key == 'nombre') { updateNombre(undefined) ;  deleteFilterByKey('nombre', filters, setFilters)} 
    else if(key == 'estado') { updateEstado(undefined) ;  deleteFilterByKey('estado', filters, setFilters)} 
 }

 export const deleteFilterByKey = (key: string, filters: any[] , setFilters: (array: any[]) => void,) => {
  const filteredArray = filters.filter(item => item[2] !== key);
  setFilters(filteredArray)
}