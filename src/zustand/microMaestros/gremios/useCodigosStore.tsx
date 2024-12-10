import { create } from 'zustand'

type State = {
    codigoGremioConsolidador: string,
    nombreGremioConsolidador: string,
    codigoGremioConsolidado: string,
    nombreGremioConsolidado: string,
    codigoAsociacionGremial: string,
    nombreAsociacionGremial: string,
    codigoConvenioColectivo: string,
    nombreConvenioColectivo: string,
    codigoTituloConvenioColectivo: string,
    nombreTituloConvenioColectivo: string,
}

type Action = {
  updateCodigoGremioConsolidador: (codigoGremioConsolidador: State['codigoGremioConsolidador']) => void
  updateNombreGremioConsolidador: (nombreGremioConsolidador: State['nombreGremioConsolidador']) => void
  updateCodigoGremioConsolidado: (codigoGremioConsolidado: State['codigoGremioConsolidado']) => void
  updateNombreGremioConsolidado: (nombreGremioConsolidado: State['nombreGremioConsolidado']) => void
  updateCodigoAsociacionGremial: (codigoAsociacionGremial: State['codigoAsociacionGremial']) => void
  updateNombreAsociacionGremial: (nombreAsociacionGremial: State['nombreAsociacionGremial']) => void
  updateCodigoConvenioColectivo: (codigoConvenioColectivo: State['codigoConvenioColectivo']) => void
  updateNombreConvenioColectivo: (nombreConvenioColectivo: State['nombreConvenioColectivo']) => void
  updateCodigoTituloConvenioColectivo: (codigoTituloConvenioColectivo: State['codigoTituloConvenioColectivo']) => void
  updateNombreTituloConvenioColectivo: (nombreTituloConvenioColectivo: State['nombreTituloConvenioColectivo']) => void

}

// Create your store, which includes both state and (optionally) actions
export const useCodigosStore = create<State & Action>((set) => ({
    codigoGremioConsolidador : '',
    nombreGremioConsolidador : '',
    codigoGremioConsolidado : '',
    nombreGremioConsolidado : '',
    codigoAsociacionGremial : '',
    nombreAsociacionGremial : '',
    codigoConvenioColectivo : '',
    nombreConvenioColectivo : '',
    codigoTituloConvenioColectivo : '',
    nombreTituloConvenioColectivo : '',
    updateCodigoGremioConsolidador: (codigoGremioConsolidador) => set(() => ({ codigoGremioConsolidador: codigoGremioConsolidador })),
    updateNombreGremioConsolidador: (nombreGremioConsolidador) => set(() => ({ nombreGremioConsolidador: nombreGremioConsolidador })),
    updateCodigoGremioConsolidado: (codigoGremioConsolidado) => set(() => ({ codigoGremioConsolidado: codigoGremioConsolidado })),
    updateNombreGremioConsolidado: (nombreGremioConsolidado) => set(() => ({ nombreGremioConsolidado:nombreGremioConsolidado })),
    updateCodigoAsociacionGremial: (codigoAsociacionGremial) => set(() => ({ codigoAsociacionGremial: codigoAsociacionGremial })),
    updateNombreAsociacionGremial: (nombreAsociacionGremial) => set(() => ({ nombreAsociacionGremial:nombreAsociacionGremial })),
    updateCodigoConvenioColectivo: (codigoConvenioColectivo) => set(() => ({ codigoConvenioColectivo: codigoConvenioColectivo })),
    updateNombreConvenioColectivo: (nombreConvenioColectivo) => set(() => ({ nombreConvenioColectivo:nombreConvenioColectivo })),
    updateCodigoTituloConvenioColectivo: (codigoTituloConvenioColectivo) => set(() => ({ codigoTituloConvenioColectivo: codigoTituloConvenioColectivo })),
    updateNombreTituloConvenioColectivo: (nombreTituloConvenioColectivo) => set(() => ({ nombreTituloConvenioColectivo: nombreTituloConvenioColectivo })),
}))