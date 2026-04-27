//Este sidebar te permitira conectar estados, seleccionar simbolos de transicion
//Hacer que los estados sean terminales entre otras cosas

function SideBar() {
  return (
    <div className="flex flex-col w-[20vw] border-r-1 border-black/50">
      <div className="w-full mr-auto ml-auto p-2">
        <div className="flex gap-1 w-full">
          <button className="flex-1 truncate text-lg border border-black/50 rounded-full py-1">
            State
          </button>
          <button className="flex-1 truncate text-lg border border-black/50 rounded-full py-1">
            Settings
          </button>
        </div>
      </div>
      <div className="w-full mr-auto ml-auto p-2">
        <div className="flex gap-1 w-full">
          <p className="flex-1 truncate text-xl text-center rounded-full font-medium py-1">
            Current State
          </p>
          <button className="flex-1 truncate text-lg border border-black/50 rounded-full py-1">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
