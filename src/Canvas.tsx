import { Stage, Layer } from "react-konva";
import { useState } from "react";
import State from "./State";

const Canvas = () => {
  const [states, setStates] = useState([
    { id: "q0", name: "q0", x: 80, y: 80, isSelected: false, isFinal: false },
    { id: "q1", name: "q1", x: 160, y: 80, isSelected: false, isFinal: true },
  ]);

  //function to select and deselect states
  const selectState = (id: string) => {
    setStates((prev) =>
      prev.map((state) => ({
        ...state,
        isSelected: state.id === id,
      })),
    );
  };
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
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
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;
