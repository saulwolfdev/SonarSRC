import { Box, CssBaseline, Grid } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import themeWithOverrides from '@/config/themeConfig';
import { useAuth } from '../../config/autorizacion/AuthContext';
import { useEffect } from 'react';

const LayoutYPF = ({ children }: any) => {
    const auth = useAuth()

    useEffect(() => {
        console.log('auth Layout', auth)
    }, [auth])


    return (
        auth.usuario ?
            <ThemeProvider theme={themeWithOverrides}>
                <CssBaseline />
                <Grid
                    sx={{ m: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 }, bgcolor: "#F5F5F5 0% 0%" }}
                    container
                    spacing={{
                        xs: 12,
                        sm: 12,
                        md: 18,
                        lg: 28,
                        xl: 28,
                    }}
                >
                    {children}
                </Grid>
            </ThemeProvider>
            :
            <h1>Sin acceso??</h1>
    );
};

export default LayoutYPF;