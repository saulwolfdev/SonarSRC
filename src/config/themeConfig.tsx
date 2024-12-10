'use client';
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const theme = createTheme({
    spacing: 1,
    breakpoints: {
      values: {
        xs: 0, 
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    typography: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        h1: {
            fontSize: '32px',
            fontWeight: 'bold',
        },
        h2: {
            fontSize: '26px',
        },
        body1: {
            fontSize: '16px',
            fontStyle: 'normal !important',
        },
        body2: {
            fontSize: '14px',
            fontStyle: 'italic',
        },
    },
    palette: {
        primary: {
            main: "#0451DD",
        },
        error: {
            main: '#DC3545',
        },
        success: {
            main: '#007F49',
        },
        warning: {
            main: '#F77F00',
        },
        grey: {
            //Mientras mas chico, mas claro
            50: '#D6D6D6',
            100: '#B8B8B8',
            200: '#999999',
        },
        common: {
            black: '#1F1F1F',
            white: '#FFFFFF'
        }
    }
})

const themeWithOverrides = createTheme(theme, {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ".box-form-create-update": { // seria para las card de los formularios de crear y updetear
          border: "1px solid #D6D6D68A",
          borderRadius: 8, 
          display: "flex",
          flexDirection: "column",
          mt: 40, 
        },
        html: {
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
        },
        body: {
          backgroundColor: "#F5F5F5",
          width: "100%",
          height: "100%",
        },
        "#root": {
          width: "100%",
          height: "100%",
        },
        "*": {
          maxWidth: "100%",
          maxHeight: "100%",
          boxSizing: "inherit",
        },
        ".input-position-1-of-3":{
          marginTop:  '15px !important'  ,
          marginLeft:  '21px !important'  ,
          marginRigth:  '21px !important'  ,
          width:  "30% !important"  ,
        },
        ".input-position-2-or-3-of-3":{
          marginTop:  '15px !important' ,
          marginLeft:  '21px !important' ,
          width:  "30% !important" ,
        },
        ".cellEstadoDataGrid":{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: 'center'
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)", // Box-shadow del menú de acciones
          border: "1px solid #F5F5F5",
          "&:hover": {
            boxShadow: "4px 4px 10px #D6D6D6",
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
          root: {
              transition: "background-color 0.3s, color 0.3s",
              "&:hover": {
                  backgroundColor: "#F5F5F5", // Cambia el color de fondo cuando pasas el ratón
                  color: theme.palette.primary.main, // Cambia el color del texto
                  borderRadius: "4px", // Agrega border-radius para resaltar el item
              },
          },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          margin: 0,
          padding: 0,
          [theme.breakpoints.up("sm")]: {
            margin: "0 22px",
            maxWidth: `calc(100% - 44px)`, // 22px * 2
          },
          [theme.breakpoints.up("md")]: {
            margin: "0 32px",
            maxWidth: `calc(100% - 64px)`, // 32px * 2
          },
          [theme.breakpoints.up("lg")]: {
            margin: "0 68px",
            maxWidth: `calc(100% - 136px)`, // 68px * 2
          },
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          [theme.breakpoints.up("sm")]: {
            columns: "4",
            "& > .MuiGrid-item": {
              marginLeft: "6px", // half of 12px spacing
              marginRight: "6px", // half of 12px spacing
              maxWidth: "70px",
              "&:first-of-type": {
                marginLeft: "0px",
              },
              "&:last-of-type": {
                marginRight: "0px",
              },
            },
          },
          [theme.breakpoints.up("md")]: {
            columns: "12",
            "& > .MuiGrid-item": {
              marginLeft: "9px", // half of 18px spacing
              marginRight: "9px", // half of 18px spacing
              maxWidth: "92px",
              "&:first-of-type": {
                marginLeft: "0px",
              },
              "&:last-of-type": {
                marginRight: "0px",
              },
            },
          },
          [theme.breakpoints.up("lg")]: {
            columns: "12",
            "& > .MuiGrid-item": {
              marginLeft: "14px", // half of 28px spacing
              marginRight: "14px", // half of 28px spacing
              maxWidth: "123px",
              "&:first-of-type": {
                marginLeft: "0px",
              },
              "&:last-of-type": {
                marginRight: "0px",
              },
            },
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          whiteSpace: "nowrap", // Asegura que el texto no se rompa en varias líneas
          "&.MuiButton-primary": {
            backgroundColor: "#0451DD",
            borderRadius: "4px",
            opacity: 1,
            color: "#fff",
            "&:hover": {
              backgroundColor: "#578BE8",
            },
            "&:disabled": {
              backgroundColor: "#D6D6D6",
              color: "#999999",
            },
          },
          "&.MuiButton-secondary": {
            backgroundColor: "#FFF",
            borderRadius: "4px",
            opacity: 1,
            color: "#0451DD",
            border: "1px solid #0451DD",
            boxShadow: "0px 2px 4px #D6D6D6",
            "&:hover": {
              backgroundColor: "#578BE81F",
            },
            "&:disabled": {
              border: "1px solid #D6D6D6",
              color: "#999999",
            },
          },
          "&.MuiButton-success": {
            backgroundColor: "#007F49",
            borderRadius: "4px",
            opacity: 1,
            color: "#fff",
            "&:hover": {
              backgroundColor: "#00BF6E",
            },
            "&:disabled": {
              backgroundColor: "#D6D6D6",
              color: "#999999",
            },
            "&:not(.MuiButton-sizeMedium)": {
              display: "none",
            },
          },
          "&.MuiButton-error": {
            backgroundColor: "#DC3545",
            borderRadius: "4px",
            opacity: 1,
            color: "#fff",
            "&:hover": {
              backgroundColor: "#E15664",
            },
            "&:disabled": {
              backgroundColor: "#D6D6D6",
              color: "#999999",
            },
            "&:not(.MuiButton-sizeMedium)": {
              display: "none",
            },
          },
          "&.MuiButton-text": {
            backgroundColor: "#FFF",
            opacity: 1,
            color: "#0451DD",
            fontSize: "1.25rem",
            padding: "6px 16px",
            "&:hover": {
              backgroundColor: "#578BE81F",
              color: "#0451AA",
            },
            "&:disabled": {
              color: "#999999",
            },
            // '&:not(.MuiButton-sizeLarge)': {
            //     display: 'none',
            // },
          },
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        },
      },
    },    
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: "#1F1F1F",
            fontSize: "16px",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "&.error": {
            borderColor: theme.palette.error.main,
          },
        },
      },
    },
    MuiFormLabel:{
      styleOverrides: {
        root: {
          marginBottom: "8px", // Mantiene un espacio fijo debajo del TextField
          "& .MuiFormHelperText-root": {
            minHeight: "24px", // Altura mínima para el mensaje de error
          },
          "&.Mui-disabled": {
            backgroundColor: "#f5f5f5", 
            color: "#9e9e9e !important", 
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          minHeight: "24px", // Asegura una altura mínima para el mensaje de error
          marginTop: "4px", // Espacio entre el input y el mensaje
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          display: "flex",
          borderStyle: "none",
          border: "none",
          borderRadius: 0,
          borderWidth: 0,
          marginTop: 30,
          boxSizing: "none",
          fontSize: theme.typography.body1.fontSize,
          fontStyle: theme.typography.body1.fontStyle,
          fontFamily: theme.typography.fontFamily,
          maxHeight: 'none !important',
          "& .MuiDataGrid-main":{
            maxHeight: 'none !important',
          },
          "& .MuiDataGrid-root": {
            justifyContent: "flex-start",
            maxHeight: 'none !important',
          },
          "& .MuiDataGrid-cell": {
            alignItems: "center",
            justifyContent: "flex-start",
            fontSize: theme.typography.body1.fontSize,
            fontStyle: theme.typography.body1.fontStyle,
            fontFamily: theme.typography.fontFamily,
            lineHeight: 'unset !important',
            maxHeight: 'none !important',
            whiteSpace: 'normal',
            wordWrap: 'break-word',

            display: 'flex',
            WebkitLineClamp: 3, // Limita a 3 líneas
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            backgroundColor: "transparent",
            color: "#0065BD",
            fontWeight: "bold",
            fontStyle: "normal !important",
            textAlign: "left",
          },
          // Sobreescribo el estilo del focus
          "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus": {
            outline: "none", // Remueve el borde azul del foco
          },
          "& .MuiDataGrid-cell[data-field='actions']": {
            justifyContent: "flex-end",
          },
          // Sobreescribo el estilo de focus-within
          "& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within":
            {
              outline: "none", // Remuevo el borde azul de focus-within
            },
          '& .MuiDataGrid-cell[data-field="actions"]': {
            justifyContent: "flex-end",
          },
          '& .MuiDataGrid-cell[data-field="estado"]': {
            justifyContent: "center",
          },
          "& .MuiDataGrid-row:hover": {
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "4px", // Ancho de la línea azul
              background: "#0264BD", // Color de la línea azul
              borderRadius: "1px 0px 0px 1px",
              opacity: 1,
            },
            position: "relative",
          },
          "& .MuiDataGrid-actionsCell .MuiSvgIcon-root": {
            fontSize: 30, // Cambia el tamaño de los tres puntitos
            color: "black", // Cambia el color a negro
          },
          "& .MuiDataGrid-row": {
            paddingLeft: 3,
            borderBottom: "1px solid transparent", // Sin línea en las filas intermedias
            maxHeight: 'none !important',
          }, 
          "& .MuiDataGrid-row:last-child": {
            borderBottom: "1px solid #e0e0e0", // Línea completa en la última fila
          },
          '& .MuiDataGrid-renderingZone': {
            maxHeight: 'none !important',
        },
        },
      },
    },
  },
})

interface ThemeProps {
    children: React.ReactNode
}

// export const ThemeConfig = ({ children }: ThemeProps) => {
//     return (
//         <ThemeProvider theme={themeWithOverrides}>
//             <CssBaseline />
//             {children}
//         </ThemeProvider>
//     )
// }


export default themeWithOverrides;