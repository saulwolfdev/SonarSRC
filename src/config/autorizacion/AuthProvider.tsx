import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { fetchCurrentProfile, fetchUsuario } from "../../services/autorizacion/autorizacionService";
import useLoadingStore from "../../zustand/shared/useLoadingStore";
import GlobalLoadingOverlay from "../../components/shared/GlobalLoadingOverlay";

export interface AuthContextType {
    usuario?: UsuarioActivo
}

export interface PermisoUsuario {
    id: number
    codigo: string
    descripcion?: string
}

export interface RolUsuario {
    id: string
    nombre: string
    descripcion?: string
}

export interface UsuarioActivo {
    id:number
    nombre: string
    idRed: string
    roles?: RolUsuario[]
    permisos?: PermisoUsuario[]
}

export const getAutorizacion = async (): Promise<AuthContextType | undefined> => {

    var profile = await fetchCurrentProfile()

    if (!profile) {
        window.location.assign(window.location.origin.concat('/.auth/login'))
        return undefined
    }

    var usuario = await fetchUsuario({ idRedUsuario: profile.token_details.preferred_username })

    if (!usuario || usuario.idUsuario === 0) {
        window.location.assign(window.location.origin.concat('/.auth/login'))
        return undefined
    }

    console.log('profile', profile)
    console.log('usuario', usuario)

    const autorizacion: AuthContextType = {
        usuario: {
            id: usuario?.idUsuario ?? 0,
            idRed: usuario?.idRed ?? 'N/A',
            nombre: usuario?.nombreCompleto ?? 'N/A',
            roles: usuario?.roles,
            permisos: usuario?.permisos
        }
    }
    return autorizacion
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [contextoActivo, setContextoActivo] = useState<AuthContextType | undefined>()
    const { setLoading } = useLoadingStore()

    useEffect(() => {
        setLoading(true)
        getAutorizacion().then((aut) => {
            if (!aut?.usuario?.idRed) {
                setContextoActivo(undefined)
            } else {
                setContextoActivo({
                    usuario: aut.usuario
                })
            }
        }).finally(() => { setLoading(false) });
    }, [])

    return <AuthContext.Provider value={contextoActivo}>
        {contextoActivo ? children : <GlobalLoadingOverlay></GlobalLoadingOverlay>}
    </AuthContext.Provider >;
};