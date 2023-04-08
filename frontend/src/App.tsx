import React from 'react';
import { Game } from './Game';
import { BrowserRouter } from "react-router-dom";
import { Card, createTheme, ThemeProvider } from '@mui/material';
import { Router } from './Routes/Router';
import { MenuBar } from './Components/Menu/MenuBar';

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const lightTheme = createTheme({
    palette: {
        mode: "light",
    },
});

const App = () => (
    <BrowserRouter>
        <ThemeProvider theme={darkTheme}>
            <Router />
        </ThemeProvider>
    </BrowserRouter>
);

export default App;
