// import "./App.css";
import Konva from "konva";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Canvas from "./components/Canvas.tsx";
import NavBar from "./components/NavBar.tsx";
import Landing from "./components/Landing.tsx";
import { useEffect } from "react";
import useTheme from "./hooks/useTheme.tsx";
import "./index.css";

//resolution will be 90% of the window
Konva.pixelRatio = 0.9;

function App() {
  const theme = useTheme((e) => e.bool);

  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute("data-theme", theme ? "" : "dark");
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="flex flex-col h-full">
        <NavBar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/canvas" element={<Canvas />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
