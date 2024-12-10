import { Box, Typography, Link } from '@mui/material';
import React, { useState, useEffect } from 'react';
import ArrowbackButton from '@/components/shared/ArrowbackButton';
import SwitchCreacionMasiva from './components/SwitchCreacionMasiva';
import { useRouter } from 'next/router';
import { PuestoEmpresaCargaMasivaResponse } from '../../../types/microMaestros/puestosEmpresaTypes';
import { descargarErroresPuestosEmpresa } from '../../../services/microMaestros/puestosEmpresaService';
import Spinner from '@/components/shared/Spinner';

export default function ResultPuestosEmpresaMasiva() {
    const router = useRouter();
    const [response, setResponse] = useState<null | PuestoEmpresaCargaMasivaResponse>(null);

    useEffect(() => {
        if (router.isReady) {
            const {
                cargaMasivaId,
                cantPuestosCreados,
                cantErrores,
                puestosCreados,
                errores,
            } = router.query;

            const parsedPuestosCreados = JSON.parse(puestosCreados as string);
            const parsedErrores = JSON.parse(errores as string);

            setResponse({
                cargaMasivaId: parseInt(cargaMasivaId as string),
                cantPuestosCreados: parseInt(cantPuestosCreados as string),
                cantErrores: parseInt(cantErrores as string),
                puestosCreados: parsedPuestosCreados,
                errores: parsedErrores,
            });
        }
    }, [router.isReady, router.query]);

    const handleDownloadErrores = async () => {
        try {
            if (response) {
                const erroresBlob = await descargarErroresPuestosEmpresa(response.cargaMasivaId);

                const url = window.URL.createObjectURL(new Blob([erroresBlob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'errores.xlsx');
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
            }
        } catch (error) {
            console.error('Error descargando errores:', error);
        }
    };

    if (!response) {
        return <Spinner />;
    }

    return (
        <>
            <Box sx={{ p: 4, margin: '0 auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ArrowbackButton />
                        <Typography variant="h1">Crear Puesto Empresa</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SwitchCreacionMasiva checked={true} onClick={() => { }} />
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Typography sx={{ color: '#5C5C5C', textDecoration: 'none', display: 'flex', alignItems: 'center', m: 8 }} variant="body1">
                {response.cantPuestosCreados} datos cargados de forma correcta,{' '}
                <Link component="button" onClick={handleDownloadErrores} sx={{ color: '#0651DD', textDecoration: 'underline', cursor: 'pointer' }}>
                    {response.cantErrores} incorrectos
                </Link>.
            </Typography>
        </>
    );
}
