import useTheme from "../hooks/useTheme.tsx";
import ssLight from "../assets/automata_promo_light.png";
import ssDark from "../assets/automata_promo_dark.png";
import { useNavigate } from "react-router-dom";

function Landing() {
  const theme = useTheme((e) => e.bool);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-black text-black dark:text-white">
      {/*I am rushing this landing page because i need to show it off on friday*/}
      <div
        className=" flex flex-col items-center justify-center p-16 border-b-1 border-black/50 w-full 
        bg-[linear-gradient(to_right,#ccc_1px,transparent_1px),linear-gradient(to_bottom,#ccc_1px,transparent_1px)] bg-[size:50px_50px]
        dark:border-white/50
        dark:bg-[linear-gradient(to_right,#555_1px,transparent_1px),linear-gradient(to_bottom,#555_1px,transparent_1px)] bg-[size:50px_50px]
"
      >
        <h1 className="font-bold text-8xl">A Simple FDA Diagram tool.</h1>
        <h2 className="font-semibold text-5xl">Built in React.</h2>
      </div>
      <div className="flex flex-row p-16">
        {theme ? (
          <div className="w-[50vw]">
            <img
              src={ssLight}
              className="w-full h-full object-contain rounded-md border-2 border-pink-500"
            />
          </div>
        ) : (
          <div className="w-[50vw]">
            <img
              src={ssDark}
              className="w-full h-full object-contain rounded-md border-2 border-pink-500"
            />
          </div>
        )}
        <div className="flex items-center justify-center p-8">
          <button
            className="text-2xl p-6 cursor-pointer border-1 border-black/50 rounded-md hover:border-pink-500 hover:text-pink-500
            transition duration-300 ease-in dark:border-white/50"
            onClick={() => {
              navigate(`/canvas/`);
            }}
          >
            Try it out now.
          </button>
        </div>
      </div>

      <div className="flex flex-row w-full border-t-1 border-pink-500/50 text-pink-500/50 justify-center items-center mt-auto">
        <p>Made by Nurodayo 2026 - Open Source.</p>
      </div>
    </div>
  );
}

export default Landing;
