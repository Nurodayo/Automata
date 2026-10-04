import { MdCancel } from "react-icons/md";
import { MdNavigateNext } from "react-icons/md";
import { useState } from "react";

type SymbolMenuProps = {
  setSymbolMenu: (menu: boolean) => void;
  symbolMenu: boolean;
  array: string[];
  addSymbol: (symbol: string[]) => void;
};

function SymbolMenu({
  array,
  symbolMenu,
  setSymbolMenu,
  addSymbol,
}: SymbolMenuProps) {
  if (!array) {
    setSymbolMenu(false);
    return;
  }
  if (!symbolMenu) return;

  const [input, setInput] = useState("");

  const updateArray = (e: string) => {
    const temp = e.split(" ");
    const concatArray = temp.filter((a) => !array.includes(a));
    const newArray = [...array].concat(concatArray).sort();

    addSymbol(newArray);
  };

  return (
    <div className="flex items-center justify-center z-20 w-[100vw] h-[94vh] bg-black/50 absolute backdrop-blur-xs duration-300">
      <div className="w-[33vw] h-[16vh] bg-white rounded-md border-1 border-black dark:bg-black dark:border-white/50 z-30">
        <div className="flex w-[33vw] flex-col items-center p-2 h-full">
          <button
            className="ml-auto px-2 hover:scale-120 hover:text-pink-500 duration-300 cursor-pointer mb-auto"
            onClick={() => {
              setSymbolMenu(false);
            }}
          >
            <MdCancel size={28} />
          </button>
          <h1 className="text-lg">Add symbols separated by spaces</h1>
          <div className="flex flex-col padding-2 w-full h-full justify-center items-center">
            <input
              className="w-full border-black border-1 p-1 rounded-md border-black
              dark:border-white/50 w-lg focus:border-pink-500 outline-none focus:outline-none"
              onChange={(e) => setInput(e.target.value)}
            ></input>
            {
              <button
                className="mt-auto ml-auto pr-4"
                onClick={() => {
                  updateArray(input);
                }}
              >
                <MdNavigateNext
                  size={32}
                  className="hover:text-pink-500 hover:scale-120 duration-300 cursor-pointer"
                />
              </button>
            }
          </div>
        </div>
      </div>
      <div
        onClick={() => {
          setSymbolMenu(false);
        }}
        className="flex items-center justify-center z-20 w-[100vw] h-[94vh] absolute"
      />
    </div>
  );
}

export default SymbolMenu;
