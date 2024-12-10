import { Suspense } from "react";
import { AppProps } from "next/app";
import themeWithOverrides from "@/config/themeConfig";
import { ThemeProvider } from "@emotion/react";
import { Box, Container, CssBaseline } from "@mui/material";
import LayoutYPF from "@/components/shared/LayoutYPF";
import AppBarYPF from "@/components/AppBar/AppBarYPF";
import useLoadingStore from "@/zustand/shared/useLoadingStore";
import Spinner from "@/components/shared/Spinner";
import GlobalLoadingOverlay from "@/components/shared/GlobalLoadingOverlay";
import { AuthProvider } from "../config/autorizacion/AuthProvider";

function MyApp({ Component, pageProps }: AppProps) {
    const { loading } = useLoadingStore();
    
  return (
    <ThemeProvider theme={themeWithOverrides}>
      <CssBaseline />
      <Suspense fallback={<Spinner />}>
      <AuthProvider>
        <LayoutYPF>
          <Container>
            <AppBarYPF />
            <Box
              sx={{
                boxShadow: "4px 4px 10px #D6D6D6",
                px: 30,
                pt: 3,
                pb: 5,
                marginTop: "4vh",
                backgroundColor: "#FFFFFF",
                borderRadius: "15px",
              }}
            >
              {loading ? (
                <Box sx={{my: 200}}>
                  <Spinner />
                </Box>
              ) : (
                <>
                <GlobalLoadingOverlay />
                <Component {...pageProps} />
                </>
                
              )}
            </Box>
          </Container>
        </LayoutYPF>
        </AuthProvider>
      </Suspense>
    </ThemeProvider>
  );
}

export default MyApp;
