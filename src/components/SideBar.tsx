//Este sidebar te permitira conectar estados, seleccionar simbolos de transicion
//Hacer que los estados sean terminales entre otras cosas

function SideBar() {
  return (
    <div className="flex flex-col w-[20vw] border-r-1 border-black/50 dark:border-white/50 dark:bg-slate-800 dark:text-white">
      <div className="w-full mr-auto ml-auto p-2 border-b border-black/50 dark:border-white/50">
        <div className="flex gap-1 w-full">
          <button className="flex-1 truncate text-lg border border-black/50 rounded-full py-1 dark:border-white/50">
            State
          </button>
          <button className="flex-1 truncate text-lg border border-black/50 rounded-full py-1 dark:border-white/50">
            Settings
          </button>
        </div>
      </div>
      {/* We need to add some logic to when we chose the settings tab*/}
      <div className="w-full mr-auto ml-auto p-2">
        <div className="flex gap-1 w-full">
          <p className="flex-1 truncate text-xl text-center rounded-full font-medium py-1">
            Current State.
          </p>
          <button className=" font-[JetBrains_Mono] truncate text-xl border border-black/50 rounded-full w-[5vw] py-1 dark:border-white/50">
            q0
          </button>
        </div>
        <div className="flex gap-1 w-full py-2">
          <p className="flex-1 truncate text-xl text-center rounded-full font-medium py-1">
            Terminal State.
          </p>
          <button className="w-[5vw] font-[JetBrains_Mono] truncate text-xl border border-black/50 rounded-full py-1 dark:border-white/50">
            q0
          </button>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
