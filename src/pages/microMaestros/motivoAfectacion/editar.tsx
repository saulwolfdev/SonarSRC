"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import { fetchMotivoAfectacionById, putMotivoAfectacion } from "../../../services/microMaestros/motivoAfectacionService";
import Spinner from "@/components/shared/Spinner";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { InputsMotivoAfectacion } from "../../../components/microMaestros/motivoAfectacion/InputsMotivoAfectacion";
import { MotivoAfectacionDetalleResponse, MotivoAfectacionUpdateRequest } from "@/types/microMaestros/motivoAfectacionTypes";

const validationSchema = yup.object({
    motivoAfectacion: yup
        .string()
        .min(3, "Debe tener entre 3 y 80 caracteres.")
        .max(80, "Debe tener entre 3 y 80 caracteres.")
        .matches(
            /^[0-9a-zA-ZÑñ\s]+$/,
            "Solo se permiten letras incluida la Ñ, sin acentos"
        )
        .required("Campo obligatorio"),
    //predictivo
    relacionServicio: yup
        .array()
        .required("Campo obligatorio."),
});

export default function UpdateMotivoAfectacion() {
    const router = useRouter();

    const { id } = router.query;

    const [loading, setLoading] = useState(true);

    // respuesta
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

    const [response, setResponse] = useState<MotivoAfectacionDetalleResponse | null>(
        null
    );

    const formik = useFormik<any>({
        initialValues: {
            motivoDeAfectacion: "",
            relacionServicio: [],
            fechaIncorporacion: false,
            bajaPorCesion: false,
            afectacionTemporal: false,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (response === null) return;
            const body: MotivoAfectacionUpdateRequest = {
                ...values,
                id: response.id,
                motivoDeAfectacion: values.motivoDeAfectacion ?? response.motivoDeAfectacion,
                relacionServicio: values.relacionServicio ?? response.relacionServicio,
                fechaIncorporacion: values.fechaIncorporacion ?? response.fechaIncorporacion,
                bajaPorCesion: values.bajaPorCesion ?? response.bajaPorCesion,
                afectacionTemporal: values.afectacionTemporal ?? response.afectacionTemporal,
            }
            putMotivoAfectacion(body)
                .then((res) => {
                    setAlertMessage("Se guardo con éxito");
                    setAlertType(typeAlert.success);
                    setTimeout(() => {
                        router.back();
                    }, 1000);
                })
                .catch((error) => {
                    if(error.response.data.errors){
                      setAlertMessage(error.response.data.errors[0].description);
                    }
                      else{
                        setAlertMessage(
                            "No se pudo realizar la edición, intente más tarde."
                        );
                    }
                    setAlertType(typeAlert.error);
                })
                .finally();
        },
    });

    useEffect(() => {
        if (id && typeof id === "string") {
            const numericId = parseInt(id, 10);

            if (!isNaN(numericId)) {
                fetchMotivoAfectacionById(numericId)
                    .then((response) => {
                        console.log("Response:", response);
                        formik.setValues({
                            motivoDeAfectacion: response.motivoDeAfectacion,
                            relacionServicio: response.relacionServicio,
                            fechaIncorporacion: response.fechaIncorporacion,
                            bajaPorCesion: response.bajaPorCesion,
                            afectacionTemporal: response.afectacionTemporal,
                        });
                        setResponse(response);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error("Error fetching data:", error);
                        setLoading(false);
                    });

            }
        }
    }, [id]);


    return loading ? (
        <Spinner />
    ) : (
        <Box
            sx={{
                width: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                overflow: "hidden",
            }}
        >
            <SnackbarAlert
                message={alertMessage}
                type={alertType}
                setAlertMessage={setAlertMessage}
                setAlertType={setAlertType}
            />
            <Box display="flex" alignItems="center">
                <ArrowbackButton />
                <Typography variant="h1" sx={{ textAlign: "center", flexGrow: 1 }}>
                    Editar motivo de afectación
                </Typography>
            </Box>

            <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
                <InputsMotivoAfectacion formik={formik} response={response} />
                <ButtonsCreateUpdate
                    isEdit={true}
                />
            </form>
        </Box>
    );
}
