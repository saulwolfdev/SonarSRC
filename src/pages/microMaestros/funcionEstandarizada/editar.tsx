import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { patchFuncionEstandarizada, getFuncionEstandarizada } from '@/services/microMaestros/funcionEstandarizadaService'; // Asegúrate de importar correctamente
import { useRouter } from 'next/router';
import ArrowbackButton from '@/components/shared/ArrowbackButton';
import CancelButton from '@/components/shared/CancelButton';
import SnackbarAlert, { typeAlert } from '@/components/shared/SnackbarAlert';
import { FuncionEstandarizadaResponse } from '@/types/microMaestros/funcionEstandarizadaTypes';
import ButtonsCreateUpdate from '@/components/shared/ButtonsCreateUpdate';
import { InputCreateUpdateFuncionEstandarizada } from './components/InputCreateUpdateFuncionEstandarizada';
import Spinner from '@/components/shared/Spinner';

export const EditFuncionEstandarizada: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const numericId = typeof id === 'string' ? parseInt(id) : undefined;

  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (numericId !== undefined) {
      // Llamada al servicio para obtener la función estandarizada
      getFuncionEstandarizada(numericId)
        .then((data: FuncionEstandarizadaResponse) => {
          formik.setValues({ nombre: data.nombre });  // Actualizamos el nombre en el formik
        })
        .catch((error) => {
          if(error.errors){
            setAlertMessage(error.errors[0].description);
          }
            else{

          setAlertMessage("Error al cargar los datos");
            }
          setAlertType(typeAlert.error);
        })
        .finally(() => {
          setLoading(false);  // Ya cargó la data, quitamos el estado de loading
        });
    }
  }, [numericId]);

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
    initialValues: {
      nombre: '',  // El valor se actualizará cuando se reciba la respuesta del endpoint
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (numericId !== undefined) {
        try {
          console.log("Sending data:", { id: numericId, nombre: values.nombre });
          await patchFuncionEstandarizada({ id: numericId, nombre: values.nombre });
          setAlertMessage("Se actualizó con éxito");
          setAlertType(typeAlert.success);
          setTimeout(() => {
            router.back();
          }, 1000);
        } catch (error: any) {
          console.log("Error:", error);
          setAlertMessage(error.errors[0].description);
          setAlertType(typeAlert.error);
        }
      }
    },
  });

  if (loading) {
    return <Spinner /> // Muestra un mensaje de carga
  }

  return (
    <Box sx={{ p: 4, margin: '0 auto' }}>
      <SnackbarAlert
        message={alertMessage}
        type={alertType}
        setAlertMessage={setAlertMessage}
        setAlertType={setAlertType}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ArrowbackButton />
          <Typography variant="h1">Editar función estandarizada</Typography>
        </Box>
      </Box>

      <form 
      onSubmit={formik.handleSubmit}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
        }
      }}
      >
         <InputCreateUpdateFuncionEstandarizada formik={formik} />
         <ButtonsCreateUpdate disabled={!(formik.isValid && formik.dirty)} isEdit={true} />
      </form>
    </Box>
  );
};

export default EditFuncionEstandarizada;
