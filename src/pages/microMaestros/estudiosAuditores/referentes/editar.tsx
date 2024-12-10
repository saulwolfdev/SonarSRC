import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import ArrowbackButton from '@/components/shared/ArrowbackButton';
import CancelButton from '@/components/shared/CancelButton';
import SnackbarAlert, { typeAlert } from '@/components/shared/SnackbarAlert';
import AccordionForm from '@/components/shared/AcordeonForm';
import { fetchReferenteById, putReferente } from '@/services/microMaestros/ReferentesServices';
import { ReferenteDetalleResponse } from '@/types/microMaestros/ReferentesTypes';
import Spinner from '@/components/shared/Spinner';

export const EditReferente: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const numericId = typeof id === 'string' ? parseInt(id) : undefined;

    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (numericId !== undefined) {
            fetchReferenteById(numericId)
                .then((data: ReferenteDetalleResponse) => {
                    formik.setValues({
                        idReferente: data.id,
                        sedeId: data.sedeId,
                        usuarioEPId: data.usuarioEPId,
                        nombre: data.nombre,
                        email: data.email || '',
                        rolEspecialidad: data.rolEspecialidad || '',
                        estado: data.estado
                    });
                })
                .catch((error) => {
                    setAlertMessage("Error al cargar los datos");
                    setAlertType(typeAlert.error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [numericId]);

    const formik = useFormik({
        initialValues: {
            idReferente: 0,
            sedeId: 0,
            usuarioEPId: 0,
            nombre: '',
            email: '',
            rolEspecialidad: '',
            estado: true,
        },
        validationSchema: Yup.object({
            //TODO
            // nombre: Yup.string().min(3, 'Debe tener al menos 3 caracteres').required('El nombre es obligatorio'),
            // telefono: Yup.string().required('El teléfono es obligatorio'),
            // email: Yup.string().email('Debe ser un email válido').required('El email es obligatorio'),
            // rol: Yup.string().required('El rol es obligatorio'),
        }),
        onSubmit: async (values) => {
            if (numericId !== undefined) {
                try {
                    await putReferente({ id: numericId, ...values });
                    setAlertMessage("Referente actualizado con éxito");
                    setAlertType(typeAlert.success);
                    setTimeout(() => {
                        router.back();
                    }, 1000);
                } catch (error: any) {
                        if(error.response.data.errors){
                          setAlertMessage(error.response.data.errors[0].description);
                        }
                          else{
                    setAlertMessage("Error al actualizar el referente");
                          }
                    setAlertType(typeAlert.error);
                }
            }
        },
    });

    if (loading) {
        return <Spinner />
    }

    return (

        <Box
            sx={{
                width: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                overflow: "hidden",
            }}>
            <SnackbarAlert
                message={alertMessage}
                type={alertType}
                setAlertMessage={setAlertMessage}
                setAlertType={setAlertType}
            />
            <Box display="flex" alignItems="center" sx={{ width: "100%", display: "ruby", mt: 8 }}>
                <ArrowbackButton />
                <Typography variant="h1">Editar Referente</Typography>
            </Box>

            <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: "100%", mt: 4 }}>
                <AccordionForm title="Definición general/Ubicación">
                    <TextField
                        id="usuarioEPId"
                        name="usuarioEPId"
                        label="Id de usuario EP"
                        type="number"
                        value={formik.values.usuarioEPId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.usuarioEPId && Boolean(formik.errors.usuarioEPId)}
                        helperText={formik.touched.usuarioEPId && formik.errors.usuarioEPId}
                        sx={{ width: { md: "30%" } }}
                        size="small"
                    />
                    <TextField
                        id="nombre"
                        name="nombre"
                        label="Nombre del Referente*"
                        value={formik.values.nombre}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                        helperText={formik.touched.nombre && formik.errors.nombre}
                        sx={{ width: { md: "30%" } }}
                        size="small"
                    />

                    <TextField
                        id="email"
                        name="email"
                        label="Email*"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        sx={{ width: { md: "30%" } }}
                        size="small"
                    />
                    <TextField
                        id="rolEspecialidad"
                        name="rolEspecialidad"
                        label="Rol - Especialidad"
                        value={formik.values.rolEspecialidad}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.rolEspecialidad && Boolean(formik.errors.rolEspecialidad)}
                        helperText={formik.touched.rolEspecialidad && formik.errors.rolEspecialidad}
                        sx={{ width: { md: "30%" }, mt: { md: 24 } }}
                        size="small"
                    />
                </AccordionForm>
            </Box>

            <Box
                component="form" onSubmit={formik.handleSubmit}
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    mt: { md: 40 },
                }}
            >
                <CancelButton />

                <Button
                    type="submit"
                    variant="contained"
                    disabled={!formik.isValid || !formik.dirty}
                    className="MuiButton-primary"
                    sx={{ ml: { md: 8 } }}
                >
                    EDITAR
                </Button>
            </Box>
        </Box>
    );
};

export default EditReferente;
