import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import State from "./state";
import District from "./District";
import Ac from "./Ac";
import Part from "./Part";
import Error from "./Error";
import ErrorDown from "./ErrorDown";

export default function App() {
  let state = window.location.pathname.split("/")[2];
  let district = window.location.pathname.split("/")[3];
  let ac = window.location.pathname.split("/")[4];
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<State />} />
          <Route path={`/dwn/${state}`} element={<District />} />
          <Route path={`/dwn/${state}/${district}`} element={<Ac />} />
          <Route path={`/dwn/${state}/${district}/${ac}`} element={<Part />} />
          <Route path={`/error`} element={<Error />} />
          <Route path={`/error/${state}`} element={<ErrorDown />} />
      </Routes>
    </BrowserRouter>
  );
}