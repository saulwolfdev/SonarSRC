import { create } from 'zustand'

type State = {
    codigoFiltroConvenioCategoria: number | undefined,
    nombreFiltroConvenioCategoria: string | undefined,
    estadoFiltroConvenioCategoria: boolean | undefined,
    
}

type Action = {
  updateCodigoFiltroConvenioCategoria: (codigo: State['codigoFiltroConvenioCategoria']) => void
  updateNombreFiltroConvenioCategoria: (nombre: State['nombreFiltroConvenioCategoria']) => void
  updateEstadoFiltroConvenioCategoria: (estado: State['estadoFiltroConvenioCategoria']) => void
 
}

export const useFiltrosConveniosCategoriasStore = create<State & Action>((set) => ({
    codigoFiltroConvenioCategoria : undefined,
    nombreFiltroConvenioCategoria : undefined,
    estadoFiltroConvenioCategoria : undefined,
    updateCodigoFiltroConvenioCategoria: (codigoFiltroConvenioCategoria) => set(() => ({ codigoFiltroConvenioCategoria: codigoFiltroConvenioCategoria })),
    updateNombreFiltroConvenioCategoria: (nombreFiltroConvenioCategoria) => set(() => ({ nombreFiltroConvenioCategoria: nombreFiltroConvenioCategoria })),
    updateEstadoFiltroConvenioCategoria: (estadoFiltroConvenioCategoria) => set(() => ({ estadoFiltroConvenioCategoria: estadoFiltroConvenioCategoria }))
  }))