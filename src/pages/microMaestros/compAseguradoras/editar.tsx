import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Typography } from "@mui/material";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import Spinner from "@/components/shared/Spinner";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import InputsCreateUpdate from "../../../components/microMaestros/compAseguradora/formCreateUpdate/InputsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { fetchCompaniasAseguradorasById, putCompaniasAseguradoras } from "../../../services/microMaestros/CompaniasAseguradorasService";
import { CompaniasAseguradorasDetalleDTO, CompaniasAseguradorasUpdate, FormikCompaniaAseguradoraCreateOrUpdateRequest } from "../../../types/microMaestros/companiasAseguradorasTypes";
import { validarCuit } from "../../../components/microMaestros/compAseguradora/helpers/validarCuit";

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
    .min(1, "Debes seleccionar al menos un tipo de seguro.")
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
            is: 0, 
            then: (schema) => schema.min(0),
            otherwise: (schema) => schema.min(1, "Debes seleccionar al men os un contratista."),
          })   
      })
    )
});

export default function UpdateCompaniasAseguradoras() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);
  const [response, setResponse] = useState<CompaniasAseguradorasDetalleDTO | null>(null);

  const formik = useFormik<FormikCompaniaAseguradoraCreateOrUpdateRequest>({
    initialValues: {
      nombre: "",
      cuit: "",
      observacion: "",
      tiposSegurosIds: [],
      excepcionesSeguros: [{
        tipoSeguroId: 0,
        contratistasIds: [],
      }],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const data: CompaniasAseguradorasUpdate = {
        id: response?.id ?? 0,
        nombre: values.nombre,
        cuit: values.cuit.toString(),
        observacion: values.observacion,
        estado: response?.estado ?? true,
        tiposSegurosIds: values.tiposSegurosIds,
        excepcionesSeguros: values.excepcionesSeguros.filter(e => e.tipoSeguroId != 0)
      }

      putCompaniasAseguradoras(data)
        .then((res) => {
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
            setAlertMessage("No se pudo realizar la edición, intente más tarde.");
          }
          setAlertType(typeAlert.error);
        });
    },
  });

  useEffect(() => {
    if (id && typeof id === "string") {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) {
        fetchCompaniasAseguradorasById(numericId)
          .then((response) => {
            formik.setValues({
              nombre: response.nombre,
              cuit: response.cuit,
              observacion: response.observacion,
              tiposSegurosIds: response.tiposSeguros.map(t => t.id),
              excepcionesSeguros: [...response.excepcionesSeguros.map(e => ({tipoSeguroId: e.tipoSeguro.id, contratistasIds: e.contratistas.map(c=> c.bdOrigenId)})), {tipoSeguroId: 0, contratistasIds: []}]
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
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <SnackbarAlert message={alertMessage} type={alertType} setAlertMessage={setAlertMessage} setAlertType={setAlertType} />
      <Box display="flex" alignItems="center">
        <ArrowbackButton />
        <Typography variant="h1" sx={{ textAlign: "center", flexGrow: 1 }}>
          Editar compañia aseguradora
        </Typography>
      </Box>
      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputsCreateUpdate formik={formik} response={response} />
        <ButtonsCreateUpdate />
      </form>
    </Box>
  );
}
