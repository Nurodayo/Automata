import { RiFunctionFill } from "react-icons/ri";

type MenuOptions = {
  id: string;
  label: string;
  method: () => void;
};
type MenuProps = {
  options: MenuOptions[];
};

// We pass an object in Canvas.tsx which is going to have a label for the button and the function that it will on click
// this file is going to be mostly style
function RightClickMenu({ options }: MenuProps) {
  return (
    <div className="flex flex-col items-start">
      <div className="flex flex-row padding-8">
        <RiFunctionFill />
        <p>Menu</p>
      </div>
      {options.map((e) => (
        <button key={e.id} onClick={e.method}>
          {e.label}
        </button>
      ))}
    </div>
  );
}
export default RightClickMenu;
