import React from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useRouterPush } from "@/hooks/useRouterPush";

const CreateButton: React.FC = () => {

  const routerPush = useRouterPush();

  const handleNavigation = () => {
    routerPush("/microMaestros/areas/crear"); 
  };

  return (
    <Button
        className="MuiButton-primary"
        variant="contained"
        onClick={handleNavigation}
    >
      CREAR
    </Button>
  );
};

export default CreateButton;
