import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import Spinner from "@/components/shared/Spinner";
import { fetchContratistaById } from "@/services/microContratos/contratistasService";
import { ContratistaDetalleResponse, ContratistaUpdate } from "@/types/microContratos/contratistasTypes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import TabsCustom from "@/components/microContratos/contratistas/verDetalle/TabsCustom";
import DatosDelContratista from "@/components/microContratos/contratistas/verDetalle/DatosDelContraista";
import Historial from "@/components/microContratos/contratistas/verDetalle/Historial";
import { Box, Typography } from "@mui/material";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { ChipCustom, StatusChip } from "@/components/shared/ChipsCustom"
import GridBox from "@/components/microContratos/contratistas/verDetalle/VerDetalleBox";

export default function VerDetalleContratista() {

  const [value, setValue] = useState(0);
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);

  const [response, setResponse] = useState<ContratistaDetalleResponse | undefined>();
  const [loading, setLoading] = useState(true);

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
    onSubmit: (values) => { }, // no hay subit
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

  const options = [
    {
      name: "Datos del contratista",
      element: <DatosDelContratista formik={formik} response={response} />,
    },
    {
      name: "Subcontratista",
      element: <Spinner />,
    },
    {
      name: "Historial",
      element: <Historial />,
    },
  ];

  return loading ? (
    <Spinner />
  ) : (
    <>
      {/* ss */}
      <Box display="flex" alignItems="center" sx={{ mb: 30 }}>
        <ArrowbackButton />
        <Typography variant="h1" sx={{ textAlign: "initial", marginTop: '10px' }}>
          {response?.razonSocial}
        </Typography>
        <ChipCustom
          label={response?.estado ? "Activo" : "Inactivo"}
          status={response?.estado ? StatusChip.success : StatusChip.disabled}
          sx={{ marginLeft: '10px', marginTop: '10px' }}
        />
      </Box>
      {response && <GridBox response={response} />}
      {/* todo datos de arriba */}
      <TabsCustom options={options} value={value} setValue={setValue} id={Number(id)} />
      {/* agrgar lapiz de eitar en el coso de las tabs */}

    </>
  );
}

