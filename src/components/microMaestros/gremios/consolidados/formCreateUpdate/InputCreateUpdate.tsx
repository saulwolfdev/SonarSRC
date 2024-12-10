import { Box, Card, TextField, Typography } from "@mui/material"
import { useState } from "react"
import RegistrosExistentes from "./RegistrosExistentes"
import {
  GremioConsolidadoAPI,
  GremioConsolidadoDetalleResponce,
} from "@/types/microMaestros/gremiosConsolidadosTypes"
import { fetchGremiosConsolidados } from "@/services/microMaestros/consolidadosService"

interface InputsCreateUpdateProps {
  formik: any
  response?: GremioConsolidadoDetalleResponce | null
}

export function InputsCreateUpdate({ formik, response }: InputsCreateUpdateProps) {
  const [gremiosExisting, setGremiosExisting] = useState<GremioConsolidadoAPI[]>([])

  const handleChangeGremio = (event: any) => {
    formik.handleChange(event)
    if (event.target.value.length > 2) {
      fetchGremiosConsolidados({ nombre: event.target.value })
        .then((response) => {
          setGremiosExisting(response.data)
        })
        .catch((error) => {})
    } else {
      setGremiosExisting([])
    }
  }
  return (
    <Box className="box-form-create-update">
      <Typography
        variant="body1"
        sx={{
          fontWeight: "bold",
          color: "grey",
          mt: { md: 15 },
          ml: { md: 21 },
        }}
      >
        Definición general
      </Typography>
      <TextField
        id="nombre"
        name="nombre"
        label="Nombre*"
        value={formik.values.nombre}
        onChange={handleChangeGremio}
        onBlur={formik.handleBlur}
        error={formik.touched.nombre && Boolean(formik.errors.nombre)}
        helperText={formik.touched.nombre && formik.errors.nombre}
        sx={{
          mt: { md: 15 },
          ml: { md: 21 },
          width: { md: "30%" },
        }}
      />
      <RegistrosExistentes gremiosExisting={gremiosExisting} />
    </Box>
  )
}

const dummy = () => {
  console.log('...')
}
export default dummy
