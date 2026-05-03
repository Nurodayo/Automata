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

type CurveType = {
  id: string;
  name: string;
  start: string;
  end: string;
  symbol: string[];
};

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
    { id: "0", name: "q0", x: 80, y: 80, isSelected: false, isFinal: false },
    { id: "1", name: "q1", x: 180, y: 180, isSelected: false, isFinal: true },
  ]);

  // Creating new states
  // i would like it so states are named automatically so i dont have to make a renaming ui
  const createStates = () => {
    clearSelection();
    const prev = states;
    const newId: string = crypto.randomUUID();

    const name = (() => {
      const names = states.map((e) => Number(e.name.slice(1)));
      // we will sort the array and then find the mising number to name the new state
      // we need to sort because the new state will always be appended to the end
      // ex names = [1, 2, 3] we see that 4 is missing and create q4
      // ex if a state was deleted names = [1, 2, 4] we find that 3 is missing and create q3
      // quicksort from https://www.geeksforgeeks.org/dsa/iterative-quick-sort/
      const partition = (arr: number[], low: number, high: number) => {
        let temp: number;
        const pivot = arr[high];

        let i = low - 1;
        for (let j = low; j <= high - 1; j++) {
          if (arr[j] <= pivot) {
            i++;

            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
          }
        }
        temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;

        return i + 1;
      };

      function qSort(arr: number[], low: number, high: number) {
        if (low < high) {
          /* pi is partitioning index, 
            arr[pi] is now at right place */
          const pi = partition(arr, low, high);

          // Recursively sort elements
          // before partition and after
          // partition
          qSort(arr, low, pi - 1);
          qSort(arr, pi + 1, high);
        }
      }

      const length = names.length;
      qSort(names, 0, length - 1);

      for (let i = 0; i <= length; i++) {
        // console.log(i);
        if (i !== names[i]) {
          return "q".concat(String(i));
        }
      }
    })();

    if (!name) return;
    // Done
    const newState = {
      id: newId,
      name: name,
      x: menuPosition.x - 64 * 4, //that fixes the states spawning way off the right
      y: menuPosition.y,
      isSelected: true,
      isFinal: false,
    };
    const newArray = [...prev];
    newArray.push(newState);
    setStates(newArray);

    setClickedState(newId);
  };

  // curva bezier entre los dos estados basada en las funciones de transicion
  // bezier curve between both states bases on transition functions (or however the hell they're called in english)
  // no sera la forma mas optimizada para hacer esto pero es muy parecido a la teoria
  const [curves, setCurves] = useState([
    {
      id: "curve0",
      name: "curve0",
      start: "0",
      end: "1",
      symbol: ["0", "1"],
    },
    {
      id: "curve1",
      name: "curve1",
      start: "1",
      end: "1",
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
    const newId = crypto.randomUUID();
    // these calculations will make it easier to export a json with transition functions later
    const startName = states.find((s) => s.id === clickedState) ?? "???";
    const endName = states.find((s) => s.id === end) ?? "???";
    const newCurve: CurveType = {
      id: newId,
      name: `${startName} to ${endName}`,
      start: clickedState,
      end: end,
      symbol: [],
    };

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
