"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";

import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { InputsContratista } from "@/components/microContratos/contratistas/form/InputsCreateUpdate";
import {
  fetchContratistaById,
  postContratista,
  putContratista,
} from "@/services/microContratos/contratistasService";
import { ContratistaDetalleResponse, ContratistaUpdate, EstadoBloqueo } from "@/types/microContratos/contratistasTypes";
import moment from "moment";
import Spinner from "@/components/shared/Spinner";

const validationSchema = yup.object({
  razonSocial: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .matches(
      /^[a-zA-ZÑñ&.\- ]+$/,
      "Ingresa caracteres (incluida la ñ) sin acentos."
    )
    .trim("Ingresa caracteres (incluida la ñ) sin acentos.")
    .required("Campo obligatorio."),
  numeroIdentificacion: yup.number().required("Campo obligatorio."),
  //tipoIdentificacion
  paisId: yup
    .number()
    .min(1, "Campo obligatorio.")
    .required("Campo obligatorio."),
  provinciaId: yup.number(),
  localidadId: yup.number(),
  calle: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .matches(
      /^[a-zA-ZÑñ&.\- ]+$/,
      "Ingresa caracteres (incluida la ñ) sin acentos."
    )
    .required("Campo obligatorio."),
  nroCalle: yup
    .number()
    .min(1, "Debe tener entre 1 y 10 caracteres.")
    .max(9999999999, "Debe tener entre 1 y 10 caracteres.") //numbers tienen como max el el maxnumber
    .required("Campo obligatorio."),
  piso: yup.string().max(10, "Debe tener entre 1 y 10 caracteres."),
  departamento: yup.string().max(10, "Debe tener entre 1 y 10 caracteres."),
  nombreContactoComercial: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .matches(
      /^[a-zA-ZÑñ&.\- ]+$/,
      "Ingresa caracteres (incluida la ñ) sin acentos."
    )
    .required("Campo obligatorio."),
  emailContactoComercial: yup
    .string()
    .min(10, "Debe tener entre 10 y 80 caracteres.")
    .max(80, "Debe tener entre 10 y 80 caracteres.")
    .required("Campo obligatorio."),
  telefono: yup
    .number() // todo no se si deberia ser string
    .min(100000, "Campo obligatorio.") // minimo 6 diigtos
    .required("Campo obligatorio."),
  nroIERIC: yup
    .string() // todo agregarlo al crear
    .matches(
      /^\d{5}(-\d{1})?$/,
      "Debe tener 5 dígitos o 5 dígitos seguidos de un guion y 1 dígito"
    )
    .notRequired(),
  motivoEmpresaPromovida: yup
    .string()
    .min(10, "Debe tener entre 10 y 250 caracteres.")
    .max(250, "Debe tener entre 10 y 250 caracteres.")
    .matches(
      /^[a-zA-ZÑñ&.\- ]+$/,
      "Ingresa caracteres (incluida la ñ) sin acentos."
    ).notRequired(),
  sedeId: yup.number().notRequired(),
  estadoBloqueoId: yup.number(),
  motivoBloqueoIds: yup.array().of(yup.number()),
  motivoDesbloqueo: yup
    .string()
    .max(250, "Debe tener hasta  250 caracteres.")
    .matches(
      /^[a-zA-ZÑñ&.\- ]+$/,
      "Ingresa caracteres (incluida la ñ) sin acentos."
    ),

  // politicaDiversidad : yup.string().required("Campo obligatorio."),
  // linkPoliticaDiversidad : yup.string().required("Campo obligatorio."),
  bloqueoDesde: yup.date().notRequired(),
  bloqueoHasta: yup
    .date()
    .min(
      moment().startOf("day").toDate(),
      "La fecha no puede ser anterior a la fecha actual."
    )
    .notRequired(),
});

export default function CrearCentroFisico() {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);

  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [response, setResponse] = useState<
    ContratistaDetalleResponse | undefined
  >();
  const [loading, setLoading] = useState(true);
  const [withoutIntegration, setWithoutIntegration] = useState(false);
 

  const validateObjet = (values: any) => {
    const errors: any = {};
    
    if (values.empresaConstruccion && !values.nroIERIC) {
      errors.nroIERIC = "Campo obligatorio.";
    }
    if (values.empresaPromovida && !values.motivoEmpresaPromovida) {
      errors.motivoEmpresaPromovida = "Campo obligatorio.";
    }
    if (values.estudioAuditorId  && !values.sedeId) {
      errors.sedeId = "Campo obligatorio.";
    }
    if (values.estadoBloqueoId == EstadoBloqueo.Bloqueado && values.motivoBloqueoIds.length == 0) {
      // Id del bloquado
      errors.motivoBloqueoIds = "Campo obligatorio.";
    }
    if (values.estadoBloqueoId == EstadoBloqueo.DesbloqueadoTransitorio) {
      // Id del desbloqueado transitorio
      if(values.motivoDesbloqueo.length == 0){
        errors.motivoDesbloqueo = "Campo obligatorio.";
      }
      if(!values.fechaInicioDesbloqueo){
        errors.fechaInicioDesbloqueo = "Campo obligatorio.";
      }
      if(!values.fechaFinalizacionDesbloqueo){
        errors.fechaFinalizacionDesbloqueo = "Campo obligatorio.";
      }
      if (values.fechaFinalizacionDesbloqueo < values.fechaInicioDesbloqueo) {
        errors.fechaFinalizacionDesbloqueo = "La segunda fecha debe ser mayor a la primera";
      }     
    }
    
    return errors;
  };

  const formik = useFormik<ContratistaUpdate>({
    initialValues: {
      id: 0,
      razonSocial: "",
      numeroIdentificacion: 0,
      telefono: 0,
      codigoPostalId: 0,
      codigoPostalNombre: "",  // no lo recibe el back, es solo para el formulario
      localidadId: 0,
      localidadNombre: "", // no lo recibe el back, es solo para el formulario
      provinciaId: 0,
      provinciaNombre: "", // no lo recibe el back, es solo para el formulario
      paisId: 9,
      paisNombre: "", // no lo recibe el back, es solo para el formulario
      calle: "",
      nroCalle: 0,
      piso: 0,
      departamento: 0,
      nombreContactoComercial: "",
      emailContactoComercial: "",
      empresaEventual: false,
      empresaConstruccion: false,
      nroIERIC: null,
      codigoSAP: 0, // no lo recibe el back, es solo para el formulario

      politicaDiversidad: false,
      linkPoliticaDiversidad: "",
      empresaPromovida: false,
      motivoEmpresaPromovida: null,
      estudioAuditorId: null,
      sedeId: null,
      estadoBloqueoId: 0,
      fechaInicioDesbloqueo: null,
      fechaFinalizacionDesbloqueo: null,
      motivoBloqueoIds: [],
      motivoDesbloqueo: "",
    },
    validationSchema: validationSchema,
    validate: validateObjet,
    onSubmit: (values) => {
      putContratista(values)
        .then((res) => {
          setAlertMessage("Se guardo con éxito");
          setAlertType(typeAlert.success);
          setTimeout(() => {
            router.back();
          }, 1000);
        })
        .catch((error) => {
          if (error.errors) {
            setAlertMessage(error.response.data.errors[0].description);
          } else {
            setAlertMessage(
              "No se pudo crear un nuevo dato, intente más tarde."
            );
          }
          setAlertType(typeAlert.error);
        })
        .finally();
    },
  });

  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;
      setId(id as string);
      if (id && typeof id === "string") {
        const numericId = parseInt(id, 10);

        if (!isNaN(numericId)) {
          fetchContratistaById(numericId)
            .then((response) => {
              formik.setValues({
                // todo cambiar los
                ...formik.values,
                id: response.id,
                razonSocial: response.razonSocial,
                numeroIdentificacion: response.numeroIdentificacion,
                telefono: response.telefono,
                codigoPostalId: response.ubicacion.codigoPostalId,
                codigoPostalNombre: response.ubicacion.codigoPostalNombre,
                localidadId: response.ubicacion.localidadId,
                localidadNombre: response.ubicacion.localidadNombre,
                provinciaId: response.ubicacion.provinciaId,
                provinciaNombre: response.ubicacion.provinciaNombre,
                paisId: response.ubicacion.paisId,
                paisNombre: response.ubicacion.paisNombre,
                calle: response.calle,
                nroCalle: response.nroCalle,
                piso: response.piso,
                departamento: response.departamento,
                nombreContactoComercial: response.nombreContactoComercial,
                emailContactoComercial: response.emailContactoComercial,
                empresaEventual: response.empresaEventual,
                empresaConstruccion: response.empresaConstruccion,
                nroIERIC: response.nroIERIC ? response.nroIERIC : null,
                codigoSAP: response.codigoProveedorSAP,
                politicaDiversidad: response.politicaDiversidad,
                linkPoliticaDiversidad: response.linkPoliticaDiversidad,
                empresaPromovida: response.empresaPromovida,
                motivoEmpresaPromovida: response.motivoEmpresaPromovida ? response.motivoEmpresaPromovida : null,
                estudioAuditorId: response.estudioAuditor ? response.estudioAuditor.id : null,
                sedeId: response.sede ?  response.sede.id : null,
                estadoBloqueoId: response.estadoBloqueo.id,
                fechaInicioDesbloqueo: response.fechaInicioDesbloqueo ? response.fechaInicioDesbloqueo : null,
                fechaFinalizacionDesbloqueo: response.fechaFinalizacionDesbloqueo ? response.fechaFinalizacionDesbloqueo : null,
                motivoBloqueoIds: response.motivosBloqueo ? response.motivosBloqueo.map(m =>  m.motivoBloqueo.id) : [] ,
                motivoDesbloqueo: response.motivoDesbloqueo ? response.motivoDesbloqueo : ''
              });
              setResponse(response);
              setWithoutIntegration(response.origen.nombre.toUpperCase() == "MANUAL");
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
              setLoading(false);
            });
        }
      }
    }
  }, [router.isReady, router.query]);

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
      <Box display="flex" alignItems="center" sx={{ mb: 30 }}>
        <ArrowbackButton />
        <Typography variant="h1" sx={{ textAlign: "center", flexGrow: 1 }}>
          Editar contratista
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputsContratista
          withoutIntegration={withoutIntegration}
          formik={formik}
          isEditar={true}
          response={response}
          setAlertMessage={setAlertMessage}
          setAlertType={setAlertType}
        />
        <ButtonsCreateUpdate disabled={!(formik.isValid && formik.dirty)} />
      </form>
    </Box>
  );
}
