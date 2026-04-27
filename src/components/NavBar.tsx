import "../index.css";
import { FaGithub } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa";
import useTheme from "../hooks/useTheme";

function NavBar() {
  console.log("Welcome to MaidKissa");
  const theme = useTheme((e) => e.bool);
  const toggle = useTheme((e) => e.toggle);

  return (
    <div className="flex justify-center border-b-[1px] border-black/50 h-[6vh] dark:bg-slate-800 dark:text-white dark:border-white/50">
      <div className="flex w-[min(100vw,177.77vh)] items-center px-4">
        <p className="font-bold text-3xl">Nurin Automata</p>{" "}
        <div className="ml-auto flex flex-row">
          <button
            className="pr-2  hover:scale-120 hover:text-pink-500 duration-300"
            onClick={toggle}
          >
            {theme ? <FaMoon size={28} /> : <FaSun size={28} />}
          </button>
          {/*Animacion bonita jujujuj*/}
          <a
            className="transition transform easy-in duration-300 hover:scale-120 hover:text-pink-500"
            target="_blank"
            href="https://github.com/Nurodayo/Automata"
            rel="noopener noreferrer"
          >
            <FaGithub size={28} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
