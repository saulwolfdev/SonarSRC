import { create } from 'zustand'

type State = {
    codigo: number | undefined,
    nombre: string | undefined,
    estado: boolean | undefined,
    
}

type Action = {
  updateCodigo: (codigo: State['codigo']) => void
  updateNombre: (nombre: State['nombre']) => void
  updateEstado: (estado: State['estado']) => void
 
}

export const useFiltrosConsolidadosStore = create<State & Action>((set) => ({
    codigo : undefined,
    nombre : undefined,
    estado : undefined,
    updateCodigo: (codigo) => set(() => ({ codigo: codigo })),
    updateNombre: (nombre) => set(() => ({ nombre: nombre })),
    updateEstado: (estado) => set(() => ({ estado: estado }))
  }))