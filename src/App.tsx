// import "./App.css";
import Canvas from "./components/Canvas.tsx";
import NavBar from "./components/NavBar.tsx";
import "./index.css";

function App() {
  return (
    <div className="flex flex-col">
      <NavBar />
      <Canvas />
    </div>
  );
}
export default App;
