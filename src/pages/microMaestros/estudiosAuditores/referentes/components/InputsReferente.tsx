import React from "react";
import { TextField } from "@mui/material";
import AccordionForm from "@/components/shared/AcordeonForm";
import { FormikProvider } from "formik";

interface InputsReferenteProps {
  formik: any;
}
export function InputsReferente({
  formik,
}: InputsReferenteProps) {

  const handleNumericInput = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    //Función para solo permitir números
    const { value } = event.target;
    const numericValue = value.replace(/\D/g, "");
    formik.setFieldValue(fieldName, numericValue);
  };


  if (!formik || !formik.values) {
    return null;
  }
  return (
    <FormikProvider value={formik}>
      <AccordionForm title="Definición general/Ubicación">
        <TextField
          id="usuarioEPID"
          name="usuarioEPID"
          label="Id de usuario EP"
          value={formik.values.usuarioEPID}
          onChange={(e: any) => handleNumericInput(e, 'usuarioEPID')}
          onBlur={formik.handleBlur}
          error={formik.touched.usuarioEPID && Boolean(formik.errors.usuarioEPID)}
          helperText={formik.touched.usuarioEPID && formik.errors.usuarioEPID}
          sx={{ width: { md: "30%" } }}
          size="small"
        />
        <TextField
          id="nombreReferente"
          name="nombreReferente"
          label="Nombre del Referente*"
          value={formik.values.nombreReferente}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.nombreReferente && Boolean(formik.errors.nombreReferente)}
          helperText={formik.touched.nombreReferente && formik.errors.nombreReferente}
          sx={{ width: { md: "30%" } }}
          size="small"
        />

        <TextField
          id="emailReferente"
          name="emailReferente"
          label="Email*"
          value={formik.values.emailReferente}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.emailReferente && Boolean(formik.errors.emailReferente)}
          helperText={formik.touched.emailReferente && formik.errors.emailReferente}
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
    </FormikProvider>
  );
}

// export default InputsReferente;
const dummy = () => {console.log('...')}
export default dummy