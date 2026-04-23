import "../index.css";
import { FaGithub } from "react-icons/fa";

const style = { color: "black" };

function NavBar() {
  console.log("Welcome to MaidKissa");

  return (
    <div className="flex justify-center border-b">
      <div className="flex w-[min(100vw,177.77vh)] items-center px-4 h-16">
        <p className="font-bold text-3xl">Nurin Automata</p>
        {/*Animacion bonita jujujuj*/}
        <a
          className="ml-auto transition transform easy-in duration-300 hover:scale-125"
          href="https://github.com/Nurodayo/Automata"
          rel="noopener noreferrer"
        >
          <FaGithub size={28} className="fill-black" style={style} />
        </a>
      </div>
    </div>
  );
}

export default NavBar;
