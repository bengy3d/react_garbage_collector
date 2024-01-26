import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material';
import { Router } from './Routes/Router';

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
