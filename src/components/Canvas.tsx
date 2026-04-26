import { Stage, Layer } from "react-konva";
import { useState, useEffect } from "react";
import State from "./State";
import Curve from "./Curve";
import Grid from "./Grid";
import type { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";
import RightClickMenu from "./RightClickMenu";

const Canvas = () => {
  const height = window.innerHeight;
  const width = window.innerWidth;
  const radius: number = 40;

  const gridSize: number = 60;
  // Large Canvas but not infinite
  // it might be hardcoded but who cares
  const range: number = 3840; // 64x64 grid squares

  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  // Ripped straight from https://konvajs.org/docs/sandbox/Canvas_Context_Menu.html
  useEffect(() => {
    // Hide menu on window click
    const handleWindowClick = () => {
      setShowMenu(false);
    };
    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);
  // open the menu
  const handleContextMenu = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    if (!stage) return;
    const containerRect = stage.container().getBoundingClientRect();
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    setMenuPosition({
      x: containerRect.left + pointerPosition.x + 4,
      y: containerRect.top + pointerPosition.y + 4,
    });

    setShowMenu(true);
    //setSelectedId(e.target.id()); might need to use this later for the delete button
    e.cancelBubble = true;
  };
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // i was getting the position onDragMove before but i will use it for something else later on like setting the camera on set cordinates
  // this console.log is here so it wont throw an error because i'm not using the constant
  console.log(position);
  // useEffect(() => {
  //   console.log(position);
  // }, [position]);
  const [states, setStates] = useState([
    { id: "0", name: "q0", x: 80, y: 80, isSelected: false, isFinal: false },
    { id: "1", name: "q1", x: 180, y: 180, isSelected: false, isFinal: true },
  ]);

  // Creating new states
  const createStates = () => {
    clearSelection();
    const prev = states;
    const newId: string = prev.length.toString();

    const name = "q".concat(newId);
    // TODO: Fix the id system
    const newState = {
      id: newId,
      name: name,
      x: menuPosition.x,
      y: menuPosition.y,
      isSelected: true,
      isFinal: false,
    };
    const newArray = [...prev];
    newArray.push(newState);
    setStates(newArray);
  };

  // curva bezier entre los dos estados basada en las funciones de transicion
  // bezier curve between both states bases on transition functions (or however the hell they're called in english)
  // no sera la forma mas optimizada para hacer esto pero es muy parecido a la teoria
  const [curves] = useState([
    {
      id: "curve0",
      name: "curve0",
      start: "0",
      end: "1",
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
  const menuOptions = [
    {
      id: "0",
      label: "Create State.",
      method: createStates,
    },
    { id: "1", label: "Delete State.", method: () => console.log("Deleted") },
  ];

  // We're going to calculate the grid Once
  return (
    <div>
      {/* height / 16 is to account for the navbar*/}
      <Stage
        width={width}
        height={height - height / 16}
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
        onContextMenu={handleContextMenu}
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
                radius={radius}
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
      {showMenu && (
        <RightClickMenu
          options={menuOptions}
          x={menuPosition.x}
          y={menuPosition.y}
        />
      )}
    </div>
  );
};

export default Canvas;
