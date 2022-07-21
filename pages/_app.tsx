import "../styles/globals.css";
import type { AppProps } from "next/app";
import { pContextProvider } from "../context/context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <pContextProvider>
        <Component {...pageProps} />
      </pContextProvider>
    </>
  );
}

export default MyApp;
