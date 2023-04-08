import React from "react"
import { Link } from "react-router-dom";
import { Button } from "@mui/material";


interface PropsInterface {
    href: String;
    text: String;
}

export const MenuLink = (props: PropsInterface) => {
    return (
        <Button 
            component={Link}
            to={`${props.href}`}
            sx={{ my: 2, color: "white", display: "block" }}
        >
            {props.text}
        </Button>
    );
}

