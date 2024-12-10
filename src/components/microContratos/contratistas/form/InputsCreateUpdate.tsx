"use Client"
import { ContratistaDetalleResponse } from "@/types/microContratos/contratistasTypes"
import AccordionForm from "@/components/shared/AcordeonForm"
import { FormikProvider } from "formik"
import DefinicionGeneal from "./definicionGeneral/DenificionGeneral"
import Contacto from "./Contacto"
import ConfiguracionesOnlyEdit from "./configuraciones/ConfiguracionesOnlyEdit"
import Configuraciones from "./configuraciones/Configuraciones"
import DefinicionGenealOnlyEdit from "./definicionGeneral/DenificionGeneralOnlyEdit"

interface InputsContratistaProps {
  formik: any
  response?: ContratistaDetalleResponse | null
  setAlertMessage?: any
  setAlertType? : any
  isEditar? :  boolean
  isView?: boolean
  withoutIntegration?: boolean
}

export function InputsContratista({withoutIntegration = true, formik, response, setAlertMessage, setAlertType, isEditar= false , isView=false}: InputsContratistaProps) {
  

  const formikChange = (event: any) => {
    formik.setFieldValue(event.target.name, event.target.value)
  }

  //todo, deshabilitar segun roles
  /*
  en CON INTEGRACION:
  rol compras : solo habilitar : Nombre Contacto Comercial
  rol contratista : solo habilitar : Política de diversidad - Link Política de diversidad
  */

  return (
    <FormikProvider value={formik}>
      { !isView &&
      <AccordionForm title="Definición general" sx={{justifyContent: "flex-start"}} allowCollapse={!isView} >
        <DefinicionGeneal formik={formik} withoutIntegration={withoutIntegration} />
        {isEditar && 
        <DefinicionGenealOnlyEdit response={response} withoutIntegration={withoutIntegration} /> }
      </AccordionForm>
      }

      <AccordionForm title="Datos de contacto" sx={{justifyContent: "flex-start"}} allowCollapse={!isView}>
        <Contacto
        formik={formik}
        formikChange={formikChange}
        response={response}
        withoutIntegration={withoutIntegration}
        isView={isView}
        />
      </AccordionForm>

      <AccordionForm title="Configuraciones" sx={{justifyContent: "flex-start"}} allowCollapse={!isView}>
          <Configuraciones formik={formik} withoutIntegration={withoutIntegration} isView={isView} />
          {(isEditar || isView) && <ConfiguracionesOnlyEdit  formik={formik} response={response} formikChange={formikChange} setAlertMessage={setAlertMessage} setAlertType={setAlertType} withoutIntegration={withoutIntegration} isView={isView}/>}
      </AccordionForm>
    </FormikProvider>
  )
}

const dummy = () => {
  console.log('...')
}
export default dummy
