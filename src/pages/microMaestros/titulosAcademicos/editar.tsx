import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import ArrowbackButton from '@/components/shared/ArrowbackButton';
import CancelButton from '@/components/shared/CancelButton';
import SnackbarAlert, { typeAlert } from '@/components/shared/SnackbarAlert';
import { fetchTitulosAcademicosById, putTitulosAcademicos } from '../../../services/microMaestros/TitulosAcademicosService';
import { TitulosAcademicosDetalleResponse } from '../../../types/microMaestros/TitulosAcademicosTypes';
import Spinner from '@/components/shared/Spinner';

export const EditTitulosAcademicos: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const numericId = typeof id === 'string' ? parseInt(id) : undefined;

    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Nuevo estado para controlar el envío

    useEffect(() => {
        if (numericId !== undefined) {
            fetchTitulosAcademicosById(numericId)
                .then((data: TitulosAcademicosDetalleResponse) => {
                    formik.setValues({
                        nombre: data.nombre
                    });
                })
                .catch((error) => {
                    setAlertMessage("Error al cargar los datos");
                    setAlertType(typeAlert.error);
                    console.error("Error:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [numericId]);

    const validationSchema = Yup.object({
        nombre: Yup.string()
            .min(3, 'Debe tener entre 3 y 80 caracteres.')
            .max(80, 'Debe tener entre 3 y 80 caracteres.')
            .required('El nombre es obligatorio')
    });

    const formik = useFormik({
        initialValues: {
            nombre: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (numericId !== undefined) {
                setIsSubmitting(true); // Indicar que se está enviando el formulario
                try {
                    await putTitulosAcademicos({ id: numericId, nombre: values.nombre });
                    setAlertMessage("Se actualizó con éxito");
                    setAlertType(typeAlert.success);
                    setTimeout(() => {
                        router.back();
                    }, 1000);
                } catch (error: any) {
                    console.error("Error:", error);
                    setAlertMessage(error.response.data.errors[0].description);
                    setAlertType(typeAlert.error);
                } finally {
                    setIsSubmitting(false); // Indicar que terminó el envío
                }
            }
        },
    });

    if (loading) {
        return <Spinner /> 
    }

    return (
        <Box>
            <SnackbarAlert
                message={alertMessage}
                type={alertType}
                setAlertMessage={setAlertMessage}
                setAlertType={setAlertType}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ArrowbackButton />
                    <Typography variant="h1">Editar categoría de monotributo</Typography>
                </Box>
            </Box>

            <form onSubmit={formik.handleSubmit}>
                <Box className="box-form-create-update" sx={{ mb: 32 }}>
                    <Typography variant="body1" sx={{ mb: 24, mt: 32, ml: 16 }}>
                        Definición general
                    </Typography>
                    <TextField
                        id="nombre"
                        label="Nombre *"
                        name="nombre"
                        value={formik.values.nombre}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                        helperText={formik.touched.nombre && formik.errors.nombre}
                        sx={{ width: "30%", mr: { md: 80 } }}
                        size="small"
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 16, mt: 8 }}>
                    <CancelButton />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || isSubmitting || !formik.isValid || !formik.dirty}
                        className="MuiButton-primary"
                    >
                        EDITAR
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default EditTitulosAcademicos;
