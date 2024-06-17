import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import State from "./state";
import District from "./District";
import Ac from "./Ac";
import Part from "./Part";

export default function App() {
  let state = window.location.pathname.split("/")[1];
  let district = window.location.pathname.split("/")[2];
  let ac = window.location.pathname.split("/")[3];
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<State />} />
          <Route path={`/${state}`} element={<District />} />
          <Route path={`/${state}/${district}`} element={<Ac />} />
          <Route path={`/${state}/${district}/${ac}`} element={<Part />} />
      </Routes>
    </BrowserRouter>
  );
}