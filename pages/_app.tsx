import "../styles/globals.css";
import { PContextProvider } from "../context/context";
import Home from "./index";

function MyApp() {
  return (
    <>
      <PContextProvider>
        <Home />
      </PContextProvider>
    </>
  );
}

export default MyApp;
