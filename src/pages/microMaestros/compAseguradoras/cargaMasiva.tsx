import { Box, Typography, Link } from '@mui/material';
import React, { useState, useEffect } from 'react';
import ArrowbackButton from '@/components/shared/ArrowbackButton';
import SwitchCreacionMasiva from '../../../components/microMaestros/compAseguradora/SwitchCreacionMasiva';
import { useRouter } from 'next/router';
import { CompAseguradorasCargaMasivaResponse } from '../../../types/microMaestros/companiasAseguradorasTypes';
import { descargarErroresCompAseguradoras } from '../../../services/microMaestros/CompaniasAseguradorasService'; 
import { useSearchParams } from 'next/navigation';
import Spinner from '@/components/shared/Spinner';

export default function ResultFuncionMasiva() {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
  
    const handleDownloadErrores = async () => {
        try {
            setIsLoading(true);            
            const erroresBlob = await descargarErroresCompAseguradoras(Number(searchParams.get("id")));
            const url = window.URL.createObjectURL(new Blob([erroresBlob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'errores.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            
        } catch (error) {
            console.error('Error descargando errores:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <>
            <Box sx={{ p: 4, margin: '0 auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ArrowbackButton />
                        <Typography variant="h1">Crear Compañia aseguradora</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SwitchCreacionMasiva checked={true} onClick={() => { }} />
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Typography sx={{ color: '#5C5C5C', textDecoration: 'none', display: 'flex', alignItems: 'center', m: 8 }} variant="body1">
                {searchParams.get("cantidadCreados")} datos cargados de forma correcta,{' '}

                <Link component="button" onClick={handleDownloadErrores} sx={{ color: '#0651DD', textDecoration: 'underline', cursor: 'pointer' }}>
                    {searchParams.get("cantidadErrores")} incorrectos
                </Link>.
            </Typography>
        </>
    );
}
