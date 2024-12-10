// components/GlobalLoadingOverlay.tsx
import React from "react";
import { CircularProgress, Box } from "@mui/material";
import useLoadingStore from "@/zustand/shared/useLoadingStore";
import Spinner from "./Spinner";

const GlobalLoadingOverlay = () => {
  const loadingAxios = useLoadingStore((state) => state.loadingAxios);

  if (!loadingAxios) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1300,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spinner />
    </Box>
  );
};

export default GlobalLoadingOverlay;
