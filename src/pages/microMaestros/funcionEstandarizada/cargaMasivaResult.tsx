import React, { useState, useEffect } from 'react';
import { Box, Typography, Link, Button, LinearProgress, IconButton } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SwitchCreacionMasiva from './components/SwitchCreacionMasiva';
import { useRouter } from 'next/router';
import { FuncionEstandarizadaCargaMasivaResponse } from '@/types/microMaestros/funcionEstandarizadaTypes';
import { descargarErroresFuncionEstandarizada } from '@/services/microMaestros/funcionEstandarizadaService';
import { useRouterPush } from '@/hooks/useRouterPush';
import Spinner from '@/components/shared/Spinner';

export default function ResultFuncionMasiva() {
  const router = useRouter();
  const routerPush = useRouterPush();

  const [response, setResponse] = useState<null | FuncionEstandarizadaCargaMasivaResponse>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (router.isReady) {
      const { cargaMasivaId, cantFuncionesCreadas, cantErrores, funcionesCreadas, errores } = router.query;
      const parsedFuncionesCreadas = JSON.parse(funcionesCreadas as string);
      const parsedErrores = JSON.parse(errores as string);

      setResponse({
        cargaMasivaId: parseInt(cargaMasivaId as string),
        cantFuncionesCreadas: parseInt(cantFuncionesCreadas as string),
        cantErrores: parseInt(cantErrores as string),
        funcionesCreadas: parsedFuncionesCreadas,
        errores: parsedErrores,
      });
    }
  }, [router.isReady, router.query]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);

    if (selectedFile) {
      // Simular la carga del archivo
      setIsUploading(true);
      setUploadProgress(0);

      const interval = setInterval(() => {
        setUploadProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return Math.min(oldProgress + 20, 100);
        });
      }, 500);
    }
  };

  const handleCancelUpload = () => {
    setFile(null);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleDownloadErrores = async () => {
    try {
      if (response) {
        const erroresBlob = await descargarErroresFuncionEstandarizada(response.cargaMasivaId);
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

  // Nueva función para manejar la redirección
  const handleRedirect = () => {
    routerPush('/microMaestros/funcionEstandarizada/');
  };

  if (!response) {
    return <Spinner />;
  }

  return (
    <>
      <Box sx={{ p: 4, margin: '0 auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Actualizamos el ArrowbackButton para redirigir */}

            <IconButton onClick={handleRedirect}>
              <ArrowBackIosNewIcon />
            </IconButton>
            <Typography variant="h1">Crear función estandarizada</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SwitchCreacionMasiva checked={true} onClick={() => { }} />
            </Box>
          </Box>
        </Box>

        {/* Sección de carga de archivo */}
        <input
          type="file"
          accept=".xls,.xlsx"
          style={{ display: 'none' }}
          id="file-upload"
          onChange={handleFileChange}
          disabled={isUploading}
        />

        {file && (
          <Box mt={2} display="flex" alignItems="center">
            <InsertDriveFileIcon style={{ color: '#1E90FF', marginRight: '8px' }} />
            <Typography variant="body1">{file.name}</Typography>
            <IconButton onClick={handleCancelUpload} color="primary">
              <CancelIcon />
            </IconButton>
          </Box>
        )}

        {isUploading && (
          <Box mt={2}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="caption">{`Cargando: ${uploadProgress}%`}</Typography>
            <Box mt={1}>
              <Button onClick={handleCancelUpload} variant="outlined" color="primary" size="small">
                Cancelar
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      <Typography sx={{ color: '#5C5C5C', textDecoration: 'none', display: 'flex', alignItems: 'center', m: 8 }} variant="body1">
        {response.cantFuncionesCreadas} datos cargados de forma correcta,{' '}
        <Link component="button" onClick={handleDownloadErrores} sx={{ color: '#0651DD', textDecoration: 'underline', cursor: 'pointer' }}>
          {response.cantErrores} incorrectos
        </Link>.
      </Typography>

      {/* Actualizamos el botón "Cancelar" para redirigir */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: { md: 40 }, mb: 15 }}>
        <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={handleRedirect}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary" disabled={true} sx={{ mt: 2, ml: 10 }}>
          Crear
        </Button>
      </Box>
    </>
  );
}
