import { Stage, Layer } from "react-konva";
import { useState, useEffect } from "react";
import State from "./State";

const Canvas = () => {
  const [states, setStates] = useState([
    { id: "q0", name: "q0", x: 80, y: 80, isSelected: false, isFinal: false },
    { id: "q1", name: "q1", x: 180, y: 80, isSelected: false, isFinal: true },
  ]);

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
  return (
    <div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            clearSelection();
          }
        }}
      >
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
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
