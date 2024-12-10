import { useSearchParams } from "next/navigation";
import {
  fetchGremiosConsolidados,
} from "@/services/microMaestros/consolidadosService";
import {
  GremiosConsolidadosFiltradasRequest,
  GremiosConsolidadosFiltradasResponse,
} from "@/types/microMaestros/gremiosConsolidadosTypes";
import useQueryString, { IQuery } from "@/hooks/useQueryString";


export const handleApplySort = (
  appliedFilters: GremiosConsolidadosFiltradasRequest,
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
): GremiosConsolidadosFiltradasRequest => {
  return {
    codigo: Number(searchParams.get("codigo")) || undefined,
    nombre: searchParams.get("nombre") || undefined,
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

export const buscarGremiosConsolidados = (
  setPagination: any,
  setGremiosConsolidado: any,
  setLoading: any,
  modifyQueries: any,
  searchParams: any,
  codigoGremioConsolidador: string
) => {
  const filtros: GremiosConsolidadosFiltradasRequest = getSerchParams(searchParams);

  fetchGremiosConsolidados({codigoGremioConsolidador: Number(codigoGremioConsolidador), ... filtros})
    .then((response: GremiosConsolidadosFiltradasResponse) => {
      const consolidadosAPI = response.data.map((c) => ({
        id: c.codigo,
        nombre: c.nombre,
        estado: c.estado,
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
      setGremiosConsolidado(consolidadosAPI);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      setLoading(false);
    });
};

// export const toggleActivation = useCallback(
//   (isActivated: boolean | undefined, idClasificacion: number) => {
//     if (isActivated) {
//       desactivarCentro({ id: idClasificacion })
//         .then(() => {
//           setAlertMessage("¡Todo salió bien! Se guardó con éxito.")
//           setAlertType(typeAlert.success)
//           buscarConsolidado()
//         })
//         .catch(() => {
//           setAlertMessage("No se pudo desactivar el estado. Inténtalo de nuevo más tarde.")
//           setAlertType(typeAlert.error)
//         })
//     } else {
//       activarCentro({ id: idClasificacion })
//         .then(() => {
//           setAlertMessage("¡Todo salió bien! Se guardó con éxito.")
//           setAlertType(typeAlert.success)
//           buscarConsolidado()
//         })
//         .catch(() => {
//           setAlertMessage("No se pudo activar el estado. Inténtalo de nuevo más tarde.")
//           setAlertType(typeAlert.error)
//         })
//     }
//     setModalOpen(false)
//   },
//   [buscarConsolidado]
// )

export const handleDeleteFilter = (
  key: keyof GremiosConsolidadosFiltradasRequest,
  removeQueries: any
) => {
  removeQueries([key]);
};

export const getFilters = async (setFilters: any, searchParams: any) => {
  const array: [string, string, string][] = [];
  const appliedFilters = new URLSearchParams(searchParams.toString());
  const filtersObject: { [key: string]: string } = {};
  appliedFilters.forEach((value, key) => {
    filtersObject[key] = value;
  });

  filtersObject.nombre
    ? array.push(["Nombre", filtersObject.nombre, "nombre"])
    : null;
  filtersObject.codigo
    ? array.push(["Código", filtersObject.codigo, "codigo"])
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
  estado: any,
  modifyQueries: any,
) => {
  const queries: IQuery[] = []; 
  codigo && queries.push({ name: "codigo", value: codigo.toString() });
  nombre && queries.push({ name: "nombre", value: nombre.toString() });
  estado && queries.push({ name: "estado", value: estado ? '1' : '0'});
  modifyQueries(queries);
};

const dummy = () => {console.log('...')}; // dummy function for export default

export default dummy