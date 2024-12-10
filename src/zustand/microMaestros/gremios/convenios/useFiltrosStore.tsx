import { create } from 'zustand'

type State = {
  codigo : number | undefined,
  nombre : string | undefined,
  horasDiariasDeTrabajo : string | undefined,
  nombreTitulo : string | undefined,
  nombreZona : string | undefined,
  nombreTurno : string | undefined,
  estado: boolean | undefined,    
}

type Action = {
  updateCodigo: (codigo: State['codigo']) => void
  updateNombre: (nombre: State['nombre']) => void
  updateHorasDiariasDeTrabajo: (estado: State['horasDiariasDeTrabajo']) => void
  updateNombreTitulo: (nombreAsociacionGremial: State['nombreTitulo']) => void
  updateNombreZona: (provinciaId: State['nombreZona']) => void
  updateNombreTurno: (nombreConvenioColectivo: State['nombreTurno']) => void
  updateEstado: (nombreConvenioColectivo: State['estado']) => void

 
}

export const useFiltrosConveniosStore = create<State & Action>((set) => ({
    codigo : undefined,
    nombre : undefined,
    horasDiariasDeTrabajo : undefined,
    nombreTitulo : undefined,
    nombreZona : undefined,
    nombreTurno : undefined,
    estado : undefined,
    updateCodigo: (codigo) => set(() => ({ codigo: codigo })),
    updateNombre: (nombre) => set(() => ({ nombre: nombre })),
    updateHorasDiariasDeTrabajo: (horasDiariasDeTrabajo) => set(() => ({ horasDiariasDeTrabajo: horasDiariasDeTrabajo })),
    updateNombreTitulo: (nombreTitulo) => set(() => ({ nombreTitulo: nombreTitulo })),
    updateNombreZona: (nombreZona) => set(() => ({ nombreZona: nombreZona })),
    updateNombreTurno: (nombreTurno) => set(() => ({ nombreTurno: nombreTurno })),
    updateEstado: (estado) => set(() => ({ estado: estado })),

  }))