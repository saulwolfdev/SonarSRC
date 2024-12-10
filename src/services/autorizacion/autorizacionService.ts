import { AuthContextType, PermisoUsuario, RolUsuario } from "../../config/autorizacion/AuthProvider";
import { axiosBFF } from "../../config/axios/axiosBFF";
import { axiosUsuarios } from "../../config/axios/axiosUsuarios";

const AutorizacionService = () => {
    return null;
}

export default AutorizacionService

export interface UsuarioByIdRedRequest {
    idRedUsuario: string
}

export interface UsuarioByIdResponse {
    idUsuario: number
    idRed: string
    nombreCompleto: string
    roles: RolUsuario[]
    permisos: PermisoUsuario[]
}

export interface CurrentProfileResponse {
    iss: string
    iat: number
    aud: string
    exp: number
    jti: string
    mail: string
    token_details: {
        scope: string
        expires_in: number
        token_type: string
        preferred_username: string
        Profile: {
            uid: string
            first_name: string
            last_name: string
            mail: string
            Perfil: {
                given_username: string
                uid: string
                first_name: string
                last_name: string
                mail: string
                tipo_empleado: string
                roles: string
                TipoDocumento: string
                NumeroDocumento: string
            }
        }
    }
}

export const fetchCurrentProfile = async (): Promise<CurrentProfileResponse | undefined> => {
    
    //if (typeof window !== 'undefined' && window.location.origin.includes('localhost')) {
    //    const profileMock: CurrentProfileResponse = {
    //        "iss": "https://magdesa.ypf.com",
    //        "iat": 1732295902,
    //        "aud": "6345abd5-2b37-41ca-836a-fd4ad835df2c",
    //        "exp": 1732641501,
    //        "jti": "6b77bb2f-4f3b-4041-b7f5-7d421d2f42f1-1732641501",
    //        "mail": "alejandromartin.maldonado@set.ypf.com",
    //        "token_details": {
    //            "scope": "openid jwt profile interno proveedor email",
    //            "expires_in": 345600,
    //            "token_type": "Bearer",
    //            "preferred_username": "se43912",
    //            "Profile": {
    //                "uid": "SE43912",
    //                "first_name": "ALEJANDRO MARTIN",
    //                "last_name": "MALDONADO",
    //                "mail": "alejandromartin.maldonado@set.ypf.com",
    //                "Perfil": {
    //                    "given_username": "se43912",
    //                    "uid": "SE43912",
    //                    "first_name": "ALEJANDRO MARTIN",
    //                    "last_name": "MALDONADO",
    //                    "mail": "alejandromartin.maldonado@set.ypf.com",
    //                    "tipo_empleado": "Interno",
    //                    "roles": "IDM-TRANSFORMACIONSRC-DEV-Auditor, IDM-TRANSFORMACIONSRC-DEV-Inspector, IDM-TRANSFORMACIONSRC-DEV-Comprador, IDM-TRANSFORMACIONSRC-DEV-GIP, IDM-TRANSFORMACIONSRC-DEV-AdministradorGIP, IDM-TRANSFORMACIONSRC-DEV-AdministradorSRC",
    //                    "TipoDocumento": "C.U.I.L",
    //                    "NumeroDocumento": "30-70446407-6"
    //                }
    //            }
    //        }
    //    };
    //    return profileMock;
    //}
    

    try {
        const res = await axiosBFF.get("/.auth/profile");

        console.log('res profile', res)

        if (res.status == 200) {
            return res.data
        }
        else {
            return undefined;
        }
    } catch (e) {
        console.log('error', e)
        return undefined;
    }


};


export const fetchUsuario = async (
    query: UsuarioByIdRedRequest
): Promise<UsuarioByIdResponse> => {

    const res = await axiosUsuarios.get("/permisosUsuario", {
        params: {
            idRed: query.idRedUsuario
        }
    });

    console.log('resp data endp usuario', res.data)

    if (res.status == 200) {
        return res.data.data as UsuarioByIdResponse
    } else {
        const usuarioNull: UsuarioByIdResponse = {
            idUsuario: 0,
            idRed: '',
            nombreCompleto: "",
            roles: [],
            permisos: [],
        };
        return usuarioNull;
    }

};

