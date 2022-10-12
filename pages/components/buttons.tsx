import { usePconfig } from "../../context/context";
import { pickRandomConfig } from "../../particlePhysics/randomConfig";
import PlayPause from "./playPause";

const Buttons = (props: {
  toggleInfo: boolean;
  setToggleInfo: React.Dispatch<React.SetStateAction<boolean>>;
  toggleDesc: boolean;
  setToggleDesc: React.Dispatch<React.SetStateAction<boolean>>;
  handleToggleInfo: () => void;
  handleToggleDesc: () => void;
}) => {
  const { pconfig, setPconfig, pause, setPause } = usePconfig();
  const handleRandomConfig = () => {
    if (pconfig.num !== 0) {
      const newConfig = pickRandomConfig(pconfig.boundary);
      setPconfig(newConfig);
      if (props.toggleInfo) props.setToggleInfo(false);
      if (props.toggleDesc) props.setToggleDesc(false);
    }
  };

  return (
    <>
      <div className="text-2xl w-full text-center z-10 absolute bottom-5 p-2 flex flex-row justify-center items-center gap-x-1 ">
        <button
          onClick={props.handleToggleDesc}
          className="bg-black p-1 border border-white active:opacity-50 transition-transform duration-500 ease-in-out rounded-full hover:scale-105"
        >
          <p className=" text-2xl w-8 h-8 text-white leading-5"> ... </p>
        </button>

        <button
          onClick={handleRandomConfig}
          className="bg-black p-1 border border-white hover:rotate-90 active:opacity-50 transition-transform duration-500 ease-in-out rounded-full hover:scale-105"
        >
          <svg
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="2em"
            height="2em"
          >
            <path d="M 16 4 C 10.886719 4 6.617188 7.160156 4.875 11.625 L 6.71875 12.375 C 8.175781 8.640625 11.710938 6 16 6 C 19.242188 6 22.132813 7.589844 23.9375 10 L 20 10 L 20 12 L 27 12 L 27 5 L 25 5 L 25 8.09375 C 22.808594 5.582031 19.570313 4 16 4 Z M 25.28125 19.625 C 23.824219 23.359375 20.289063 26 16 26 C 12.722656 26 9.84375 24.386719 8.03125 22 L 12 22 L 12 20 L 5 20 L 5 27 L 7 27 L 7 23.90625 C 9.1875 26.386719 12.394531 28 16 28 C 21.113281 28 25.382813 24.839844 27.125 20.375 Z" />
          </svg>
        </button>

        <PlayPause {...{ pause, setPause }} />
      </div>
      <button
        onClick={props.handleToggleInfo}
        className="bg-[#111111] p-1 active:opacity-50 transition-transform duration-500 ease-in-out rounded-full text-3xl hover:scale-105 overflow-hidden absolute right-1"
      >
        <p className="font-mochiy w-5 h-5 text-white"> i </p>
      </button>
    </>
  );
};

export default Buttons;
