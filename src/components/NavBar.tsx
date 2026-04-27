import "../index.css";
import { FaGithub } from "react-icons/fa";

function NavBar() {
  console.log("Welcome to MaidKissa");

  return (
    <div className="flex justify-center border-b-[1px] border-black/50 h-[6vh]">
      <div className="flex w-[min(100vw,177.77vh)] items-center px-4">
        <p className="font-bold text-3xl">Nurin Automata</p>
        {/*Animacion bonita jujujuj*/}
        <a
          className="ml-auto transition transform easy-in duration-300 hover:scale-120 hover:text-pink-500"
          href="https://github.com/Nurodayo/Automata"
          rel="noopener noreferrer"
        >
          <FaGithub size={28} />
        </a>
      </div>
    </div>
  );
}

export default NavBar;
