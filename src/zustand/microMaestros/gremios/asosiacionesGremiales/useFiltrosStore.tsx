import { create } from 'zustand'

type State = {
    codigo: number | undefined,
    nombre: string | undefined,
    estado: boolean | undefined,
    provinciaId: number | undefined,
    
}

type Action = {
  updateCodigo: (codigo: State['codigo']) => void
  updateNombre: (nombre: State['nombre']) => void
  updateEstado: (estado: State['estado']) => void
  updateProvinciaId: (provinciaId: State['provinciaId']) => void
 
}

export const useFiltrosAsociacionesGremialesStore = create<State & Action>((set) => ({
    codigo : undefined,
    nombre : undefined,
    estado : undefined,
    provinciaId : undefined,
    updateCodigo: (codigo) => set(() => ({ codigo: codigo })),
    updateNombre: (nombre) => set(() => ({ nombre: nombre })),
    updateEstado: (estado) => set(() => ({ estado: estado })),
    updateProvinciaId: (provinciaId) => set(() => ({ provinciaId: provinciaId })),
   }))