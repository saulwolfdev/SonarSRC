import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchContratistasHistorialById } from "@/services/microContratos/contratistasService";
import { ContratistaHistorialAPI } from "@/types/microContratos/contratistasTypes";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Divider,
  InputBase,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ChipCustom, StatusChip } from "@/components/shared/ChipsCustom";
import { GridSearchIcon } from "@mui/x-data-grid";
import Spinner from "@/components/shared/Spinner";
import NoExistenRegistros from "@/components/shared/NoExistenRegistros";

// Función para extraer el año de la fecha
const getYear = (dateString: string) => new Date(dateString).getFullYear();

// Agrupar los registros por año

const RegistroItem = ({ registro, showLine }: any) => {
  const fecha = new Date(registro.fecha);
  const formattedDate = fecha.toLocaleDateString();
  const formattedTime = fecha.toLocaleTimeString();

  return (
    <Box
      display="flex"
      flexDirection="row" // Para que todo esté en una fila
      alignItems="flex-start"
      position="relative"
      mb={2}
      sx={{ gap: 5 }}
    >
      {/* Columna izquierda: Fecha y hora */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        sx={{ width: "10%" }}
      >
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {formattedDate}
        </Typography>
        <Typography variant="body1">{formattedTime}</Typography>
      </Box>

      {/* Columna del medio: Punto gris y línea */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ height: "100%", width: "2%" }}
      >
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: "#AACBE9", // Color gris para el punto
            marginBottom: 1,
          }}
        />
        {showLine && (
          <Box
            sx={{
              position: "absolute",
              top: "10px",
              width: "2px",
              height: "100%",
              backgroundColor: "#AACBE9", // Color gris para la línea
            }}
          />
        )}
      </Box>

      {/* Columna derecha: Descripción y detalle */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        sx={{ width: "80%" }}
      >
        <Typography variant="body2" >{registro.descripcion}</Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>{registro.detalle}</Typography>
      </Box>
    </Box>
  );
};

export default function Historial() {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [registrosPorAno, setRegistrosPorAno] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event : any) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm); 
  };

  const buscarHistorialincrementarPage = async (id: number, search = "") => {
    let pageNumber = 1;
    let responseSize = 100;
    let registros: any[] = [];
    setRegistrosPorAno(null);
    setLoading(true);
    // Hacemos la primera llamada para obtener el primer conjunto de datos
    let response = await buscarHistorial(id, search, pageNumber, responseSize);

      // Si hay registros, los añadimos al array de registros
    if (responseSize > 0) {
      registros = [...registros, ...response];
    }

    // Seguimos llamando a buscarHistorial mientras el tamaño sea 100
    while (responseSize === response.length) {
      pageNumber++; 
      response = await buscarHistorial(id, search, pageNumber, responseSize);
      if (responseSize > 0) {
        registros = [...registros, ...response]; 
      }
    }

    const array = registros.reduce((acc, registro) => {
      const year = getYear(registro.fecha.toString());
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(registro);
      return acc;
    }, {});

    setRegistrosPorAno(array)
    setLoading(false);
  };
  const buscarHistorial = async (id: number, search = "", pageNumber: number, responseSize: number) => {
    try {
      const response = await fetchContratistasHistorialById({
        id: id,
        palabraClave: search,
        pageSize: responseSize,
        pageNumber: pageNumber,
      });
      return response ? response : [];
    } catch (error) {
      setLoading(false);
      return [];
    }
  };

  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;
      setId(id as string);
      if (id && typeof id === "string") {
        const numericId = parseInt(id, 10);
        if (!isNaN(numericId)) {
          buscarHistorialincrementarPage(numericId)
        }
      }
    }
  }, [router.isReady, router.query]);

  if(loading){
    return <Spinner />
  }
  return (
     <div>
      <Box
        sx={{
          background: " #FFFFFF 0% 0% no-repeat padding-box",
          border: "1px solid #D6D6D6",
          borderRadius: "15px",
          opacity: 1,
          width: "348px",
          height: "32px",
          my: 10,
          display: "flex", // Para alinear los elementos en fila
          alignItems: "center", // Centrar verticalmente los elementos
          justifyContent: "space-between", // Asegurar el uso del espacio
        }}
      >
        <IconButton type="button" sx={{ p: "10px" }} aria-label="search" onClick={(e) => buscarHistorialincrementarPage(Number(id), searchTerm) }>
          <GridSearchIcon />
        </IconButton>
        <Divider sx={{ height: "100%", m: 0.5 }} orientation="vertical" />
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Ingrese una fecha o una palabra clave"
          value={searchTerm} 
          onChange={handleSearchChange} 
        />
      </Box>
      {registrosPorAno ? (
        Object.keys(registrosPorAno).map((ano) => (
          <Accordion key={ano}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{ano}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {registrosPorAno[ano].map((registro: any, index: any, array: any) => (
                <RegistroItem
                  key={index}
                  registro={registro}
                  showLine={index < array.length - 1}
                />
              ))}
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <NoExistenRegistros />
      )}
    </div>
  );
}
