"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import Spinner from "@/components/shared/Spinner";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import InputsCreateUpdate from "@/components/microMaestros/motivosBloqueos/formCreateUpdate/InputsCreateUpdate";
import { fetchMotivoBloqueoById, patchMotivoBloqueo } from "@/services/microMaestros/motivosBloqueosService";

const validationSchema = yup.object({
  enviaNotificacion: yup.boolean().required("Campo obligatorio"),
  enviaComunicacionFormal: yup.boolean().required("Campo obligatorio"),
});

const EditarMotivoBloqueo = () => {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const formik = useFormik({
    initialValues: {
      id: Number(id),
      nombre: "",
      origenNombre: "",
      enviaNotificacion: false,
      enviaComunicacionFormal: false,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const dataToUpdate = {
        id: Number(id),
        enviaNotificacion: values.enviaNotificacion,
        enviaComunicacionFormal: values.enviaComunicacionFormal,
      };
      patchMotivoBloqueo(dataToUpdate)
        .then(() => {
          setAlertMessage("¡Se guardó con éxito!");
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
              setAlertMessage("No se pudo realizar la edición. Inténtalo más tarde."
          );}
          setAlertType(typeAlert.error);
        });
    },
  });

  useEffect(() => {
    if (id && typeof id === "string") {
      fetchMotivoBloqueoById(Number(id))
        .then((response) => {
          if (response.isSuccess) {
            const responseData = response.data;
            formik.setValues({
              id: Number(id),
              nombre: responseData.nombre,
              origenNombre: responseData.origenNombre,
              enviaNotificacion: responseData.enviaNotificacion,
              enviaComunicacionFormal: responseData.enviaComunicacionFormal,
            });
            setLoading(false);
          } else {
            setAlertMessage("Error al cargar los datos.");
            setAlertType(typeAlert.error);
            setLoading(false);
          }
        })
        .catch((error) => {
          setAlertMessage("Error al cargar los datos.");
          setAlertType(typeAlert.error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <Spinner />;

  return (
    <Box sx={{ width: "100%", py: 4 }}>
      <SnackbarAlert
        message={alertMessage}
        type={alertType}
        setAlertMessage={setAlertMessage}
        setAlertType={setAlertType}
      />
      <Box display="flex" alignItems="center" mb={3}>
        <ArrowbackButton />
        <Typography variant="h1" sx={{ textAlign: "start", flexGrow: 1 }}>
          Editar Motivo de Bloqueo
        </Typography>
      </Box>
      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputsCreateUpdate formik={formik} />
        <ButtonsCreateUpdate disabled={!(formik.isValid && formik.dirty)} isEdit={true} />
      </form>
    </Box>
  );
};

export default EditarMotivoBloqueo;
