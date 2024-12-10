'use client';

import CancelButton from "@/components/shared/CancelButton";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/router";

interface ButtonsCreateUpdateProps{
  disabled?: boolean
  isEdit?: boolean;
}


export default function ButtonsCreateUpdate({
  disabled = false,
  isEdit = false,
}: ButtonsCreateUpdateProps) {
  const router = useRouter();

  return (
    <Box
      sx={{ display: "flex", justifyContent: "flex-end", mt: { md: 40 } }}
    >
      <CancelButton />
      <Button
        className="MuiButton-primary"
        variant="contained"
        type="submit"
        disabled={disabled}
        sx={{ ml: { md: 10 } }}
      >
        {isEdit ? "GUARDAR" : "CREAR"} 
      </Button>
    </Box>
  );
}