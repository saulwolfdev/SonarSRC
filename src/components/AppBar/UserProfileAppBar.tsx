import React from "react"
import { Box, Button, IconButton, List, Paper, Popper, styled, Typography } from "@mui/material"
import { PersonLarge, Settings, LogoutOutlined } from "../shared/Icons"
import { stylesArrowPopper } from "./NoticationAppBar"
import { AvatarCustom, StatusAvatar } from "../shared/AvatarCustom"
import { useAuth } from "../../config/autorizacion/AuthContext"
import { useRouterPush } from "@/hooks/useRouterPush"

const settings = ["Mi perfil", "Configuración"]

const CustomButton = styled(Button)(({ theme }) => ({
    textTransform: "none",
    boxShadow: "none",
    minWidth: 0,
    "&.MuiButton-text": {
        backgroundColor: "transparent",
        color: theme.palette.common.black,
        paddingBottom: 5,
        paddingTop: 5,
        paddingLeft: 0,
        fontSize: "inherit",
        "&:hover": {
            backgroundColor: "transparent",
            boxShadow: "none",
            color: theme.palette.common.black,
        },
        "&:disabled": {
            color: theme.palette.action.disabled,
        },
    },
}))

export default function UserProfileAppBar({ ...props }) {
    const [arrowRef, setArrowRef] = React.useState(null)
    const { open, handleClick, handleClose, anchorEl } = props
    const id = open ? "simple-popper" : undefined
    const routerPush = useRouterPush()
    const authInfo = useAuth()

    const handleConfigClick = () => {
        routerPush("/microMaestros/navegacion")
    }

    return (
        <Box sx={{ justifyContent: "end", height: "100%", display: { xs: "none", sm: "flex" } }}>
            <IconButton
                aria-describedby={id}
                onClick={handleClick}
                sx={{
                    my: 13,
                    p: 0,
                    "&:hover .MuiAvatar-root": {
                        border: "1px solid #E3EBFB",
                    },
                }}
            >
                <AvatarCustom
                    status={StatusAvatar.none}
                    photo="/static/images/avatar/2.jpg"
                    avatarWidth={{ md: 54 }}
                    avatarHeight={{ md: 54 }}
                    sxBox={{ mr: 36 }}
                />
            </IconButton>

            <Popper
                id={id}
                open={open}
                anchorEl={anchorEl}
                placement="bottom"
                disablePortal={false}
                modifiers={[
                    {
                        name: "arrow",
                        enabled: true,
                        options: {
                            element: arrowRef,
                        },
                    },
                ]}
            >
                <Box component="span" className="arrow" ref={setArrowRef} sx={stylesArrowPopper.arrow} />

                <Paper
                    elevation={3}
                    sx={{
                        backgroundColor: { md: "#ffff" },
                        p: { md: 3 },
                        mt: { md: 7 },
                        borderRadius: { md: "15px" },
                        opacity: { md: "1" },
                    }}
                >
                    <Box sx={{ minWidth: { md: 323 } }} py={{ md: 10 }}>
                        <List>
                            <Typography
                                gutterBottom
                                sx={{
                                    fontSize: { md: "18px" },
                                    textAlign: { md: "left" },
                                    ml: { md: 27 },
                                    fontWeight: "bold",
                                }}
                            >
                                {authInfo.usuario?.nombre ?? "Sin nombre"}
                            </Typography>
                            <Typography
                                sx={{
                                    color: { md: "#7A7A7A" },
                                    fontSize: { md: "14px" },
                                    textAlign: { md: "left" },
                                    ml: { md: 27 },
                                }}
                            >
                                {authInfo.usuario?.roles?.map((r) => { return r.nombre })}
                            </Typography>

                            <Box display="flex" alignItems="center" sx={{ ml: 25, mt: 17.5 }}>
                                <CustomButton startIcon={<PersonLarge />}>
                                    <Typography variant="body1">Perfil</Typography>
                                </CustomButton>
                            </Box>
                            <Box
                                display="flex"
                                alignItems="center"
                                sx={{
                                    ml: { md: 25 },
                                }}
                            >
                                <CustomButton startIcon={<Settings />} onClick={handleConfigClick}>
                                    <Typography variant="body1">Configuración</Typography>
                                </CustomButton>
                            </Box>
                        </List>
                        <hr
                            style={{
                                border: "0.5px solid #C4C4C4",
                                opacity: "0.5",
                            }}
                        />
                        <Box>
                            <Typography onClick={handleClose}>
                                <Box sx={{ ml: { md: 25 } }} display="flex" alignItems="center">
                                    <CustomButton startIcon={<LogoutOutlined />}>
                                        <Typography variant="body1"> Cerrar sesión</Typography>
                                    </CustomButton>
                                </Box>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Popper>
        </Box>
    )
}
