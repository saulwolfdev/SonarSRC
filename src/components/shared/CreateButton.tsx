import React from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useRouterPush } from "@/hooks/useRouterPush";

export interface CreateButtonProps{
  url: string;
}

export default function CreateButton({url}:CreateButtonProps ){
  const routerPush = useRouterPush();


  const handleNavigation = () => {routerPush(url);
};

  return (
    <Button variant="contained" color="primary" onClick={handleNavigation}>
      CREAR
    </Button>
  );
};

