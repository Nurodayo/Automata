// import "./App.css";
import Konva from "konva";
import Canvas from "./components/Canvas.tsx";
import NavBar from "./components/NavBar.tsx";
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
    <div className="flex flex-col h-full">
      <NavBar />
      <div className="flex flex-row">
        <Canvas />
      </div>
    </div>
  );
}
export default App;
