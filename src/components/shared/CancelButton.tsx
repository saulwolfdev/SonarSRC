import React from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/router";

const CancelButton: React.FC = () => {

  const router = useRouter();

  const handleNavigation = () => {
    router.back(); 
  };

  return (
    <Button
        className="MuiButton-secondary"
        variant="contained"
        onClick={handleNavigation}
    >
      CANCELAR
    </Button>
  );
};

export default CancelButton;
