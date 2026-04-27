import { RiFunctionFill } from "react-icons/ri";

type MenuOptions = {
  id: string;
  label: string;
  method: () => void;
};
type MenuProps = {
  options: MenuOptions[];
  x: number;
  y: number;
};
// i hate styling
// We pass an object in Canvas.tsx which is going to have a label for the button and the function that it will on click
// this file is going to be mostly style
function RightClickMenu({ options, x, y }: MenuProps) {
  return (
    <div
      style={{ left: x, top: y }}
      className="flex flex-col border-1 border-black/50 w-64 rounded-md z-10 fixed bg-white dark:bg-slate-800 dark:text-white dark: border-white/50"
    >
      <div className="flex flex-row p-2">
        <RiFunctionFill size={32} />
        <p className="text-2xl font-medium">Menu</p>
      </div>
      <div className="flex flex-col items-center pb-1">
        {options.map((e) => (
          <button
            key={e.id}
            onClick={e.method}
            className="p-1 w-62 hover:bg-gray-200 rounded-md align-start text-lg justify-center border-b-1 border-transparent hover:border-gray-500  duration-200 ease-in-out 
            dark:hover:bg-slate-700 dark:hover:border-slate-500"
          >
            {e.label}
          </button>
        ))}
      </div>
    </div>
  );
}
export default RightClickMenu;
