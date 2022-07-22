import "../styles/globals.css";
import type { AppProps } from "next/app";
import { pContextProvider } from "../context/context";
import { useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <pContextProvider value={value}>
        <Component {...pageProps} />
      </pContextProvider>
    </>
  );
}

export default MyApp;
