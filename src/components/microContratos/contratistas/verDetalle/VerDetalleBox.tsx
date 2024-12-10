import { ContratistaDetalleResponse } from "@/types/microContratos/contratistasTypes";
import { Box } from "@mui/material";

interface GridBoxProps {
    response: ContratistaDetalleResponse;
  }

export default function GridBox({ response}: GridBoxProps){
    const titles = ['N° de identificación CUIT', 'Origen', 'Código SAP/Acreedor', 'Fecha de creación'];
    const data = [
      response.numeroIdentificacion ?? '- -',
      response.origen.nombre ?? '- -',
      response.codigoProveedorSAP ?? '- -',
      response.fechaCreacion ? new Date(response.fechaCreacion).toLocaleDateString() : '- -'
    ];
  
    return (
      <Box
        sx={{
          display: 'flex',
          height: 'auto',
          border: '1px solid #ccc',
          borderRadius: '15px',
          boxShadow: '4px 4px 10px #D6D6D6',
          opacity: '1',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto auto auto auto', 
            gap: '10px 30px', // 10px entre filas (vertical), 20px entre columnas (horizontal)
            marginTop: '20px',
            marginLeft: '10px',
            marginBottom: '26px',
            height: 'auto',
            padding: '20px',
            opacity: '1',
          }}
        >
          {/* Títulos (primera fila) */}
          {titles.map((title, index) => (
            <div
              key={index}
              style={{
                fontWeight: 'bold',
                textAlign: 'left',
                color: '#999999',
                opacity: '1'
              }}
            >
              {title}
            </div>
          ))}
  
          {/* Datos (segunda fila) */}
          {data.map((item, index) => (
            <div
              key={index}
              style={{
                textAlign: 'left',
                color: '#000000'
              }}
            >
              {item.toString()}
            </div>
          ))}
        </Box>
      </Box>
    );
  };