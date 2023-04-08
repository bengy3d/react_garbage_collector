import {
    Card,
    Grid,
    styled,
} from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import { MenuBar } from "../../Components/Menu/MenuBar";

const Root = styled(Card)({
    flexGrow: 1,
    minHeight: "100%", 
    width: "100%",
})

const StyledDiv = styled('div')({
    textAlign: "center",
    marginTop: "20px",
})

export const MainLayout = () => (
    <>
        <MenuBar />
        <Root>
            <Grid container spacing={3}>
                <Grid item xs></Grid>
                <Grid item xs={6}>
                    <StyledDiv>
                        <Outlet />
                    </StyledDiv>
                </Grid>
                <Grid item xs></Grid>
            </Grid>
        </Root>
    </>
);

