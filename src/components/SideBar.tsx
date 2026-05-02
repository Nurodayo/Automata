import Select from "react-select";
import useTheme from "../hooks/useTheme";
import { useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
//Este sidebar te permitira conectar estados, seleccionar simbolos de transicion
//Hacer que los estados sean terminales entre otras cosas

// This is all about transitioning !!! 🏳️‍⚧️🏳️‍⚧️🏳️‍⚧️🏳️‍⚧️🏳️‍⚧️
// i didn't knew how many times i would've had to define type
//
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
  clickedStateId: string | null;
  setClickedStateId: (id: string | null) => void;
  selectedCurve: CurveType | null;
  setSelectedCurve: (curve: CurveType | null) => void;
};

// type Options = {
//   value: string;
//   label: string;
// };

// we pass an useState() (the constant and the setter so the select can update when you click the canvas)
// if i dont do this now i'll tell you, we will do the same for symbols but i have to make the renaming ui
function SideBar({
  states,
  curves,
  clickedStateId,
  setClickedStateId,
  selectedCurve,
  setSelectedCurve,
}: SideBarProps) {
  const theme = useTheme((e) => e.bool);
  const stateOptions = states.map((e) => ({ value: e.id, label: e.name }));
  const selectedOption =
    stateOptions.find((opt) => opt.value === clickedStateId) || null;
  // const [symbols, setSymbols] = useState([""]); //needed later to edit symbols

  //find curves that start on the state that the user has selected using the ui
  const filterCurves = () => {
    if (!clickedStateId) return;
    const selectedCurves = curves.filter((e) => e.start === clickedStateId);
    // we do this so that new states print that there are no transitions
    if (selectedCurves.length === 0) return null;
    return selectedCurves;
  };

  const filteredCurves = filterCurves();
  //just realized i need another useState to select an specific filtered curves
  // const [selectedCurve, setSelectedCurve] = useState<CurveType | null>(null);
  // complains about infinite rerenders but it works fine
  useEffect(() => {
    setSelectedCurve(null);
  }, [clickedStateId]);

  // TODO: Add settings tab but that can probably wait after the presentation
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
      <div className="w-full mr-auto ml-auto p-2">
        <div className="flex gap-1 w-full">
          <p className="flex-1 truncate text-xl text-center rounded-full font-medium py-1">
            Current State.
          </p>
          {/* Select */}
          <Select
            value={selectedOption}
            onChange={(e) => {
              setClickedStateId(e?.value ?? null);
            }}
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
        {/* Transitions */}
        <div>
          <p className="text-center text-xl font-medium p-1">
            Transition functions.
          </p>
          <div className="h-[22vh] overflow-y-auto border border-black/50 dark:border-white/50 rounded-md">
            {filteredCurves ? (
              filteredCurves.map((o) => (
                <div
                  key={o.id}
                  className={`text-center p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 cursor-pointer
                    ${
                      selectedCurve?.id === o.id
                        ? "bg-gray-100 dark:bg-zinc-900 font-medium text-pink-500"
                        : ""
                    }
                  `}
                  onClick={() => setSelectedCurve(o)}
                >
                  {/*Surely using an ascii arrow wont introduce problems later on. Right?*/}
                  {/*if i did this in js instead of ts i would've been done with this long ago but i chose pain*/}
                  {states ? (
                    `${states.find((s: StateType) => s.id === o.start)?.name ?? "?"} → ${states.find((s: StateType) => s.id === o.end)?.name ?? "?"}`
                  ) : (
                    <p className="text-red-500">
                      No states associated to this transition.
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center p-2">No Transitions found.</p>
            )}
          </div>
          {/* Create states buttons */}
          <div className="p-1">
            <div className="flex gap-1 w-full">
              <button className="flex-1 truncate items-center justify-center text-lg border border-black/50 rounded-md py-1 dark:border-white/50">
                <FaPlus className="m-auto" />
              </button>
              <button className="flex-1 truncate text-lg border border-black/50 rounded-md py-1 dark:border-white/50">
                <FaMinus className="m-auto" />
              </button>
            </div>
          </div>
        </div>
        {/* Symbols */}
        <div>
          <p className="text-center text-xl font-medium p-1">
            Transition Symbols.
          </p>
          <div className="h-[22vh] overflow-y-auto border border-black/50 dark:border-white/50 rounded-md">
            {selectedCurve ? (
              selectedCurve.symbol.map((o) => (
                <div
                  key={o}
                  className="text-center p-2 text-center hover:bg-gray-100 dark:hover:bg-zinc-900 flex items-center justify-between gap-2"
                >
                  <p className="ml-auto">{o}</p>
                  <FaEdit className="cursor-pointer ml-auto" />
                </div>
              ))
            ) : (
              <p className="text-center p-2">No Transitions Selected.</p>
            )}
          </div>
        </div>
        {/* Add symbols button */}
        <div className="p-1">
          <div className="flex gap-1 w-full">
            <button className="flex-1 truncate items-center justify-center text-lg border border-black/50 rounded-md py-1 dark:border-white/50">
              <FaPlus className="m-auto" />
            </button>
            <button className="flex-1 truncate text-lg border border-black/50 rounded-md py-1 dark:border-white/50">
              <FaMinus className="m-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
