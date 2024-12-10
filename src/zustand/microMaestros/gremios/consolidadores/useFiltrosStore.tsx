import { create } from 'zustand'

type State = {
    codigo: number | undefined,
    nombre: string | undefined,
    estado: boolean | undefined,
    nombreGremioConsolidado: string | undefined,
    nombreAsociacionGremial: string | undefined,
    provinciaId: number | undefined,
    nombreConvenioColectivo: string | undefined,
    
}

type Action = {
  updateCodigo: (codigo: State['codigo']) => void
  updateNombre: (nombre: State['nombre']) => void
  updateEstado: (estado: State['estado']) => void
  updateNombreGremioConsolidado: (nombreGremioConsolidado: State['nombreGremioConsolidado']) => void
  updateNombreAsociacionGremial: (nombreAsociacionGremial: State['nombreAsociacionGremial']) => void
  updateProvinciaId: (provinciaId: State['provinciaId']) => void
  updateNombreConvenioColectivo: (nombreConvenioColectivo: State['nombreConvenioColectivo']) => void
 
}

export const useFiltrosConsolidadoresStore = create<State & Action>((set) => ({
    codigo : undefined,
    nombre : undefined,
    estado : undefined,
    nombreGremioConsolidado : undefined,
    nombreAsociacionGremial : undefined,
    provinciaId : undefined,
    nombreConvenioColectivo : undefined,
    updateCodigo: (codigo) => set(() => ({ codigo: codigo })),
    updateNombre: (nombre) => set(() => ({ nombre: nombre })),
    updateEstado: (estado) => set(() => ({ estado: estado })),
    updateNombreGremioConsolidado: (nombreGremioConsolidado) => set(() => ({ nombreGremioConsolidado: nombreGremioConsolidado })),
    updateNombreAsociacionGremial: (nombreAsociacionGremial) => set(() => ({ nombreAsociacionGremial: nombreAsociacionGremial })),
    updateProvinciaId: (provinciaId) => set(() => ({ provinciaId: provinciaId })),
    updateNombreConvenioColectivo: (nombreConvenioColectivo) => set(() => ({ nombreConvenioColectivo: nombreConvenioColectivo })),
   }))