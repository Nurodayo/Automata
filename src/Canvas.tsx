import { Stage, Layer } from "react-konva";
import { useState, useEffect } from "react";
import State from "./State";
import Curve from "./Curve";
import Grid from "./Grid";
import type { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";

const Canvas = () => {
  const height = window.innerHeight;
  const width = window.innerWidth;

  const gridSize: number = 40;
  // Large Canvas but not infinite
  // it might be hardcoded but who cares
  const range: number = 3840; // 96x96 grid squares

  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    console.log(position);
  }, [position]);
  const [states, setStates] = useState([
    { id: "q0", name: "q0", x: 80, y: 80, isSelected: false, isFinal: false },
    { id: "q1", name: "q1", x: 180, y: 180, isSelected: false, isFinal: true },
  ]);
  // curva bezier entre los dos estados basada en las funciones de transicion
  // bezier curve between both states bases on transition functions (or however the hell they're called in english)
  // no sera la forma mas optimizada para hacer esto pero es muy parecido a la teoria
  const [curves] = useState([
    {
      id: "curve0",
      name: "curve0",
      start: "q0",
      end: "q1",
      symbol: ["0", "1"],
    },
  ]);

  //const stageRef = useRef(null); // does not seem to be necesary
  //function to select and deselect states
  //we create a new array to select the current clicked state and deselect the other ones
  const selectState = (id: string) => {
    setStates((prev) =>
      prev.map((state) => ({
        ...state,
        isSelected: state.id === id,
      })),
    );
  };
  // Deselect when clicking the canvas
  const clearSelection = () => {
    setStates((prev) =>
      prev.map((state) => ({
        ...state,
        isSelected: false,
      })),
    );
  };
  const updatePosition = (id: string, x: number, y: number) => {
    setStates((prev) =>
      prev.map((state) => (state.id === id ? { ...state, x, y } : state)),
    );
  };

  const scaleBy: number = 1.2;
  // si esta en la documentacion oficial espero que no cause problemas de rendimiento
  const handleWheel = (e: KonvaEventObject<WheelEvent, Konva.Stage>) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    if (!stage) return;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    let direction = e.evt.deltaY > 0 ? -1 : 1;
    if (e.evt.ctrlKey) {
      direction = -direction;
    }
    let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    newScale = Math.max(0.1, Math.min(10, newScale));
    stage.scale({ x: newScale, y: newScale });
    stage.position({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  // We're going to calculate the grid Once
  return (
    <div>
      <Stage
        width={width}
        height={height}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            clearSelection();
          }
        }}
        draggable
        onDragMove={(e) => {
          const stage = e.target;
          setPosition({ x: stage.x(), y: stage.y() });
        }}
        onWheel={handleWheel}
      >
        <Layer>
          <Grid
            width={range}
            height={range}
            gridSize={gridSize}
            color="lightgray"
          />
        </Layer>
        <Layer>
          {/* iterating curves*/}
          {curves.map((curve) => {
            const from = states.find((s) => s.id === curve.start);
            const to = states.find((s) => s.id === curve.end);

            if (!from || !to) return null;

            return (
              <Curve
                key={curve.id}
                start={[from.x, from.y]}
                end={[to.x, to.y]}
                symbol={curve.symbol}
              />
            );
          })}
        </Layer>
        <Layer>
          {/* iterating states */}
          {states.map((state) => (
            <State
              key={state.id}
              id={state.id}
              name={state.name}
              x={state.x}
              y={state.y}
              isSelected={state.isSelected}
              isFinal={state.isFinal}
              onClick={selectState}
              onDragStart={() => selectState(state.id)}
              onDragoMove={updatePosition}
              onDragEnd={updatePosition}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
