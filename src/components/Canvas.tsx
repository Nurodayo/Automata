import { Stage, Layer } from "react-konva";
import { useState, useEffect, useRef } from "react";
import State from "./State";
import Curve from "./Curve";
import Grid from "./Grid";
import type { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";
import RightClickMenu from "./RightClickMenu";
import SideBar from "./SideBar";
import useTheme from "../hooks/useTheme";
// i should make a ts file with the types
// i did it
import type { CurveType } from "../types";
import type { StateType } from "../types";

const Canvas = () => {
  const theme = useTheme((e) => e.bool);
  const stageRef = useRef<Konva.Stage | null>(null);
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
  // useEffect(() => {
  //   console.log(position);
  // }, [position]);
  const [states, setStates] = useState([
    { id: "q0", name: "q0", x: 80, y: 80, isSelected: false, isFinal: false },
    { id: "q1", name: "q1", x: 180, y: 180, isSelected: false, isFinal: true },
  ]);

  // Creating new states
  // i would like it so states are named automatically so i dont have to make a renaming ui
  const createStates = () => {
    clearSelection();
    const prev: StateType[] = states;
    // const newId: string = crypto.randomUUID();
    const names = states.map((e) => Number(e.name.slice(1)));

    const name = (() => {
      // we will sort the array and then find the mising number to name the new state
      // we need to sort because the new state will always be appended to the end
      // ex names = [1, 2, 3] we see that 4 is missing and create q4
      // ex if a state was deleted names = [1, 2, 4] we find that 3 is missing and create q3
      // Replaced quicksort with insertion sort because the array is always a nearly sorted list

      const insertionSort = (arr: number[]) => {
        const n = arr.length;

        for (let i = 1; i < n; i++) {
          const current = arr[i];

          let j = i - 1;
          while (j > -1 && current < arr[j]) {
            arr[j + 1] = arr[j];
            j--;
          }

          arr[j + 1] = current;
        }
      };

      insertionSort(names);
      // console.log(names);

      const length = names.length;

      for (let i = 0; i <= length; i++) {
        // console.log(`${i} names ${names[i]}`);
        if (i !== names[i]) {
          // console.log(names[i]);
          names.push(i);
          return "q".concat(String(i));
        }
      }
      console.error("Failed to create state");
      return;
    })();

    if (!name) return;
    // Done
    //
    const newState = {
      id: name,
      name: name,
      x: menuPosition.x - 64 * 4, //that fixes the states spawning way off the right //this is fucked up and need fixing
      y: menuPosition.y,
      isSelected: true,
      isFinal: false,
    };

    const newArray = [...prev];
    newArray.push(newState);

    // we optimize it for exporting states and insertion sort
    // we make a Map to make the lookup o(N)
    const map = new Map(newArray.map((e: StateType) => [e.id, e]));
    const orderedArray: StateType[] = names.map((e) => map.get(`q${e}`)!); // the ! is because there should always be a state here because we just created one and it should be on newState
    // if no state was created there is a return above
    setStates(orderedArray);
    setClickedState(name);
  };

  // curva bezier entre los dos estados basada en las funciones de transicion
  // bezier curve between both states bases on transition functions (or however the hell they're called in english)
  // no sera la forma mas optimizada para hacer esto pero es muy parecido a la teoria
  const [curves, setCurves] = useState([
    {
      id: "q0toq1",
      name: "curve0",
      start: "q0",
      end: "q1",
      symbol: ["0", "1"],
    },
    {
      id: "q1toq1",
      name: "curve1",
      start: "q1",
      end: "q1",
      symbol: ["0"],
    },
  ]);

  // When we delete a state we also need to delete al transitions containing that state
  const deleteState = () => {
    //delete curves
    const filteredCurves: CurveType[] = curves.filter(
      (c) => c.start !== clickedState && c.end !== clickedState,
    );
    setCurves(filteredCurves);

    //delete state

    const filteredStates = states.filter((s) => s.id !== clickedState);

    setStates(filteredStates);
  };

  // Last id of the last clicked state
  //
  // SideBar Props
  //
  const [clickedState, setClickedState] = useState<string | null>(null);
  const [selectedCurve, setSelectedCurve] = useState<CurveType | null>(null);
  //
  //const stageRef = useRef(null); // does not seem to be necesary
  //function to select and deselect states
  //we create a new array to select the current clicked state and deselect the other ones
  const selectState = (id: string) => {
    setClickedState(id);
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
  // Creating new curves
  // We will use the start as the current selected state
  const createCurve = (end: string | null) => {
    if (!clickedState) return;
    if (!end) return;
    // const newId = crypto.randomUUID();
    // these calculations will make it easier to export a json with transition functions later
    const startName = states.find((s) => s.id === clickedState)?.name ?? "???"; // i was passing the object instead of the name before. big dumbass moment
    const endName = states.find((s) => s.id === end)?.name ?? "???";
    const newCurve: CurveType = {
      id: `${startName}to${endName}`,
      name: `${startName} to ${endName}`,
      start: clickedState,
      end: end,
      symbol: [],
    };

    // Check duplicate transitions
    if (curves.some((e) => e.id === newCurve.id)) return;

    const newCurves = [...curves, newCurve];
    setCurves(newCurves);
  };

  const updatePosition = (id: string, x: number, y: number) => {
    setStates((prev) =>
      prev.map((state) => (state.id === id ? { ...state, x, y } : state)),
    );
  };
  // fixed centering
  const goToCenter = (e: Konva.Stage | null) => {
    if (!e) return;
    e.scaleX(1);
    e.scaleY(1);
    e.x(0 + width / 2);
    e.y(0 + height / 2);

    setPosition({ x: 0, y: 0 });
    console.log(position);
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
    {
      id: "1",
      label: "Center Camera.",
      method: () => goToCenter(stageRef.current),
    },
    { id: "2", label: "Delete State.", method: deleteState },
  ];
  useEffect(() => {
    console.log(states);
  }, [states]);
  // We're going to calculate the grid Once
  return (
    <div className="flex flex-row">
      <SideBar
        states={states}
        curves={curves}
        clickedStateId={clickedState}
        setClickedStateId={setClickedState}
        selectedCurve={selectedCurve}
        setSelectedCurve={setSelectedCurve}
        selectState={selectState}
        createCurve={createCurve}
      />
      {/* height / 16 is to account for the navbar*/}
      <Stage
        ref={stageRef}
        width={width - width * 0.2}
        height={height - height * (6 / 100)}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            clearSelection();
          }
        }}
        draggable
        onWheel={handleWheel}
        onContextMenu={handleContextMenu}
        style={{
          backgroundColor: theme ? "white" : "black",
        }}
      >
        <Layer>
          <Grid
            width={range}
            height={range}
            gridSize={gridSize}
            color={theme ? "lightgray" : "grey"}
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
