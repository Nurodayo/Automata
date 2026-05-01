import Select from "react-select";
import useTheme from "../hooks/useTheme";
import { useState } from "react";
//Este sidebar te permitira conectar estados, seleccionar simbolos de transicion
//Hacer que los estados sean terminales entre otras cosas

type StateType = {
  id: string;
  name: string;
  x: number;
  y: number;
  isSelected: boolean;
  isFinal: boolean;
};

type CurveType = {
  id: string;
  name: string;
  start: string;
  end: string;
  symbol: string[];
};

type SideBarProps = {
  states: StateType[];
  curves: CurveType[];
};

type Options = {
  value: string;
  label: string;
};

function SideBar({ states, curves }: SideBarProps) {
  const theme = useTheme((e) => e.bool);
  console.log(states);
  const stateOptions = states.map((e) => ({ value: e.id, label: e.name }));
  console.log(stateOptions);
  const [selectedState, setSelectedState] = useState<Options | null>(null);

  //find curves that start on the state that the user has selected using the ui
  const filterCurves = () => {
    if (!selectedState) return;
    const selectedCurves = curves.filter(
      (e) => e.start === selectedState.value,
    );
    return selectedCurves;
  };

  const selectedCurves = filterCurves();

  return (
    <div className="flex flex-col w-[20vw] border-r-1 border-black/50 dark:border-white/50 dark:bg-black dark:text-white">
      <div className="w-full mr-auto ml-auto p-2 border-b border-black/50 dark:border-white/50">
        <div className="flex gap-1 w-full">
          <button className="flex-1 truncate text-lg border border-black/50 rounded-md py-1 dark:border-white/50">
            States.
          </button>
          <button className="flex-1 truncate text-lg border border-black/50 rounded-md py-1 dark:border-white/50">
            Settings.
          </button>
        </div>
      </div>
      {/* We need to add some logic to when we chose the settings tab*/}
      <div className="w-full mr-auto ml-auto p-2">
        <div className="flex gap-1 w-full">
          <p className="flex-1 truncate text-xl text-center rounded-full font-medium py-1">
            Current State.
          </p>
          {/* Select */}
          <Select
            value={selectedState}
            onChange={setSelectedState}
            options={stateOptions}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: "transparent",
                borderColor: state.isFocused
                  ? "deeppink"
                  : theme
                    ? "#00000080"
                    : "#ffffff80",
                width: "5vw",
                boxShadow: "none",
                "&:hover": {
                  borderColor: state.isFocused
                    ? "deeppink"
                    : theme
                      ? "#00000080"
                      : "#ffffff80",
                },
              }),

              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: theme ? "white" : "black",
                color: theme ? "black" : "white",
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: theme ? "#00000080" : "#ffffff80",
              }),

              option: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: theme
                  ? state.isFocused
                    ? "#F3F4F6"
                    : "white"
                  : state.isFocused
                    ? "#18181B"
                    : "black", //Same colors as in tailwind
                color: state.isFocused ? "deeppink" : theme ? "black" : "white",
                textAlign: "center",
              }),

              singleValue: (baseStyles) => ({
                ...baseStyles,
                color: theme ? "black" : "white",
                textAlign: "center",
              }),

              placeholder: (baseStyles) => ({
                ...baseStyles,
                color: theme ? "#00000080" : "#ffffff80",
                textAlign: "center",
              }),
            }}
            menuPlacement="auto"
            maxMenuHeight={150}
          />
        </div>
        <div className="flex gap-1 w-full py-2">
          <p className="flex-1 truncate text-xl text-center rounded-full font-medium py-1">
            Accepting State.
          </p>
          <button className="w-[5vw] font-[JetBrains_Mono] truncate text-xl border border-black/50 rounded-full py-1 dark:border-white/50">
            True
          </button>
        </div>
        <div>
          <p className="text-center text-xl font-medium p-1">Transitions.</p>
          <div className="h-[25vh] overflow-y-auto border border-black/50 dark:border-white/50 rounded-md">
            {selectedCurves ? (
              selectedCurves.map((o) => (
                <div
                  key={o.id}
                  className="text-center p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  {o.name}
                </div>
              ))
            ) : (
              <p className="text-center p-2">No Transitions found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
