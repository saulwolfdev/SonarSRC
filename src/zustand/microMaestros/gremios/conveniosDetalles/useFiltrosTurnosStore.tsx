import { create } from 'zustand'

type State = {
    codigoFiltroConvenioTurno: number | undefined,
    nombreFiltroConvenioTurno: string | undefined,
    estadoFiltroConvenioTurno: boolean | undefined,
    
}

type Action = {
  updateCodigoFiltroConvenioTurno: (codigo: State['codigoFiltroConvenioTurno']) => void
  updateNombreFiltroConvenioTurno: (nombre: State['nombreFiltroConvenioTurno']) => void
  updateEstadoFiltroConvenioTurno: (estado: State['estadoFiltroConvenioTurno']) => void
 
}

export const useFiltrosConveniosTurnosStore = create<State & Action>((set) => ({
    codigoFiltroConvenioTurno : undefined,
    nombreFiltroConvenioTurno : undefined,
    estadoFiltroConvenioTurno : undefined,
    updateCodigoFiltroConvenioTurno: (codigoFiltroConvenioTurno) => set(() => ({ codigoFiltroConvenioTurno: codigoFiltroConvenioTurno })),
    updateNombreFiltroConvenioTurno: (nombreFiltroConvenioTurno) => set(() => ({ nombreFiltroConvenioTurno: nombreFiltroConvenioTurno })),
    updateEstadoFiltroConvenioTurno: (estadoFiltroConvenioTurno) => set(() => ({ estadoFiltroConvenioTurno: estadoFiltroConvenioTurno }))
  }))