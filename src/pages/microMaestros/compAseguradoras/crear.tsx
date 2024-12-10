"use client";

import React, { useCallback, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, IconButton, Typography, Link, Button } from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";

import { downloadPlantilla, postCompaniasAseguradoras, postCompAseguradorasMasiva } from "../../../services/microMaestros/CompaniasAseguradorasService";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import InputsCreateUpdate from "../../../components/microMaestros/compAseguradora/formCreateUpdate/InputsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { CompaniaAseguradoraCreateRequest, CompAseguradorasCargaMasivaResponse, FormikCompaniaAseguradoraCreateOrUpdateRequest } from '../../../types/microMaestros/companiasAseguradorasTypes';
import SwitchCreacionMasiva from "../../../components/microMaestros/compAseguradora/SwitchCreacionMasiva";
import { MuiFileUploader } from '../../../components/microMaestros/compAseguradora/DropzoneCompaniasAseguradoras';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CancelButton from '@/components/shared/CancelButton';
import { validarCuit } from "../../../components/microMaestros/compAseguradora/helpers/validarCuit";
import { useRouterPushQuery } from "@/hooks/useRouterPush";


const validationSchema = yup.object({
  nombre: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .matches(
      /^[a-zA-ZÑñ0-9\s]+$/,
      "No se permiten acentos"
    )
    .required("Campo obligatorio"),
  cuit: yup
    .string()
    .required("Campo obligatorio.")
    .test("valid-cuit", "El CUIT no es válido.", (value) => {
      if (!value) return false;
      return validarCuit(value);
    }),
  tiposSegurosIds: yup
    .array()
    .of(yup.number().required("Campo obligatorio."))
    .min(1, "Debes seleccionar al menos un tipo de seguro.") // Asegura que al menos un tipo sea seleccionado
    .required("Campo obligatorio."),
  excepcionesSeguros: yup
    .array()
    .of(
      yup.object({
        tipoSeguroId: yup
          .number()
          .required("El tipo de seguro es obligatorio."),
        contratistasIds: yup
          .array()
          .of(yup.number())
          .when('tipoSeguroId', {
            is: 0, // alternatively: (val) => val == true
            then: (schema) => schema.min(0),
            otherwise: (schema) => schema.min(1, "Debes seleccionar al men os un contratista."),
          })
      })
    )
});

export default function CrearCompaniasAseguradoras() {
  const router = useRouter();
  const routerPushQuery = useRouterPushQuery();

  // respuesta
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [checked, setChecked] = useState(false);
  const [fileObjects, setFileObjects] = useState<File[]>([]);

  const handleSwitchClick = () => {
    setChecked((prevChecked) => !prevChecked);
    setFileObjects([]);
    formik.resetForm();
  };

  const handleFileChange = (newFiles: File[]) => {
    setFileObjects(newFiles);
  };

  const handleDownloadClick = async () => {
    await downloadPlantilla(setAlertMessage, setAlertType);
  };

  const handleCreate = useCallback(async (values: FormikCompaniaAseguradoraCreateOrUpdateRequest) => {
    if (!checked) {
      const data: CompaniaAseguradoraCreateRequest = {
        nombre: values.nombre,
        cuit: values.cuit.toString(),
        observacion: values.observacion,
        estado: true,
        tiposSegurosIds: values.tiposSegurosIds,
        excepcionesSeguros: values.excepcionesSeguros.filter(e => e.tipoSeguroId != 0),
      };

      postCompaniasAseguradoras(data)
        .then(() => {
          setAlertMessage("Se guardó con éxito");
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
            setAlertMessage("No se pudo crear un nuevo dato, intente más tarde.");
          }
          setAlertType(typeAlert.error);
        });
    } else if (fileObjects.length > 0) {
      const file = fileObjects[0];
      postCompAseguradorasMasiva(file)
        .then((response: CompAseguradorasCargaMasivaResponse) => {
          console.log("Response: ", response);
          routerPushQuery({
            pathname: '/microMaestros/compAseguradoras/cargaMasiva',
            query: {
              id: response.id,
              cantidadCreados: response.cantidadCreados,
              cantidadErrores: response.cantidadErrores,
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


  const formik = useFormik<FormikCompaniaAseguradoraCreateOrUpdateRequest>({
    initialValues: {
      nombre: "",
      cuit: '',
      observacion: '',
      tiposSegurosIds: [],
      excepcionesSeguros: [{
        tipoSeguroId: 0,
        contratistasIds: []
      }]
    },
    validationSchema: validationSchema,
    onSubmit: handleCreate,
  });

  return (
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
          Crear compañia aseguradora
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SwitchCreacionMasiva checked={checked} onClick={handleSwitchClick} />
        </Box>
      </Box>


      {!checked ? (

        <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <InputsCreateUpdate formik={formik} />
          <ButtonsCreateUpdate
            disabled={false}
          />
        </form>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', m: 'auto', width: '100%', height: '40vh' }}>
          <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MuiFileUploader onFileChange={handleFileChange} />
            <Typography sx={{ color: '#5C5C5C', textDecoration: 'none', display: 'flex', alignItems: 'center', mt: 4 }} variant="body1">
              Tamaño máximo de archivo: 50MB. Solo archivos .xlsx, .xlsm, .xlsb.
            </Typography>
            <Link
              component="button"
              onClick={handleDownloadClick}
              sx={{ color: '#81A8EE', textDecoration: 'none', display: 'flex', alignItems: 'center', mt: 2 }}
            >
              <PictureAsPdfIcon sx={{ mr: 1 }} />
              Descargar plantilla
            </Link>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3, mt: 4, width: '100%' }}>
            <CancelButton />
            <Button
              disabled={!checked ? formik.values.nombre.length < 3 : fileObjects.length === 0}
              variant="contained"
              type="submit"
              className="MuiButton-primary"
              onClick={handleCreate as any}            >
              CREAR
            </Button>
          </Box>
        </Box>


      )}

    </Box>
  );
}
