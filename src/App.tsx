// import "./App.css";
import Konva from "konva";
import Canvas from "./components/Canvas.tsx";
import NavBar from "./components/NavBar.tsx";
import "./index.css";

//resolution will be 90% of the window
Konva.pixelRatio = 0.9;

function App() {
  return (
    <div className="flex flex-col">
      <NavBar />
      <Canvas />
    </div>
  );
}
export default App;
