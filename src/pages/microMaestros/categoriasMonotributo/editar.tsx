import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import ArrowbackButton from '@/components/shared/ArrowbackButton';
import CancelButton from '@/components/shared/CancelButton';
import SnackbarAlert, { typeAlert } from '@/components/shared/SnackbarAlert';
import { fetchCategoriasMonotributoById, putCategoriasMonotributo } from './services/CategoriasMonotributoService';
import { CategoriasMonotributoDetalleResponse } from './types/CategoriasMonotributoTypes';
import Spinner from '@/components/shared/Spinner';

export const EditCategoriasMonotributo: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const numericId = typeof id === 'string' ? parseInt(id) : undefined;

    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (numericId !== undefined) {
            fetchCategoriasMonotributoById(numericId)
                .then((data: CategoriasMonotributoDetalleResponse) => {
                    console.log(data)
                    formik.setValues({
                        nombre: data.nombre
                    });
                })
                .catch((error: any) => {
                    setAlertMessage("Error al cargar los datos");
                    setAlertType(typeAlert.error);
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
            .matches(/^[a-zA-Z0-9Ññ\s]*$/, 'Solo se permiten letras, números y espacios')
            .required('El nombre es obligatorio')
    });


    const formik = useFormik({
        initialValues: {
            nombre: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (numericId !== undefined) {
                try {
                    console.log("Sending data:", { id: numericId, nombre: values.nombre});
                    await putCategoriasMonotributo({ id: numericId, nombre: values.nombre });
                    setAlertMessage("Se actualizó con éxito");
                    setAlertType(typeAlert.success);
                    setTimeout(() => {
                        router.back();
                    }, 1000);
                } catch (error: any) {
                    console.log("Error:", error);
                    setAlertMessage(error.response.data.errors[0].description);
                    setAlertType(typeAlert.error);
                }
            }
        },
    });


    if (loading) {
        return <Spinner /> // Muestra un mensaje de carga
    }

    return (
        <Box >
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
                    <TextField
                        id="nombre"
                        label="Nombre Diagrama Trabajo*"
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
                        disabled={!formik.isValid || !formik.dirty}
                        className="MuiButton-primary"
                    >
                        EDITAR
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default EditCategoriasMonotributo;