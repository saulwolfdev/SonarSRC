'use client';

import CancelButton from "@/components/shared/CancelButton";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/router";

interface ButtonsCrearFuncionEstandarizada {
  disabled?: boolean
}


export default function ButtonsCrearFuncionEstandarizada({ disabled = false }: ButtonsCrearFuncionEstandarizada) {
  const router = useRouter();

  return (


    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        mt: { md: 40 },
        mb: 15,
      }}>
      <CancelButton />
      <Button
        className="MuiButton-primary"
        variant="contained"
        type="submit"
        disabled={disabled}
        sx={{ ml: { md: 10 } }}
      >
        CREAR
      </Button>
    </Box>
  )
}