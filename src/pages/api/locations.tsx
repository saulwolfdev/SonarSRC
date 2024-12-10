// pages/api/locations.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Define la interfaz para el tipo de datos
interface LocationData {
  id: number;
  pais: string;
  provincia: string;
  localidad: string;
  codigoPostal: string;
  estado: string;
}

// Manejador de la API
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LocationData[]>
) {
  const data: LocationData[] = [
    { id: 1, pais: 'Argentina', provincia: 'Buenos Aires', localidad: 'La Plata', codigoPostal: '1900', estado: 'Activo' },
    { id: 2, pais: 'Chile', provincia: 'Santiago', localidad: 'Santiago', codigoPostal: '8320000', estado: 'Inactivo' },
    { id: 3, pais: 'Uruguay', provincia: 'Montevideo', localidad: 'Montevideo', codigoPostal: '11000', estado: 'Activo' },
    { id: 4, pais: 'Brasil', provincia: 'São Paulo', localidad: 'São Paulo', codigoPostal: '01000-000', estado: 'Activo' },
    { id: 5, pais: 'Paraguay', provincia: 'Asunción', localidad: 'Asunción', codigoPostal: '1209', estado: 'Inactivo' },
    { id: 6, pais: 'Perú', provincia: 'Lima', localidad: 'Lima', codigoPostal: '15001', estado: 'Activo' },
    { id: 7, pais: 'Colombia', provincia: 'Bogotá', localidad: 'Bogotá', codigoPostal: '110111', estado: 'Inactivo' },
    { id: 8, pais: 'Ecuador', provincia: 'Pichincha', localidad: 'Quito', codigoPostal: '170143', estado: 'Activo' },
    { id: 9, pais: 'Bolivia', provincia: 'La Paz', localidad: 'La Paz', codigoPostal: '12345', estado: 'Inactivo' },
    { id: 10, pais: 'Venezuela', provincia: 'Distrito Capital', localidad: 'Caracas', codigoPostal: '1010', estado: 'Activo' },
    { id: 11, pais: 'Argentina', provincia: 'Córdoba', localidad: 'Córdoba', codigoPostal: '5000', estado: 'Activo' },
    { id: 12, pais: 'Chile', provincia: 'Valparaíso', localidad: 'Valparaíso', codigoPostal: '2340000', estado: 'Inactivo' },
    { id: 13, pais: 'Uruguay', provincia: 'Canelones', localidad: 'Canelones', codigoPostal: '90000', estado: 'Activo' },
    { id: 14, pais: 'Brasil', provincia: 'Rio de Janeiro', localidad: 'Rio de Janeiro', codigoPostal: '20000-000', estado: 'Activo' },
    { id: 15, pais: 'Paraguay', provincia: 'Central', localidad: 'Luque', codigoPostal: '2060', estado: 'Inactivo' },
    { id: 16, pais: 'Perú', provincia: 'Cusco', localidad: 'Cusco', codigoPostal: '08000', estado: 'Activo' },
    { id: 17, pais: 'Colombia', provincia: 'Antioquia', localidad: 'Medellín', codigoPostal: '050021', estado: 'Inactivo' },
    { id: 18, pais: 'Ecuador', provincia: 'Guayas', localidad: 'Guayaquil', codigoPostal: '090112', estado: 'Activo' },
    { id: 19, pais: 'Bolivia', provincia: 'Santa Cruz', localidad: 'Santa Cruz de la Sierra', codigoPostal: '591', estado: 'Inactivo' },
    { id: 20, pais: 'Venezuela', provincia: 'Zulia', localidad: 'Maracaibo', codigoPostal: '4001', estado: 'Activo' },
  ];

  res.status(200).json(data);
}
