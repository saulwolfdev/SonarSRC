import React from "react";
import { Button, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const ArrowbackButton: React.FC = () => {

    const router = useRouter();

    const handleNavigation = () => {
        router.back();
    };

    return (
        <IconButton onClick={handleNavigation}>
            <ArrowBackIosNewIcon />
        </IconButton>

    );
};

export default ArrowbackButton;
