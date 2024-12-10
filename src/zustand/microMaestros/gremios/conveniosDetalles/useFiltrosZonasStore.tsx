import { create } from 'zustand'

type State = {
    codigoFiltroConvenioZona: number | undefined,
    nombreFiltroConvenioZona: string | undefined,
    estadoFiltroConvenioZona: boolean | undefined,
    
}

type Action = {
  updateCodigoFiltroConvenioZona: (codigo: State['codigoFiltroConvenioZona']) => void
  updateNombreFiltroConvenioZona: (nombre: State['nombreFiltroConvenioZona']) => void
  updateEstadoFiltroConvenioZona: (estado: State['estadoFiltroConvenioZona']) => void
 
}

export const useFiltrosConveniosZonasStore = create<State & Action>((set) => ({
    codigoFiltroConvenioZona : undefined,
    nombreFiltroConvenioZona : undefined,
    estadoFiltroConvenioZona : undefined,
    updateCodigoFiltroConvenioZona: (codigoFiltroConvenioZona) => set(() => ({ codigoFiltroConvenioZona: codigoFiltroConvenioZona })),
    updateNombreFiltroConvenioZona: (nombreFiltroConvenioZona) => set(() => ({ nombreFiltroConvenioZona: nombreFiltroConvenioZona })),
    updateEstadoFiltroConvenioZona: (estadoFiltroConvenioZona) => set(() => ({ estadoFiltroConvenioZona: estadoFiltroConvenioZona }))
  }))