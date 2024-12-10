import { IdOption, PaginacionAPI } from "./GenericTypes";
// GET BY ID

// sirve tambien para hacer cambio de estado
export interface SociedadesByIdRequest{ 
    id:number
}

export interface SociedadesDetalleResponse {
    id: number;
    nombre: string;
    estado: boolean;
    cantidadRecursosAfectados: number;
}



// GET ALL 

export interface SociedadesFiltradasRequest {
    nombre?: string;
    origen?: string;
    codigoSap?: string;
    estado?: boolean;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string 
    orderAsc?: boolean | null
  }
  
  export interface SociedadesGridData {
    id: number;
    nombre: string;
    origen: string;
    codigoSap: string;
    estado: boolean;
  }
  
  export interface SociedadesFiltradasResponse {
    data: SociedadesGridData[];
    paginationData: {
      pageNumber: number;
      pageSize: number;
      totalPages: number;
      totalCount: number;
    };
  }
   
// Desactivar Sociedades
export interface DesactivarSociedadRequest {
  id: number;
  motivo: string;
}

export interface ModalEstadoProps {
  open: boolean;
  handleClose: () => void;
  id: number;
  toggleActivation: (isActivated: boolean | undefined, id: number, motivo?: string) => void;
}

export interface GridSociedadesProps {
  sociedades: SociedadesGridData[] | undefined;
  pagination?: PaginacionAPI;
  exportButton: React.ReactNode;
  handleModalOpenEstado: (id: number) => void;
  handleApplySort: any;

}

export interface FilterChipsProps {
  filters: { label: string; value: string }[];
  onDelete: (value: string) => void;
}

export interface ExportButtonProps {
  nombre?: string;
  origen?: string;
  codigoSap?: string;
  estado?: boolean;
}

export interface ClasificationSearchProps {
  label: string;
  value: IdOption | null;
  fetchOptions: (query: string) => Promise<IdOption[]>;
  onChange: (value: IdOption | null) => void;
  getOptionLabel?: (option: IdOption) => string;
}


export interface AutocompleteFiltroProps {
  label: string;
  value: IdOption | null;
  fetchOptions?: (query: string) => Promise<IdOption[]>;
  options?: IdOption[];
  onChange: (value: IdOption | null) => void;
}


export interface PopperFiltrosSociedadesProps {
  onApplyFilters: (filters: SociedadesFiltradasRequest) => void;
}

const dummy = () => {console.log('...')}; // dummy function for export default

export default dummy
