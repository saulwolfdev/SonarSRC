import React from "react";
import { TextField, Box } from "@mui/material";
import AccordionForm from "@/components/shared/AcordeonForm";
import { FormikProvider } from "formik";

interface InputsDiagramaTrabajoProps {
  formik: any;
}

export function InputsDiagramaTrabajo({
  formik,
}: InputsDiagramaTrabajoProps) {

  return (
    <FormikProvider value={formik}>
      <AccordionForm title="Definición general">
        <Box sx={{ width: "100%", textAlign: "left" }}>  
          <TextField
            id="diasTrabajo"
            label="Dás de trabajo * "
            name="diasTrabajo"
            value={formik.values.diasTrabajo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.diasTrabajo && Boolean(formik.errors.diasTrabajo)}
            helperText={formik.touched.diasTrabajo && formik.errors.diasTrabajo}
            sx={{ width: "30%", mr: {md: 20} }}
            size="small"
          />
          <TextField
            id="diasDescanso"
            label="Dás de descanso * "
            name="diasDescanso"
            value={formik.values.diasDescanso}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.diasDescanso && Boolean(formik.errors.diasDescanso)}
            helperText={formik.touched.diasDescanso && formik.errors.diasDescanso}
            sx={{ width: "30%", mr: {md: 20} }}
            size="small"
          />
          <TextField
            id="diaTrabajoMes"
            label="Dás de trabajo por mes * "
            name="diaTrabajoMes"
            value={formik.values.diaTrabajoMes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.diaTrabajoMes && Boolean(formik.errors.diaTrabajoMes)}
            helperText={formik.touched.diaTrabajoMes && formik.errors.diaTrabajoMes}
            sx={{ width: "30%", mr: {md: 20} }}
            size="small"
          />

        </Box>
      </AccordionForm>
    </FormikProvider>
  );
}

// export default InputsDiagramaTrabajo;
const dummy = () => {console.log('...')}
export default dummy