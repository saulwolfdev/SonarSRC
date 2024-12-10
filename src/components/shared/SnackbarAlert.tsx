import React, { useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';


export enum typeAlert {
    success= 'success',
    info= 'info',
    warning= 'warning',
    error= 'error',
}

export interface SnackbarAlertProps{
  message: string ,
  type: typeAlert | undefined, 
  setAlertMessage: (message: string) => void, 
  setAlertType: (type: typeAlert | undefined) => void
  
}
export default function SnackbarAlert({message , type, setAlertMessage, setAlertType}: SnackbarAlertProps) {

  const [open, setOpen] = useState(false);
  const router = useRouter()

  useEffect(()=>{
    if(message?.length >0 ) setOpen(true);
  }, [message])


  const handleClose = () => {
   setOpen(false)
   setAlertMessage('') 
   setAlertType(undefined)
  };

 
  return (
      <Snackbar
      sx={{mt: {md: '14vh'}}} // es la proporcion del appBar
        anchorOrigin={{ vertical:'top', horizontal:'center' }}
        open={open}
        onClose={handleClose}
        autoHideDuration={5000}
    >
        <Alert severity={type} onClose={() => handleClose()}>{message}</Alert>
    </Snackbar>
   
  );
}
