import { Box, IconButton, Link, Typography } from "@mui/material";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useEffect, useState } from "react";
import { descargarErroresPuestosEmpresa } from "@/services/microMaestros/puestosEmpresaService";
import { ContratistasCargaMasivaResponse } from "@/types/microContratos/contratistasTypes";
import { descargarErroresContratistaEditarMasiva } from "@/services/microContratos/contratistasService";

interface FileChargedProps{
    fileName : any
    fileExtension : any
    fileSize : any
    handleCancelUpload : any
    response: null | ContratistasCargaMasivaResponse
}

export default function FileCharged({fileName, fileExtension, fileSize,handleCancelUpload,response}: FileChargedProps){

    const handleDownloadErrores = async () => {
        try {
          if (response) {
            const erroresBlob = await descargarErroresContratistaEditarMasiva(
              response.id
            );
    
            const url = window.URL.createObjectURL(new Blob([erroresBlob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "errores.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
          }
        } catch (error) {
          console.error("Error descargando errores:", error);
        }
      };
    return(
        <Box mt={2} display="flex" flexDirection="column" sx={{ width: "40%" }}>
          <Box display="flex" alignItems="center"  sx={{width:'100%'}} >
            <InsertDriveFileIcon
              style={{ color: "#1E90FF", marginRight: "8px", fontSize: 40 }} 
            />
            <Box display="flex" flexDirection="column" sx={{ flexGrow: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {fileName}
              </Typography>
              <Typography variant="body2">
                {fileExtension} | {fileSize}
              </Typography>
            </Box>
            <IconButton
              onClick={handleCancelUpload}
              sx={{ marginLeft: "auto" }}
            >
              <DeleteOutlineIcon style={{ fontSize: 40 }} />
            </IconButton>
            </Box>
            { response &&
            <Box   display="flex" alignItems="center" sx={{width:'100%'}}>
                <Typography sx={{ color: '#5C5C5C', textDecoration: 'none', display: 'flex', alignItems: 'center', m: 8 }} variant="body1">
                 {response.cantidadCreados} datos cargados de forma correcta,{' '}
                 <Link component="button" onClick={handleDownloadErrores} sx={{ color: '#0651DD', textDecoration: 'underline', cursor: 'pointer' }}>
                     {response.cantidadErrores} incorrectos
                 </Link>.
             </Typography>
             </Box>
             }
          </Box>


    )
}