import React from "react";
import { TextField, Box } from "@mui/material";
import AccordionForm from "@/components/shared/AcordeonForm";
import { FormikProvider } from "formik";

interface InputsEstudiosAuditoresProps {
  formik: any;
}

export function InputsEstudiosAuditores({
  formik,
}: InputsEstudiosAuditoresProps) {

  const handleNumericInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    // Permitir solo números
    const numericValue = value.replace(/\D/g, "");
    formik.setFieldValue("cuit", numericValue);
  };


  return (
    <FormikProvider value={formik}>
      <AccordionForm title="Definición general/Ubicación">
        <Box sx={{ width: "100%", textAlign: "left" }}>
          <TextField
            id="nombreEstudioAuditor"
            label="Nombre estudio auditor*"
            name="nombreEstudioAuditor"
            value={formik.values.nombreEstudioAuditor}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.nombreEstudioAuditor && Boolean(formik.errors.nombreEstudioAuditor)}
            helperText={formik.touched.nombreEstudioAuditor && formik.errors.nombreEstudioAuditor}
            sx={{ width: "30%", mr: {md: 80} }}
            size="small"
          />

          <TextField
            id="cuit"
            label="CUIT*"
            name="cuit"
            value={formik.values.cuit}
            onChange={handleNumericInput}
            onBlur={formik.handleBlur}
            error={formik.touched.cuit && Boolean(formik.errors.cuit)}
            helperText={formik.touched.cuit && formik.errors.cuit}
            sx={{ width: "30%" }}
            size="small"
          />
        </Box>
      </AccordionForm>
    </FormikProvider>
  );
}

const dummy = () => {console.log('...')}
export default dummy