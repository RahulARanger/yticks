import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#e85403",
        },
        secondary: {
            main: "#0008bb",
        },
        error: {
            main: "#f71505",
        },
        warning: {
            main: "#ffb300",
        },
    },
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Component {...pageProps} />
        </ThemeProvider>
    );
}
