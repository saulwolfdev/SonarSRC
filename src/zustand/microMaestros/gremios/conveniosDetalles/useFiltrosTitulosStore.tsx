import { create } from 'zustand'

type State = {
    codigoFiltroConvenioTitulo: number | undefined,
    nombreFiltroConvenioTitulo: string | undefined,
    estadoFiltroConvenioTitulo: boolean | undefined,
    
}

type Action = {
  updateCodigoFiltroConvenioTitulo: (codigo: State['codigoFiltroConvenioTitulo']) => void
  updateNombreFiltroConvenioTitulo: (nombre: State['nombreFiltroConvenioTitulo']) => void
  updateEstadoFiltroConvenioTitulo: (estado: State['estadoFiltroConvenioTitulo']) => void
 
}

export const useFiltrosConveniosTitulosStore = create<State & Action>((set) => ({
    codigoFiltroConvenioTitulo : undefined,
    nombreFiltroConvenioTitulo : undefined,
    estadoFiltroConvenioTitulo : undefined,
    updateCodigoFiltroConvenioTitulo: (codigoFiltroConvenioTitulo) => set(() => ({ codigoFiltroConvenioTitulo: codigoFiltroConvenioTitulo })),
    updateNombreFiltroConvenioTitulo: (nombreFiltroConvenioTitulo) => set(() => ({ nombreFiltroConvenioTitulo: nombreFiltroConvenioTitulo })),
    updateEstadoFiltroConvenioTitulo: (estadoFiltroConvenioTitulo) => set(() => ({ estadoFiltroConvenioTitulo: estadoFiltroConvenioTitulo }))
  }))