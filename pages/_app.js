import '../styles/globals.css';
import { NextUIProvider } from '@nextui-org/react';
import { createTheme } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from 'next-themes';


const lightTheme = createTheme({
  type: 'light',
  theme: {
    colors: {}
  }
})

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {}
  }
})

function MyApp({ Component, pageProps }) {
  return (
<NextThemesProvider
    defaultTheme="system"
    attribute="class"
    value={{
      light: lightTheme.className,
      dark: darkTheme.className
    }}
  >
  <NextUIProvider>
    <Component {...pageProps} />
  </NextUIProvider>
  </NextThemesProvider>
  );
}



export default MyApp;
