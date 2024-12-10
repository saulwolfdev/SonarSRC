import { Box, Typography } from "@mui/material";
import { InputsContratista } from "../form/InputsCreateUpdate";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import { useState } from "react";


export default function DatosDelContratista({formik, response}: any){

    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);



    return(
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
        
  
        <form style={{ width: "100%" }}>
          <InputsContratista
            formik={formik} // No usamos Formik aquí pero es un 
            isView={true}
            response={response}
            setAlertMessage={setAlertMessage}
            setAlertType={setAlertType}
            //disabled={true} // Deshabilitar todos los campos
          />
        </form>
      </Box>
    )
}