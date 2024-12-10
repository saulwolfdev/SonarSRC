import React, { useCallback, useState } from 'react';
import { Box, Button, TextField, Typography, Link } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { MuiFileUploader } from './components/DropzoneAreas';
import { downloadPlantilla, postAreas, postAreasMasiva } from '@/services/microMaestros/areasService';
import ArrowbackButton from '@/components/shared/ArrowbackButton';
import SnackbarAlert, { typeAlert } from '@/components/shared/SnackbarAlert';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { AreasCargaMasivaResponse } from '@/types/microMaestros/areasTypes';
import {InputCreateUpdate} from './components/InputCreateUpdate';
import ButtonsCreateUpdate from '@/components/shared/ButtonsCreateUpdate';
import { useRouterPushQuery } from '@/hooks/useRouterPush';

export const CreateAreas = () => {
  const router = useRouter();
  const routerPushQuery = useRouterPushQuery();

  const [checked, setChecked] = useState(false);
  const [fileObjects, setFileObjects] = useState<File[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const handleFileChange = (newFiles: File[]) => {
    setFileObjects(newFiles);
  };

  const handleSwitchClick = () => {
    setChecked((prevChecked) => !prevChecked);
    setFileObjects([]);
    formik.resetForm();
  };

  const handleDownloadClick = async () => {
    await downloadPlantilla(setAlertMessage, setAlertType);
  };

  const handleCreate = useCallback(async (values: { nombre: string }) => {

    if (!checked) {
      // Creación individual
      postAreas({ nombre: values.nombre })
        .then(() => {
          setAlertMessage("Se guardó con éxito");
          setAlertType(typeAlert.success);
          setTimeout(() => {
            router.back();
          }, 1000);
        })
        .catch((error: any) => {
          if (error.errors) {
            setAlertMessage(error.errors[0].description);
            setAlertType(typeAlert.error);
          } else {
            setAlertMessage("No se pudo crear un nuevo dato, intente más tarde");
            setAlertType(typeAlert.error);
          }
        });
    } else if (fileObjects.length > 0) {
      // Creación masiva
      const file = fileObjects[0];
      postAreasMasiva(file)
        .then((response: AreasCargaMasivaResponse) => {
          routerPushQuery({
            pathname: '/microMaestros/areas/cargaMasiva',
            query: {
              cargaMasivaId: response.cargaMasivaId,
              cantFuncionesCreadas: response.cantFuncionesCreadas,
              cantErrores: response.cantErrores,
              funcionesCreadas: JSON.stringify(response.funcionesCreadas),
              errores: JSON.stringify(response.errores),
            },
          });
        })
        .catch((error: any) => {
          if (error.errors) {
            const validationErrors = error.errors
              .map((err: { errorMessage: string }) => err.errorMessage)
              .join(', ');
            setAlertMessage(validationErrors);
            setAlertType(typeAlert.error);
          } else {
            setAlertMessage("No se pudo completar la carga masiva, intente más tarde");
            setAlertType(typeAlert.error);
          }
        });
    } else {
      setAlertMessage("Por favor, selecciona un archivo para la carga masiva.");
      setAlertType(typeAlert.warning);
    }
  }, [checked, fileObjects]);


  const validationSchema = Yup.object({
    nombre: Yup.string()
      .min(3, 'Debe tener entre 3 y 80 caracteres.')
      .max(80, 'Debe tener entre 3 y 80 caracteres.')
      .matches(/^[a-zA-Z0-9Ññ\s]*$/, 'Solo se permiten letras, números y espacios')
      .required('El nombre es obligatorio'),
  });

  const formik = useFormik({
    validateOnChange: true,
    validateOnBlur: true, 
    initialValues: { nombre: '' },
    validationSchema: !checked ? validationSchema : Yup.object(),
    onSubmit: handleCreate,
  });

  return (
    <Box sx={{ p: 4, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ArrowbackButton />
          <Typography variant="h1">Crear área</Typography>
        </Box>
      </Box>

      {!checked ? (
        <form onSubmit={formik.handleSubmit}>
          <SnackbarAlert
              message={alertMessage}
              type={alertType}
              setAlertMessage={setAlertMessage}
              setAlertType={setAlertType}
            />
            <InputCreateUpdate formik={formik} />
            <ButtonsCreateUpdate 
            disabled={!(formik.isValid && formik.dirty)} 
            
            />
        </form>
      ) : (
        <>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 60 }}>
          <Box sx={{ width: '50%', display: 'contents' }}>
            <MuiFileUploader onFileChange={handleFileChange} />
          </Box>
          <Typography sx={{ color: '#5C5C5C', textDecoration: 'none', display: 'flex', alignItems: 'center', m: 8 }} variant="body1">
            Tamaño máximo de archivo: 50MB. Solo archivos .xlsx, .xlsm, .xlsb.
          </Typography>
          <Link
            component="button"
            onClick={handleDownloadClick}
            sx={{ color: '#81A8EE', textDecoration: 'none', display: 'flex', alignItems: 'center', mt: 8 }}
          >
            <PictureAsPdfIcon sx={{ mr: 1 }} />
            Descargar plantilla
          </Link>
        </Box>
        <ButtonsCreateUpdate disabled={fileObjects.length === 0} />
        </>
      )}
    </Box>
  );
};

export default CreateAreas;
