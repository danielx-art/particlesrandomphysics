type props = {
  pause: boolean;
  setPause: React.Dispatch<React.SetStateAction<boolean>>;
};

const PlayPause = ({ pause, setPause }: props) => {
  const handlePlayPause = () => {
    setPause((state) => !state);
  };

  const path = {
    false: "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26",
    true: "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28",
  };

  return (
    <button
      onClick={handlePlayPause}
      className="bg-black p-1 border border-white active:opacity-50 transition-transform duration-500 ease-in-out rounded-full text-3xl hover:scale-105"
    >
      <svg
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="1em"
        height="1em"
        className={
          pause
            ? `translate-x-[-.0em] translate-y-[-.05em]`
            : `translate-x-[-.1em] translate-y-[-.05em]`
        }
      >
        <path d={path[`${pause}`]} />
      </svg>
    </button>
  );
};

export default PlayPause;
